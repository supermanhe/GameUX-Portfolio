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
   * - 'dragon'：0→1 深度养成系统型——养成弧线框架 + 镜头切换包装 + 包装翻译（龙养成用此版）。
   * - 'pet'：复杂系统信息架构治理型——复杂度地图 + 三道闸框架 + 方案抉择 + 骨架统一 + 渐进披露（幻兽用此版）。
   * - 'diy'：交互创新型——竞品范式扫描 + 可交互模式开关 + 画板全景 + 创作生态链（DIY 时装用此版）。
   * - 'aiux'：AI 工作流探索型——三层进化路线 + 一源双环管线图 + 流程条 / DSL 表 / 双读文档 / 清单墙 / 代理卡（AI First UX 项目四案例共用）。
   */
  layout?: 'rail' | 'linear' | 'dragon' | 'pet' | 'diy' | 'aiux'
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
  /**
   * 需求背景 + 我负责什么（dragon 开场）。
   */
  background?: {
    kicker?: string
    title?: string
    body: string
    roleLabel?: string
    roles?: string[]
  }
  /**
   * 养成弧线（dragon 灵魂区）：把多层养成翻译成一条逐级抬升的情感/付费弧线。
   * 进入视口时逐层点亮。每层：机制本质 → 玩家看到的包装 → 情感 → 产出层（付费深度）。
   */
  cultivationArc?: {
    kicker?: string
    title?: string
    intro?: string
    stages: Array<{
      key: string
      /** 设计本质（机制原名），如「强化」 */
      mechanic: string
      /** 玩家看到的包装名，如「巨龙研究」 */
      label: string
      /** 情感定位，如「日常陪伴」 */
      emotion: string
      /** 产出层文案，如「日常产出」 */
      tier: string
      /** 付费深度 1-3，驱动暖色强度（1 中性 / 2 暖金 / 3 深红） */
      tierLevel: 1 | 2 | 3
    }>
  }
  /**
   * 镜头切换包装（dragon 主线亮点）：复用已有龙模型，靠镜头/特写做演出。
   * 一组帧（强化 / 切换部位 / 切换元素）可点选切换主图，下方接可交互原型视频。
   */
  lensSwitch?: {
    kicker?: string
    title?: string
    body?: string
    frames: Array<{ label: string; src: string; caption?: string }>
    video?: { src: string; caption?: string }
  }
  /**
   * 包装翻译（dragon）：机制原名 → 玩家看到的包装 + 一句说明。
   */
  packagingMap?: {
    kicker?: string
    title?: string
    intro?: string
    rows: Array<{ from: string; to: string; note: string }>
  }
  /**
   * 复杂度地图 → 三道闸（pet 灵魂区）：先把复杂度摊开，再用三道闸（空间分区 / 骨架统一 / 渐进披露）逐层收纳。
   * 进入视口时复杂度碎片先铺开，三道闸随后依次点亮。
   */
  complexityGates?: {
    kicker?: string
    title?: string
    intro?: string
    /** 摊开的复杂度碎片（7 维提升 + 子页签），网页重画为 chips */
    load: string[]
    /** 三道闸：从宏观空间到微观操作逐层收纳 */
    gates: Array<{
      key: string
      /** 序号 一 / 二 / 三 */
      no: string
      /** 闸名，如「空间分区」 */
      label: string
      /** 一句心法，如「先回答『我在哪』」 */
      principle: string
      /** 怎么做 */
      how: string
    }>
  }
  /**
   * 方案抉择（pet 决策聚焦）：N 个候选信息架构方案，标注选用 / 未选用 + 理由，可接原型视频。
   */
  schemeChoice?: {
    kicker?: string
    title?: string
    intro?: string
    options: Array<{
      label: string
      src: string
      chosen?: boolean
      /** 「选用」/「未选用」 */
      verdict: string
      note: string
    }>
    video?: { src: string; caption?: string }
  }
  /**
   * 骨架拆解（pet）：单态 tour（无前后对比），证明所有子页共享同一「选幻兽 + 切 tab」骨架。
   */
  skeletonTour?: {
    kicker?: string
    title?: string
    intro?: string
    /** 恒定骨架示意条（如 幻兽列表 / 一级 tab / 功能操作区） */
    zones?: string[]
    tabs: Array<{
      key: string
      label: string
      summary: string
      src: string
      caption?: string
    }>
  }
  /**
   * 渐进披露细节（pet）：2-3 张截图 + 网页层标注，证明复杂度按需露出（字不画进图）。
   */
  progressiveReveal?: {
    kicker?: string
    title?: string
    intro?: string
    items: Array<{
      title: string
      body: string
      media: { src: string; caption?: string }
      /** 网页层标注（百分比定位 0-100，按需微调） */
      annotations?: Array<{ label: string; xPct: number; yPct: number }>
    }>
  }
  /**
   * 竞品范式扫描（diy 灵魂区前奏）：移动端点阵创作的两种操作范式，网页重画为范式卡（不放竞品截图）。
   */
  paradigmScan?: {
    kicker?: string
    title?: string
    intro?: string
    rivals: Array<{
      /** 竞品名，如「dotpict」 */
      name: string
      /** 范式名，如「双手模式」 */
      mode: string
      /** 持机手数 1/2，驱动 CSS 手机示意图的拇指数量 */
      hands: 1 | 2
      /** 竞品操作截图；存在时替代 CSS 手机示意图 */
      media?: { src: string; alt?: string }
      /** 一句定位，如「专业像素画玩家的主流选择」 */
      tagline: string
      traits: string[]
      /** 适合人群 */
      suits: string
    }>
    /** 扫描后的洞察结论（引出「一个开关兼容两端」） */
    insight: string
  }
  /**
   * 模式开关（diy 灵魂区）：页面内可交互的「单手 / 双手」开关，切换演示 GIF 与文案。
   * 与真实设计一致：默认单手、记住上次选择。
   */
  modeSwitch?: {
    kicker?: string
    title?: string
    intro?: string
    /** 开关旁的小注，如「默认单手 · 记住上次选择」 */
    defaultNote?: string
    modes: Array<{
      key: string
      label: string
      media: { src: string; caption?: string }
      points: string[]
      /** 该模式服务的人群标签 */
      suits: string
    }>
  }
  /**
   * 创作生态链（diy 结尾前）：创作 → 分享 → 交易 → 评比 的上线后生态。
   */
  ecosystem?: {
    kicker?: string
    title?: string
    intro?: string
    steps: Array<{
      /** 链路环节名，如「创作」 */
      label: string
      title: string
      body: string
      media: { src: string; caption?: string }
    }>
  }
  /**
   * 三层进化路线（aiux 蓝图）：L1 工具化 → L2 管线化 → L3 自适应，时间轴式逐层点亮。
   */
  evolutionLadder?: {
    kicker?: string
    title?: string
    intro?: string
    /** 「你在这里」标记落在第 hereAfter 层之后（0-based，层与层之间） */
    hereAfter?: number
    rungs: Array<{
      key: string
      /** 年代区间，如「2024 – 2026」 */
      era: string
      /** 层名，如「L1 工具化」 */
      label: string
      /** 一句论点 */
      thesis: string
      points: string[]
    }>
  }
  /**
   * 一源双环管线图（aiux 蓝图灵魂）：中心设计源 + 六环节节点 + 验证/反馈双环。
   * 点选环节显示详情卡（状态徽标 / 输入输出 / 资产 / 案例锚点），SVG+CSS 网页重绘。
   */
  pipelineMap?: {
    kicker?: string
    title?: string
    intro?: string
    /** 中心「设计源」节点 */
    core: { label: string; sub?: string }
    /** 两个闭环：验证环（上线前）/ 反馈环（上线后） */
    loops: Array<{ key: string; label: string; desc: string }>
    stations: Array<{
      key: string
      no: string
      label: string
      /** 状态：live=已落地（暖金）/ proto=原型（中性）/ plan=规划（虚线灰） */
      status: 'live' | 'proto' | 'plan'
      statusLabel: string
      /** 对应 skill / 资产名 */
      asset: string
      input: string
      output: string
      note: string
      /** 指向同项目其他案例的锚点，如「#figma2prefab」 */
      caseHref?: string
    }>
  }
  /** 横向流程条（aiux 通用）：编译管线 / 多 agent 工作流的步骤序列 */
  flowStrip?: {
    kicker?: string
    title?: string
    intro?: string
    steps: Array<{ label: string; sub?: string }>
    caption?: string
  }
  /** 命名规则 DSL 对照表（aiux 编译器）：节点名 → 编译产物 */
  dslTable?: {
    kicker?: string
    title?: string
    intro?: string
    rows: Array<{ rule: string; effect: string; note: string }>
    caption?: string
  }
  /**
   * 人机双读文档双视图（aiux 设计源灵魂）：同一份文档的「人读」与「机读」并排呈现。
   */
  docDuet?: {
    kicker?: string
    title?: string
    intro?: string
    doc: { title: string; source: string }
    human: { label: string; ascii: string; notes: string[] }
    machine: { label: string; table: { head: string[]; rows: string[][] }; notes: string[] }
  }
  /** 可交互清单墙（aiux 评审权）：分组展开的检查项清单 */
  checklistWall?: {
    kicker?: string
    title?: string
    intro?: string
    groups: Array<{ key: string; label: string; items: string[] }>
    note?: string
  }
  /** 多代理角色卡（aiux 需求验证）：agent 名册 + 实证产出摘录 */
  agentRoster?: {
    kicker?: string
    title?: string
    intro?: string
    agents: Array<{
      key: string
      /** 调用命令，如「/producer」 */
      cmd: string
      role: string
      duty: string
      /** true = 负责 review/整合 的收口角色，特殊样式 */
      loop?: boolean
    }>
    /** 实证产出摘录（网页重绘，不放截图） */
    artifact?: { title: string; meta: string; lines: string[] }
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
    cover?: { src: string; alt?: string; objectPosition?: string }
    /** 旧版（无 story）案例封面用：原型标签 + 一句话描述（对齐 story 版 hero 的语气） */
    archetype?: string
    blurb?: string
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
        id: 'ui-guidelines',
        title: '系统整理UI规范',
        highlights: ['统一视觉语言', '沉淀界面规则', '提升协作效率'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098435/1_qafivl.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098422/2_xnbckn.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098419/3_hatqyg.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098420/4_wlqjhy.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098418/5_unvnro.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098419/6_h7jw5d.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098415/7_j0ppwh.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781098416/8_fd69yp.png',
          },
        ],
        articleMDX: md`
![UI规范画板 01](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098435/1_qafivl.png)
![UI规范画板 02](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098422/2_xnbckn.png)
![UI规范画板 03](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098419/3_hatqyg.png)
![UI规范画板 04](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098420/4_wlqjhy.png)
![UI规范画板 05](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098418/5_unvnro.png)
![UI规范画板 06](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098419/6_h7jw5d.png)
![UI规范画板 07](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098415/7_j0ppwh.png)
![UI规范画板 08](https://res.cloudinary.com/dnhjgceru/image/upload/v1781098416/8_fd69yp.png)
        `,
      },
      {
        id: 'desktop-to-mobile',
        title: '端游转手游设计思路',
        highlights: ['端手游体验转译', '口袋版适配规范', '团队知识沉淀'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781253978/Frame_16_hh3dok.webp',
            caption: '端游转手游设计思路',
          },
        ],
        articleMDX: md`
经典端游紧跟手游时代推出口袋版。加入项目后，我的重要任务之一，是将既有端游页面重构为手游 UI；此后新系统也默认需要支持口袋版，因此我将实践经验总结为设计方法与规范，用于团队知识积累与分享。

![端游转手游设计思路](https://res.cloudinary.com/dnhjgceru/image/upload/v1781253978/Frame_16_hh3dok.webp)
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
        archetype: '交易体验 · 效率提升',
        blurb:
          '大话玩家高频使用的虚拟道具交易平台——通过筛选优化、搜索提效和算法推荐UI迭代，让玩家更快找到心仪道具，提升交易转化与平台收入。',
        cover: {
          src: '/illustrations/dahua2/cangbao-cover.png',
          alt: '藏宝阁优化',
        },
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
<blockquote>
  <h2>筛选与搜索优化</h2>
</blockquote>
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
<blockquote>
  <h2>算法推荐UI迭代</h2>
</blockquote>
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
<blockquote>
  <h2>交易流程优化</h2>
</blockquote>
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
        archetype: '消费体验 · 场景化设计',
        blurb:
          '游戏内核心消费商城——从传统列表式改为瀑布流布局，结合算法推荐与场景化设计，让玩家在浏览中发现更多心仪商品，提升商城转化效率。',
        cover: {
          src: '/illustrations/dahua2/duobao-cover.png',
          alt: '多宝阁优化',
        },
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
<blockquote>
  <h2>瀑布流布局设计</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468013/20251026-163907_swab87.gif"
/>
<blockquote>
  <h2>算法推荐与场景化</h2>
</blockquote>
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
        archetype: '经济系统 · 资源流通',
        blurb:
          'MMO核心经济系统的资源流通体验优化——梳理资源来源、获得反馈与消耗路径，让玩家对资源流转有清晰认知，提升经济系统的活跃度与健康度。',
        cover: {
          src: '/illustrations/dahua2/liutong-cover.png',
          alt: 'MMO资源流通优化',
        },
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761479819/Frame_1_2_ryapjb.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h2>资源流通全景</h2>
</blockquote>
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
        archetype: '社交传播 · 奖励展示',
        blurb:
          '高价值道具获得后的炫耀与分享场景——优化奖励展示视觉、简化分享流程，让玩家的成就感更容易传播到社交平台，提升游戏社交裂变效果。',
        cover: {
          src: '/illustrations/dahua2/gaojiazhi-cover.png',
          alt: '高价值奖励分享优化',
        },
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480721/0fd1d9aa-5c15-4b67-9b36-c9b1737990ba.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h2>奖励展示与分享流程</h2>
</blockquote>
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
        archetype: '社交体验 · 留存提升',
        blurb:
          'MMO核心社交系统体验优化——基于社会临场感理论重构回流玩法与社交细节，让玩家在游戏中感受到更真实的陪伴感，提升社交留存与活跃。',
        cover: {
          src: '/illustrations/dahua2/social-cover.png',
          alt: '社交优化',
        },
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
<blockquote>
  <h2>回流玩法迭代</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761489967/a524ec4f-2ddd-45f5-ba36-09862769cf80.png"
/>
<blockquote>
  <h2>社会临场感交互设计</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480652/fe4d09db-fe8a-418b-895b-aeaf70b6b4d4.png"
/>
<blockquote>
  <h2>社交细节优化</h2>
</blockquote>
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
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780995674/Group_22_1_z4u1jp.png',
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
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1780995684/Group_24_v0qcv7.png',
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
      {
        id: 'pet',
        title: '幻兽系统',
        highlights: ['复杂系统信息架构', '三道闸治理复杂度', '统一养成骨架 · 渐进披露'],
        archetype: '信息架构 · 复杂系统治理',
        blurb:
          '幻兽是圣境继花灵之后第一个大型复杂养成系统——7 维养成、6 个子页、还叠了孵化合成的随机性。我用「空间分区 / 骨架统一 / 渐进披露」三道闸把复杂度逐层收纳，让玩家第一次接触就学得会。',
        cover: {
          src: '/covers/pet-cover.png',
          alt: '幻兽系统封面 · 训练师与幻兽在悬浮花园',
          objectPosition: 'center',
        },
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163309/%E5%B9%BB%E5%85%BD_1%E4%B8%BB%E7%95%8C-a%E5%B8%B8%E8%A7%84%E9%9D%A2_1_compressed_x1nk95.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1781163309/%E5%B9%BB%E5%85%BD_1%E4%B8%BB%E7%95%8C-a%E5%B8%B8%E8%A7%84%E9%9D%A2_1_compressed_x1nk95.png"
/>
        `,
        story: {
          layout: 'pet',
          archetype: '信息架构 · 复杂系统治理',
          oneLiner:
            '幻兽是圣境继花灵之后第一个大型复杂养成系统——7 种提升维度、6 个功能子页，孵化与合成还叠了一层随机。最大的挑战不是把功能做全，而是让玩家在第一次接触时就「学得会、不被劝退」。我的解法：用三道闸把复杂度逐层收纳。',
          heroKicker: '7 维养成 × 6 个子页  →  一套学得会的骨架',
          heroImage: {
            src: '/covers/pet-cover.png',
            alt: '幻兽系统封面 · 训练师与幻兽在悬浮花园',
            objectPosition: 'center',
          },
          complexityGates: {
            kicker: '设计骨架 · 复杂度治理',
            title: '先把复杂度摊开，再用三道闸逐层收纳',
            intro:
              '幻兽天生就重：7 种提升维度散落在 6 个子页里，孵化合成又叠了一层随机。与其指望玩家一次记住，不如分层——从「我在哪」「怎么用」到「先看什么」，让复杂度永远只露出当下需要的那一层。',
            load: [
              '孵化',
              '升级',
              '升品 / 合成',
              '洗练',
              '被动技能镶嵌',
              '被动技能升级',
              '被动技能升品',
              '信息页',
              '技能页',
              '洗练页',
              '合成页',
              '法阵页',
              '跟随 / 森林',
            ],
            gates: [
              {
                key: 'zone',
                no: '一',
                label: '空间分区',
                principle: '先回答「我在哪」',
                how: '用「魔法屋」主场景把获取 / 养成 / 出战 / 陪伴切成 4 个去处——孵化在场景中心，养成、法阵、森林各占一角。首屏只需理解 4 个入口，不直面 7 维细节。',
              },
              {
                key: 'skeleton',
                no: '二',
                label: '骨架统一',
                principle: '再回答「怎么用」',
                how: '所有养成子页统一成「左侧选幻兽 + 顶部切一级 tab」的同一结构：信息、技能、洗练、合成共用一套幻兽列表与筛选规则，切 tab 不丢选中。玩家只学一次导航，就能走通全部维度。',
              },
              {
                key: 'reveal',
                no: '三',
                label: '渐进披露',
                principle: '最后回答「先看什么」',
                how: '复杂度跟着成长解锁——技能槽随品质从虚框→锁→可镶嵌逐步开放，升满当前品质即隐藏升级、原地抛出「前往合成」的下一步。任何时刻，界面只露出玩家此刻够得着的那一层。',
              },
            ],
          },
          schemeChoice: {
            kicker: '关键决策 · 孵化养成空间',
            title: '两版信息架构里，为什么选方案一',
            intro:
              '养成子页怎么从主场景展开，直接决定玩家的认知成本。我出了两版方案，差别就在「骨架统一」这道闸落得够不够实。',
            options: [
              {
                label: '方案一',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163519/%E6%96%B9%E6%A1%88%E4%B8%80_ntgzih.png',
                chosen: true,
                verdict: '选用',
                note: '养成统一收进「升级 / 技能 / 洗练 / 合成 / 分解」一级 tab 切换：一个稳定骨架承载全部维度，玩家学一次导航走通全程。这版把「骨架统一」这道闸落到了实处。',
              },
              {
                label: '方案二',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163517/%E6%96%B9%E6%A1%88%E4%BA%8C_retyb8.png',
                verdict: '未选用',
                note: '各功能从主场景发散成独立页面，入口多、层级浅但分散——玩家每进一个功能都要重新建立心智，复杂度被「摊平」却没被「收纳」。',
              },
            ],
            video: {
              src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1781163717/pet-demo_compressed_pyx5ne.mp4',
              caption: '据方案一搭建的可交互原型（UE）',
            },
          },
          skeletonTour: {
            kicker: '骨架统一 · 逐页验证',
            title: '切一级 tab，选中的幻兽始终不变',
            intro:
              '所有养成子页共用同一套版式：左侧幻兽列表、中间当前幻兽模型、右侧属性与成长区。关键在于——切换顶部一级 tab 时，左侧选中的幻兽不变、中间模型不变，只有右侧内容随功能切换。玩家不必反复重选、重新定位，养成体验始终连贯流畅。',
            zones: ['幻兽列表 · 选中不变', '幻兽模型 · 恒定居中', '属性 / 成长 · 随 tab 切换'],
            tabs: [
              {
                key: 'info',
                label: '信息 & 升级',
                summary: '幻兽基础信息 + 升级托底：等级、资质、基础属性一屏读完，升满即引导去合成升阶。',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163303/pet-info_qvnm7a.png',
                caption: '信息 & 升级 · 左列表 / 中模型 / 右属性',
              },
              {
                key: 'skill',
                label: '技能',
                summary: '1 主动 + N 被动槽位，槽位随品质开放；镶嵌、升级、升星都在这一页内完成。',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163309/pet-skill_llpmbr.png',
                caption: '技能 · 槽位三态随品质开放',
              },
              {
                key: 'refine',
                label: '洗练',
                summary: '随机刷新附加属性，玩家可保留或放弃——给随机留一个反悔权。',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163300/pet-refine_nsa3jk.png',
                caption: '洗练 · 基础资质进度条',
              },
              {
                key: 'synthesis',
                label: '合成',
                summary: '主副幻兽合成升阶，可锁定被动技能不被合成吞掉；同种族绿箭头提示额外槽位概率。',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163302/pet-synthesis_e1o60v.png',
                caption: '合成 · 主副幻兽 + 锁定技能',
              },
              {
                key: 'formation',
                label: '法阵',
                summary: '12 宫格上阵出战，幻兽列表与排序规则与养成页完全一致。',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163309/pet-formation_qnvigt.png',
                caption: '法阵 · 12 宫格上阵',
              },
            ],
          },
          progressiveReveal: {
            kicker: '渐进披露 · 细节实证',
            title: '复杂度按需露出，而不是一次砸给玩家',
            intro:
              '同一个界面，对新手和老手露出的信息量不该一样。三个细节，落实「先看什么」这道闸。',
            items: [
              {
                title: '技能槽位随品质开放',
                body:
                  '未开放的槽位在任何界面都不显示，随品质成长才依次出现：虚框（未开放）→ 锁（未解锁）→ + 号（可镶嵌）。新手不会一上来就被一排空槽劝退，槽位本身成了成长的可视进度。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163309/pet-skill_llpmbr.png',
                  caption: '技能页 · 右侧被动槽位随品质开放',
                },
                annotations: [{ label: '随品质开放的槽位', xPct: 78, yPct: 42 }],
              },
              {
                title: '孵化概率显式化',
                body:
                  '孵化结果的属性倾向（如 50% 攻击 / 50% 防御）与暴击概率直接写在界面上，把一堆随机参数组织成「看得懂的赔率」，而不是黑箱抽取——随机也要可读。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163303/pet-hatch-odds_gvc1wh.png',
                  caption: '孵化 · 概率与属性倾向显式标注',
                },
                annotations: [{ label: '概率显式标注', xPct: 50, yPct: 86 }],
              },
              {
                title: '升满即抛出下一步',
                body:
                  '幻兽达到当前品质等级上限时，升级模块隐藏，原地换成「前往合成」的跳转——界面主动告诉玩家「这条路走到头了，下一步去哪」，而不是让人自己找。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781163303/pet-info_qvnm7a.png',
                  caption: '信息页 · 升满后引导前往合成',
                },
                annotations: [{ label: '升满 → 前往合成', xPct: 84, yPct: 88 }],
              },
            ],
          },
          liveResult: {
            kicker: '正式落地 · 线上实装',
            title: '正式落地效果',
            body: '系统已于 10.24 / 10.31 两个版本陆续上线正式服。下方为线上实装的孵化与养成流程。',
            media: {
              type: 'video',
              src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1781164098/%E6%AD%A3%E5%BC%8F%E8%90%BD%E5%9C%B0%E6%95%88%E6%9E%9C_compressed_gvavu8.mp4',
              caption: '正式落地 · 幻兽孵化与养成（线上实装）',
            },
          },
          metrics: [
            {
              value: '+55.8%',
              label: '上线后三个月，MAU 增长约 55.8%',
              meta: [
                { k: '周期', v: '幻兽上线后 3 个月 vs 上线前' },
                { k: '口径', v: '游戏整体 MAU；幻兽为该期主推内容之一' },
              ],
            },
            {
              value: '+32.1%',
              label: '同期收入增长约 32.1%',
              meta: [
                { k: '周期', v: '幻兽上线后 3 个月' },
                { k: '口径', v: '游戏整体收入，非幻兽单独归因' },
              ],
            },
          ],
          reflection: {
            title: '如果重来',
            body:
              '复杂度治理目前靠 MAU / 收入 的宏观增长佐证，但这些数字混入了同期活动、买量等多重因素，并不能直接证明「劝退率真的降了」。若能补一轮新手漏斗或专门的易用性量化，对「玩家学得会」这个核心命题会更有说服力。',
          },
        },
      },
      {
        id: 'dragon',
        title: '龙养成系统',
        highlights: ['养成弧线框架', '模型镜头切换包装', '三页信息架构'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145052/%E5%B0%81%E9%9D%A2_r6rbat.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145333/ui_%E5%B7%A8%E9%BE%99%E7%A0%94%E7%A9%B6%E6%89%80_%E5%BC%BA%E5%8C%96%E7%95%8C%E9%9D%A2.png_liwitr.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145050/%E9%BE%99%E9%B3%9E%E9%99%84%E9%AD%94_q4egs9.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145051/%E9%BE%99%E9%AD%82%E8%A7%89%E9%86%92_yvxnuc.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1781145052/%E5%B0%81%E9%9D%A2_r6rbat.png"
/>
        `,
        story: {
          layout: 'dragon',
          archetype: '系统设计 · 体验包装',
          oneLiner:
            '从 0 到 1 设计一套层层递进的巨龙养成系统——把 4 条冷冰冰的数值强化线，包装成「养一条会进化的龙」：研究、附魔、龙魂逐级抬升，每一层都有看得见的情感与付费深度。',
          heroKicker: '4 条数值强化线  →  一条会进化的龙',
          heroImage: {
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145052/%E5%B0%81%E9%9D%A2_r6rbat.png',
            alt: '巨龙研究所龙养成系统主界面，龙模型居中、四元素四部位环绕',
            objectPosition: 'center',
          },
          background: {
            kicker: '需求背景',
            title: '为什么是龙——一条新的核心养成线',
            body:
              '花灵、宠物等既有成长线逐渐趋于饱和，长线营收需要新的承载；与此同时，「龙」主题的买量素材在数据上反馈良好。项目据此决定推出一条全新的核心养成线，并用「龙」作为主题包装来承载这套复杂的数值养成。',
            roleLabel: '我负责',
            roles: ['复杂数值养成的包装转化', '核心交互框架搭建', '概念原型快速搭建'],
          },
          cultivationArc: {
            kicker: '数值养成翻译 · 设计骨架',
            title: '把数值养成，翻译成一条会进化的龙',
            intro:
              '同一条投放主线，从日常陪伴一路抬升到终极信仰——机制越深，玩家的情感与付费深度同步递增。突破、共鸣作为「研究」层内的节奏点，不单独占据玩家心智。',
            stages: [
              {
                key: 'research',
                mechanic: '强化',
                label: '巨龙研究',
                emotion: '日常陪伴',
                tier: '日常产出',
                tierLevel: 1,
              },
              {
                key: 'enchant',
                mechanic: '刻印',
                label: '龙鳞附魔',
                emotion: '个性深化',
                tier: '元素龙 / 付费',
                tierLevel: 2,
              },
              {
                key: 'soul',
                mechanic: '龙魂',
                label: '龙魂觉醒',
                emotion: '终极信仰',
                tier: '付费产出',
                tierLevel: 3,
              },
            ],
          },
          lensSwitch: {
            kicker: '主线亮点 · 包装提案',
            title: '不新增美术，用「镜头切换」把一个龙模型讲成一台演出',
            body:
              '深度养成最怕变成一张数值表。我提出复用已有的龙模型资产，在研究界面里随玩家切换「部位 / 元素」联动镜头与特写——切到翼研究就推近龙翼，切到火元素就染上火光。零额外建模成本，却让每一次强化都有「我在养这条龙」的实感。下方是据此搭建的可交互原型。',
            frames: [
              {
                label: '强化界面',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145333/ui_%E5%B7%A8%E9%BE%99%E7%A0%94%E7%A9%B6%E6%89%80_%E5%BC%BA%E5%8C%96%E7%95%8C%E9%9D%A2.png_liwitr.png',
                caption: '研究主界面 · 龙模型居中，右侧四部位 / 四元素',
              },
              {
                label: '切换部位',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145049/%E7%A0%94%E7%A9%B62_e8azkj.png',
                caption: '切换部位 · 镜头推近对应的龙身体部位',
              },
              {
                label: '切换元素',
                src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781145050/%E7%A0%94%E7%A9%B63_kwu97x.png',
                caption: '切换元素 · 模型与特效染上对应元素色',
              },
            ],
            video: {
              src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1781145393/UE%E5%8F%AF%E4%BA%A4%E4%BA%92%E5%8E%9F%E5%9E%8B%E7%A4%BA%E6%84%8F2_compressed_pzyfvg.mp4',
              caption: '可交互原型 · 镜头随部位 / 元素切换（UE 搭建）',
            },
          },
          packagingMap: {
            intro:
              '同一套底层机制，给玩家的是另一套词汇与体感。包装不是换皮，是为每个抽象动作找到对应的情感锚点。',
            rows: [
              { from: '强化（刷数值）', to: '巨龙研究', note: '「刷数值」讲成「研究巨龙」，4 条线对应 4 种元素' },
              { from: '每 10 级一突破', to: '龙的部位', note: '强化进度映射到龙的翼 / 骨 / 角，养的是「龙的身体」' },
              { from: '刻印', to: '龙鳞附魔', note: '抽象的刻印，落到「给龙鳞附魔」，升阶时形体进化' },
              { from: '高阶数值', to: '龙魂觉醒', note: '顶端付费层包装成「唤醒龙魂」，换名换形换定位' },
            ],
          },
          liveResult: {
            kicker: '正式落地 · 线上实装',
            title: '正式落地效果',
            body: '系统已正式上线。下方为线上实装的养成与演出效果。',
            media: {
              type: 'video',
              src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1781145574/%E6%AD%A3%E5%BC%8F%E8%90%BD%E5%9C%B0%E6%95%88%E6%9E%9C_compressed_o0y8wj.mp4',
              caption: '正式落地 · 龙养成系统（线上实装）',
            },
          },
          metrics: [
            {
              value: '已上线',
              label: '系统完整落地于圣境 1.48–1.49 版本',
              meta: [
                { k: '范围', v: '研究 / 龙鳞附魔 / 龙魂觉醒 三大养成页' },
                { k: '状态', v: '线上实装' },
              ],
            },
            {
              value: '0 新增建模',
              label: '镜头切换包装复用既有龙模型资产',
              meta: [
                { k: '成本', v: '仅镜头 / 特写调度，无额外美术' },
                { k: '口径', v: '设计事实 · 非线上指标' },
              ],
            },
          ],
        },
      },
      {
        id: 'diyfashion',
        title: 'DIY 时装编辑器',
        highlights: ['单/双手模式一键切换', '竞品双范式兼容', '创作-分享-交易生态'],
        archetype: '交互创新 · 模式兼容',
        media: [
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184532/%E5%8D%95%E6%89%8B%E6%A8%A1%E5%BC%8F_olbuf5.gif',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1781184431/%E7%8E%A9%E5%AE%B6%E4%BD%9C%E5%93%81_njpqu3.webp"
/>
        `,
        story: {
          layout: 'diy',
          archetype: '交互创新 · 模式兼容',
          oneLiner:
            'DIY 时装让玩家在游戏里亲手画出自己的像素时装。移动端点阵创作长期分裂成两种操作范式——单手直觉、双手精准，各自服务一类人也各自放弃另一类人。我的解法是不做选择题：用一个开关让两种模式在同一块画板上共存，默认单手降低门槛，双手承接硬核创作者。',
          heroKicker: '单手直觉 × 双手精准  →  一个开关',
          heroImage: {
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184431/%E7%8E%A9%E5%AE%B6%E4%BD%9C%E5%93%81_njpqu3.webp',
            alt: 'DIY 时装玩家作品 · 像素时装创作界面',
            objectPosition: 'center',
          },
          paradigmScan: {
            kicker: '竞品研究 · 两种范式',
            title: '移动端点阵创作，分裂成两种操作范式',
            intro:
              '动手前我拆了移动端主流点阵图产品：操作方式清晰地分成两派。dotpict 是专业像素画玩家的主流选择，双手模式的代表；8bit 走极简风格、上手最快，单手模式的代表。',
            rivals: [
              {
                name: '8bit 画板',
                mode: '单手模式',
                hands: 1,
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781234093/8bit1_rz2bhi.png',
                  alt: '8bit 画板单手操作界面',
                },
                tagline: '极简风格 · 上手最快',
                traits: [
                  '手指点哪画哪，符合触屏交互直觉',
                  '单手竖持即可创作，零学习成本',
                  '指尖遮挡画布，难以做像素级精修',
                ],
                suits: '新手与随手创作的泛用户',
              },
              {
                name: 'dotpict',
                mode: '双手模式',
                hands: 2,
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781233737/dotpict_1_q8dwb0.png',
                  alt: 'dotpict 双手操作界面',
                },
                tagline: '专业像素画玩家的主流选择',
                traits: [
                  '一手移动光标、一手按键落点',
                  '光标与落点分离，指尖不挡画布',
                  '需要双手横持，学习成本更高',
                ],
                suits: '追求像素级精细度的专业爱好者',
              },
            ],
            insight:
              '两派各占一端：单手赢在直觉，双手赢在精准。而游戏内的 DIY 时装要同时面对泛用户与硬核创作者——与其替玩家二选一，不如用一个开关兼容两端。',
          },
          modeSwitch: {
            kicker: '核心创新 · 模式开关',
            title: '一个开关，让两种范式在同一块画板上共存',
            intro:
              '画板内置「单手 / 双手」开关：单手模式点哪画哪，双手模式光标与落点分离。开关会记住玩家上次的选择，默认单手——希望更多泛用户能先画起来，再按需要长成双手高手。',
            defaultNote: '默认单手 · 记住上次选择（下面这个开关也会记住你的选择）',
            modes: [
              {
                key: 'one',
                label: '单手模式',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184532/%E5%8D%95%E6%89%8B%E6%A8%A1%E5%BC%8F_olbuf5.gif',
                  caption: '单手模式 · 点哪画哪，符合触屏直觉',
                },
                points: [
                  '手指点哪画哪，符合触屏交互直觉',
                  '单手竖持随时随地画两笔，零学习成本',
                  '新手第一次进画板就能直接产出',
                ],
                suits: '默认模式 · 新手与泛用户',
              },
              {
                key: 'two',
                label: '双手模式',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184541/%E5%8F%8C%E6%89%8B%E6%A8%A1%E5%BC%8F_v05kyp.gif',
                  caption: '双手模式 · 光标与落点分离，像素级精准',
                },
                points: [
                  '一手移动光标、一手按键落点，指尖不挡画布',
                  '光标微调 + 连续落点，做到像素级精准',
                  '对齐专业点阵工具的操作上限',
                ],
                suits: '进阶模式 · 像素画专业爱好者',
              },
            ],
          },
          oneTap: {
            kicker: '专业度托底 · 画板全景',
            title: '不止一个开关：一块功能完整的像素画板',
            body:
              '模式开关解决「怎么落笔」，画板本身还要托住创作上限：取色、填充、撤销、网格缩放等工具一应俱全，让双手模式的精准有用武之地。',
            media: {
              type: 'gif',
              src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184569/%E8%AF%A6%E7%BB%86%E7%94%BB%E6%9D%BF%E9%9D%A2%E6%9D%BF_qsu1yy.gif',
              caption: '详细画板面板 · 完整创作工具链',
            },
          },
          ecosystem: {
            kicker: '上线之后 · 创作生态',
            title: '从一块画板，长出「创作 → 分享 → 交易 → 评比」的生态链',
            intro:
              '功能推出后玩家讨论度高，社区涌现大量精妙作品。我们顺势补全生态：让作品被看见、可流通、有舞台。',
            steps: [
              {
                label: '创作',
                title: '玩家作品',
                body: '默认单手压低门槛、双手抬高上限，泛用户和高手都画得出自己的时装。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184431/%E7%8E%A9%E5%AE%B6%E4%BD%9C%E5%93%81_njpqu3.webp',
                  caption: '玩家实操界面 · 像素时装创作',
                },
              },
              {
                label: '分享',
                title: '社区分享',
                body: '高手在社区分享精妙作品与画法，作品本身成了最好的传播素材。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184432/%E7%A4%BE%E5%8C%BA%E5%88%86%E4%BA%AB_l8063a.webp',
                  caption: '社区分享 · 玩家作品讨论',
                },
              },
              {
                label: '交易',
                title: 'DIY 时装交易平台',
                body: '配套推出游戏内 DIY 时装交易平台，优秀作品可以流通，创作者获得回报。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184432/DIY%E5%B8%82%E5%9C%BA%E4%BA%A4%E6%98%93_oext3x.webp',
                  caption: 'DIY 市场 · 时装交易',
                },
              },
              {
                label: '评比',
                title: '定期时装评比',
                body: '官方定期主办 DIY 时装评比，给创作者持续的舞台与目标。',
                media: {
                  src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781184432/%E5%AE%9A%E6%9C%9FDIY%E6%97%B6%E8%A3%85%E8%AF%84%E6%AF%94_fd6y6v.webp',
                  caption: '定期 DIY 时装评比',
                },
              },
            ],
          },
          metrics: [
            {
              value: '默认单手',
              label: '开关记忆上次选择，泛用户零门槛上手',
              meta: [
                { k: '口径', v: '设计事实 · 非线上指标' },
                { k: '取舍', v: '默认值偏向泛用户，双手一键可达' },
              ],
            },
            {
              value: '高讨论度',
              label: '功能推出后社区讨论度高，高手持续分享精妙作品',
              meta: [
                { k: '口径', v: '上线后社区反馈 · 定性，无量化埋点' },
              ],
            },
            {
              value: '生态成型',
              label: '后续推出游戏内 DIY 时装交易平台与定期评比',
              meta: [
                { k: '范围', v: '创作 → 分享 → 交易 → 评比' },
                { k: '状态', v: '线上持续运营' },
              ],
            },
          ],
          reflection: {
            title: '如果重来',
            body:
              '模式开关上线时没有埋「单/双手使用比例与切换率」的点——这两个数字最能验证「默认单手降门槛、双手承接硬核」的判断是否成立。若能补上，还可以基于使用数据为两种模式做差异化引导与教学。',
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
        archetype: '操作体验 · 易用性量化',
        blurb:
          '横屏战斗里技能轮盘是最高频的操作区——以费茨定律重排技能键位、贴合拇指热区，并把易用性沉淀成可量化的规则，让出招更跟手、误触更少。',
        cover: {
          src: '/illustrations/shengjing/skillcircle-cover.jpg',
          alt: '技能轮盘迭代',
        },
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
  <h2>迭代前后</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1780999700/20260609-180726_ox1a8t.gif"
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
  {
    slug: 'ai-ux',
    title: 'AI First UX',
    subtitle: 'AI First 工作流 · 探索性项目',
    role: '发起人 / 全流程设计与开发',
    period: '2025至今',
    platform: ['Claude Code', 'Unity', 'Figma'],
    kpis: [{ label: '六环节', value: '3 项已有可运行资产' }],
    cover: '/covers/ai-ux-cover.png',
    tags: ['AI 工作流', '设计工程化'],
    summary:
      '一项关于「未来五年游戏 UX 工作方式」的个人探索。我没有按环节收集 AI 工具，而是先画了一张地图——「一源双环」：设计意图成为唯一的源，上线前的 agent 仿真与上线后的玩家反馈构成两个闭环。地图上的六个环节，我已经亲手走出三步：人机双读的设计文档 skill、46 条可执行的评审清单、把 Figma 设计稿直接编译成 Unity UI Prefab 的管线。',
    cases: [
      {
        id: 'blueprint',
        title: 'AI First UX 流程蓝图',
        highlights: ['一源双环框架', '三层进化路线', '六环节诚实状态'],
        media: [],
        articleMDX: md`蓝图案例由结构化叙事渲染。`,
        story: {
          layout: 'aiux',
          archetype: '工作流设计 · 未来推演',
          oneLiner:
            '与其按环节收集 AI 工具，不如先回答一个问题：五年后游戏 UX 的工作方式是什么样？我的推演是「一源双环」——设计意图成为唯一的源，上线前的 agent 仿真验证与上线后的玩家反馈回流构成两个闭环。六个流程环节挂在这张图上，每一个都诚实标注：已落地、原型，还是规划。',
          heroKicker: '工具目录 → 一张地图 + 已走出的三步',
          evolutionLadder: {
            kicker: '路线推演 · 三层进化',
            title: '从工具化到自适应：UX 工作方式的三层进化',
            intro:
              'AI 进入 UX 流程不是一次性的，而是三层递进——每一层改变的不只是效率，而是设计师工作的对象本身。',
            hereAfter: 0,
            rungs: [
              {
                key: 'l1',
                era: '2024 – 2026',
                label: 'L1 工具化',
                thesis: '每个环节有专属 AI 工具，人是流水线的粘合剂',
                points: [
                  'skill 接管单点产出：写文档、做评审、转 prefab',
                  '效率提升，但设计意图仍在每次转换中损耗',
                  '本项目的三项已落地资产都诞生在这一层',
                ],
              },
              {
                key: 'l2',
                era: '2026 – 2029',
                label: 'L2 管线化 · 设计即源码',
                thesis: '设计意图成为唯一的「源」，交付物都是它的编译产物',
                points: [
                  '人机双读的设计源：同一份文档同时服务人与 AI',
                  '交互稿、规则文档、prefab 由设计源编译生成，需求一变全链路自动 diff',
                  'Handoff 消失，评审权成为设计师的核心岗位价值',
                ],
              },
              {
                key: 'l3',
                era: '2029 – 2031+',
                label: 'L3 自适应 · 活的 UX',
                thesis: '界面不再是静态交付物，而在设计师定义的约束内按玩家实时重组',
                points: [
                  '上线前：千级 persona agent（新手 / 老手 / 付费 / 弱网 / 单手）先把原型「玩」一遍',
                  '上线后：社区与埋点自动映射回设计源节点，生成修改提案进入同一条评审管线',
                  '设计师设计的不是界面，是界面的生成规则与边界',
                ],
              },
            ],
          },
          pipelineMap: {
            kicker: '框架 · 一源双环',
            title: '一个设计源，两个闭环，六个环节',
            intro: '点击环节查看：它在回路里的位置、对应的资产、以及当前的真实状态。',
            core: { label: '设计源', sub: '人机双读的设计意图' },
            loops: [
              { key: 'verify', label: '验证环', desc: '上线前 · agent 仿真先于真人测试' },
              { key: 'feedback', label: '反馈环', desc: '上线后 · 社区与数据回流设计源' },
            ],
            stations: [
              {
                key: 'req',
                no: '01',
                label: '需求理解',
                status: 'proto',
                statusLabel: '原型',
                asset: 'VibeGame Studio 多代理',
                input: '模糊的玩法想法',
                output: '玩法支柱 + 系统架构 + 完整策划案',
                note: '制作人 / 系统 / 世界观 / 数值 / 战斗 5 个 agent 协作，producer 负责 review 与整合。',
                caseHref: '#agent-studio',
              },
              {
                key: 'draft',
                no: '02',
                label: '方案生成',
                status: 'plan',
                statusLabel: '规划',
                asset: '交互稿生成 skill',
                input: '需求 + 设计源约束',
                output: '可评审的多方案交互稿',
                note: '目标：从设计源直接生成多方案交互稿——人来挑，而不是人来画。',
              },
              {
                key: 'spec',
                no: '03',
                label: '规则沉淀',
                status: 'live',
                statusLabel: '已落地',
                asset: 'game-ui-doc skill',
                input: '交互方案',
                output: '人机双读的交互规则文档',
                note: '自然语言 + 结构化表格的八节结构，人能顺着读、AI 能直接解析——设计源的雏形。',
                caseHref: '#design-source',
              },
              {
                key: 'review',
                no: '04',
                label: '设计评审',
                status: 'live',
                statusLabel: '已落地',
                asset: 'UE Checklist（46 条）',
                input: '规则文档',
                output: '逐条核对的评审结论',
                note: '六大类 46 条可执行检查项：AI 按条预审、人终审——评审权的工程化。',
                caseHref: '#design-source',
              },
              {
                key: 'build',
                no: '05',
                label: '编译交付',
                status: 'live',
                statusLabel: '已落地',
                asset: 'FigmaToPrefab + fast_ui',
                input: 'Figma 设计稿（按命名 DSL）',
                output: 'Unity UI Prefab',
                note: '设计稿即源码：右键一步把 Figma JSON 编译成挂好组件的可运行 prefab，落地最深的一环。',
                caseHref: '#figma2prefab',
              },
              {
                key: 'loopback',
                no: '06',
                label: '反馈回路',
                status: 'plan',
                statusLabel: '规划',
                asset: '社群反馈提炼 skill',
                input: '社区舆情 + 埋点数据',
                output: '映射回设计源节点的修改提案',
                note: '目标：每条差评都能定位到具体界面与规则，修改提案进入同一条评审管线。',
              },
            ],
          },
          metrics: [
            {
              value: '3 / 6',
              label: '六个环节中，三个已有可运行资产',
              meta: [
                { k: '口径', v: '设计事实 · 以可运行代码 / skill 为准' },
                { k: '范围', v: '规则沉淀 / 设计评审 / 编译交付' },
              ],
            },
            {
              value: 'L1 → L2',
              label: '当前位置：工具化已验证，正向「设计即源码」过渡',
              meta: [{ k: '口径', v: '自评 · 按三层进化框架' }],
            },
          ],
          reflection: {
            title: '框架是推演，不是预言',
            body:
              '三层进化的年份基于当前模型能力曲线推演，需要按年校准。「一源双环」的价值不在预测准确，而在它给每个新工具一个明确的位置——接到图上哪个环节、推进哪一层，避免为了用 AI 而用 AI。',
          },
        },
      },
      {
        id: 'figma2prefab',
        title: '设计编译器：Figma → UI Prefab',
        highlights: ['设计稿即源码', '命名规则 DSL', '一步编译交付'],
        media: [],
        articleMDX: md`设计编译器案例由结构化叙事渲染。`,
        story: {
          layout: 'aiux',
          archetype: '设计工程化 · 编译交付',
          oneLiner:
            '传统交付里，交互稿到引擎之间隔着切图、拼 prefab、对坐标的人肉流水线——每一步都在损耗设计意图。我做了一个「设计编译器」：设计师在 Figma 里按一套命名 DSL 作图，右键一步把 Figma JSON 编译成挂好组件、绑好资源的 Unity UI Prefab。这是「设计即源码」最重的一块实证。',
          heroKicker: '设计稿不再被「实现」，而是被「编译」',
          flowStrip: {
            kicker: '管线 · 五步编译',
            title: '从 Figma JSON 到可运行 Prefab',
            intro: 'Unity 编辑器内右键触发，整条管线全自动：',
            steps: [
              { label: 'Figma JSON', sub: '设计稿原始数据' },
              { label: 'TreeParser', sub: '解析节点树' },
              { label: 'Normalizer', sub: '坐标归一 1920×1080' },
              { label: 'ComponentMapper', sub: '命名 DSL → 组件' },
              { label: 'PrefabGenerator', sub: '生成 + 资源绑定' },
              { label: 'UI Prefab', sub: '挂好组件可运行' },
            ],
            caption: '生成过程的中间产物自动清理；一份 JSON 含多个 Frame 时自动拆分为多个 prefab',
          },
          dslTable: {
            kicker: '核心设计 · 命名规则 DSL',
            title: '让节点名成为「带类型的代码」',
            intro:
              '编译器的关键不在解析，而在约定：一套设计师写得顺手、机器读得懂的命名 DSL。节点叫什么，就编译成什么。',
            rows: [
              { rule: 'equip_list', effect: 'ScrollRect + List + 复用池', note: '第一个子节点自动抽成 item 模板 prefab，运行时动态创建' },
              { rule: 'quality_tab', effect: 'ToggleGroup + Toggle', note: 'item 里的 select 层自动接管选中态显隐' },
              { rule: 'shop_tablist', effect: '动态列表 × 页签组合', note: '列表 item 模板自动带 Toggle 与选中态' },
              { rule: 'btn_play', effect: 'Button + ButtonScale', note: 'btn_ 前缀即按钮，自带按压缩放反馈' },
              { rule: 'icon|atlas/common/icon_coin', effect: 'Image + sprite 绑定', note: '竖线后的图集路径直接写入 _sprite_id' },
              { rule: 'btn_hecheng:btn_blue1', effect: '替换为项目共享 prefab', note: '冒号引用共享样式，保证全局组件一致性' },
              { rule: 'safe_area_ignore', effect: '不进入 prefab', note: '标注、参考线等制作辅助层在编译期剔除' },
            ],
            caption: '完整规则沉淀为 figma-to-prefab-rules.md——设计师与编译器的共同契约',
          },
          oneTap: {
            kicker: '跑通样例',
            title: '右键「Figma 转 Prefab」，列表、页签、按钮直接可玩',
            body:
              '配套洁净重写的 fast_ui 运行时（CanvasRenderer 自绘 + 自研输入 + 复用列表），编译产物开箱即用：按钮可点、列表可滚、页签可切。',
            media: {
              type: 'image',
              src: '/covers/ai-ux-cover.png',
              caption: '跑通样例截图 · 待替换（当前为占位图）',
            },
          },
          reflection: {
            title: '边界与下一步',
            body:
              '当前不还原描边、阴影、多层 fill 等视觉效果，复杂表现仍需手工补；规则也要求设计师改变命名习惯——这正是「设计即源码」的真实代价：编译器越强，设计规范就越像代码规范。下一步是把规则文档喂给 AI，在 Figma 阶段就自动检查命名合规。',
          },
        },
      },
      {
        id: 'design-source',
        title: '人机双读的设计源',
        highlights: ['自然语言+结构化表格', 'UE Checklist 46 条', 'AI 预审 · 人终审'],
        media: [],
        articleMDX: md`设计源案例由结构化叙事渲染。`,
        story: {
          layout: 'aiux',
          archetype: '设计基建 · 文档工程化',
          oneLiner:
            '当 AI 开始消费设计文档，文档就不再只写给人看。game-ui-doc skill 约定了一种「人机双读」的文档格式：自然语言讲意图，结构化表格讲规则——同一份文档，人能顺着读，AI 能直接解析去写代码。这就是「设计源」的雏形；配套的 UE Checklist 把评审经验沉淀成 46 条可执行检查项。',
          heroKicker: '一份文档，两种读者',
          docDuet: {
            kicker: '核心约定 · 人机双读',
            title: '同一份文档，人读意图，机读规则',
            intro:
              '以 skill 内置的真实示例「房间图纸列表」为例——左边是给人读的布局与意图，右边是给 AI 读的状态规则表，出自同一份 markdown。',
            doc: { title: '房间图纸列表 · 交互文档', source: 'game-ui-doc skill 内置示例（节选）' },
            human: {
              label: '人读 · 布局与意图',
              ascii: [
                '┌──────────────────┐',
                '│  [红/蓝/紫/金]    │ ← 品质色块',
                '│     ▓▓▓          │',
                '│    ▓▓▓▓▓         │ ← 建筑图标',
                '│   200            │ ← 所需建造点',
                '│   石头房子        │ ← 建筑名称',
                '│   已建设:0/3      │ ← 数量/上限',
                '└──────────────────┘',
              ].join('\n'),
              notes: [
                '布局用 ASCII 画，意图用中文讲',
                '排序规则必须带例子：先按 ID 排，再按品质倒序',
                '边界情况单独成节：空列表、建造点实时刷新',
              ],
            },
            machine: {
              label: '机读 · 状态规则表',
              table: {
                head: ['状态', '触发条件', '卡片表现'],
                rows: [
                  ['可建造', '建造点够 且 图纸够 且 未达上限', '正常显示品质色块'],
                  ['已达上限', '已建造 = 最大可造', '灰色遮罩 +「不可建造」'],
                  ['建造点不足', '当前建造点 < 所需', '灰色遮罩 +「不可建造」'],
                  ['图纸不足', '拥有图纸 = 0', '灰色遮罩 +「不可建造」'],
                ],
              },
              notes: [
                '「条件 → 表现」的映射可被 AI 直接转成代码分支',
                '数据需求列成字段清单，程序与 AI 都不用猜',
                '禁止伪代码与 interface——表格比代码更不易歧义',
              ],
            },
          },
          checklistWall: {
            kicker: '评审权 · 工程化',
            title: '把交互评审沉淀成 46 条可执行检查',
            intro:
              '评审经验最怕只活在资深设计师的脑子里。UE Checklist 把它拆成六大类 46 条——AI 按条预审、标出缺失项，人把精力留给真正需要品味的判断。点击分类查看条目。',
            groups: [
              {
                key: 'goal',
                label: '需求确认',
                items: ['策划目标：想实现什么成果', '玩家目标：玩家为什么要用', '体验目标：营造怎样的体验与优先级'],
              },
              {
                key: 'ia',
                label: '信息架构',
                items: [
                  '架构是否易理解（熟悉的结构与布局）',
                  '信息层级是否清晰（主次 / 从属）',
                  '信息分类是否有逻辑',
                  '5 秒内知道「我在哪、做什么」',
                  '是否具备拓展性',
                  '重点是否突出（最重要内容在最显眼处）',
                  '视觉动线是否符合优先级',
                  '主题是否清晰',
                ],
              },
              {
                key: 'flow',
                label: '流程',
                items: [
                  '逆向流程完整（返回 / 出入口符合预期）',
                  '提供简单的撤销操作',
                  '破坏性操作有二次确认',
                  '二次确认是否过频（需要「不再提醒」吗）',
                  '是否需要自动保存',
                  '不满足条件的操作是否用隐藏控件规避',
                  '任务中断的提示与恢复',
                  '三步以上是否有步骤指示器',
                ],
              },
              {
                key: 'state',
                label: '状态',
                items: [
                  '初始（默认）状态',
                  '空状态的缺省提示',
                  '中间状态（锁定 / 完成 / 可领取…）',
                  '状态间显示互斥',
                  '状态刷新方式（手势 / 点击 / 自动）',
                  '新获得 / 锁定等特殊状态',
                ],
              },
              {
                key: 'feedback',
                label: '反馈与提醒',
                items: [
                  '任何操作都有反馈',
                  '成功 / 失败提示与下一步引导',
                  '反馈方式是否合适（飘字 / 特效 / 弹窗）',
                  '反馈位置是否合适',
                  '是否需要声音 / 震动',
                  '是否需要红点提示',
                  '红点显隐时机与位置',
                  '多层级红点的继承规则',
                  '消息通知的形式',
                ],
              },
              {
                key: 'misc',
                label: '常见问题',
                items: [
                  '是否考虑 PC 端操作',
                  'Tab 页位置优先级',
                  '获得物品是否显示弹窗',
                  '是否需要新手引导',
                  '不可用按钮是否置灰',
                  '选中框、货币是否够明显',
                  '同系统按钮文本一致性',
                  '倒计时前端实时 + 后端同步',
                  '是否考虑批量操作',
                  '背包排序是否合理',
                  '长按操作补足',
                  '状态标识的空间与覆盖关系',
                ],
              },
            ],
            note: '使用方法：逐条核对文档，缺失项补充说明或标记「待确认」——AI 预审产出的就是这张核对结果。',
          },
          reflection: {
            title: '文档的下一站',
            body:
              '目前设计源还是「一份写得更规整的 markdown」，编译它的还是人和单点 skill。下一步是让规则文档与 Figma 稿、prefab 建立显式引用关系——需求一变，自动列出受影响的稿与 prefab，那才算真正从「文档」变成「源」。',
          },
        },
      },
      {
        id: 'agent-studio',
        title: '多代理需求验证：VibeGame Studio',
        highlights: ['5 个策划 agent 协作', 'producer 评审整合', '策划案实证产出'],
        media: [],
        articleMDX: md`多代理需求验证案例由结构化叙事渲染。`,
        story: {
          layout: 'aiux',
          archetype: '多代理协作 · 需求理解',
          oneLiner:
            'UX 的上游是策划案，而策划案最大的问题是「纸上谈兵」：逻辑不透明、数值没验证。VibeGame Studio 用 5 个垂直 agent skill 把一句模糊的玩法想法跑成完整策划案——制作人定愿景，系统 / 世界观 / 数值 / 战斗并行展开，制作人回头 review 整合。它验证的是未来流程的第一环：需求在进入 UX 之前，先被 AI 跑通一遍逻辑。',
          heroKicker: '一句想法 → 一份逻辑闭环的策划案',
          agentRoster: {
            kicker: '虚拟工作室 · 5 个 agent',
            title: '每个 agent 一个垂直职责，producer 负责收口',
            intro: '以 Claude Code skill 形式实现，命令即角色：',
            agents: [
              {
                key: 'producer',
                cmd: '/producer',
                role: '游戏制作人',
                duty: '定义核心愿景与玩法支柱、分发任务；最后回头 review 各环节产出并整合输出',
                loop: true,
              },
              { key: 'system', cmd: '/system-designer', role: '系统策划', duty: '设计系统架构与核心循环' },
              { key: 'worldview', cmd: '/worldview-designer', role: '世界观策划', duty: '设计世界背景、角色与剧情' },
              { key: 'numerical', cmd: '/numerical-designer', role: '数值策划', duty: '设计经济系统与成长曲线' },
              { key: 'combat', cmd: '/combat-designer', role: '战斗策划', duty: '设计战斗系统与怪物 AI' },
            ],
            artifact: {
              title: '《龙翼弹幕》策划案',
              meta: '实证产出 · Ver 0.1 · 飞行弹幕 × 卡牌构筑 × RPG',
              lines: [
                '核心愿景：「驾驭神龙，编织弹幕，构筑属于你的空战卡组」',
                '支柱 1 弹幕战斗 —— 卡牌决定弹幕类型，龙伙伴提供被动增益',
                '支柱 2 卡牌构筑 —— 战前组卡，战中按能量条件释放',
                '支柱 3 龙伙伴养成 —— 属性克制影响战斗，龙技能可编入卡组',
                '支柱 4 RPG 成长 —— 成长提升上限，解锁卡牌与龙',
                '弹幕类型表：直射 / 扩散 / 追踪 / 护盾 / 召唤，逐型配卡…',
              ],
            },
          },
          flowStrip: {
            kicker: '工作流 · 串并结合',
            title: '从模糊想法到总策划案',
            steps: [
              { label: '/producer', sub: '定愿景与支柱' },
              { label: '系统 ∥ 世界观', sub: '并行展开' },
              { label: '数值 ∥ 战斗', sub: '依赖架构 · 并行' },
              { label: '/producer', sub: 'review & 整合' },
              { label: '总策划案', sub: 'output/ 落盘' },
            ],
            caption: 'docs/ 目录是知识库：喂入历史策划案与行业参考，agent 产出的风格随之对齐',
          },
          reflection: {
            title: '离「验证环」还有多远',
            body:
              '目前 agent 产出的是逻辑自洽的文档，离构想中的「白盒可交互原型 + 大规模数值模拟」还有两步——这正是三层进化里验证环的入口。诚实地说，这一环节还是原型，但它已经能在立项讨论前把一个想法的逻辑漏洞暴露出来。',
          },
        },
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
