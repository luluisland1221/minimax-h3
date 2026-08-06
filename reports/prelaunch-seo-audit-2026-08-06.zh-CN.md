# MiniMax H3 上线前 SEO 完整审计报告

审计日期：2026 年 8 月 6 日  
审计目标：本地上线前版本 `http://localhost:3000`  
正式商业域名：`https://minimaxh3.pro`  
网站类型：独立第三方 AI 视频 SaaS、博客及产品文档站  
核心关键词：`MiniMax H3`

## 一、执行摘要

网站已经具备较好的 MiniMax H3 内容基础。核心页面可以正常渲染，抽查页面均只有一个 H1，均带有自引用 canonical 和 OG 图片。14 篇已发布的 MiniMax H3 博客文章及 7 篇计划保留的产品文档均超过 1,000 个英文单词，初步形成了有价值的主题内容体系。

但网站目前还不适合开放生产环境索引。生产环境 TypeScript 检查失败；sitemap 暴露了未发布的 Fumadocs 博客示例及 31 个模板文档 URL；`/docs` 本身仍是 Fumadocs Quick Start 页面；`/about` 仍将产品描述为 MkSaaS。抽查的 30 个页面均未检测到 JSON-LD 结构化数据。Blog 和 Docs 的 Title 还普遍过长，因为每个页面标题后面都拼接了完整的网站标题。

### 上线前准备度：52/100

这是代码和内容层面的上线准备度评分，不是 Google 排名分数，也不是基于真实用户数据的 Core Web Vitals 分数。

| 类别 | 得分 | 权重 | 概况 |
|---|---:|---:|---|
| 技术 SEO | 42 | 22% | robots 和 canonical 正常，但生产构建失败，sitemap 污染严重 |
| 内容质量 | 68 | 23% | H3 文章内容充足，但模板内容严重削弱信任和主题聚焦 |
| 页面 SEO | 66 | 20% | H1、canonical、OG 覆盖良好，Title 和部分 Description 需要修改 |
| Schema 结构化数据 | 15 | 10% | 所有抽查页面均未检测到 JSON-LD |
| 上线前性能 | 55 | 10% | 媒体加载思路合理，但首页包含约 115 MB 视频资源 |
| AI 搜索准备度 | 48 | 10% | 主题内容较强，但缺少 `llms.txt`、实体 Schema 和清晰答案结构 |
| 图片与视频 SEO | 52 | 5% | OG 覆盖存在，但 OG 尺寸、体积和视频元数据需要优化 |

## 二、五个阻止上线的问题

### 1. 生产环境类型检查失败

- 严重程度：严重（Critical）
- 证据：运行 `npx tsc --noEmit` 时，多个动画及模板组件报错。错误包括 Framer Motion 的 `ease`、`type` 被错误推断，缺少 `AnimationProps` 导出，以及 `src/hooks/use-auth.ts` 中使用了 `provider` 而不是 `providerId`。
- 影响：`next build` 无法可靠完成。不管 SEO 内容多完善，生产构建失败都会直接阻止部署。
- 修复方法：修复或从 TypeScript 构建中移除不再使用的模板动画组件；为 Motion transition 添加正确类型；在适用位置将账户属性更新为 `providerId`。
- 验证标准：`npx tsc --noEmit` 和 `npm run build` 都必须以退出码 0 完成。

### 2. Sitemap 包含模板内容和未发布内容

- 严重程度：严重（Critical）
- 证据：`/sitemap.xml` 包含 82 条记录，但只有 72 个唯一 URL。5 个自定义分类 URL 各出现两次。Sitemap 还包含 8 个未发布模板 Blog URL 和 31 个 Fumadocs 模板 Docs URL。
- 影响：Google 可能发现并索引与 MiniMax H3 无关的 Fumadocs/MkSaaS 内容。这会稀释网站的 MiniMax H3 主题、浪费抓取资源，并造成质量和信任问题。
- 根本原因：
  - Sitemap 最后的单篇 Blog 生成逻辑没有过滤 `post.data.published`。
  - 分类 URL 在普通分类区块生成一次，在分类分页区块又生成一次。
  - `source.generateParams()` 收录了全部 Docs 文件，而不是只收录计划保留的 MiniMax H3 文档。
