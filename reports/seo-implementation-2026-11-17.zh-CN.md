# MiniMax H3 SEO 实施记录

- 日期：2026-11-17
- 依据：`reports/seo-optimization-roadmap-2026-11-17.zh-CN.md`
- 本轮不做（按要求）：中文版、社交矩阵/sameAs、YouTube、AI 工具目录

## 一、技术修复

### 1. 软 404 归零

`src/middleware.ts` 改为"路径白名单 + 内容白名单"：

- 精确路径：`/`、`/pricing`、`/about`、`/contact`、`/privacy`、`/terms`、`/cookie`、`/methodology`、`/editorial-policy`、`/blog`、`/docs`、`/examples`、`/authors`
- 前缀路径：`/blog/`、`/docs/`、`/examples/`、`/authors/`、`/auth/`、`/dashboard/`、`/settings/`、`/admin/`、`/api/`、`/og`
- 未知文章、未知文档、未知分类、已下线 `/ai/video`、其余一切路径 → 直接返回 **404**（带 `<title>` 和三个站内链接），不再落入 Next 的流式 200。
- 404 页面（`app/[locale]/not-found.tsx`）补 `<title>` 与博客/价格入口。

`dynamicParams = false` 加在：博客分页、分类分页、分类页、示例详情页、作者详情页。越界分页（如 `/blog/page/99`）从"200 空列表"变成真 404。

### 2. 全站静态化（根因修复）

- `src/app/[locale]/layout.tsx`：新增 `generateStaticParams` + `setRequestLocale(locale)`（此前全仓 0 处调用，导致所有页面动态渲染）。
- `src/i18n/routing.ts`：`localeCookie: false`，响应不再附带 `Set-Cookie: NEXT_LOCALE`，HTML 可被 CDN 缓存。
- `(protected)/layout.tsx`、`auth/layout.tsx` 及 4 个读取会话的后台页：`export const dynamic = 'force-dynamic'`，避免把需要登录的页面预渲染。

构建结果：89 个静态 HTML（此前 0 个营销页 HTML），TTFB 从"每次 Worker 渲染"变为静态命中。

### 3. 首页性能

- 首屏背景视频在移动端改为静态海报（`hidden md:block` + `<img fetchPriority="high">`），避免 4 MB 自动播放视频吃掉移动端 LCP。
- 海报图补 `width/height`（960×540）。

## 二、结构化数据与 E-E-A-T

- **VideoObject**：新增 `videoObjectSchema()`；`/examples/<slug>` 共 19 个页面输出 VideoObject + WebPage + BreadcrumbList。
- **作者体系**：新增 `EDITORIAL_AUTHOR`、`/authors`、`/authors/minimax-h3`（ProfilePage + Person），文章 schema 的作者由 Organization 改为 Person，页面增加署名链接。
- **WebApplication**：补 `featureList`。
- **信任页**：新增 `/methodology`（测试方法）与 `/editorial-policy`（编辑政策、独立性、AI 使用、纠错）。

## 三、页面与内容

- 新增 **19 个 `/examples/<slug>` 页面 + `/examples` 枢纽**：每条视频带原始提示词、模式、分辨率、画幅与"该看什么"，并提供相关示例与文档内链。
- 新增 3 篇文章：`/blog/minimax-h3-video-to-video`、`/blog/minimax-h3-github`、`/blog/minimax-h3-review`（补 `PUBLIC_BLOG_SLUGS`）。
- 首页新增"按需求进入"6 个入口内链（what-is 之外的 api / pricing / comfyui / vram / vs-veo-3 / examples）。
- 导航与页脚新增 Examples、How we test、Editorial policy 入口。
- 7 个超长标题、2 个越界描述改为 50–58 / 145–158 区间。

## 四、Metadata

- `og:type=article` + `article:published_time` / `article:modified_time` / `article:author` / `article:section`。
- 移除非法的 `twitter:site` URL；补 `og:image:width/height`。
- 补 hreflang（`en` + `x-default`），为后续多语言留好出口。
- 文档标题不再重复品牌（`MiniMax H3 Documentation | MiniMax H3` → `MiniMax H3 Documentation`）。
- `robots.txt` 增加 `/auth/*`、`/admin/*`。
- `llms.txt` 重写并补全新页面。

## 五、验证

- `tsc --noEmit`：0 error。
- `next build`：成功，119 个页面生成，其中 89 个静态 HTML。
- sitemap：**87 条 URL**（原 57 条），新增 19 个示例页、作者页、方法/政策页、3 篇新文章。
- 构建产物抽查：首页含 hreflang、6 个新内链、移动端海报；文章页 `og:type=article`、`article:author` 指向作者页、署名可见；示例页含 VideoObject。

## 六、已知限制 / 后续

1. `/pricing` 仍是请求时渲染：价格页的客户端组件在预渲染阶段会调用会话接口（构建日志中的 `/get-session` 报错即来自此），因此没有生成静态 HTML。上线后可用 Cloudflare Cache Rule 覆盖，或在 CI 补 `BETTER_AUTH_URL` 后再验证。
2. 以下 6 个候选术语页未做，需先确认需求与页面归属后再写：`refmod`、`latent upscaler`、`singularity`、`character swap`、`fal minimax h3`、`ref2va`。
3. 部署后仍需：GSC 提交与软 404 复查、Rich Results 测试、Cloudflare HTML 缓存规则、IndexNow 自动提交确认。
