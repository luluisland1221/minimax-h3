# MiniMax H3 Pre-Launch SEO Audit

Audit date: 2026-08-06  
Target: local pre-launch build at `http://localhost:3000`  
Primary commercial domain: `https://minimaxh3.pro`  
Site type: independent third-party AI video SaaS, Blog, and product documentation  
Primary keyword: `MiniMax H3`

## Executive summary

The site has a strong MiniMax H3 content base, valid core page rendering, one H1 per audited page, self-referencing canonical tags, and OG images on all 30 sampled pages. The 14 published MiniMax H3 articles and seven intended product documentation pages are all over 1,000 words and form a useful topical foundation.

The site is not ready for production indexing yet. The production TypeScript check fails, the sitemap exposes unpublished Fumadocs Blog examples and 31 template Docs URLs, `/docs` itself is still a Fumadocs Quick Start page, and `/about` still identifies the product as MkSaaS. No JSON-LD structured data was detected on any of the 30 audited pages. Blog and Docs title tags are also systematically too long because the full site title is appended to every page title.

### Pre-launch readiness score: 52/100

This is a code-and-content readiness score, not a Google ranking score and not a field Core Web Vitals score.

| Category | Score | Weight | Summary |
|---|---:|---:|---|
| Technical SEO | 42 | 22% | Robots and canonicals work, but the build fails and the sitemap is polluted |
| Content quality | 68 | 23% | H3 articles are substantial; template content seriously weakens trust and topical focus |
| On-page SEO | 66 | 20% | H1, canonical, and OG coverage are good; titles and several descriptions need revision |
| Schema | 15 | 10% | No JSON-LD detected on any audited page |
| Pre-launch performance | 55 | 10% | Media implementation is thoughtful, but the homepage exposes 115 MB of video assets |
| AI search readiness | 48 | 10% | Strong topical content, but no `llms.txt`, entity schema, or clear answer architecture |
| Image and video SEO | 52 | 5% | OG coverage exists; OG crop/weight and video metadata need work |

## Five launch-blocking issues

### 1. Production type checking fails

- Severity: Critical
- Evidence: `npx tsc --noEmit` fails in multiple animation/template components. Errors include invalid Framer Motion `ease` and `type` inference, a missing `AnimationProps` export, and `provider` versus `providerId` in `src/hooks/use-auth.ts`.
- Impact: `next build` cannot complete reliably. A failed production build blocks deployment regardless of SEO quality.
- Required fix: resolve or remove unused template animation components from the TypeScript build, correct typed motion transitions, and update the auth account property to `providerId` where appropriate.
- Verification: `npx tsc --noEmit` and `npm run build` must both exit with code 0.

### 2. Sitemap contains template and unpublished content

- Severity: Critical
- Evidence: `/sitemap.xml` contains 82 entries but only 72 unique URLs. Five custom category URLs appear twice. It includes eight unpublished template Blog URLs and 31 Fumadocs template Docs URLs.
- Impact: Google can discover and index irrelevant Fumadocs/MkSaaS content. This dilutes the MiniMax H3 topical theme, consumes crawl resources, and creates quality and trust problems.
- Root causes:
  - Blog post sitemap generation does not filter `post.data.published` in the final single-post block.
  - Category routes are added once in the general category block and again in the paginated-category block.
  - `source.generateParams()` includes every Docs file, not only the eight intended product documentation routes.
- Required fix: filter unpublished Blog posts, emit each category once, and whitelist only the intended MiniMax H3 Docs routes.

### 3. `/docs` is still a Fumadocs template page

- Severity: Critical
- Evidence: `/docs` returns the title `Quick Start | Minimax H3 - Multimodal AI Video Generation`, a 29-character description, and content from `content/docs/index.mdx` describing Fumadocs installation, Node.js, Fumadocs CLI, and Fumadocs components.
- Impact: A primary navigation destination contradicts the product and can rank for irrelevant terms. It also links into many unwanted template documents.
- Required fix: replace `content/docs/index.mdx` with a MiniMax H3 documentation landing page that links only to Getting Started, Text to Video, First/Last Frame, Multimodal Reference, Prompting, Credits and Pricing, and Video History.

