# MiniMax H3（minimaxh3.pro）全站 SEO 优化路线图

- 日期：2026-11-17
- 核心词：`minimax h3`
- 审计方式：源码逐文件核查（`src/app`、`src/lib/seo`、`src/config`、`content`）+ 线上真实请求（状态码、响应头、TTFB、HTML/JS/CSS/字体/视频体积、JSON-LD、sitemap、robots）
- 前置文档：`reports/prelaunch-seo-audit-2026-08-06.zh-CN.md`、`reports/prelaunch-seo-remediation-2026-08-06.zh-CN.md`（本轮不重复已修复项，只列"还能做什么"）

---

## 一、一句话结论

8 月的整改把"能上线、能被收录"这件事做完了（canonical、sitemap 去重、llms.txt、OG 路由、视频瘦身、模板内容下线都是对的）。**现在剩下的增量集中在四块：技术状态码与可缓存性、视频类结构化数据与视频分发、E-E-A-T（作者/实体）信号、内容矩阵与多语言。** 其中技术面有一个"全站 HTML 都不缓存、每个请求都 SSR"的结构性问题，和一组"未知 URL 返回 200"的软 404，这两项是当前性价比最高的修复点。

---

## 二、实测基线（2026-11-17）

| 项目 | 实测值 | 判断 |
| --- | --- | --- |
| sitemap URL 数 | 57（30 篇博客 + 7 篇文档 + 9 个静态页 + 6 分类 + 5 分页） | 合理，无重复 |
| HTML 缓存头 | `private, no-cache, no-store, max-age=0, must-revalidate` | ❌ 全站 HTML 不被 CDN 缓存 |
| 每个响应附带 | `Set-Cookie: NEXT_LOCALE=en` | ❌ 进一步阻止共享缓存 |
| TTFB（本文网络→LAX 边缘） | 冷启 1,221ms / 热 230–277ms | ⚠️ 静态内容不该每次回源渲染 |
| 首页 HTML | 143 KB（未压缩，br 传输） | 正常 |
| 首页 JS / CSS | 36 个 JS ≈ 1.0 MB、2 个 CSS ≈ 255 KB（均未压缩） | ⚠️ 对落地页偏重 |
| 字体 | 4 个 woff2 共 ≈ 100 KB，已 preload | ✅ 良好 |
| 首页 `<video>` | 21 个，`hero.mp4` 4.06 MB 且 `autoplay`（源码中一处 `preload="auto"`） | ⚠️ 移动端 LCP/流量风险 |
| public/videos | 66 个文件 79.06 MB | 已有优化，仍可再分档 |
| JSON-LD | 1 个 `@graph`；首页 Organization/WebSite/WebPage/WebApplication/Offer，文章 BlogPosting/BreadcrumbList，部分 FAQPage | ✅ 覆盖面不错 |
| VideoObject | 0 处 | ❌ 33 个视频无任何视频标记 |
| hreflang / `alternates.languages` | 0 处 | ⚠️ 当前单语言无伤，扩语言前必须补 |
| Organization `sameAs` | 缺失（`website.tsx` 里社交项全空） | ❌ 实体信号弱 |
| 文章作者 | `author` = Organization，无 Person、无作者页 | ❌ E-E-A-T 缺口 |
| 标题长度 | 7 个 > 60 字符（`minimax-h3-api` 65、`vram` 62、`gguf` 62、`lora` 65、`vs-veo-3` 61、`prompt-guide` 65 等） | ⚠️ 移动端易被截断 |
| 描述长度 | 10 个不在 120–160 区间（如 `free` 167、`lora` 161、`vs-seedance` 126） | ⚠️ 建议统一 |
| 文章 og:type | `website`（应为 `article`） | ❌ |
| `twitter:site` | 填成了 `https://minimaxh3.pro`（应为 @handle） | ❌ 值非法 |
| 未知 URL 状态码 | `/a/b/c` → **200**；`/blog/category/不存在` → **200**；`/blog/page/99` → **200 且可索引** | ❌ 软 404 |
| 强制 404 的范围 | 仅 `/docs/*`、`/blog/<单段>`（中间件手写 404，581 字节） | ✅ 思路对，覆盖不全 |
| robots.txt | 显式允许 GPTBot/PerplexityBot/ClaudeBot 等；未拦 `/auth/*`、`/admin/*` | ✅ 方向对，小补 |
| 内容量 | 38 个 MDX，30 篇已发布，平均 ≈1,174 词 | ⚠️ 对比类偏薄 |
| 语言 | 仅 `en` 启用；zh MDX 全是模板残留，产品文无中文版 | ⚠️ 中文市场完全放弃 |
| 监测 | GA4（GTM 注入）在；HTML 中无 GSC/Bing 验证 meta（可能走 DNS） | ⚠️ 需确认 |
| IndexNow | 有 key 文件 + 部署后自动提交 | ✅ |