- 修复方法：过滤未发布 Blog；每个分类只输出一次；只允许计划保留的 MiniMax H3 Docs 进入 sitemap。

### 3. `/docs` 仍是 Fumadocs 模板页面

- 严重程度：严重（Critical）
- 证据：`/docs` 的 Title 是 `Quick Start | Minimax H3 - Multimodal AI Video Generation`，Description 只有 29 个字符。`content/docs/index.mdx` 仍在介绍 Fumadocs 安装、Node.js、Fumadocs CLI 和 Fumadocs 组件。
- 影响：主导航中的重要入口与网站产品完全不符，并且可能参与无关关键词排名。该页面还会把爬虫引向大量不需要的模板文档。
- 修复方法：将 `content/docs/index.mdx` 替换成 MiniMax H3 文档首页，只链接 Getting Started、Text to Video、First/Last Frame、Multimodal Reference、Prompting、Credits and Pricing、Video History。

### 4. `/about` 仍将网站描述为 MkSaaS

- 严重程度：严重（Critical）
- 证据：`messages/en.json` 的 `AboutPage` 中仍包含 `MkSaaS`、`AI SaaS Boilerplate` 和 MkSaaS 模板介绍。页面还使用 `/logo.png`，而不是 MiniMax H3 Logo。
- 影响：这是明显的品牌实体与信任问题。它和“独立第三方、与 MiniMax 无关联”的定位冲突，也会降低用户转化和 E-E-A-T 信号。
- 修复方法：准确介绍这个独立 MiniMax H3 在线服务；声明网站与 MiniMax 无关联；使用 H3 Logo；说明服务内容、支持渠道、计费方式及数据处理责任。

### 5. 全站没有结构化数据

- 严重程度：高（High）
- 证据：30 个抽查页面均未发现 `application/ld+json`。
- 影响：搜索引擎难以准确理解网站实体、产品、面包屑、文章和视频关系。
- 修复方法：
  - 首页：添加 `WebSite`、`Organization`、`WebPage`、`SoftwareApplication`。
  - Pricing：在信息真实准确的情况下添加 `SoftwareApplication` 和 `Offer` 或 `OfferCatalog`。
  - Blog：添加 `BlogPosting` 或 `TechArticle`、`datePublished`、`dateModified`、发布组织和面包屑。根据当前内容政策，不强制显示个人作者。
  - Docs：添加 `TechArticle` 或 `WebPage` 以及 `BreadcrumbList`。
  - 精选示例视频：只有在缩略图、时长、上传日期、描述和视频 URL 均已知时才添加 `VideoObject`。

## 三、技术 SEO 审计

### 3.1 可抓取性与 robots.txt

状态：基本通过，但仍需调整。

- `/robots.txt` 返回 200。
- 允许抓取公开网站。
- 已屏蔽 `/api/*`、`/_next/*`、`/settings/*`、`/dashboard/*`。
- 已引用 `/sitemap.xml`。
- 没有明确屏蔽主要 AI 搜索爬虫。

建议：

1. 继续屏蔽受保护页面和 API 路由。
2. 部署后确认 sitemap 地址为 `https://minimaxh3.pro/sitemap.xml`。
3. 如果未来出现其他可被发现的登录后页面，应考虑加入 robots 屏蔽。
4. 不要屏蔽页面渲染所需的 CSS、JavaScript、视频 Poster 或公开媒体文件。

### 3.2 Sitemap 质量

状态：不通过。

| 指标 | 结果 |
|---|---:|
| 总记录数 | 82 |
| 唯一 URL | 72 |
| 重复 URL 组数 | 5 |
| 重复记录数 | 10 |
| 未发布模板 Blog URL | 8 |
| 模板 Docs URL | 31 |

