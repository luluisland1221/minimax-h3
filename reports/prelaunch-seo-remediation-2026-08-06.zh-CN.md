# MiniMax H3 上线前 SEO 整改记录

整改日期：2026 年 8 月 6 日  
整改范围：原审计报告中的 P0、P1、P2  

## P0：上线阻塞项

- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过，43 个静态页面完成生成。
- `/docs` 已替换为 MiniMax H3 文档入口，只展示 7 个计划保留的工作流文档。
- `/about` 已重写为独立第三方服务介绍，并加入 “Independent / Not affiliated with MiniMax” 声明。
- 未发布模板 Blog 和 Fumadocs 模板 Docs 已从静态路由、搜索索引和 sitemap 中排除；未知文章/文档路径不再允许动态生成。
- Sitemap 分类 URL 去重，当前本地检查为 37 条、37 条唯一 URL、0 个重复组。
- 已提供 `.env.production.example`，生产环境必须设置 `NEXT_PUBLIC_BASE_URL=https://minimaxh3.pro`。

## P1：提交 Sitemap 前修复项

- Blog 和 Docs 页面标题后缀缩短为 `| MiniMax H3`。
- 首页加入 Organization、WebSite、WebPage、SoftwareApplication Schema。
- Pricing 加入真实套餐及积分包 OfferCatalog；Blog、文章、Docs、About 加入对应实体及 BreadcrumbList。
- Pricing、Blog、Contact、Docs 首页 Meta Description 已重写。
- 可见品牌统一使用 `MiniMax H3` 大小写。
- `supportEmail` 已改为纯邮箱地址 `support@minimaxh3.pro`。
- 已创建 `/llms.txt`，包含产品、价格、文档、重点文章、政策和独立第三方声明。

## P2：首轮性能与内容优化

- Prompt、ComfyUI/本地部署、Cost、Seedance Comparison 与 Real-World Test 内容集群已加强内链。
- 已创建动态 1200 × 630 OG 图片路由 `/og`，Metadata 默认使用该图片。
- 33 个视频均生成真实首帧 Poster；图库视频改为 `preload="none"`，继续保持悬停播放、移出暂停。
- 7 个最大视频已重新编码并进行完整解码校验；全站视频总体积由约 115.35 MB 降至约 77.62 MB。
- Sitemap 和文章 Schema 使用固定、可解释的内容日期，不再在每次构建时把全部 URL 标记为刚刚更新。

## 已完成的本地验证

- TypeScript：通过。
- Next.js 生产构建：通过。
- Git diff whitespace 检查：通过。
- Sitemap：37 条记录、37 条唯一 URL、0 个重复组。
- `/llms.txt`：可访问。
- `/og`：可生成图片响应。
- 首页、Pricing、Blog、BlogPosting、Docs、About：已输出 JSON-LD。

## 必须在部署后完成的验证

HTTPS、Cloudflare 响应头、真实缓存、Stripe、Google 登录、Plunk、MiniMax 生成、R2 转存、Search Console、Rich Results Test、PageSpeed 和 CrUX 都依赖正式域名或真实流量，不能用本地构建替代。详见原完整审计报告的 P3 与上线验证清单。
