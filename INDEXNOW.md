# IndexNow

Canonical site: https://minimaxh3.pro

- Preview: `node scripts/indexnow.mjs` (no submission or state write).
- Submit changes: `node scripts/indexnow.mjs --submit`.
- Submit selected updated/deleted URLs: append full URLs after `--submit`.
- Force all sitemap URLs: add `--force`; use for deliberate full-site changes only.

Successful `deploy` commands automatically run `node scripts/indexnow.mjs --submit --auto`.

The first accepted run submits all listed URLs. Later runs compare visible HTML text, metadata and links, ignoring hydration scripts, styles and build IDs. This is a content heuristic, not a full visual diff. Removed URLs are notified only after an HTTP 404/410 is confirmed. Permanent 301/308 redirects are notified by their original URLs. Temporary redirects, failed requests and noindex pages stop submission for review. Plain text/Markdown sitemap entries are supported. Submission warnings never turn an already successful deployment into a reported deployment failure. Retry the submit command separately. HTTP 202 means key verification is pending; receipt does not guarantee indexing.

Successful fingerprints are stored in ignored `.indexnow/state.json` (small metadata, no page HTML). Preserve this folder across deployments. Fresh machines and ephemeral CI without a restored state perform a first full submission again. Do not commit this folder or publish it as an asset. Direct dashboard/Wrangler deployments that bypass the configured commands do not invoke this hook. No scheduled jobs were created.

State cache: Local deployments retain `.indexnow` in the project. The included GitHub workflows restore/save it with Actions cache. Cloudflare dashboard builds and other ephemeral runners must preserve this state themselves or use the included post-deployment GitHub workflow; otherwise each clean runner performs a first full submission.
