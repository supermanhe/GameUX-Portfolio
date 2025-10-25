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
    slug: 'star-arena',
    title: 'Star Arena',
    subtitle: '科幻多人战斗 · 实时PVP',
    role: 'UI/UX 负责人',
    period: '2023.02 - 2024.02',
    team: '25人（设计3 / 客户端 / 服务端 / 策划5 / 测试3）',
    platform: ['iOS', 'Android'],
    kpis: [
      { label: '次日留存', value: '+7.8%' },
      { label: '完成新手引导', value: '+12.3%' },
    ],
    cover: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop',
    tags: ['PVP', '科幻', '移动端'],
    summary:
      '负责整套界面体系与交互规范，主导新手引导、战斗HUD、货币化入口与活动模块的策略与落地。通过A/B测试与可用性测试持续优化。',
    cases: [
      {
        id: 'onboarding',
        title: '新手引导体系重做',
        highlights: [
          '任务流拆解，降低早期认知负荷',
          '关键节点动效加持，提升完成率',
          '引导完成率 +12.3%'
        ],
        media: [
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop',
            caption: '分步引导的结构图',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761213900/%E8%BE%93%E5%85%A5_kt67yf.gif',
            caption: '箭头与放大动效',
          },
          {
            type: 'video',
            src: 'https://www.w3schools.com/html/mov_bbb.mp4',
            caption: '关键动效演示',
            poster: 'https://placehold.co/800x450/000000/FFFFFF?text=Motion+Demo',
          },
        ],
        articleMDX: md`
### 目标
在不牺牲节奏与乐趣的前提下，降低首次启动时的认知负荷，提升关键机制理解与留存。
### 方法
- 将教学任务切分为 5 个阶段，每阶段 1-2 个明确目标。
- 在关键交互处加入轻量动效（放大/高亮/抖动）。
- 使用 12 名真实玩家进行走查与回放分析。
### 结果
- 引导完成率 +12.3%，Day2 留存 +7.8%。
- 玩家反馈“更清楚下一步该做什么”。
        `,
      },
      {
        id: 'test',
        title: 'test',
        highlights: [
          'highlight1',
          'highlight2',
          'highlight3',
        ],
        media: [
          {
            type: 'video',
            src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1761213999/%E7%89%B9%E6%95%88bug_h9eiu2.mp4',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761213900/%E8%BE%93%E5%85%A5_kt67yf.gif',
          },
        ],
        articleMDX: md`
### 目标
在不牺牲节奏与乐趣的前提下，降低首次启动时的认知负荷，提升关键机制理解与留存。

<div class="tiptap-video-wrapper">
  <video
    class="tiptap-video"
    controls="true"
    src="https://res.cloudinary.com/dnhjgceru/video/upload/v1761213999/%E7%89%B9%E6%95%88bug_h9eiu2.mp4"
  ></video>
</div>

### 方法
- 将教学任务切分为 5 个阶段，每阶段 1-2 个明确目标。
- 在关键交互处加入轻量动效（放大/高亮/抖动）。
- 使用 12 名真实玩家进行走查与回放分析。

<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761213900/%E8%BE%93%E5%85%A5_kt67yf.gif"
/>

### 结果
- 引导完成率 +12.3%，Day2 留存 +7.8%。
- 玩家反馈“更清楚下一步该做什么”。
        `,
      },
      {
        id: 'hud',
        title: '战斗 HUD 优化',
        highlights: ['信息层级梳理', '端内热力图观察点位', '色彩与对比度无障碍优化'],
        media: [
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop',
            caption: 'HUD 信息层级',
          },
        ],
        articleMDX: md`
我们聚焦四个信息层级：核心状态 > 关键技能 > 资源 & 目标 > 次要信息。通过统一的栅格与色彩语义减少搜索时间，战斗胜率稳定性提升 3%。
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


