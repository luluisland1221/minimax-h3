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