**已做得好的部分（保持）**：HSTS/CSP/nosniff 等安全头齐全、brotli 已开、canonical 自引用、面包屑可见+标记、sitemap 有 lastmod 且无重复、`/pricing.md` 与 `/llms.txt` 机器可读、模板文章已从 sitemap/搜索中排除、视频已降码率并生成真实首帧。

---

## 三、P0：1 周内，直接影响抓取质量

### P0-1 未知 URL 返回 200（软 404）——当前最该修的一项

**证据**
- `https://minimaxh3.pro/a/b/c` → `200`，正文是 44 KB 的 Next 404 页面，`<title>` 为空，只有 `noindex`。
- `https://minimaxh3.pro/blog/category/not-a-category` → `200`。
- `https://minimaxh3.pro/blog/page/99` → `200`，标题 `… – Page 99`，**没有 noindex**，是一张空白列表页。
- 只有 `/docs/xxx`、`/blog/<单段>` 被中间件强制成真 404。

**原因**：`app/[locale]/[...rest]/page.tsx` 里 `notFound()` 发生在流式渲染已开始之后，OpenNext/Workers 会把状态码定成 200；`src/middleware.ts` 只对 docs/blog 单段路径做了兜底。

**影响**：GSC 会报 "Soft 404"；任意拼错的外链、被爬虫猜到的 URL 都消耗抓取预算；空分页可被索引成薄页面。

**修复**（`src/middleware.ts`，在现有 `isUnknownDoc || isUnknownBlog` 判断旁边扩展）：

```ts
const NOT_FOUND_HTML =
  '<!doctype html><html lang="en"><head><meta name="robots" content="noindex"><title>404 – Page not found | MiniMax H3</title></head><body><main><h1>Page not found</h1><p>The requested page does not exist.</p><p><a href="/">Back to MiniMax H3</a></p></main></body></html>';

// 只允许这些一级路径；其余一律真 404
const KNOWN_FIRST_SEGMENTS = new Set([
  'pricing', 'about', 'contact', 'blog', 'docs', 'privacy', 'terms',
  'cookie', 'auth', 'dashboard', 'settings', 'admin', 'api', 'og',
]);

const firstSegment = pathnameWithoutLocale.split('/').filter(Boolean)[0] ?? '';
const isUnknownCategory =
  /^\/blog\/category\/[^/]+$/.test(pathnameWithoutLocale) &&
  !categorySource.getPages().some(
    (c) => c.slugs[0] === pathnameWithoutLocale.split('/')[3]
  );

if (
  (firstSegment && !KNOWN_FIRST_SEGMENTS.has(firstSegment)) ||
  isUnknownCategory ||
  isUnknownDoc ||
  isUnknownBlog ||
  isRetiredRoute
) {
  return new NextResponse(NOT_FOUND_HTML, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
```

> 注意：`categorySource` 在 middleware（Edge/Workers）里可能不便引入，可改为 `PUBLIC_CATEGORY_SLUGS` 常量数组，与 `src/lib/seo/content-routes.ts` 同风格维护。