Sitemap 还会在每次构建时把所有页面的 `lastModified` 设置成当前时间。这会让所有页面看起来每次部署都刚刚修改，即使实际内容没有变化。Blog 应尽可能使用 Frontmatter 日期，其他页面则使用真实文件或内容修改日期。

### 3.3 Canonical 标签

状态：本地通过，正式环境需要复查。

- 30 个抽查页面都有 canonical。
- Canonical 与对应的本地路由一致。
- `/docs` 的 canonical 指向 `/docs/`，与导航使用的 `/docs` 存在尾斜杠差异。
- 项目存在 `NEXT_PUBLIC_BASE_URL`，但审计没有读取或输出它的值。

上线前必须在生产环境设置：

```text
NEXT_PUBLIC_BASE_URL=https://minimaxh3.pro
```

并确认 canonical、OG URL、Twitter URL、robots 和 sitemap 中不再出现 localhost。

### 3.4 状态码及爬虫访问

- 30 个计划保留的抽查页面全部返回 HTTP 200。
- 设置为未发布的模板 Blog 仍然可以直接访问，并且仍在 sitemap 中。
- 模板 Docs 页面同样可以直接访问。

未发布内容应该返回 404、从路由生成中排除，或者添加 `noindex`。对于从未被索引且没有对应替代页面的模板内容，返回 404 即可，不需要重定向。

### 3.5 HTTPS 和安全响应头

本地环境不计分。开发服务器的响应头不能代表 Cloudflare 正式环境。

部署后需要验证：

- HTTP 是否通过 301/308 跳转到 HTTPS。
- 是否只有一个首选域名，例如只使用 `minimaxh3.pro`，避免 `www` 形成竞争版本。
- 是否启用 HSTS、`X-Content-Type-Options`、Referrer-Policy、点击劫持保护和合理的 CSP。
- 视频、图片、脚本、API 是否不存在混合内容。

## 四、页面 SEO 审计

### 4.1 当前做得好的部分

- 30 个抽查页面都只有一个 H1。
- 首页 H1 是 `MiniMax H3 AI Video Generator`。
- 首页 Title 长度为 52，Meta Description 长度为 151。
- 所有抽查页面均带有 canonical 和 OG 图片。
- 已发布 Blog 的英文单词数介于 1,074–1,706。
- 计划保留的 Docs 英文单词数介于 1,025–1,193。
- 已发布内容的 URL 都清晰、可读并包含相应关键词。

### 4.2 Title 普遍过长

状态：高优先级。

14 篇 H3 Blog 的最终 Title 长度均在 108–121 个字符之间，因为文章标题后面又拼接了：

```text
| Minimax H3 - Multimodal AI Video Generation
```

计划保留的 Docs Title 也因此达到 66–83 个字符。

示例：

- `/blog/minimax-h3-real-world-test`：121 个字符。
- `/blog/minimax-h3-reference-to-video-guide`：120 个字符。
- `/blog/minimax-h3-character-consistency`：118 个字符。
- `/docs/first-last-frame`：83 个字符。

修复方法：使用更短的页面后缀，例如 `| MiniMax H3`；或者配置 Metadata Title Template，避免拼接完整首页标题。建议最终 Title 大致控制在 50–65 个字符，同时保留核心关键词和搜索意图。

### 4.3 Meta Description 检查结果

| 页面组 | 结果 |
|---|---|
| 首页 | 151 个字符，表现良好 |
| Pricing | 39 个字符，过短且过于通用 |
| Blog 首页 | 37 个字符，过短且过于通用 |
| About | 114 个字符，但内容错误，仍是模板文案 |
| Contact | 57 个字符，过短 |
| Privacy、Terms、Cookie | 58–59 个字符，工具页可以接受，但可写得更清楚 |
| H3 Blog | 大多为 132–157 个字符，整体良好 |
| LoRA 文章 | 161 个字符，略长 |
| 计划保留的 Docs | 大多为 124–151 个字符，整体良好 |
| Docs 首页 | 29 个字符且介绍 Fumadocs，必须替换 |

建议的 Pricing Description：

> Compare MiniMax H3 plans, monthly credits, 768P and 2K generation costs, and one-time credit packages for your AI video workflow.

