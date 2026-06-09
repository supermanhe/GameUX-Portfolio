---
name: GameUX Portfolio - Project Detail System
description: 圣境之塔项目详情页的三模板案例叙事与视觉规范
colors:
  background-deep: "#100d0a"
  foreground-warm: "#f7f4ee"
  surface-card: "#1f1a14"
  primary-gold: "#f7bb3b"
  primary-ink: "#291c0a"
  surface-secondary: "#2f2923"
  surface-muted: "#342e28"
  text-muted: "#c0b6a5"
  accent-orange: "#f2822c"
  problem-red: "#ef4343"
  border-warm: "#463e35"
typography:
  display:
    fontFamily: "Noto Serif SC, Songti SC, SimSun, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(1.35rem, 2.6vw, 1.85rem)"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.85
  pixel-label:
    fontFamily: "Press Start 2P, Courier New, monospace"
    fontSize: "0.68rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.1em"
rounded:
  none: "0"
  sm: "6px"
  md: "11px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "64px"
components:
  case-hero:
    backgroundColor: "{colors.background-deep}"
    textColor: "{colors.foreground-warm}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "clamp(2rem, 5vw, 4.5rem)"
    height: "clamp(29rem, 46vw, 38rem)"
  archetype-chip:
    backgroundColor: "{colors.background-deep}"
    textColor: "{colors.primary-gold}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.8rem"
  evidence-panel:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.foreground-warm}"
    rounded: "{rounded.md}"
    padding: "1.4rem 1.5rem"
  sticky-nav:
    backgroundColor: "{colors.background-deep}"
    textColor: "{colors.foreground-warm}"
    rounded: "{rounded.pill}"
    padding: "0.4rem"
---

# Design System: GameUX Portfolio Project Detail

## Overview

**Creative North Star: "游戏证据剧场"**

圣境之塔详情页不是统一卡片模板的集合，而是一组根据证据类型选择舞台的案例叙事系统。封面负责建立场景和核心论点，正文负责拆解决策，截图、动效与指标负责证明判断。当前规范记录的是 2026-06-09 工作区中的实现状态。

页面视觉以暖黑、金色、像素标签与真实游戏界面为主。它应像一个资深游戏 UX 设计师亲自策展的项目复盘：有游戏气质，有明确节奏，也能经得住读者追问。所有新案例必须先选择叙事模板，再填内容；禁止先堆素材，再寻找排版。

**Key Characteristics:**

- 暖黑全页底色，金色只承担导航、结论、选中态和可信结果。
- 全宽影院式案例封面建立章节感，正文回到 1280px 内容版心。
- 三套主模板共用品牌语言，但依据证据类型使用不同阅读节奏。
- 像素插画用于概括核心矛盾，真实截图和数据用于证明结论。
- 顶部项目内导航持续可见，案例之间依靠全宽封面或发丝线自然分隔。

**The Template-First Rule.** 新案例必须先判断属于侧轨叙事、线性系统叙事还是影院档案，再组织字段与媒体。不得为了视觉统一强套同一模板。

**The One-Claim Rule.** 每个案例只证明一个核心论点，并用 2 至 3 个关键决策支撑。

## Colors

配色来自游戏内火光、金色奖励提示与深色界面环境。页面整体保持暖黑，颜色用于表达语义，不用于填满空间。

### Primary

- **Primary Gold**：导航激活、案例编号、原型标签、核心数字、方案态与重点结论。
- **Primary Ink**：金色实心控件上的文字。

### Secondary

- **Accent Orange**：极少量用于游戏气质和局部暖色过渡，不能与金色争夺主层级。
- **Problem Red**：只用于问题、迭代前、风险和错误标注。

### Neutral

- **Background Deep**：全页底色与影院封面基底。
- **Surface Card / Secondary / Muted**：证据框、步骤区、弱层级背景。
- **Foreground Warm**：标题和高优先级正文。
- **Text Muted**：解释、caption、meta 与次要信息。
- **Border Warm**：所有发丝线、弱边框和结构分隔。

**The Semantic Color Rule.** 金色表示“当前、方案、价值、结果”；红色表示“问题、旧态、风险”。同一模块中不得交换这两个含义。

**The Dark Stage Rule.** 新案例不得引入大面积白色卡片、蓝紫 SaaS 渐变或与项目无关的新强调色。真实游戏截图可以拥有自己的颜色，网页框架保持暖黑和金色。