**同时做**：
1. 分页越界直接 `notFound()`：`blog/(blog)/page/[page]/page.tsx` 与 `blog/(blog)/category/[slug]/page/[page]/page.tsx` 中，`pageNum > totalPages` 时 `notFound()`。
2. 给 Next 侧 404 补 `<title>`（`app/[locale]/not-found.tsx` 目前无标题，SERP/工具里显示为空）。

---

### P0-2 全站 HTML 动态渲染 + 不可缓存（根因已定位）

**证据**
- 所有页面响应 `Cache-Control: private, no-cache, no-store`。
- 构建产物里**没有任何营销页 HTML**（`.next/server/app` 下只有 `_not-found.html`），说明 57 个 URL 全部是请求时 SSR。
- 全仓搜索 `setRequestLocale` / `force-static`：0 处（营销区）。

**根因**：next-intl 的静态渲染要求在每个使用 `getTranslations` / `getMessages` 的 layout/page 里先调用 `setRequestLocale(locale)`。当前没有调用，所以凡是用了 next-intl 服务端 API 的页面自动变成动态渲染。

**影响**：TTFB 从"边缘静态命中（~50ms）"变成"每次跑一遍 Worker 渲染（230ms+，冷启 1.2s）"；Cloudflare 无法缓存 HTML；流量上来后 Worker 时长成本线性增长。

**修复**
1. `src/app/[locale]/layout.tsx`：

```ts
import { setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);        // ← 必须在 getMessages() 之前
  const messages = await getMessages();
  ...
}
```

2. 给每个调用 `getTranslations` 的 page/layout 顶部加同样的 `setRequestLocale(locale)`（营销 layout、blog 列表/详情、pricing、docs layout 等）。
3. `pnpm build` 后确认输出里这些路由从 `ƒ` 变成 `○`，且 `.next/server/app/**` 出现 HTML。
4. 关闭"每个响应都写 locale cookie"：`src/i18n/routing.ts` 设 `localeCookie: false`（单语言站没有必要记 cookie），否则即使静态化，`Set-Cookie` 仍会让 CDN 放弃缓存。
5. 在 Cloudflare 加 Cache Rule：对 `text/html` 且非 `/api/*`、`/dashboard/*`、`/settings/*` 的响应启用边缘缓存（Edge TTL 1h + `stale-while-revalidate`），并确保 `Vary` 不包含 cookie。

**验收**：`curl -I https://minimaxh3.pro/pricing` 看到 `cache-control: public, s-maxage=…`；重复请求 TTFB < 100ms。

---

### P0-3 404 页面缺标题、缺站内导航

当前手写 404（581 字节）只有一个 h1 和一句提示。补 `<title>`、`<link rel="canonical">` 不需要，但要补：返回首页 + 热门内容（3 个链接），把误入流量接住。Next 侧 `not-found.tsx` 同理补 `<title>`。

---

## 四、P1：2–4 周，结构化数据与实体信号

### P1-1 VideoObject：33 个视频、0 个标记（最大的"免费"富结果缺口）

首页 21 个 `<video>`、内容页还有视频演示，但 JSON-LD 里没有任何 `VideoObject`。补上后可进入 Google 视频结果、视频 Tab、Discover 视频卡片，而且视频缩略图能吃到图片搜索。

**落地方式（建议同时开 `/examples/<slug>` 页面，见 6.4）**：

```ts
// src/lib/seo/video.ts
export function videoObjectSchema(v: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string; // ISO 8601，如 2026-08-07
  duration: string;   // ISO 8601，如 PT8S
  width?: number;
  height?: number;
}) {
  return {
    '@type': 'VideoObject',
    ...v,
    publisher: { '@id': 'https://minimaxh3.pro/#organization' },
    inLanguage: 'en',
    isFamilyFriendly: true,
  };
}
```

**硬性要求（缺一不可）**：`name`、`thumbnailUrl`（≥1200px 宽）、`uploadDate`、`contentUrl` 或 `embedUrl`；`duration` 强烈建议。先给首页 3–6 个主视频 + 每个 `/examples` 页 1 个加，不要一次 21 个全塞首页（体积和"重复实体"都没必要）。