建议的 Blog Description：

> Explore MiniMax H3 guides, prompts, local deployment, VRAM, ComfyUI, model comparisons, native audio, pricing, and production tests.

### 4.4 品牌大小写一致性

网站目前交替使用 `MiniMax H3` 和 `Minimax H3`。建议在可见标题、网站名称、Metadata、导航、OG 标签及 Schema 中统一使用官方形式 `MiniMax H3`。

### 4.5 内链结构

已发布 Blog 每篇包含 1–13 个内部链接。Prompt Guide 只有一个内部链接，但它本应是工作流内容集群中的核心支柱页。VRAM 和 Seedance 对比文章的内链数量也偏少。

建议的内容集群链接：

- Prompt Guide 应链接 Text to Video、First/Last Frame、Multimodal Reference、Reference-to-Video、Character Consistency 和 Playground。
- ComfyUI 应链接 VRAM、GGUF、LoRA、Hugging Face、Open Source 和在线 Playground。
- What Is MiniMax H3 应链接所有主要功能指南及 Pricing。
- Cost 应链接 Pricing、Credits and Pricing Docs 以及 Playground 的价格估算。
- Seedance Comparison 和 Real-World Test 应互相链接。

锚文本应自然、具有描述性，避免反复使用 `click here`，也不要在所有位置强行使用完全相同的精确关键词。

## 五、内容质量和主题权威性

### 5.1 优点

- 14 篇计划保留的 Blog 全部超过 1,000 个英文单词。
- Blog 覆盖模型基础、Prompt、参考工作流、原生音频、角色一致性、成本、实测、模型比较、ComfyUI、VRAM、GGUF、LoRA、Hugging Face 和开放权重等内容。
- 7 篇计划保留的 Docs 也都超过 1,000 个英文单词。
- 文章中包含表格、限制说明、安全提醒、实际工作流和来源链接。
- 内容围绕 MiniMax H3 搜索集群展开，没有继续扩散到无关的通用 AI 话题。

### 5.2 问题

1. 模板污染严重：About 中的 MkSaaS 文案、Fumadocs Docs 首页、31 个模板 Docs URL，以及 8 个未发布但仍可索引的模板 Blog URL。
2. 多个产品界面翻译仍是通用模板文案，包括 Blog、Pricing、Contact、Newsletter 和 Docs 的标题或描述。
3. About 没有充分说明网站是独立第三方服务。
4. 缺少一个清晰的测试方法中心，用于把 Real-World Test 文章和真实、可复现的视频输出关联起来。
5. 所有 Blog 使用同一个发布日期。这本身不一定错误，但分批发布并记录真实 `dateModified` 会更自然，也更利于后续维护。

审计尊重“不显示个人作者”的编辑决策。可以通过准确的 About、清晰的来源引用、测试方法、发布日期、更新记录、客服信息、法律页面和 Organization 发布实体来增强信任，而不必增加个人作者模块。

## 六、Schema 结构化数据审计

状态：不通过。

在抽查页面的服务端 HTML 中没有检测到 JSON-LD。在代码层面搜索 `application/ld+json` 和 Schema.org 输出，也没有发现网站级结构化数据实现。

建议实施顺序：

1. 首页实体图谱：`Organization`、`WebSite`、`WebPage`、`SoftwareApplication`。
2. Blog、分类、文章和 Docs 页面添加全局 `BreadcrumbList`。
3. Blog 添加发布组织和日期数据，但不增加不需要的可见作者模块。
4. Pricing 的 Offer 必须与实际支付价格和积分数量完全一致后才能上线。
5. 为少量重点授权视频添加 `VideoObject`。

不要单纯为了 Google 富结果而添加 FAQ Schema。商业网站 FAQ 富结果的展示资格受到限制，但页面上保留真实可见的 FAQ 仍然有利于用户和 AI 理解。

## 七、AI 搜索与 GEO 准备度

### 7.1 当前优势