### 4. `/about` still identifies the site as MkSaaS

- Severity: Critical
- Evidence: `messages/en.json` uses `MkSaaS`, `AI SaaS Boilerplate`, and the MkSaaS template introduction in `AboutPage`. The page also uses `/logo.png` instead of the MiniMax H3 logo.
- Impact: This is a direct trust and brand-entity failure. It conflicts with the site's independent-third-party positioning and weakens conversion and E-E-A-T signals.
- Required fix: write an accurate independent MiniMax H3 service description, state that the site is not affiliated with MiniMax, use the H3 logo, and explain the service, support channel, billing model, and data-handling responsibility.

### 5. No structured data is present

- Severity: High
- Evidence: zero `application/ld+json` blocks were found on all 30 audited pages.
- Impact: Search engines receive weaker entity, product, breadcrumb, article, and video context.
- Required fix:
  - Homepage: `WebSite`, `Organization`, `WebPage`, and `SoftwareApplication`.
  - Pricing: `SoftwareApplication` with `Offer` or `OfferCatalog` where accurate.
  - Blog: `BlogPosting` or `TechArticle`, `datePublished`, `dateModified`, publisher organization, and breadcrumb data. A visible personal author is not required by the current editorial policy.
  - Docs: `TechArticle` or `WebPage` plus `BreadcrumbList`.
  - Selected showcase videos: `VideoObject` only when thumbnail, duration, upload date, description, and content URL are known.

## Technical SEO audit

### Crawlability and robots

Status: Pass with adjustments

- `/robots.txt` returns 200.
- It allows the public site and blocks `/api/*`, `/_next/*`, `/settings/*`, and `/dashboard/*`.
- It references `/sitemap.xml`.
- AI search crawlers are not explicitly blocked.

Recommendations:

1. Keep protected and API routes blocked.
2. After deployment, verify that the sitemap URL uses `https://minimaxh3.pro/sitemap.xml`.
3. Consider explicitly disallowing other authenticated route groups if they become discoverable.
4. Do not block CSS, JavaScript, video posters, or public media needed for rendering.

### Sitemap quality

Status: Fail

| Metric | Result |
|---|---:|
| Total entries | 82 |
| Unique URLs | 72 |
| Duplicate URL groups | 5 |
| Duplicate entries | 10 |
| Unpublished template Blog URLs | 8 |
| Template Docs URLs | 31 |

The sitemap also sets `lastModified` to the current build time for all routes. This makes every page look newly modified on every build, even when content did not change. Use the Blog frontmatter date or file/content modification data when possible.

### Canonical tags

Status: Pass locally, production verification required

- All 30 sampled pages expose a canonical.
- Canonicals match their local route.
- `/docs` canonicalizes to `/docs/`, creating a trailing-slash difference from the navigation URL.
- `NEXT_PUBLIC_BASE_URL` exists, but its value was not exposed during the audit.

Before launch, set `NEXT_PUBLIC_BASE_URL=https://minimaxh3.pro` in the production environment and verify that no canonical, OG URL, Twitter URL, robots reference, or sitemap entry contains localhost.

### Status codes and accessibility to crawlers

- All 30 intended sampled pages returned HTTP 200.
- Unpublished template Blog posts remain directly accessible and included in the sitemap.
- Template Docs pages also remain accessible.

Unpublished content should either return 404, be excluded from route generation, or carry `noindex`. For removed template content that has never been indexed, 404 is appropriate; no redirect is needed unless an equivalent H3 page exists.

### HTTPS and security headers

Not scored locally. Development-server headers do not represent Cloudflare production behavior.

After deployment verify:

- HTTP to HTTPS 301/308 redirect.
- One preferred host (`minimaxh3.pro`, not a competing `www` variant).
- HSTS, `X-Content-Type-Options`, Referrer-Policy, frame protection, and an appropriate CSP.
- No mixed-content video, image, script, or API requests.

## On-page SEO audit

### What currently works

