import assert from 'node:assert/strict';
const options = { headers: { 'x-forwarded-proto': 'https' } };
const base = process.env.SEO_TEST_BASE_URL || 'http://127.0.0.1:8787';
for (let attempt = 0; ; attempt++) {
  try { await fetch(base, options); break; }
  catch (error) { if (attempt >= 59) throw error; await new Promise(r => setTimeout(r, 1000)); }
}
for (const [path, status] of [
  ['/', 200], ['/blog', 200], ['/blog/page/2', 200],
  ['/blog/minimax-h3-api', 200], ['/docs/getting-started', 200],
  ['/blog/page/99', 404], ['/blog/page/0', 404], ['/blog/page/abc', 404],
  ['/blog/category/tests-comparisons/page/99', 404],
]) {
  const response = await fetch(base + path, options);
  const html = await response.text();
  assert.equal(response.status, status, path);
  if (status === 200) assert.doesNotMatch(html, /<meta[^>]*name="robots"[^>]*content="noindex"/, path);
  console.log(status, path);
}

// Account routes must reach authentication, rather than the SEO 404 guard.
for (const path of ['/dashboard', '/dashboard/videos', '/settings/profile', '/settings/billing', '/settings/credits', '/settings/security', '/settings/notifications', '/admin/users', '/admin/analytics', '/admin/mail']) {
  const response = await fetch(base + path, { ...options, redirect: 'manual' });
  assert.equal(response.status, 307, path);
  const location = new URL(response.headers.get('location'), base);
  assert.equal(location.pathname, '/auth/login', path);
  assert.equal(location.searchParams.get('callbackUrl'), path);
  console.log('307 auth redirect', path);
}
for (const path of ['/pricing', '/about', '/contact', '/privacy', '/terms', '/cookie', '/examples', '/authors', '/methodology', '/editorial-policy', '/auth/login']) {
  const response = await fetch(base + path, options);
  assert.equal(response.status, 200, path);
  console.log('200', path);
}
const missing = await fetch(base + '/not-a-real-page', options);
assert.equal(missing.status, 404);
assert.match(await missing.text(), /favicon\.svg/);

const sitemap = await (await fetch(base + '/sitemap.xml', options)).text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.ok(locations.length > 50);
for (const url of locations) assert.equal(new URL(url).origin, 'https://minimaxh3.pro');
const home = await (await fetch(base, options)).text();
assert.match(home, /rel="canonical" href="https:\/\/minimaxh3\.pro\/?"/);
console.log('Production canonical and sitemap origins OK');