- 首页和文章直接定义了 MiniMax H3。
- 内容包含表格、简短答案、比较、限制和本站价格解释。
- Robots 没有屏蔽主要 AI 搜索爬虫。

### 7.2 缺口

- 缺少 `/llms.txt`。
- 缺少 Organization、WebSite、SoftwareApplication 实体图谱。
- 缺少结构化面包屑。
- 错误的 MkSaaS About 页面造成实体歧义。
- Fumadocs 内容集群和 MiniMax H3 主题发生竞争。
- 许多 H2 是描述性标题，而不是直接问题。可以选择性增加问句标题，提高答案提取能力。

建议 `llms.txt` 链接首页、Pricing、About、核心 Docs、重点 Blog 支柱页、法律页面，以及独立第三方和非关联声明。不要收录模板页面、受保护页面或每一个次要 URL。

## 八、图片、OG 和视频审计

### 8.1 OG 图片

- 30 个抽查页面都有 `og:image`。
- 默认 OG 图片为 `hero-cinematic.png`。
- 当前尺寸为 1823 × 863，文件大小 2.16 MB。
- 图片比例比常用的 1200 × 630 社交预览比例更宽。

建议制作一张专用的 1200 × 630 压缩 WebP/JPEG/PNG OG 图片，保留安全文字边距和 MiniMax H3 品牌元素。Blog 不需要显示文章配图；社交分享使用的统一或分类 OG 图片与文章正文配图是两回事。

### 8.2 首页视频体积

| 指标 | 结果 |
|---|---:|
| 视频文件数量 | 33 |
| 视频总大小 | 115.35 MB |
| 超过 5 MB 的文件 | 7 |
| 超过 10 MB 的文件 | 3 |
| 最大文件 | 18.1 MB |
| Hero 视频 | 4.06 MB |

图库使用了 `preload="metadata"`，并且只在鼠标悬停后播放，这个方向是正确的。但 33 个 Metadata 请求和大体积文件仍会产生带宽和连接开销。Hero 使用 `preload="auto"`、自动播放和循环。

建议：

1. 保留悬停播放和移出暂停。
2. 为 Hero 和图库视频增加 Poster，提高首屏稳定性和加载失败时的展示质量。
3. 测试首屏以下图库使用 `preload="none"` 是否更合适。
4. 重新编码 3 个超过 10 MB 的文件及其他高体积视频。
5. 通过 Cloudflare 为带版本的静态视频设置长期不可变缓存。
6. 测量 Hero 视频是否成为 LCP 元素；如果是，先显示轻量 Poster。
7. 不要预加载全部图库资源。

## 九、信任、法律和转化检查

- Privacy、Terms、Cookie 均返回 200，并带有 canonical。
- 法律页面已经包含之前要求的独立第三方/非关联声明。
- About 必须在上线前重写。
- `websiteConfig.mail.supportEmail` 当前值为 `Minimax H3 <support@minimaxh3.pro>`，但该值又被直接拼接到 `mailto:` 链接中，最终会形成类似 `mailto:Minimax H3 <support@minimaxh3.pro>` 的不规范 URL。
- 如果邮件服务支持，`fromEmail` 可以继续使用“显示名称 + 邮箱”格式；但用于链接和收件人的 `supportEmail` 应保存为纯邮箱 `support@minimaxh3.pro`。
- 网站邮件 Provider 配置仍写着 `resend`，但项目实际使用 Plunk 密钥和后台邮件操作。上线前应验证 Newsletter 和 Contact 流程。

## 十、URL 和页面级结论

### 10.1 表现较好的页面

- `/`：H1 正确，Title 52 个字符，Description 151 个字符，canonical 和 OG 正常。
- 14 篇 H3 Blog：一个 H1、内容充足、Description 良好、URL 关键词明确。
- 7 篇计划保留的 H3 Docs：一个 H1、内容超过 1,000 词、Description 较好，搜索意图清晰。

### 10.2 需要立即修改的页面