- All 30 audited pages contain exactly one H1.
- The homepage H1 is `MiniMax H3 AI Video Generator`.
- The homepage title is 52 characters and its meta description is 151 characters.
- Every sampled page has a canonical and OG image.
- Published Blog posts contain between 1,074 and 1,706 English words.
- Intended Docs pages contain between 1,025 and 1,193 English words.
- The published content uses descriptive keyword-focused URLs.

### Systematic title-length problem

Status: High priority

All 14 H3 Blog titles render between 108 and 121 characters because the article title is followed by `| Minimax H3 - Multimodal AI Video Generation`. Intended Docs titles render between 66 and 83 characters for the same reason.

Examples:

- `/blog/minimax-h3-real-world-test`: 121 characters.
- `/blog/minimax-h3-reference-to-video-guide`: 120 characters.
- `/blog/minimax-h3-character-consistency`: 118 characters.
- `/docs/first-last-frame`: 83 characters.

Fix: use a short page-level suffix such as `| MiniMax H3`, or configure a metadata title template that does not append the full homepage title. Target roughly 50–65 characters while preserving the primary keyword and search intent.

### Meta-description findings

| Page group | Finding |
|---|---|
| Homepage | 151 characters; strong |
| Pricing | 39 characters; too short and generic |
| Blog index | 37 characters; too short and generic |
| About | 114 characters but factually wrong/template-based |
| Contact | 57 characters; too short |
| Privacy, Terms, Cookie | 58–59 characters; acceptable for utility pages but can be clearer |
| H3 Blog posts | Mostly 132–157 characters; generally strong |
| LoRA article | 161 characters; slightly long |
| Intended Docs | Mostly 124–151 characters; strong |
| Docs root | 29 characters and about Fumadocs; must be replaced |

Recommended Pricing description:

> Compare MiniMax H3 plans, monthly credits, 768P and 2K generation costs, and one-time credit packages for your AI video workflow.

Recommended Blog description:

> Explore MiniMax H3 guides, prompts, local deployment, VRAM, ComfyUI, model comparisons, native audio, pricing, and production tests.

### Brand consistency

The site alternates between `MiniMax H3` and `Minimax H3`. Use `MiniMax H3` consistently in visible titles, site name, metadata, navigation, OG tags, and schema.

### Internal linking

Published Blog articles contain between one and 13 internal links. The Prompt Guide has only one internal link even though it should be a central workflow pillar. VRAM and the Seedance comparison also have relatively few internal links.

Recommended cluster links:

- Prompt Guide should link to Text to Video, First/Last Frame, Multimodal Reference, Reference-to-Video, Character Consistency, and the Playground.
- ComfyUI should link to VRAM, GGUF, LoRA, Hugging Face, Open Source, and the online Playground.
- What Is MiniMax H3 should link to every major feature guide and Pricing.
- Cost should link to Pricing, Credits and Pricing Docs, and the Playground estimate.
- Seedance comparison and Real-World Test should cross-link.

Use descriptive anchors; avoid repeating `click here` or forcing the exact same keyword anchor everywhere.

## Content quality and topical authority

### Strengths

- All 14 intended Blog posts exceed 1,000 words.
- The Blog covers model basics, prompting, reference workflows, audio, character consistency, costs, testing, comparison, ComfyUI, VRAM, GGUF, LoRA, Hugging Face, and open-weight questions.
- The seven intended Docs pages also exceed 1,000 words.
- Articles include tables, limitations, safety notes, practical workflows, and source links.
- The content aligns well with the MiniMax H3 search cluster instead of targeting unrelated generic AI topics.

### Weaknesses

1. Template pollution is substantial: MkSaaS About copy, Fumadocs Docs root, 31 template Docs URLs, and eight unpublished but indexable template Blog URLs.
2. Several product-interface translations remain generic template copy, including Blog, Pricing, Contact, Newsletter, and Docs labels/descriptions.
3. The site's independent-third-party identity is not explained strongly enough on About.
4. There is no visible testing methodology hub tying the Real-World Test article to actual repeatable outputs.
5. All Blog posts share the same publication date. This is not inherently wrong, but staggered publishing and meaningful `dateModified` updates will look more natural and make content maintenance clearer.

