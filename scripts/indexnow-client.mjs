import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function fingerprint(html, includeScripts = false) {
  // Ignore hydration payloads, build IDs, CSS and transient HTML attributes.
  const stable = html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const seo = [...stable.matchAll(/<(?:meta|link|img|source|a)\b[^>]*>/gi)]
    .map(([tag]) => [...tag.matchAll(/\b(name|property|content|rel|href|src|srcset|alt)\s*=\s*("[^"]*"|'[^']*')/gi)]
      .map(([, k, v]) => `${k.toLowerCase()}=${v.slice(1, -1)}`).join('|')).join('\n');
  const scripts = includeScripts ? [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*("[^"]*"|'[^']*')/gi)].map(([, src]) => src).join('\n') : '';
  return createHash('sha256').update(stable.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() + '\n' + seo + '\n' + scripts).digest('hex');
}

const decode = (text) => text.replace(/&(?:amp|lt|gt|quot|apos);/g, (s) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" })[s]);
export function locations(xml) {
  return [...xml.matchAll(/<(?:\w+:)?loc\b[^>]*>([\s\S]*?)<\/(?:\w+:)?loc>/g)]
    .map(([, value]) => decode(value.trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')));
}

export async function run({ root, config, submit = false, explicit = [], force = false, fetchImpl = fetch, log = console.log }) {
  const origin = new URL(config.origin).origin;
  const statePath = resolve(root, '.indexnow/state.json');
  const checked = (value) => {
    const url = new URL(value);
    if (url.origin !== origin || url.username || url.password || url.hash) throw new Error(`URL outside canonical site: ${value}`);
    return url.href;
  };
  const request = async (url, options = {}) => fetchImpl(url, { redirect: 'manual', signal: AbortSignal.timeout(20000), ...options });
  const text = async (url) => {
    const r = await request(checked(url));
    if (r.status !== 200) throw new Error(`${url}: HTTP ${r.status}`);
    return r.text();
  };
  let previous = { version: 1, origin, pages: {} };
  try {
    previous = JSON.parse(await readFile(statePath, 'utf8'));
    if (previous.version !== 1 || previous.origin !== origin || !previous.pages || typeof previous.pages !== 'object') throw new Error('Invalid IndexNow state');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const pages = { ...previous.pages };
  const seen = new Set();
  async function sitemap(url) {
    checked(url);
    if (seen.has(url)) return [];
    if (seen.size >= 50) throw new Error('Too many sitemap files');
    seen.add(url);
    const xml = await text(url);
    const list = locations(xml).map(checked);
    if (/<(?:\w+:)?sitemapindex\b/.test(xml)) {
      const nested = [];
      for (const child of list) nested.push(...await sitemap(child));
      return nested;
    }
    if (!/<(?:\w+:)?urlset\b/.test(xml)) throw new Error('Expected sitemap XML');
    return list;
  }
  const current = [...new Set(explicit.length ? explicit.map(checked) : config.urls?.map(checked) ?? await sitemap(config.sitemap || `${origin}/sitemap.xml`))];
  if (!current.length || current.length > 50000) throw new Error('Empty or oversized URL list');
  const candidates = [...new Set([...current, ...(explicit.length ? [] : Object.keys(previous.pages).map(checked))])];
  const changed = [];
  for (let i = 0; i < candidates.length; i += 4) {
    await Promise.all(candidates.slice(i, i + 4).map(async (url) => {
      const r = await request(url);
      let hash;
      if (r.status === 404 || r.status === 410) hash = `deleted:${r.status}`;
      else if ([301, 308].includes(r.status) && r.headers.get('location')) hash = `redirect:${r.status}:${new URL(r.headers.get('location'), url).href}`;
      else if (r.status === 200 && /text\/html/i.test(r.headers.get('content-type') || '')) {
        const html = await r.text();
        if (/<meta\b[^>]*(?:noindex)/i.test(html)) throw new Error(`Noindex page in submission list: ${url}`);
        hash = fingerprint(html, config.includeScripts);
      } else if (r.status === 200 && /text\/(?:plain|markdown)\b/i.test(r.headers.get('content-type') || '')) {
        hash = createHash('sha256').update((await r.text()).replace(/\s+/g, ' ').trim()).digest('hex');
      } else throw new Error(`${url}: unexpected HTTP ${r.status} or content type (not submitted)`);
      if (force || explicit.length || previous.pages[url] !== hash) changed.push(url);
      pages[url] = hash;
    }));
  }
  changed.sort();
  log(JSON.stringify({ mode: submit ? 'submit' : 'preview', origin, scanned: candidates.length, changed: changed.length, urlList: changed }, null, 2));
  if (!submit || !changed.length) return { changed, pages };
  const keyLocation = `${origin}/${config.key}.txt`;
  const localKey = await readFile(resolve(root, config.keyDirectory || 'public', `${config.key}.txt`), 'utf8');
  if (localKey.trim() !== config.key || (await text(keyLocation)).trim() !== config.key) throw new Error('Key mismatch: deploy the verification file first');
  // Save only after every batch has been accepted, so a failure remains retryable.
  for (let i = 0; i < changed.length; i += 10000) {
    const r = await request('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host: new URL(origin).host, key: config.key, keyLocation, urlList: changed.slice(i, i + 10000) }),
    });
    if (![200, 202].includes(r.status)) throw new Error(`IndexNow HTTP ${r.status}: ${await r.text()}`);
    log(`IndexNow HTTP ${r.status}: ${r.status === 202 ? 'key validation pending' : 'received'}; indexing is not guaranteed.`);
  }
  await mkdir(dirname(statePath), { recursive: true });
  const temporary = `${statePath}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify({ version: 1, origin, pages }, null, 2));
  await rename(temporary, statePath);
  return { changed, pages };
}

export async function cli(scriptUrl) {
  const root = resolve(dirname(fileURLToPath(scriptUrl)), '..');
  const args = process.argv.slice(2);
  const automatic = args.includes('--auto');
  try {
    const unknown = args.filter((a) => a.startsWith('--') && !['--submit', '--auto', '--force'].includes(a));
    if (unknown.length) throw new Error(`Unknown arguments: ${unknown.join(', ')}`);
    const config = JSON.parse(await readFile(resolve(root, 'indexnow.config.json'), 'utf8'));
    await run({ root, config, submit: args.includes('--submit'), force: args.includes('--force'), explicit: args.filter((a) => !a.startsWith('--')) });
  } catch (error) {
    console.error(`IndexNow ${automatic ? 'warning (deployment already succeeded)' : 'error'}: ${error.message}`);
    if (!automatic) process.exitCode = 1;
  }
}
