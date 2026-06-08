import { withMinimumDelay } from '@/lib/sleep'

/**
 * 结构化案例叙事（数据驱动模板）。
 * 存在 `story` 时，详情页用模块化版式渲染（框架锚定 + 决策聚焦 + Metric Card + 证据画廊），
 * 不存在时回退到旧的 articleMDX 图片墙。两套可共存，逐个案例迁移。
 */
export type CaseStory = {
  /**
   * 版式：
   * - 'rail'（默认）：BP 数据驱动型——左侧 sticky 框架锚点 + 决策聚焦 + Metric 卡。
   * - 'linear'：系统设计型——单列叙事，以信息架构扁平化为魂（命卡用此版）。
   */
  layout?: 'rail' | 'linear'
  /** 案例原型标签，如「转化优化 · 数据驱动」 */
  archetype: string
  /** 一句话核心论点：面向谁 / 什么场景 / 改善了什么 */
  oneLiner: string
  /** 开场最强数字（可选，rail 版用） */
  headlineMetric?: { value: string; label: string }
  /** hero 去数字立论行（linear 版用，替代 headlineMetric 大数字） */
  heroKicker?: string
  /** 案例标题区背景封面（可选） */
  heroImage?: { src: string; alt: string; objectPosition?: string }
  /**
   * 信息架构层级扁平化（linear 灵魂区）：可交互的前/后树对照。
   * 节点标签内置于组件（命卡专属），此处只配文案。
   */
  iaTree?: {
    kicker?: string
    title?: string
    /** 迭代前结构说明（深埋两层） */
    beforeNote: string
    /** 迭代后结构说明（四大平级） */
    afterNote: string
    caption?: string
  }
  /** 深层入口实证（point 1）：带网页层标注的截图，字不画进图 */
  deepEntry?: {
    kicker?: string
    title?: string
    body: string
    media: { src: string; caption?: string }
    /** 网页层标注（百分比定位 0-100） */
    annotations?: Array<{ label: string; xPct: number; yPct: number }>
  }
  /** 一键镶嵌（point 3）：系统级便捷特写 */
  oneTap?: {
    kicker?: string
    title?: string
    body?: string
    media: { type: 'image' | 'gif' | 'video'; src: string; caption?: string }
  }
  /** 原创框架：作为左侧 sticky 锚点，随滚动高亮当前阶段（rail 版） */
  framework?: {
    title: string
    steps: { key: string; label: string; desc: string }[]
  }
  /** 问题 / 摩擦（rail 版） */
  problem?: {
    title: string
    points: string[]
    media?: { src: string; caption?: string }
    /**
     * 迭代前/后对比（存在时取代上面的静态 title/points/media）。
     * 顶部 tab 统一切换整块：标题 + 重点 + 图随之切换，并每隔 interval 自动轮播。
     */
    compare?: {
      /** 自动切换间隔，毫秒，默认 5000 */
      interval?: number
      slides: Array<{
        /** tab 文字，如「迭代前」「迭代后」 */
        label: string
        /** 重点的语气：problem=红色编号，solution=金色对勾 */
        tone?: 'problem' | 'solution'
        /** 该状态的标题 */
        title: string
        /** 该状态的重点说明 */
        points: string[]
        src: string
        caption?: string
      }>
    }
  }
  /** 关键决策（建议 2-3 个），每个对应框架的一个阶段（rail 版） */
  decisions?: Array<{
    stepKey: string
    no: string
    title: string
    rationale: string
    actions: string[]
    media: {
      type: 'image' | 'gif' | 'video'
      src: string
      caption?: string
      objectPosition?: string
    }
  }>
  /** 结果指标（必须带口径 / 周期 / 范围 / 说明）。linear 版渲染为横向「事实条」 */
  metrics?: Array<{
    value: string
    label: string
    meta: { k: string; v: string }[]
  }>
  /**
   * 系统级「逐功能前后对比」模块（可选，适合系统设计型案例）。
   * 顶部一排功能 tab（如 镶嵌/强化/铸命/分解），点选后在统一画框内
   * 通过「迭代前 / 迭代后」开关切换该功能的前后截图，并显示这次改了什么。
   * 用一个模块的结构本身复刻「四功能合一」的信息架构。
   */
  functionTour?: {
    kicker?: string
    title?: string
    intro?: string
    /** 统一版式分区（恒定骨架示意条，如 一级导航 / 主要信息交互区 / 命卡选择区） */
    zones?: string[]
    tabs: Array<{
      key: string
      /** tab 文字，如「镶嵌」 */
      label: string
      /** 一句话：这个功能改了什么 */
      summary: string
      /** 「本次规整」像素小标 */
      change?: string
      before: { src: string; caption?: string }
      after: { src: string; caption?: string }
    }>
  }
  /** 正式落地效果（point 5）：上线实装的单图 / GIF 聚焦 */
  liveResult?: {
    kicker?: string
    title?: string
    body?: string
    media: { type: 'image' | 'gif' | 'video'; src: string; caption?: string }
  }
  /** 反思 / 取舍 / 下一步（可选） */
  reflection?: { title: string; body: string }
}