The editorial choice not to display individual authors is respected. Strengthen trust through an accurate About page, clear source attribution, methodology notes, dates, change history, support details, legal pages, and an Organization publisher entity instead.

## Structured data audit

Status: Fail

No JSON-LD was detected in the server-rendered HTML of any sampled page. Because this is a Next.js source audit as well as an HTML audit, the codebase was also searched for `application/ld+json` and Schema.org output without finding a site-level implementation.

Recommended rollout order:

1. Homepage entity graph: `Organization`, `WebSite`, `WebPage`, `SoftwareApplication`.
2. Global `BreadcrumbList` for Blog, category, article, and Docs pages.
3. Blog publisher/date structured data without adding an unwanted visible author block.
4. Pricing offers only when prices and credit quantities exactly match the live checkout configuration.
5. `VideoObject` for a limited set of important authorized examples.

Do not add FAQ schema solely for Google rich-result eligibility; commercial FAQ rich results are restricted. Keep visible FAQ content for users and AI understanding.

## AI search and GEO readiness

### Current strengths

- The homepage and articles define MiniMax H3 directly.
- Content contains tables, concise answer blocks, comparisons, limitations, and first-party product pricing explanations.
- Major AI crawlers are not blocked by robots rules.

### Gaps

- No `/llms.txt` file.
- No Organization/WebSite/SoftwareApplication entity graph.
- No structured breadcrumb graph.
- The inaccurate MkSaaS About page creates entity ambiguity.
- The Fumadocs content cluster competes with the intended MiniMax H3 entity.
- Many H2 headings are descriptive rather than direct questions; selected question-based sections could improve answer extraction.

Recommended `llms.txt` contents should point to the homepage, Pricing, About, core Docs, key Blog pillars, legal pages, and the independent/non-affiliation disclosure. It should not list template pages, protected routes, or every minor URL.

## Image, OG, and video audit

### OG images

- All 30 sampled pages expose an `og:image`.
- The default OG image is `hero-cinematic.png`.
- Current dimensions: 1823 × 863, 2.16 MB.
- Its aspect ratio is wider than the conventional 1200 × 630 social preview ratio.

Recommendation: create a dedicated 1200 × 630 compressed WebP/JPEG/PNG OG asset with safe text margins and MiniMax H3 branding. Blog articles do not need visible article illustrations; a shared or category-level social preview asset is separate from visible Blog artwork.

### Homepage video weight

| Metric | Result |
|---|---:|
| Video files | 33 |
| Total video weight | 115.35 MB |
| Files over 5 MB | 7 |
| Files over 10 MB | 3 |
| Largest file | 18.1 MB |
| Hero video | 4.06 MB |

The gallery correctly uses `preload="metadata"` and only plays a video on hover. This is a strong implementation choice. However, 33 metadata requests and large files can still create bandwidth and connection overhead. The hero uses `preload="auto"`, autoplay, and loop.

Recommendations:

1. Keep hover-to-play and pause-on-leave.
2. Add poster frames for hero and gallery videos to improve visual stability and fallback rendering.
3. Test `preload="metadata"` versus `preload="none"` for below-the-fold gallery cards.
4. Re-encode the three files over 10 MB and other high-weight videos with web delivery settings.
5. Serve immutable cache headers for versioned video assets through Cloudflare.
6. Measure whether the hero video is the LCP candidate; if so, use a lightweight poster as the initial painted element.
7. Do not preload all gallery assets.

## Trust, legal, and conversion findings

- Privacy, Terms, and Cookie pages return 200 and have canonicals.
- The legal pages include the independent/non-affiliation positioning requested earlier.
- About must be rewritten before launch.
- `websiteConfig.mail.supportEmail` contains `Minimax H3 <support@minimaxh3.pro>`, but it is interpolated directly into `mailto:` links. This produces an invalid-looking URL such as `mailto:Minimax H3 <support@minimaxh3.pro>`.
- Keep `fromEmail` in display-name format if the mail provider accepts it, but store `supportEmail` as the plain address `support@minimaxh3.pro` for links and recipients.
- The configured mail provider still says `resend` while the project uses Plunk credentials and admin mail actions. Verify Newsletter and Contact flows before launch.