## Typography

**Display Font:** Noto Serif SC（回退 Songti SC / SimSun / Georgia）

**Body Font:** Noto Sans SC（回退 PingFang SC / Microsoft YaHei / system sans）

**Label/Mono Font:** Press Start 2P（回退 Courier New，仅用于拉丁字符、编号与短标签）

**Character:** 大标题使用厚重宋体建立作品集的策展感，正文使用高可读无衬线解释判断，像素字体将导航、编号和标签与游戏语境连接起来。

### Hierarchy

- **Project / Case Display**（900，`clamp(2rem, 5vw, 3.75rem)`，1.02）：项目名、全宽案例封面标题。
- **Section Headline**（800，`clamp(1.35rem, 2.6vw, 1.85rem)`，1.2）：决策标题、问题标题、系统模块标题。
- **Body**（400，`0.95rem`，1.85）：论点、理由与案例说明；正文行长控制在约 38rem 至 42rem。
- **One-liner**（400，`1.05rem`，1.8）：案例封面的一句话核心论点，最长约 40rem。
- **Pixel Label**（400，`0.68rem`，0.1em tracking）：编号、kicker、步骤标签、导航与状态；禁止承担长段正文。
- **Metric**（900，`clamp(2.4rem, 5vw, 4rem)`，1）：可信结果或最强证据，必须附带口径说明。

**The Pixel Accent Rule.** 像素字体只用于短标签、数字、导航与状态。中文长标题和正文始终使用宋体或无衬线字体。

**The Evidence Copy Rule.** 标题写判断，正文解释为什么，caption 说明证据是什么。三者不得重复同一句话。

## Elevation

系统使用“舞台层级”而不是大量悬浮卡片。封面、暖金对比带、深黑拆解带和证据媒体框通过背景温差、发丝边框与克制阴影区分。阴影只用于让真实媒体从深色背景中被识别，不应用于制造通用卡片墙。

### Shadow Vocabulary

- **Media Lift**（`0 24px 60px hsl(250 20% 2% / 0.3)`）：截图、GIF、对比图与系统画框。
- **Archive Lift**（`0 30px 90px hsl(0 0% 0% / 0.36)`）：全屏规范画板。
- **Featured Card Lift**（`0 24px 70px hsl(0 0% 0% / 0.24)`）：规范与流程沉淀入口卡；hover 可提高至更深阴影。
- **Sticky Nav Blur**（暖黑半透明底 + `blur(18px)`）：仅用于顶部项目内导航和全屏查看器工具栏。

**The Flat-By-Default Rule.** 正文文字区默认无阴影。只有媒体证据、全屏查看器与持续悬浮导航可以使用明显 elevation。

**The One Container Rule.** 同一证据只放在一个容器里。禁止在圆角卡片内继续嵌套带阴影的卡片。

## Components

### Shared Project Detail Shell

- 顶部使用三列 sticky 导航：返回、横向可滚动案例跳转、声音控制。
- 项目头部使用两栏：左侧项目名、标签与 summary，右侧项目 cover。
- 元信息条固定为 Role / Period / Team / Impact。
- `FOUNDATION WORK` 位于关键设计点之前，用于规范与流程证据入口。
- `KEY DESIGN` 之后进入三套主案例模板。
- 桌面内容版心为 1280px；全宽舞台使用 `100vw` 出血，再将正文回插到版心。

### Template 1: Evidence Rail / 证据侧轨叙事

**适用案例：** 转化优化、流程提效、交互改版；能够形成 2 至 3 个明确决策，并有前后对比、定量或可信定性结果。圣境示例：`pay process`、`battlepass`。

**数据选择：** `case.story` 存在，`story.layout` 省略或为 `rail`。

**固定顺序：**

1. 全宽 `Outcome Hero`：编号、原型标签、标题、one-liner、headline metric、像素封面。
2. 全宽 `Before / After Stage`：左侧 tab + 问题重点，右侧前后截图；默认 5000ms 自动切换。
3. 深黑 `Decision Breakdown`：桌面为 28% sticky 框架侧轨 + 72% 正文。
4. 2 至 3 个 `Decision Spotlight`：理由、行动标签、单一主证据，桌面左右交替。
5. `Metric Cards`：每个结果必须包含口径、周期 / 性质、范围与限制。
6. 可选 `Reflection`。