export type Project = {
  slug: string
  title: string
  subtitle?: string
  role: string
  period: string
  team?: string
  platform: string[]
  kpis?: { label: string; value: string }[]
  cover: string
  tags: string[]
  summary: string
  cases: Array<{
    id: string
    title: string
    highlights: string[]
    media: Array<{
      type: 'image' | 'gif' | 'video' | 'embed'
      src: string
      caption?: string
      poster?: string
    }>
    articleMDX: string
    story?: CaseStory
  }>
}

const md = (strings: TemplateStringsArray) => strings[0]

export const projects: Project[] = [
  {
    slug: 'dahua2',
    title: '大话西游2',
    subtitle: '经典国风MMO·持续运营20年+',
    role: 'UI交互负责人',
    period: '2017-2022',
    team: '3交互、5视觉',
    platform: ['端游', '移动端'],
    kpis: [
      { label: '营收创近十年新高', value: ' ' },
    ],
    cover: '/dahua2-cover.jpg',
    tags: ['MMO'],
    summary:
      '任《大话西游2》主交互，配合策划需求完成四年的核心运营活动及核心消费系统迭代，包括龙族资料片、藏宝阁、多宝阁，提升项目玩家活跃度及营收。',
    cases: [
      {
        id: 'manage',
        title: '团队协作管理',
        highlights: ['规范整理', '重复工作模版化', '沙龙经验分享'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491629/23c2f799-7dc3-4368-aa25-173251f0f296.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491871/8b951c5f-5a0a-42c6-8451-cab9ce89a7e7.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491473/ffacd032-d67d-47cd-be65-e5af2886eb52.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491484/175612ed-136e-43eb-8d76-89cd93a4dc56.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491547/845be891-c94c-4afd-a1c7-50e443ab707c.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491580/248f0ec2-8a6c-4f98-983d-ca7ccbe5136a.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491629/23c2f799-7dc3-4368-aa25-173251f0f296.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491871/8b951c5f-5a0a-42c6-8451-cab9ce89a7e7.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491473/ffacd032-d67d-47cd-be65-e5af2886eb52.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491484/175612ed-136e-43eb-8d76-89cd93a4dc56.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491547/845be891-c94c-4afd-a1c7-50e443ab707c.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491580/248f0ec2-8a6c-4f98-983d-ca7ccbe5136a.png"
/>
        `,
      },
      {
        id: 'cangbao',
        title: '藏宝阁 优化',
        highlights: [
          '提升筛选、搜索、浏览效率',
          '算法推荐UI迭代',
          '提升交易费收入',
        ],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761466133/b01badd9-c89c-4bd6-ba9b-c167d5b4da0f.png',
          },
          {
            type: 'video',
            src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1761466878/20251026-161913_ah3i5v.mp4',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761466890/2183e3ef-b3e4-4faf-b71f-27ac1742350c.png',
          },
          {
            type: 'video',
            src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1761467742/20251026-163343_ntooi2.mp4',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761467779/20251026-162625_f8ehl0.gif',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761467782/20251026-162835_vsqeak.gif',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761466133/b01badd9-c89c-4bd6-ba9b-c167d5b4da0f.png"
/>
<div class="tiptap-video-wrapper">
  <video
    class="tiptap-video"
    controls="true"
    src="https://res.cloudinary.com/dnhjgceru/video/upload/v1761466878/20251026-161913_ah3i5v.mp4"
  ></video>
</div>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761466890/2183e3ef-b3e4-4faf-b71f-27ac1742350c.png"
/>
<div class="tiptap-video-wrapper">
  <video
    class="tiptap-video"
    controls="true"
    src="https://res.cloudinary.com/dnhjgceru/video/upload/v1761467742/20251026-163343_ntooi2.mp4"
  ></video>
</div>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761467779/20251026-162625_f8ehl0.gif"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761467782/20251026-162835_vsqeak.gif"
/>
        `,
      },
      {
        id: 'duobao',
        title: '多宝阁 优化',
        highlights: ['瀑布流设计', '算法推荐', '场景化设计'],
        media: [
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761468013/20251026-163907_swab87.gif',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761468282/20251026-164135_avxsrl.gif',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761468295/59c9be58-2ea4-41f3-acca-156e81a99b2f.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468013/20251026-163907_swab87.gif"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468282/20251026-164135_avxsrl.gif"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468295/59c9be58-2ea4-41f3-acca-156e81a99b2f.png"
/>
        `,
      },
      {
        id: 'liutong',
        title: 'MMO资源流通 优化',
        highlights: ['资源从何而来', '获得资源的瞬间', '更加便捷地消耗'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761479819/Frame_1_2_ryapjb.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761479819/Frame_1_2_ryapjb.png"
/>
        `,
      },
      {
        id: 'gaojiazhi',
        title: '高价值奖励分享优化',
        highlights: ['优化视觉呈现', '提升易用性', '移动端社交平台分享'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480721/0fd1d9aa-5c15-4b67-9b36-c9b1737990ba.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480721/0fd1d9aa-5c15-4b67-9b36-c9b1737990ba.png"
/>
        `,
      },
      {
        id: 'social',
        title: '社交优化',
        highlights: ['回流玩法迭代', '社会临场感交互理论', '社交细节迭代'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761489967/a524ec4f-2ddd-45f5-ba36-09862769cf80.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480652/fe4d09db-fe8a-418b-895b-aeaf70b6b4d4.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480685/541e44d0-b95b-4e92-ab58-f6ae8cc1be2b.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761489967/a524ec4f-2ddd-45f5-ba36-09862769cf80.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480652/fe4d09db-fe8a-418b-895b-aeaf70b6b4d4.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480685/541e44d0-b95b-4e92-ab58-f6ae8cc1be2b.png"
/>
        `,
      },
    ],
  },
  {
    slug: 'myth-quest',
    title: '圣境之塔',
    subtitle: '二次元 MMORPG',
    role: '交互设计专家',
    period: '2022至今',
    team: '1交互、3视觉',
    platform: ['iOS', 'Android'],
    kpis: [
      { label: '全球上线流水', value: '1亿美元+' },
    ],
    cover: '/shengjing-cover.jpg',
    tags: ['二次元 MMORPG', '手游'],
    summary:
      '负责从0到1将交互流程融入到原开发流程之中,整理UI交互规范,梳理开发新流程,现已平稳运行3年并推广至新项目;\n先后跟进项目上线欧美、日、韩、国服，保障全球各区运营活动需求以及养成线拓展，全球累计流水已达上亿美元;\n持续总结经验,在公司进行演讲分享,进行UX知识的传播与布道',
    cases: [
      {
        id: 'Consistency',
        title: 'UI规范整理/Figma控件库搭建',
        highlights: ['UI资源整理', '构建Figma控件库', '弹窗一致性优化'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542177/8826a0ab-5121-48d9-93ef-d0c1d1b04a5d.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542188/d08670e4-d5a3-4991-a409-d5a09cc7464c.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542203/6131d2b5-07f0-46c1-a311-ed6ecddf0bd0.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542177/8826a0ab-5121-48d9-93ef-d0c1d1b04a5d.png"
/>
<h2>通用一级/二级/弹窗规范：</h2>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542188/d08670e4-d5a3-4991-a409-d5a09cc7464c.png"
/>
        <img
          class="rounded-xl border border-border/40"
          src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542203/6131d2b5-07f0-46c1-a311-ed6ecddf0bd0.png"
        />
        `,
      },
      {
        id: 'UEprocess',
        title: '从0-1构建游戏交互流程',
        highlights: ['岗位作用', '流程介绍', '寻求支持'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553748/8f24bd84-ac7a-4e42-aa48-f9f88d8d5ffd.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553766/0c64f9f0-a485-476a-8f61-5c70da64b042.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553781/9ea8e7c0-c72e-4889-b26c-88b99a7dbac2.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553793/f54c22d0-8644-44c9-9468-d1e8ff0ad3b4.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553834/b1d7e18d-28cb-4df7-82aa-734ae22cc479.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553871/3276cf1a-0259-4c0e-9f5f-c81325b9f169.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553904/8920c66b-75e1-4d40-8035-15dd59c43976.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553921/efd53b13-abca-4832-a28a-cd2d101ec736.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553998/c2a10351-a2b1-43ac-87c8-313852c1d8ef.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553988/1efde7df-6d92-4d56-90be-8beb117296d2.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554032/cdf90913-1f1c-4f15-9cb8-36ddcd909c5f.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554008/d5adc6b7-d988-495d-8bad-a81420bd4ea3.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554045/1e1bd8d4-ebe8-4fa1-aaab-fb6933be0f44.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554039/36c9faa0-526e-44e5-9f8d-917dc7f1ed94.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554397/fd1d0f64-3683-47a0-8b47-1050344278b0.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554416/601f643e-1885-4c4f-9aea-0cb6c89b5443.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554428/31c42521-3adf-4a1c-9e8e-5b15beb4906a.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554441/2a8dcb2b-c69e-4874-9bb9-a15b648c1ff8.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554474/7494c125-8360-43b6-b891-56c1e4c59778.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554457/e020eb11-488c-4857-9f7d-d6145b0c9f59.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554495/e803e706-a495-4e78-adae-3dce7b482c85.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554535/7f5a31b7-0a11-470a-818e-b5b7693e69af.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554541/bd7ebb0d-d8b9-46be-b873-05de2e34c668.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554527/5ed32c00-9c0f-466e-bdd4-ada0c5a725ea.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554973/98f93ad2-05c4-4d17-8188-e86eeeebd62f.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554978/51329413-e0f1-4dc6-a16f-01e5a055a77c.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761555006/a4c00767-ed8e-4b22-acf5-9618fef80b9b.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554556/b672bd15-f612-4562-a1a7-831d61536c90.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553748/8f24bd84-ac7a-4e42-aa48-f9f88d8d5ffd.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553766/0c64f9f0-a485-476a-8f61-5c70da64b042.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553781/9ea8e7c0-c72e-4889-b26c-88b99a7dbac2.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553793/f54c22d0-8644-44c9-9468-d1e8ff0ad3b4.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553834/b1d7e18d-28cb-4df7-82aa-734ae22cc479.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553871/3276cf1a-0259-4c0e-9f5f-c81325b9f169.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553904/8920c66b-75e1-4d40-8035-15dd59c43976.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553921/efd53b13-abca-4832-a28a-cd2d101ec736.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553998/c2a10351-a2b1-43ac-87c8-313852c1d8ef.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553988/1efde7df-6d92-4d56-90be-8beb117296d2.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554032/cdf90913-1f1c-4f15-9cb8-36ddcd909c5f.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554008/d5adc6b7-d988-495d-8bad-a81420bd4ea3.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554045/1e1bd8d4-ebe8-4fa1-aaab-fb6933be0f44.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554039/36c9faa0-526e-44e5-9f8d-917dc7f1ed94.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554397/fd1d0f64-3683-47a0-8b47-1050344278b0.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554416/601f643e-1885-4c4f-9aea-0cb6c89b5443.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554428/31c42521-3adf-4a1c-9e8e-5b15beb4906a.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554441/2a8dcb2b-c69e-4874-9bb9-a15b648c1ff8.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554474/7494c125-8360-43b6-b891-56c1e4c59778.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554457/e020eb11-488c-4857-9f7d-d6145b0c9f59.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554495/e803e706-a495-4e78-adae-3dce7b482c85.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554535/7f5a31b7-0a11-470a-818e-b5b7693e69af.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554541/bd7ebb0d-d8b9-46be-b873-05de2e34c668.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554527/5ed32c00-9c0f-466e-bdd4-ada0c5a725ea.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554973/98f93ad2-05c4-4d17-8188-e86eeeebd62f.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554978/51329413-e0f1-4dc6-a16f-01e5a055a77c.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761555006/a4c00767-ed8e-4b22-acf5-9618fef80b9b.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554556/b672bd15-f612-4562-a1a7-831d61536c90.png"
/>
        `,
      },
      {
        id: 'pay process',
        title: '付费货币不足流程优化',
        highlights: ['充值档位差值推荐', '缩短付费流程', '提升付费体验'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542293/0ee2b05c-64d9-4a04-a371-f4c6955035b1.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542302/3c53a59c-180f-4aca-bf6b-f3e9cd6aa6ab.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h3>迭代前</h3>
</blockquote>
<p>
  1、①→②跳转时，玩家不知道或者需要自己计算<u>充哪个档位</u>是最小能够满足彩晶的消耗(对于中小R比较精打细算)
</p>
<p>
  2、②→③，玩家充值完成后，需要重新进入商店找到想买的商品，中间又经过几个步骤，<u>操作繁琐</u>
</p>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542293/0ee2b05c-64d9-4a04-a371-f4c6955035b1.png"
/>
<blockquote>
  <h3>迭代后</h3>
</blockquote>
<ul>
  <li>
    <p>推荐充值档位</p>
  </li>
  <li>
    <p>缩短操作路径</p>
  </li>
</ul>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542302/3c53a59c-180f-4aca-bf6b-f3e9cd6aa6ab.png"
/>
        `,
        story: {
          archetype: '付费流程 · 转化提效',
          oneLiner:
            '面向货币不足时的临门一脚——把「自己算哪档刚好够 + 充完再绕回找商品」的繁琐链路，压成「推荐档位、一步直达」的顺滑付费。',
          headlineMetric: { value: '一步直达', label: '充值完成即回到购买，不再绕回商店' },
          heroImage: {
            src: '/illustrations/shengjing/payflow-recharge.png',
            alt: '像素角色面对分档充值祭坛，从满脸问号到一眼选中刚好够用的档位',
            objectPosition: 'center',
          },
          framework: {
            title: '顺滑付费三步',
            steps: [
              { key: 'calc', label: '算清', desc: '系统直接推荐刚好够用的档位' },
              { key: 'direct', label: '直达', desc: '充值完成即回到购买，不再绕回商店' },
              { key: 'smooth', label: '提效', desc: '减少跳转与心算，付费体验更顺' },
            ],
          },
          problem: {
            title: '旧版：算不清档位，绕不回商品',
            points: [
              '货币不足跳到充值时，玩家得自己算「充哪档刚好够」——中小 R 尤其精打细算',
              '充值完成后要重新进商店、再找回想买的商品，中间多步跳转，操作繁琐',
              '整条付费链路断成两截，付费意愿在反复跳转里被消耗',
            ],
            compare: {
              interval: 5000,
              slides: [
                {
                  label: '迭代前',
                  tone: 'problem',
                  title: '旧版：算不清档位，绕不回商品',
                  points: [
                    '货币不足时只跳到充值页，充哪档刚好够要玩家自己算',
                    '充值完成后需重新进店、再次查找想买的商品',
                    '多步跳转、操作繁琐，临门一脚容易流失',
                  ],
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542293/0ee2b05c-64d9-4a04-a371-f4c6955035b1.png',
                  caption: '迭代前 · 付费流程',
                },
                {
                  label: '迭代后',
                  tone: 'solution',
                  title: '新版：推荐档位，一步直达',
                  points: [
                    '按缺口直接推荐刚好满足消耗的最小档位',
                    '充值完成即回到原购买位，省去重新进店查找',
                    '路径压到最短，心算与跳转都被去掉',
                  ],
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542302/3c53a59c-180f-4aca-bf6b-f3e9cd6aa6ab.png',
                  caption: '迭代后 · 付费流程',
                },
              ],
            },
          },
          decisions: [
            {
              stepKey: 'calc',
              no: '01',
              title: '替玩家算出「刚好够用」的档位',
              rationale:
                '货币不足跳到充值时，系统按当前缺口直接推荐刚好满足消耗的最小档位——中小 R 不必再逐档精打细算，把决策成本压到最低。',
              actions: ['档位差值推荐', '按需最小档位'],
              media: {
                type: 'image',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542302/3c53a59c-180f-4aca-bf6b-f3e9cd6aa6ab.png',
                caption: '迭代后 · 充值档位差值推荐',
              },
            },
            {
              stepKey: 'direct',
              no: '02',
              title: '充完直接回到要买的商品',
              rationale:
                '迭代前充值完成后要重新进商店、再次找回商品，中间又经过几个步骤；迭代后充值即回到原购买位，把「充值 → 购买」的路径压到最短。',
              actions: ['充值后直达商品', '缩短操作路径'],
              media: {
                type: 'image',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542293/0ee2b05c-64d9-4a04-a371-f4c6955035b1.png',
                caption: '迭代前 · 充值后需重新进店找回商品（已优化）',
              },
            },
          ],
          metrics: [
            {
              value: '推荐档位',
              label: '货币不足时直接给出刚好够用的档位',
              meta: [
                { k: '口径', v: '充值档位差值推荐' },
                { k: '性质', v: '付费流程改版（体验优化，非线上指标）' },
                { k: '范围', v: '个人负责的 UI / 交互改版' },
              ],
            },
            {
              value: '路径缩短',
              label: '充值完成后一步回到购买',
              meta: [
                { k: '口径', v: '充值 → 购买的操作路径' },
                { k: '收益', v: '去掉重新进店、二次查找的跳转步骤' },
                { k: '说明', v: '定性判断，基于流程走查与评审，暂无 A/B 数据' },
              ],
            },
          ],
        },
      },
      {
        id: 'battlepass',
        title: 'BP优化',
        highlights: ['突出大奖', '价值换算', '付费率提升10%+'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542433/73ba6351-5925-46ba-8b23-2015754ee567.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542440/eaa86296-32a9-46e0-acc2-8aa45b583ab9.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542474/e61ee591-10e5-44a0-8421-381b947a1e2f.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h3>迭代前</h3>
</blockquote>
<ul>
  <li>
    <p>噱头大奖奖励不突出</p>
  </li>
  <li>
    <p>阶段性奖励不突出</p>
  </li>
  <li>
    <p>付费档奖励视觉上较弱</p>
  </li>
</ul>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542433/73ba6351-5925-46ba-8b23-2015754ee567.png"
/>
<blockquote>
  <h3>迭代后</h3>
</blockquote>
<ul>
  <li>
    <p>左边显示大奖轮播，新增花灵立绘展示</p>
  </li>
  <li>
    <p>阶段性奖励始终置于列表右边</p>
  </li>
  <li>
    <p>付费档奖励视觉上用暖色底突出</p>
  </li>
</ul>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542440/eaa86296-32a9-46e0-acc2-8aa45b583ab9.png"
/>
<blockquote>
  <h3>解锁弹窗迭代</h3>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542474/e61ee591-10e5-44a0-8421-381b947a1e2f.png"
/>
<h2>
  迭代数据提升：外放前后月份，<u>单项付费率提升10%+</u>
</h2>
        `,
        story: {
          archetype: '转化优化 · 数据驱动',
          oneLiner:
            '面向精打细算的中小 R，重构 BP 的价值感知路径——让大奖被看见、价值算得清、付费档更心动。',
          headlineMetric: { value: '+10%', label: '单项付费率 · 外放前后月对比' },
          heroImage: {
            src: '/illustrations/shengjing/battlepass-value-reveal.webp',
            alt: '像素角色激活战令奖励轨道，让隐藏奖励价值逐步显现',
            objectPosition: 'center',
          },
          framework: {
            title: '付费转化三阶',
            steps: [
              { key: 'see', label: '看见', desc: '噱头大奖第一眼就抓住注意力' },
              { key: 'calc', label: '算清', desc: '阶段与付费价值一眼可换算' },
              { key: 'want', label: '心动', desc: '付费档在视觉上被明确推荐' },
            ],
          },
          problem: {
            title: '旧版：价值都在，却都没被看见',
            points: [
              '噱头大奖不突出，玩家划过却记不住',
              '阶段性奖励位置漂移，「拿了什么、还差多少」不清晰',
              '付费档奖励视觉偏弱，和免费档难以区分',
            ],
            compare: {
              interval: 5000,
              slides: [
                {
                  label: '迭代前',
                  tone: 'problem',
                  title: '旧版：价值都在，却都没被看见',
                  points: [
                    '噱头大奖不突出，玩家划过却记不住',
                    '阶段性奖励位置漂移，「拿了什么、还差多少」不清晰',
                    '付费档奖励视觉偏弱，和免费档难以区分',
                  ],
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542433/73ba6351-5925-46ba-8b23-2015754ee567.png',
                  caption: '迭代前 · BP 主界面',
                },
                {
                  label: '迭代后',
                  tone: 'solution',
                  title: '新版：让价值被看见、算得清、更心动',
                  points: [
                    '左侧大奖轮播 + 新增花灵立绘展示',
                    '阶段性奖励固定列表右侧，进度即时可见',
                    '付费档暖色底，与免费档拉开层级',
                  ],
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780823565/%E7%BE%81%E7%BB%8A%E4%B9%8B%E7%A4%BC%E8%BF%AD%E4%BB%A3%E5%90%8E_nqhdol.png',
                  caption: '迭代后 · BP 主界面',
                },
              ],
            },
          },
          decisions: [
            {
              stepKey: 'see',
              no: '01',
              title: '把大奖搬到第一视线',
              rationale:
                '左侧改为大奖轮播并新增花灵立绘展示，让稀有奖励在进入界面的第一眼就被识别，建立「值得肝、值得买」的预期。',
              actions: ['大奖轮播', '花灵立绘展示'],
              media: {
                type: 'gif',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780823722/%E7%BE%81%E7%BB%8A%E4%B9%8B%E7%A4%BC%E8%BF%AD%E4%BB%A3%E5%90%8E-%E8%BD%AE%E6%92%AD%E5%A5%96%E5%8A%B1_jyuzhv.gif',
                caption: '迭代后 · 大奖轮播',
              },
            },
            {
              stepKey: 'calc',
              no: '02',
              title: '让进度与价值固定可读',
              rationale:
                '阶段性奖励始终固定在列表右侧，玩家在任意滚动位置都能回答「我拿了什么、还差多少」，降低价值换算的心算成本。',
              actions: ['阶段奖励固定右侧', '进度即时可见'],
              media: {
                type: 'image',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780824120/%E7%BE%81%E7%BB%8A%E4%B9%8B%E7%A4%BC%E8%BF%AD%E4%BB%A3%E5%90%8E2_gljl8n.png',
                caption: '迭代后 · 阶段奖励固定区',
              },
            },
            {
              stepKey: 'want',
              no: '03',
              title: '给付费档一个明确的视觉承诺',
              rationale:
                '付费档用暖色底与免费档拉开层级，并重做解锁弹窗，在转化瞬间把「已解锁的增量价值」讲清楚。',
              actions: ['付费档暖色底', '解锁弹窗重构'],
              media: {
                type: 'image',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780826156/%E7%BE%81%E7%BB%8A%E4%B9%8B%E7%A4%BC%E5%BC%B9%E7%AA%97%E8%BF%AD%E4%BB%A3_hlcckd.png',
                caption: '解锁弹窗迭代',
              },
            },
          ],
          metrics: [
            {
              value: '+10%',
              label: '单项付费率提升',
              meta: [
                { k: '口径', v: '该 BP 单项付费率' },
                { k: '周期', v: '外放前后相邻月份对比' },
                { k: '范围', v: '个人负责的 UI / 交互改版' },
                { k: '说明', v: '同期含版本内容更新等混杂因素，非单一归因' },
              ],
            },
          ],
        },
      },
      {
        id: 'sealcard',
        title: '核心养成系统-命卡优化',
        highlights: ['提升玩家数值培养目标感', '信息架构调整', '规整单页面结构'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761546179/431c3053-95b2-4d5a-b765-6221c1e472c9.png',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761546898/%E5%8F%AF%E4%BA%A4%E4%BA%92%E5%8E%9F%E5%9E%8B_iuu1gr.gif',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761547147/%E5%91%BD%E5%8D%A1%E5%8A%A8%E6%95%88%E8%BD%AC%E5%9C%BA%E7%A4%BA%E6%84%8F%E5%9B%BE_rwvoxi.gif',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761546179/431c3053-95b2-4d5a-b765-6221c1e472c9.png"
/>
<blockquote>
  <h2>可交互原型演示</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761546898/%E5%8F%AF%E4%BA%A4%E4%BA%92%E5%8E%9F%E5%9E%8B_iuu1gr.gif"
/>
<blockquote>
  <h2>正式UI、动效效果</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761547147/%E5%91%BD%E5%8D%A1%E5%8A%A8%E6%95%88%E8%BD%AC%E5%9C%BA%E7%A4%BA%E6%84%8F%E5%9B%BE_rwvoxi.gif"
/>
        `,
        story: {
          layout: 'linear',
          archetype: '系统设计 · 信息架构',
          oneLiner:
            '把埋在二级菜单、入口又藏在小按钮里的命卡养成功能，扁平成一眼看全的一级导航——四个功能从此并列、同框、共用一套版式语言。',
          heroKicker: '四散且深埋的养成功能  →  一目了然的一体化系统',
          heroImage: {
            src: '/illustrations/shengjing/growth-card-constellation.webp',
            alt: '像素角色在星空观测台梳理命卡养成路径，让分散卡牌形成清晰成长星图',
            objectPosition: 'center',
          },
          iaTree: {
            kicker: '信息架构调整',
            title: '强化与铸命，从「培养」二级里解放出来',
            beforeNote:
              '强化 / 铸命 被收在「培养」页里，而「培养」入口又藏在命卡详情页的小按钮——足足埋了两层；镶嵌、分解又各自独立。新玩家进来往往只看到镶嵌，其余全靠自己探索。',
            afterNote:
              '镶嵌 · 强化 · 铸命 · 分解 全部提为一级导航、彼此平级——进门一眼看全，无需探索。',
            caption: '信息架构对照（数字化自设计师手绘脑图）',
          },
          deepEntry: {
            kicker: '旧方案问题',
            title: '最重要的养成操作，藏在一个小按钮里',
            body:
              'UX 介入迭代前，培养（强化 / 铸命）只能从命卡详情页右侧的小按钮进入，玩家感知度低——不知道自己还能继续培养，且培养页没有提供命卡切换，只能返回上两级页面操作。\n 把培养提到一级导航，是整体扁平化的第一步。',
            media: {
              src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780905000/20260608-153657_ccs5p1.gif',
              caption: '迭代前养成操作路径',
            },
          },
          functionTour: {
            kicker: '交互方案 · 四功能同框',
            title: '优化交互方案',
            intro:
              '扁平到一级只解决「在哪」；要让玩家学一次就会全部，还得让四个功能共用一套版式语言——相同的一级导航、相同的主要信息交互区、相同的命卡选择区。',
            zones: ['一级导航', '主要信息交互区', '命卡选择区'],
            tabs: [
              {
                key: 'xiangqian',
                label: '镶嵌',
                summary: '从独立的部位转盘页，并入统一画框；新增右侧卡库速取与一键镶嵌。',
                change: '并入统一画框 · 右侧卡库速取 · 一键镶嵌',
                before: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843463/%E8%BF%AD%E4%BB%A3%E5%89%8D-%E9%95%B6%E5%B5%8C_vxz86d.png',
                  caption: '镶嵌 · 迭代前（独立全屏 · 转盘版式）',
                },
                after: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843487/%E9%95%B6%E5%B5%8C_gkkldj.png',
                  caption: '镶嵌 · 迭代后（统一画框 + 右侧卡库 + 一键镶嵌）',
                },
              },
              {
                key: 'qianghua',
                label: '强化',
                summary: '从单卡大立绘页，规整为属性前后对比清单，纳入统一左导航。',
                change: '大立绘页 → 属性前后对比清单 · 纳入一级导航',
                before: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843468/%E8%BF%AD%E4%BB%A3%E5%89%8D-%E5%BC%BA%E5%8C%96_mmgw4z.png',
                  caption: '强化 · 迭代前（独立全屏 · 大立绘版式）',
                },
                after: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843474/%E5%BC%BA%E5%8C%96_vy7kis.png',
                  caption: '强化 · 迭代后（属性前后差值高亮 · 统一左导航）',
                },
              },
              {
                key: 'zhuming',
                label: '铸命',
                summary: '保留原属性 / 新属性双栏与铸命评分，接入统一卡库，与其他功能同框。',
                change: '保留双栏属性与评分 · 接入统一卡库',
                before: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843461/%E8%BF%AD%E4%BB%A3%E5%89%8D-%E4%BD%8F%E5%91%BD_ycasop.png',
                  caption: '铸命 · 迭代前（独立全屏 · 双栏属性）',
                },
                after: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843481/%E9%93%B8%E5%91%BD_dyofla.png',
                  caption: '铸命 · 迭代后（原 / 新属性双栏 + 评分 + 统一卡库）',
                },
              },
              {
                key: 'fenjie',
                label: '分解',
                summary: '从独立网格页并入统一画框，筛选与产出一致呈现。',
                change: '独立网格页 → 统一画框 · 筛选与产出一致',
                before: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780843460/%E8%BF%AD%E4%BB%A3%E5%89%8D-%E5%88%86%E8%A7%A3_istdeo.png',
                  caption: '分解 · 迭代前（独立全屏 · 网格版式）',
                },
                after: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780921309/%E5%88%86%E8%A7%A3_1_n938fa.png',
                  caption: '分解 · 迭代后（统一画框 · 筛选与产出一致）',
                },
              },
            ],
          },
          liveResult: {
            kicker: '正式落地 · 线上实装',
            title: '正式落地效果',
            body:
              '改版已正式上线。镶嵌 / 强化 / 铸命 / 分解 四大养成功能并入一体化单页，玩家在同一套版式内一站式完成全部养成，无需再在多级页面间往返——下方为线上实装效果。',
            media: {
              type: 'gif',
              src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780912444/%E5%91%BD%E5%8D%A1%E6%9C%80%E6%96%B0%E6%95%88%E6%9E%9C_zzxyxg.gif',
              caption: '正式落地 · 命卡养成一体化单页（线上实装）',
            },
          },
        },
      },
      // 暂时隐藏「交易所迭代」案例，后续可能恢复，取消注释即可还原
      // {
      //   id: 'trade',
      //   title: '交易所迭代',
      //   highlights: ['优化信息架构', '新增筛选、对比便捷功能', '优化购买、售卖流程'],
      //   media: [
      //     {
      //       type: 'image',
      //       src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761543907/a1f1d279-a732-4b9d-bd8a-4e48aa741191.png',
      //     },
      //   ],
      //   articleMDX: md`
      // <img
      //   class="rounded-xl border border-border/40"
      //   src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761543907/a1f1d279-a732-4b9d-bd8a-4e48aa741191.png"
      // />
      //         `,
      // },
      {
        id: 'skillcircle',
        title: '技能轮盘迭代',
        highlights: ['费茨定律应用', '横屏操作热区', '易用性量化规则'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542847/68acf950-7254-43b1-a56b-c62a960bd885.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542708/eba52f3c-8d72-48df-977f-f8387643946e.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h2>迭代前</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542847/68acf950-7254-43b1-a56b-c62a960bd885.png"
/>
<blockquote>
  <h2>迭代分析、方案</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542708/eba52f3c-8d72-48df-977f-f8387643946e.png"
/>
        `,
      },
    ],
  },
]

export async function getProjects() {
  return withMinimumDelay(Promise.resolve(projects))
}

export async function getProjectBySlug(slug: string) {
  const list = await getProjects()
  return list.find((project) => project.slug === slug) ?? null
}

export async function getProjectCases(slug: string) {
  const project = await getProjectBySlug(slug)
  return project?.cases ?? []
}