### P1-2 品牌实体（Organization 太单薄）

现状：`name: "minimaxh3.pro"`，无 `sameAs`、无 `founder`，`logo` 用 SVG。Google 的 Logo/品牌展示更认位图（≥112×112，png/jpg）。

改法（`src/lib/seo/schema.ts`）：

```ts
export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'MiniMax H3',
  alternateName: ['minimaxh3.pro', 'MiniMax H3 AI Video Generator'],
  url: baseUrl,
  logo: { '@type': 'ImageObject', url: `${baseUrl}/logo-512.png`, width: 512, height: 512 },
  sameAs: [
    'https://x.com/<handle>',
    'https://www.youtube.com/@<handle>',
    'https://github.com/<org>',
  ],
  ...
};
```

> `sameAs` 只填真实存在且可验证的账号；没有就先建账号，别填占位符。`websiteConfig.metadata.social` 现在全空，先补 X + YouTube 两个。

### P1-3 作者与 E-E-A-T（内容站最薄弱的一环）

现状：`BlogPosting.author` = Organization；页面上只有日期，没有署名；`content/author/minimax-h3.mdx` 这个作者集合存在但**完全没被用**；`source.config.ts` 的 blog schema 里没有 `author` 字段。

三步：
1. `source.config.ts` blog schema 增加 `author: z.string().optional()`；文章 frontmatter 填 `author: minimax-h3`（或用 `editorial-team`）。
2. 页面显示 byline：`By <a href="/authors/<slug>">Name</a> · Reviewed by … · Last updated …`。
3. 新增 `/authors/<slug>` 页面 + `Person` 标记（`name`、`jobTitle`、`knowsAbout: ['AI video generation','MiniMax H3','prompt engineering']`、`sameAs`），并把文章 schema 改成：

```ts
author: { '@type': 'Person', name: authorName, url: `${baseUrl}/authors/${authorSlug}` },
```

4. 补两个"信任页"：
   - `/methodology`（如何测试、用什么参数、如何记录成本、样本量）
   - `/editorial-policy`（谁写、多久更新、纠错方式、与 MiniMax 无隶属关系）

对一个"做对比、报价格、下结论"的第三方站，这是能不能拿到稳定排名的分水岭，比再加 10 篇文章更值。

### P1-4 页面级 meta 修正清单（都是小改，收益明确）

| 问题 | 位置 | 改法 |
| --- | --- | --- |
| 文章 `og:type = website` | `src/lib/metadata.ts` | 支持 `type: 'article'`，并输出 `article:published_time` / `article:modified_time` / `article:author` / `article:section` |
| `twitter:site` 填 URL | `metadata.ts:48` | 改成 `@handle`，没有就删掉这一行 |
| 文档标题重复品牌 | `docs/[[...slug]]/page.tsx:56` | `MiniMax H3 Documentation \| MiniMax H3` → 用 `seoTitle` 显式写 `MiniMax H3 Documentation` |
| 7 个标题 > 60 字符 | 对应 MDX frontmatter | 压到 50–58；把关键词放前 35 字符 |
| 10 个描述越界 | 对应 MDX frontmatter | 统一 130–155 字符，含 `MiniMax H3` + 一个动作词 |
| OG 图无尺寸 | `metadata.ts` | 补 `width: 1200, height: 630`（文章封面是 1200×800，建议出一版 1200×630 或接受裁切） |
| 无 `og:locale:alternate` | 扩语言时 | 与 hreflang 一起加 |
| 文章页无 `article:*` | `metadata.ts` | 见第一行 |

### P1-5 结构化数据的"用对"而不是"用多"