## URL and page-level findings

### Strong pages

- `/`: correct H1, 52-character title, 151-character description, canonical, OG.
- The 14 H3 Blog pages: one H1, substantial content, strong descriptions, clear keyword URLs.
- The seven intended H3 Docs pages: one H1, 1,000+ words, useful descriptions and focused intent.

### Pages requiring immediate revision

| URL | Problem |
|---|---|
| `/docs` | Fumadocs Quick Start template |
| `/about` | MkSaaS identity and logo |
| `/blog` | Generic 37-character description |
| `/pricing` | Generic 39-character description |
| `/contact` | Generic description and support-email format risk |
| Template Blog URLs | Published false but accessible and included in sitemap |
| Template Docs URLs | Accessible and included in sitemap |

## Prioritized action plan

### P0 — before any production deployment

1. Make `npx tsc --noEmit` and `npm run build` pass.
2. Replace `/docs` Fumadocs content with a MiniMax H3 documentation landing page.
3. Rewrite `/about` and remove all visible MkSaaS identity.
4. Remove template Blog/Docs URLs from sitemap and route generation.
5. Deduplicate the five category sitemap URLs.
6. Ensure production `NEXT_PUBLIC_BASE_URL` is `https://minimaxh3.pro`.

### P1 — before submitting the sitemap

1. Shorten Blog and Docs title templates.
2. Add homepage/entity, breadcrumb, Blog, Docs, and pricing structured data.
3. Rewrite Pricing, Blog, Contact, and Docs-root meta descriptions.
4. Normalize `MiniMax` capitalization.
5. Fix `supportEmail` to use a plain email address.
6. Remove or rewrite remaining template translation strings that are reachable in production.
7. Create `/llms.txt`.

### P2 — first optimization sprint

1. Strengthen internal links around Prompt, ComfyUI/local deployment, cost, and comparisons.
2. Create a correctly sized OG image.
3. Add video posters and test gallery `preload="none"`.
4. Compress or replace the largest videos.
5. Add meaningful content modification dates to sitemap and structured data.

### P3 — after deployment

1. Crawl `https://minimaxh3.pro` and compare sitemap URLs with indexable canonicals.
2. Run mobile and desktop Lighthouse/PageSpeed tests.
3. Verify LCP, INP, CLS, TTFB, cache headers, Brotli, and video caching.
4. Test Google Rich Results for implemented schema.
5. Submit sitemap to Google Search Console and Bing Webmaster Tools.
6. Monitor index coverage, canonical selection, crawl errors, and Core Web Vitals.
7. Validate Stripe, Google login, Plunk Contact/Newsletter, MiniMax generation, R2 storage, and user video history as conversion-critical flows.

## Verification checklist

- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.
- [ ] Sitemap contains only intended indexable URLs and no duplicates.
- [ ] `/docs` contains only MiniMax H3 documentation.
- [ ] `/about` accurately describes the independent service.
- [ ] All production canonicals use `https://minimaxh3.pro`.
- [ ] Blog and Docs titles fit the intended SERP length.
- [ ] Schema validates in a rendered-page test.
- [ ] No public page contains MkSaaS/Fumadocs template content.
- [ ] OG image renders correctly in 1200 × 630 previews.
- [ ] Newsletter and Contact use Plunk successfully.
- [ ] Mobile and desktop CWV are measured after deployment.

## Audit limitations

- This is a pre-launch local audit. It cannot confirm Google indexation, Search Console coverage, backlinks, CrUX field data, production Cloudflare headers, HTTPS redirects, or real-user performance.
- Local development response times include first-route Next.js compilation and are not treated as production performance evidence.
- No private environment-variable values, analytics accounts, Search Console data, or customer data were read.
- Schema was checked in both rendered server HTML and source patterns; it should be revalidated after implementation with a rendered browser or Rich Results Test.
