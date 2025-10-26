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
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761445555/2e3d2637-d53e-40f2-b514-5cf3c3f70181.png',
    tags: ['MMO'],
    summary:
      '任《大话西游2》主交互，配合策划需求完成四年的核心运营活动及核心消费系统迭代，包括龙族资料片、藏宝阁、多宝阁，提升项目玩家活跃度及营收。',
    cases: [
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
    ],
  },
  {
    slug: 'myth-quest',
    title: 'Myth Quest',
    subtitle: '神话题材 · 放置养成',
    role: '高级交互设计师',
    period: '2021.08 - 2022.12',
    team: '30人',
    platform: ['iOS', 'Android'],
    kpis: [
      { label: '付费转化', value: '+5.1%' },
      { label: '功能点击率', value: '+9.6%' },
    ],
    cover: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop',
    tags: ['放置', '养成', '移动端'],
    summary:
      '主导背包与强化、活动页面的交互与 UI 落地，同时推动设计规范建立与组件化，使交付效率提升 20%。',
    cases: [
      {
        id: 'inventory-upgrade',
        title: '背包与强化体验优化',
        highlights: ['减少操作步数', '强化材料智能推荐', '成功率反馈优化'],
        media: [
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1600&auto=format&fit=crop',
            caption: '背包信息架构',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761213900/%E8%BE%93%E5%85%A5_kt67yf.gif',
            caption: '强化反馈动效草稿',
          },
        ],
        articleMDX: md`
通过减少 2 步关键操作，加入“智能填充材料”与“失败保护机制”的提示，强化路径点击率 +9.6%，整体付费转化 +5.1%。
        `,
      },
      {
        id: 'event-page',
        title: '活动页面组件化',
        highlights: ['组件拼搭', '模板复用', 'A/B 测试验证'],
        media: [
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
            caption: '活动页面模板示意',
          },
        ],
        articleMDX: md`
抽象出 Banner、任务列表、奖励条、进度条四类组件，沉淀规范后平均配置时间从 2 天降至 1 天。
        `,
      },
    ],
  },
]