- `FAQPage`：Google 自 2023-08 起只对政府/医疗类站点展示 FAQ 富结果，**保留它是为了 AI 检索与语义理解，不要指望 SERP 折叠**。不要为了 FAQ 富结果去堆问题。
- `HowTo`：富结果已下线，`doc-howtos.ts` 保留即可，别再扩张。
- `WebApplication`：可以补 `screenshot`、`featureList`、`softwareVersion`、`datePublished`，让"软件"实体更完整；`aggregateRating` 没有真实评分就别造。
- 对比文章可加 `about` / `mentions`（指向被对比产品的 `SoftwareApplication`），但要用真实官方 URL，不要指向自己。

---

## 五、P1/P2 性能：Core Web Vitals 风险点

没有 CrUX 现场数据（站点流量还不足以形成字段数据），以下是**结构性风险**，不是"已失败"：

1. **首屏 4 MB 自动播放视频**（`hero.mp4` 4.06 MB，`autoplay` + `preload="auto"`）。
   - 移动端：改为"静态海报 + 点击播放"，或按 `navigator.connection.saveData` / `matchMedia('(max-width: 768px)')` 降级为 720p、2–3 秒、<800 KB 的循环片段。
   - 桌面端：保留自动播放，但换成 AV1/WebM + MP4 双源，并把首帧海报 `preload` + `fetchpriority="high"`。
   - 给 `<video>` 补 `width`/`height`，避免 CLS。
2. **JS 1.06 MB（未压缩）**：营销页引入了 framer-motion、recharts、swiper、embla、radix 全家桶。建议对落地页做一次 bundle 审计（`@next/bundle-analyzer`），把图表/轮播类只留给 dashboard。
3. **CSS 255 KB**：fumadocs 样式与营销样式是否在同一入口合并，值得拆。
4. **图片**：`hero-cinematic.png` 2.16 MB、`post-6/7.png` 1 MB+，营销区应统一 WebP/AVIF。
5. **字体**：4 个 woff2 100 KB 已 preload，OK；确认 `display: swap`（Noto 系列缺字会闪）。

---

## 六、P2：内容与关键词（真正的长期增量）

### 6.1 现有覆盖矩阵（30 篇已发布）

- 产品认知：`what-is-minimax-h3`
- 操作类：`prompt-guide`、`reference-to-video`、`character-consistency`、`native-audio`、`product/ugc/game/music` 四篇场景
- 部署类：`comfyui`、`vram-requirements`、`gguf`、`lora`、`huggingface`、`open-source`
- 商业类：`cost`、`api`、`free`、`turbo-and-max`、`pricing`（页面）
- 对比类：`alternatives` + 9 篇 `vs-*`（Veo/Kling/Sora/Wan/Runway/LTX/Luma/Firefly/Seedance）
- 评测类：`real-world-test`

**结构判断**：广度很够，深度偏薄（对比篇 1,200–1,700 词，缺少自有测试数据/截图/耗时记录）。Google 对"AI 视频工具对比"这类查询越来越偏好**有第一手证据**的页面。

### 6.2 关键词缺口（按商业价值排序）

| # | 关键词簇 | 意图 | 现状 | 建议产出 |
| --- | --- | --- | --- | --- |
| 1 | minimax h3 review / is it worth it / honest review | 决策 | 只有 real-world-test | `/blog/minimax-h3-review`（评分表 + 失败案例 + 与 3 个竞品同题对比） |
| 2 | minimax h3 download / app / ios / android / windows | 高流量 | 无 | 一页说清"网页版无需下载"+ 各端可用性（避免误导，明确无官方 App） |
| 3 | minimax h3 vs hailuo ai / vs minimax h2 / hailuo vs minimax | 品牌邻近 | 无 | 2 篇（这是"minimax"品牌词流量的真正入口） |
| 4 | minimax h3 2k / 4k / upscale / regenerate | 功能 | docs 提过 | 1 页"2K 与再生成实测"（带样片与耗时） |
| 5 | minimax h3 image to video / first frame | 功能 | docs 有，博客无 | 1 页（承接 docs 的搜索需求差异） |
| 6 | minimax h3 commercial use / license / watermark | 合规 | 无 | 1 页（明确"生成内容商用范围 + 水印政策"） |
| 7 | minimax h3 seed / camera control / negative prompt | 进阶操作 | prompt-guide 部分覆盖 | 拆成 1 页"参数手册" |
| 8 | minimax h3 free trial / no credit card | 转化 | `free` 已有 | 优化该页 CTA 与 schema，不必新页 |
| 9 | best ai video generator 2026 / minimax h3 alternatives | 比价 | alternatives 已有 | 加"按场景推荐"表格 + 更新日期 |
| 10 | minimax h3 是什么 / 怎么用 / 价格 / 本地部署 / ComfyUI（中文） | 中文市场 | 0 | 见 6.6 |