**内容门槛：**

- `framework.steps[].key` 必须与 `decisions[].stepKey` 对应。
- 最后一阶段没有独立决策时，可以映射到结果区。
- `problem.compare` 有前后可比证据时优先；没有可比证据时使用静态问题模块。
- 每个决策只使用一个主媒体，其他素材进入附录或档案。

### Template 2: Linear System / 线性系统叙事

**适用案例：** 信息架构、设计系统、复杂养成系统、多功能整合；核心价值来自关系、规则、覆盖范围和一致性，而不是单一转化数字。圣境示例：`sealcard`。

**数据选择：** `case.story.layout = 'linear'`。

**固定顺序：**

1. 全宽 `System Hero`：去掉大数字，使用 `heroKicker` 与功能标签说明系统变化。
2. `Deep Entry Evidence`：先证明旧入口为什么难找，可带网页层标注。
3. `IA Before / After`：将旧层级与新层级并排显示，明确被删除、提升或合并的关系。
4. 可选 `One Tap Spotlight`：展示系统级便捷动作。
5. `Function Tour`：功能 tab + 迭代前后切换 + 恒定版式骨架。
6. `Live Result`：正式上线效果或一体化流程演示。
7. `Honest Facts`：使用横向事实条表达定性或有限证据，不伪装成增长数字。
8. 可选 `Reflection`。

**内容门槛：**

- 必须能画出一个真实的关系变化：层级、规则、功能覆盖或状态模型。
- 功能 tab 使用同一画框，证明“一套规则覆盖多个功能”，而不是普通图片轮播。
- 没有可信量化结果时，明确写“定性”“上线实装”“覆盖范围”等事实。

### Template 3: Cinematic Archive / 影院档案叙事

**适用案例：** 已有完整长图、研究板或设计分析图，但暂时缺少足够结构化的决策与验证材料；用于渐进迁移，不能成为所有新案例的默认模板。圣境示例：`skillcircle`。

**数据选择：** `case.story` 不存在，同时提供 `cover`、`archetype`、`blurb`、`highlights` 与 `articleMDX`。

**固定顺序：**

1. 全宽影院封面：编号、原型标签、标题、blurb 与一张 16:9 / 横向主视觉。
2. 正文两栏：桌面约 34% sticky highlights + 66% article。
3. Markdown / HTML 正文按自然顺序展示标题、说明、长图、GIF 或视频。
4. 媒体保持完整比例，caption 与分节标签贴近证据。

**内容门槛：**

- 至少补齐一句明确 blurb，说明玩家场景、关键方法和预期改善。
- 至少提供 3 个 highlights，作为快速扫描入口。
- 长图中可被网页正文表达的文字应逐步迁出图片。
- 当案例具备清晰决策与证据后，应迁移到侧轨或线性模板。

### Secondary Evidence Archive

`ProjectFeaturedCases` 是二级证据查看器，不是第四套正文模板。

- `gallery`：适合 Figma 规范、控件库与多张画板，使用纵向全屏画廊。
- `slides`：适合流程介绍、分享材料与演示文稿，使用单页幻灯片、拖动 / 滚轮 / 键盘翻页和进度轨。
- 只有内容本质是“规范档案”或“演示材料”时才进入这里。普通案例不得因为素材多就移入档案。

### Media Treatment

- Hero 插画优先使用 16:9 横向像素场景；一张图只表达一个问题、决策或结果。
- Hero 插画承担隐喻，真实截图、GIF、视频和指标承担证明。
- 前后对比必须使用可比较状态；不可比较时改用决策聚焦。
- 图片裁切仅在 `objectPosition` 明确指定时启用；否则完整展示。
- 所有媒体必须有 caption；caption 说明状态、范围或证据类型。
- 长图是二级证据，不应打断主叙事的关键判断。

### Navigation And Interaction

- sticky 项目内导航通过 Intersection Observer 高亮当前案例。
- 侧轨步骤可点击跳到对应决策或结果，当前阶段高亮。
- 对比轮播 hover 只暂停右侧媒体，不暂停整个叙述区。
- tab、按钮、查看器关闭与幻灯片控制必须有键盘语义和 `focus-visible` 状态。
- 动效默认使用 `cubic-bezier(0.22, 1, 0.36, 1)` 或 GSAP `power2.out / power3.out`。
- 滚动揭示约 `0.82s`，同组 stagger 约 `0.08s`；前后图交叉淡化约 `520ms`。
- `prefers-reduced-motion: reduce` 下关闭自动轮播、扫光、脉冲、上浮与缩放，内容直接显示。

