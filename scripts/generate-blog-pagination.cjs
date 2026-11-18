const fs = require('node:fs');
const { createRequire } = require('node:module');
const requireMdx = createRequire(require.resolve('fumadocs-mdx'));
const { load } = requireMdx('js-yaml');
function generateBlogPagination() {
  const counts = {};
  for (const file of fs.readdirSync('content/blog')) {
    if (!file.endsWith('.mdx')) continue;
    const text = fs.readFileSync('content/blog/' + file, 'utf8');
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) throw new Error('Missing frontmatter: ' + file);
    const data = load(frontmatter[1]);
    if (data.published !== true) continue;
    const locale = file.match(/\.([a-z]{2}(?:-[A-Z]{2})?)\.mdx$/)?.[1] || 'en';
    const entry = counts[locale] ||= { total: 0, categories: {} };
    entry.total++;
    for (const category of data.categories || []) entry.categories[category] = (entry.categories[category] || 0) + 1;
  }
  const target = 'src/lib/seo/blog-pagination.json';
  const output = JSON.stringify(counts, null, 2) + '\n';
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) fs.writeFileSync(target, output);
}
generateBlogPagination();