> 注意**关键词蚕食**：`/pricing`、`/blog/minimax-h3-cost`、`/docs/credits-and-pricing`、`/pricing.md` 四个 URL 都在抢"价格"意图。建议分工：`/pricing` 承接交易词（minimax h3 pricing/plans），`cost` 承接分析词（per second cost、credit math），`docs` 承接"我的积分怎么扣"，四者互相内链并统一口径。

### 6.3 支柱页 + 集群内链

现在只有 7 个 slug 有手工推荐（`editorialRelatedPosts`），其余靠"同类目 + 字母序"，内链质量不稳定。

- 建一个真正的枢纽：`/minimax-h3`（或把 `what-is-minimax-h3` 升级）→ 链接到 6 个分类 hub + 9 篇对比 + 4 个场景页。
- 每篇文章正文至少 3 个上下文内链（不是页尾推荐），指向"上一层 hub"和"同层兄弟"。
- 对比页互链成环：`vs-veo-3 ↔ vs-sora-2 ↔ alternatives`，每篇底部加"同一测试方法下的其他对比"。
- 分类页补 150–250 词独有导语 + 3–5 个 FAQ（`category-content.ts` 已有基础，扩写即可）。

### 6.4 程序化页面：`/examples/<slug>`

33 个视频现在是"哑素材"（只有 poster + 自动播放），既没有文字，也没有独立 URL。做成 33 个示例页，每页包含：

- H1：`<主体> — MiniMax H3 <模式> 示例`
- 视频（`VideoObject` 标记）+ 使用的提示词全文 + 参数（时长/分辨率/参考图）+ 生成耗时 + 失败/重试记录
- 3–6 个相关示例 + 返回对应指南的链接

这是**有真实独特内容**的程序化页面（不是 doorway），同时吃三份流量：`minimax h3 prompt example`、视频搜索、图片搜索（首帧）。

### 6.5 新鲜度机制

- 目前 11 篇有 10 月更新（`2026-10-06` / `2026-10-15`），其余 19 篇仍停在 8 月。模型迭代快，"Last updated" 是这类内容的核心信任信号。
- 建一个月度刷新清单：价格页、对比页、`what-is`、`free`、`api` 优先。
- 把 `content/changelog` 用起来，做一个 `/changelog` 页（模型版本、定价、功能变更），既服务用户也服务 AI 抓取。

### 6.6 中文版（分阶段，不要一键开）

zh MDX 现在只有模板残留，产品文没有中文；`websiteConfig.i18n.locales` 只开了 `en`。建议：

1. 先翻 8–10 篇最高价值（`what-is`、`pricing/cost`、`prompt-guide`、`comfyui`、`vs-hailuo`、`free`），放 `content/blog/*.zh.mdx`。
2. 再开 `locales: { en, zh: { name: '简体中文' } }`，同时补：
   - `constructMetadata` 的 `alternates.languages`（en / zh-CN / x-default）
   - sitemap 的 `alternates.languages`
   - 语言切换器（docs layout 已有 `showLocaleSwitch` 逻辑）
3. 中文关键词与英文不同：`minimax h3 是什么`、`minimax h3 怎么用`、`minimax h3 价格`、`minimax h3 本地部署`、`海螺AI`、`minimax 视频模型`。