| URL | 问题 |
|---|---|
| `/docs` | Fumadocs Quick Start 模板内容 |
| `/about` | MkSaaS 品牌、介绍和 Logo |
| `/blog` | 只有 37 个字符的通用 Description |
| `/pricing` | 只有 39 个字符的通用 Description |
| `/contact` | Description 过于通用，客服邮箱格式存在风险 |
| 模板 Blog URL | 已设置为未发布，但仍可访问并进入 sitemap |
| 模板 Docs URL | 仍可访问并进入 sitemap |

## 十一、按优先级排列的行动计划

### P0——任何生产部署之前

1. 让 `npx tsc --noEmit` 和 `npm run build` 通过。
2. 用 MiniMax H3 文档首页替换 `/docs` 的 Fumadocs 内容。
3. 重写 `/about` 并移除所有可见的 MkSaaS 身份。
4. 从 sitemap 和路由生成中移除模板 Blog/Docs URL。
5. 去除 5 个重复的分类 sitemap URL。
6. 确保生产环境 `NEXT_PUBLIC_BASE_URL` 为 `https://minimaxh3.pro`。

### P1——提交 Sitemap 之前

1. 缩短 Blog 和 Docs Title 模板。
2. 添加首页实体、面包屑、Blog、Docs 和 Pricing 结构化数据。
3. 重写 Pricing、Blog、Contact 和 Docs 首页 Meta Description。
4. 统一 `MiniMax` 大小写。
5. 将 `supportEmail` 改成纯邮箱地址。
6. 删除或重写生产环境仍可能触达的模板翻译文案。
7. 创建 `/llms.txt`。

### P2——第一轮 SEO 优化

1. 加强 Prompt、ComfyUI/本地部署、Cost 和 Comparison 内容集群的内链。
2. 创建正确尺寸的 OG 图片。
3. 为视频添加 Poster，并测试图库使用 `preload="none"`。
4. 压缩或替换最大的视频文件。
5. 在 sitemap 和结构化数据中使用真实的内容修改日期。

### P3——部署之后

1. 抓取 `https://minimaxh3.pro`，对比 sitemap URL 和可索引 canonical。
2. 分别运行移动端和桌面端 Lighthouse/PageSpeed。
3. 验证 LCP、INP、CLS、TTFB、缓存响应头、Brotli 和视频缓存。
4. 使用 Google Rich Results Test 验证 Schema。
5. 向 Google Search Console 和 Bing Webmaster Tools 提交 sitemap。
6. 监控索引覆盖、Google 选择的 canonical、抓取错误和 Core Web Vitals。
7. 验证 Stripe、Google 登录、Plunk Contact/Newsletter、MiniMax 视频生成、R2 存储和用户视频历史等转化关键流程。

## 十二、上线验证清单

- [ ] `npx tsc --noEmit` 通过。
- [ ] `npm run build` 通过。
- [ ] Sitemap 只包含计划索引的 URL，且没有重复项。
- [ ] `/docs` 只包含 MiniMax H3 文档内容。
- [ ] `/about` 准确描述独立第三方服务。
- [ ] 所有生产 canonical 均使用 `https://minimaxh3.pro`。
- [ ] Blog 和 Docs Title 符合预期的搜索结果长度。
- [ ] Schema 在渲染页面测试中验证通过。
- [ ] 所有公开页面均不再包含 MkSaaS/Fumadocs 模板内容。
- [ ] OG 图片在 1200 × 630 预览中显示正确。
- [ ] Newsletter 和 Contact 已通过 Plunk 成功测试。
- [ ] 部署后已测量移动端和桌面端 CWV。

## 十三、审计限制

- 这是一份上线前本地审计，无法确认 Google 索引情况、Search Console 覆盖、外链、CrUX 真实用户数据、Cloudflare 正式响应头、HTTPS 重定向或真实用户性能。
- 本地开发环境的响应时间包含 Next.js 首次路由编译，因此没有被当成生产性能证据。
- 审计没有读取任何私密环境变量的值、分析账户、Search Console 数据或客户数据。
- Schema 同时从服务端渲染 HTML 和源码模式进行了检查。实施后仍需通过真实浏览器或 Rich Results Test 再次验证。