### Responsive Behavior

- `>= 1024px`：侧轨与正文分栏，决策图文左右交替，对比舞台双栏。
- `< 1024px`：所有模板回到单列，sticky 侧轨取消，阅读顺序保持完整。
- `< 768px`：Hero 最小高度约 34rem，遮罩改为纵向，确保标题与 one-liner 可读。
- `< 860px`：Foundation Work 两列卡片改为单列。
- `< 560px`：隐藏 featured 卡片的长描述，保留标题、模式与 CTA。

### Implementation Map

- 数据与模板字段：`data/projects.ts`
- 模板分发：`components/projects/project-work-wall.tsx`
- 侧轨模板：`components/projects/case-story.tsx`
- 线性系统模板：`components/projects/system-case-story.tsx`
- 二级证据档案：`components/projects/project-featured-cases.tsx`
- 顶部项目内导航：`components/projects/project-detail-nav.tsx`
- 页面编排：`app/projects/[slug]/page.tsx`
- 视觉、动效与响应式：`app/globals.css`

### Agent Workflow And Skills

1. 先使用 `$game-ux-case-consultant`，产出 case thesis、证据缺口、故事顺序与媒体处理建议。
2. 根据本文件的模板选择规则确定 `rail`、`linear` 或影院档案。
3. 需要案例封面时使用 `$pixel-portfolio-illustrations`，先做 shot list，再生成 16:9 像素场景。
4. 修改动效时使用 `$gsap-core`、`$gsap-react` 与 `$gsap-scrolltrigger`，沿用当前 easing、清理与 reduced-motion 规则。
5. 完成后使用 `$impeccable audit` 检查响应式、对比度、可访问性与动效降级；视觉系统发生变化时用 `$impeccable document` 刷新本文件。

### Minimal Template Decision

```text
有清晰核心论点 + 2~3 个决策 + 前后/结果证据？
  -> Evidence Rail

核心论点是层级、规则、覆盖或多功能一致性？
  -> Linear System

当前主要只有长图、研究板或现成演示素材？
  -> Cinematic Archive，后续再迁移

内容本质是规范画板或完整演示文稿？
  -> Secondary Evidence Archive，不进入正文模板
```

## Do's and Don'ts

### Do:

- **Do** 先写一句核心论点：面向谁、在什么场景、通过什么判断改善什么体验、由什么证据支持。
- **Do** 让每个决策遵循“问题证据 → 洞察 → 决策 → 证明 → 学习”。
- **Do** 把最强证据放在结论旁边，并为指标写清口径、周期、范围和限制。
- **Do** 保持一屏一个主要视觉，让文字解释当前证据，而不是同时解释多张图。
- **Do** 使用金色表达当前态、价值与结果，使用红色表达问题与旧态。
- **Do** 让像素插画解释案例矛盾，并让主角执行与概念有关的动作。
- **Do** 保留 reduced-motion、键盘操作、焦点态、语义化 tab 与 caption。
- **Do** 在素材不足时诚实使用影院档案模板，并记录后续需要补齐的证据。

### Don't:

- **Don't** 把转化优化、系统设计和流程沉淀强套成相同卡片或相同章节顺序。
- **Don't** 将完整长图直接当作主叙事；正文必须承担标题、判断、说明和指标。
- **Don't** 为了好看发明测试结果、指标、用户反馈或个人贡献范围。
- **Don't** 把项目总流水直接归因于单个 UX 决策。
- **Don't** 在同一案例中堆叠超过 3 个主要决策；其余内容进入档案或附录。
- **Don't** 使用通用 SaaS 渐变、蓝紫霓虹、白色卡片墙、玻璃拟态堆叠或无关营销口号。
- **Don't** 让像素插画代替真实截图、上线结果或设计证据。
- **Don't** 使用像素字体承载中文长标题和正文。
- **Don't** 让动效成为读取内容的前置条件；关闭动效后页面必须完整可用。
- **Don't** 把 `ProjectFeaturedCases` 当作普通案例正文模板。