> 顺序很重要：**先有内容再开语言**，否则会出现 20 个空壳 zh 页面，反而拖累站点质量。

---

## 七、P2：站外与 AI 搜索（GEO）

1. **`sameAs` 与社交矩阵**：X、YouTube、GitHub 至少各一个真实账号；组织实体越清晰，品牌词越容易被识别。
2. **YouTube 是视频类查询的最大入口**：把 33 个样片剪成 8–15 秒 Shorts，标题用 `MiniMax H3 <场景>`，描述回链到对应 `/examples` 页。Google 视频结果里 YouTube 的权重远高于自托管 mp4。
3. **AI 工具目录**：There's An AI For That、Futurepedia、AI Tool Directory、AlternativeTo（作为 MiniMax/Hailuo 的 alternative 收录）。这些是"minimax h3"品牌词之外最稳的外链来源。
4. **可被引用的事实**：AI Overviews / Perplexity 偏爱"可摘录的短结论 + 表格 + 明确日期"。现有每篇开头的 `> **Quick answer:**` 很好，建议统一成固定格式（一句话结论 + 3 个要点 + 数据来源），并给关键数字加 `time`/`data` 标注。
5. **`llms.txt` 的现实定位**：目前没有任何主流爬虫承诺消费它，别把它当排名手段。它真正的价值是"当有人/AI 主动读时，给一份准确的官方口径"。保持更新即可。
6. **社区参与**：Reddit（r/aivideo、r/StableDiffusion）、Hacker News、Quora 上的"MiniMax H3 怎么用"问题，用真实测试数据回答，别贴裸链。
7. **`/pricing.md` 这类机器可读文件**是好实践，可以再补 `/compare.md`（9 个竞品对比表）供 AI 直接引用。

---

## 八、监测与验收清单

| 项目 | 动作 | 验收标准 |
| --- | --- | --- |
| Google Search Console | 确认已验证（HTML 里无 meta，若走 DNS 记录则忽略）；提交 sitemap | 57 条已编入索引 / 已发现 |
| Bing Webmaster | 验证 + 提交 sitemap；确认 IndexNow 生效 | IndexNow 返回 200/202 |
| 软 404 | 修完后在 GSC "网页索引" 看 Soft 404 归零 | 0 |
| 富结果 | Rich Results Test 测首页、1 篇对比文、1 个 `/examples` | VideoObject / BlogPosting 无错误 |
| CWV | GSC 核心网页指标 + PageSpeed（移动） | LCP < 2.5s、INP < 200ms、CLS < 0.1 |
| 缓存 | `curl -I` 检查 HTML `cache-control` | `public, s-maxage=…` |
| 排名 | 跟踪 `minimax h3` 及 12 个簇词（含 `minimax h3 review`、`minimax h3 vs hailuo`） | 周度记录 |
| 日志 | Cloudflare 日志看 GPTBot/PerplexityBot/ClaudeBot 命中与 404 比例 | 404 < 5% |
| 转化 | GA4 事件：playground_start、generation_success、pricing_view→checkout | 基线化 |

---

## 九、30 / 60 / 90 天路线图

| 阶段 | 动作 | 产出 | 预期效果 |
| --- | --- | --- | --- |
| 第 1 周 | P0-1 软 404（中间件白名单 + 分页 notFound + 404 标题）<br>P0-2 静态化（`setRequestLocale` + `localeCookie:false`） | 2 个 PR | 抓取质量、TTFB、索引稳定性 |
| 第 2 周 | 缓存规则 + bundle/视频瘦身（hero 移动端降级）<br>meta 修正清单（og:type、twitter:site、标题/描述） | 上线 + 复测 | CWV 与 CTR |
| 第 3–4 周 | VideoObject（首页 6 个 + 示例页）<br>Organization sameAs + logo 位图<br>作者体系（Person + `/authors`） | 结构化数据全覆盖 | 视频富结果、实体识别 |
| 第 5–6 周 | `/examples/*` 33 页（先上 10 页）<br>`/methodology`、`/editorial-policy`<br>对比页互链与 hub | 内容资产 | 长尾 + 转化 |
| 第 7–8 周 | 3–5 篇缺口文章（review、download、vs hailuo、2K、commercial use）<br>月度刷新机制 | 内容 | 覆盖决策类查询 |
| 第 9–12 周 | 中文版 8–10 篇 + hreflang + sitemap alternates<br>YouTube Shorts 分发 + 目录收录 | 新市场 + 外链 | 增量流量 |

