# 游戏 UI/UX 设计师作品集（Next.js + TypeScript）

一个移动优先、简洁且有趣味交互的作品集网站，面向游戏 UI/UX 设计展示。包含首页、自我介绍；参与项目（2 个游戏，含项目详情与“作品详情”页）；已做项目（站点集合+弹层内嵌预览）；媒体画廊（图片/GIF/视频）、本地上传与预览、主题切换、SEO/OG、sitemap 等。

## 技术栈
- Next.js 14（App Router） + TypeScript
- Tailwind CSS +（shadcn 风格的 UI 组件：Button/Card/Badge/Input/Dialog 等）
- framer-motion（微交互）
- lucide-react 图标
- react-markdown + remark-gfm（Markdown 渲染）
- next-themes（深浅色）
- @vercel/og（简单 OG 图接口）

## 开始使用

1. 安装依赖
```bash
pnpm i   # 或 npm i / yarn
```

2. 本地开发
```bash
pnpm dev
```
打开 http://localhost:3000 查看。

3. 构建与启动
```bash
pnpm build
pnpm start
```

## 信息架构 & 路由
- `/` 首页（自我介绍、技能、模块入口）
- `/projects` 参与项目列表（筛选 + 搜索）
- `/projects/[slug]` 项目详情（概述 + “设计点/工作内容”卡片导航）
- `/projects/[slug]/[caseId]` 作品详情（媒体画廊 + Markdown 正文 + 本地上传预览）
- `/sites` 已做项目（网站集合卡片 + 弹层内嵌预览，若被拦截提供外链）
- `/api/og` 生成 OG 图（支持 `?title=`）
- `/sitemap.xml`、`/robots.txt`

## 数据与内容
- 类型与示例数据：`data/projects.ts`、`data/sites.ts`
- 可替换图片/视频地址，或将资源放到 `public/` 并在数据中引用。
- Markdown/MDX：本实现使用 Markdown（`react-markdown`），数据字段为 `articleMDX`，可直接写 Markdown。

## 设计实现要点
- 视觉：默认暗色、圆角 2xl、柔和阴影、充足留白；单一强调色（电紫）
- 动效：首屏渐入、卡片悬停抬升、轻微视差（framer-motion）
- 媒体：图片/GIF/视频画廊，点击弹出 Lightbox，左右切换；懒加载
- 上传：作品详情页底部“编辑模式”开启后可本地选择图片/GIF/视频，转为 DataURL 存至 `localStorage` 进行预览（不做服务端持久化）
- 可访问性：语义化结构、焦点样式、可键盘操作的弹层/对话框
- SEO/OG：基础 `<Metadata>`、`/api/og`、sitemap/robots
- 分析埋点：`lib/analytics.ts` 提供 `useTrackEvent`（默认 console + dataLayer），可接入真实分析工具

## 注意事项
- 远程图片来源为 Unsplash / Imgur / placehold.co，已在 `next.config.mjs` 放行。如果替换为其他域名，请同步调整配置。
- 内嵌站点可能因目标站 `X-Frame-Options` 限制而无法加载，此时弹层会展示友好提示与“新窗口打开”按钮。
- 本地上传使用 `localStorage` 仅作临时预览，若需要持久化/大文件管理，建议改用 IndexedDB 或服务端存储。

## 目录结构
```
app/
  api/og/route.tsx      # OG 图片 API
  projects/
    [slug]/
      [caseId]/page.tsx # 作品详情
      page.tsx          # 项目详情
    page.tsx            # 参与项目列表
  sites/page.tsx        # 已做项目
  layout.tsx, page.tsx  # 全局布局与首页
components/
  ui/                   # shadcn 风格 UI 组件
  hero.tsx, navbar.tsx, gallery.tsx, upload-panel.tsx, site-modal.tsx
data/
  projects.ts, sites.ts # 类型与示例数据
lib/
  utils.ts, analytics.ts
```

## 自定义与扩展
- 主题/品牌：在 `app/globals.css` 中调整 CSS 变量与圆角/阴影。
- 组件：在 `components/ui/` 扩展更多（如 Tabs/Tooltip/Sheet）。
- 内容源：可将 `data/` 换成 CMS（Contentlayer、Notion、Headless CMS）。

---
如需我帮你接入真实分析、部署到 Vercel、或对样式与动效做进一步打磨，请告诉我你的偏好。