---

## 附录 A：可直接落地的补丁（按文件）

**A1 `src/lib/metadata.ts`**（og:type / twitter:site / article 时间 / hreflang 预留）

```ts
export function constructMetadata({
  title, description, canonicalUrl, image, noIndex = false, type = 'website', publishedTime, modifiedTime,
}: { /* … */ type?: 'website' | 'article'; publishedTime?: string; modifiedTime?: string; } = {}): Metadata {
  return {
    // …
    openGraph: {
      type,
      locale: 'en_US',
      url: canonicalUrl,
      title, description,
      siteName: defaultMessages.Metadata.name,
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630 }],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: ['MiniMax H3 Editorial'],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: [ogImageUrl.toString()],
      // site: '@handle',  ← 不要填 URL
    },
    // …
  };
}
```

**A2 `src/app/[locale]/layout.tsx`**：`generateStaticParams` + `setRequestLocale(locale)`（见 P0-2）。

**A3 `src/app/[locale]/(marketing)/blog/[...slug]/page.tsx`**：把 `constructMetadata` 调用改成 `type: 'article'`，并传 `publishedTime: date`、`modifiedTime: updated ?? date`。

**A4 文章 author**：`source.config.ts` 的 blog schema 加 `author: z.string().optional()`；文章 schema 的 `author` 从 `{ '@id': organization }` 换成 Person（见 P1-3）。

**A5 `src/app/sitemap.ts`**：多语言时给每条加 `alternates: { languages: { en, 'zh-CN' } }`。

---

## 附录 B：仓库卫生提示（与 SEO 无关但影响本机）

- `.next` 2.6 GB、`.next-stale-20260805` 1.39 GB、`node_modules` 1.39 GB，均在 G 盘。`tsconfig.tsbuildinfo` 4.3 MB。
- `.next-stale-20260805` 是一次旧构建的整目录残留，可按工作区规则先核对再用 `D:\CodexWork\scratch` 之外的方式清理（不要动 `.git`、`.env.local`、`content`、`public`）。
- 若继续在 G 盘跑 `opennextjs-cloudflare build`，建议把构建产物输出到 `D:\CodexWork\scratch\minimax-h3-<task>` 或使用 `D:\CodexWork\links` 联接入口。

---

## 十、优先级总表（如果只看一页）

| 优先级 | 事项 | 影响 | 工作量 |
| --- | --- | --- | --- |
| P0 | 软 404（任意路径 / 未知分类 / 越界分页） | 抓取质量、索引洁净度 | 0.5–1 天 |
| P0 | 全站静态化 + HTML 可缓存 + 去 locale cookie | TTFB、Worker 成本、CWV | 1–2 天 |
| P1 | VideoObject + `/examples` 页 | 视频富结果、长尾 | 3–5 天 |
| P1 | 作者体系 + 方法论页 + Organization sameAs | E-E-A-T、品牌实体 | 2–3 天 |
| P1 | meta 修正（og:type、twitter:site、标题/描述、docs 标题） | CTR、分享卡片 | 0.5 天 |
| P1 | 移动端 hero 视频降级 + 图片 WebP | LCP、流量成本 | 1–2 天 |
| P2 | 3–5 篇缺口文章 + 对比 hub + 内链 | 覆盖与排名 | 1–2 周 |
| P2 | 中文版（先内容后开语言）+ hreflang | 新市场 | 3–4 周 |
| P2 | YouTube 分发 + 目录收录 + 社区 | 外链与发现 | 持续 |
