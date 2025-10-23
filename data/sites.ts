export type SiteItem = {
  id: string
  name: string
  year: string
  role: string[]
  cover: string
  url: string
  description: string
  tech?: string[]
}

export const sites: SiteItem[] = [
  {
    id: 'ui-kit',
    name: 'UI Kit 文档站',
    year: '2024',
    role: ['设计系统', '前端'],
    cover: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop',
    url: 'https://v0-ultraman-runner-game.vercel.app/',
    description: '组件库与样式规范的在线文档与示例。',
    tech: ['Next.js', 'Tailwind', 'MDX'],
  },
  {
    id: 'promo',
    name: '活动落地页生成器',
    year: '2023',
    role: ['交互', '前端'],
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    url: 'https://example.com',
    description: '配置化活动模板，支持AB位与转化追踪。',
    tech: ['Next.js', 'Framer Motion'],
  },
  {
    id: 'dashboard',
    name: '数据看板 Demo',
    year: '2022',
    role: ['前端'],
    cover: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
    url: 'https://example.com',
    description: '游戏内核心指标实时可视化原型。',
    tech: ['Next.js', 'D3.js'],
  },
  {
    id: 'landing',
    name: '产品官网着陆页',
    year: '2022',
    role: ['视觉', '前端'],
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    url: 'https://example.com',
    description: '强调动效与视觉节奏的品牌站点。',
    tech: ['Next.js', 'Three.js'],
  },
  {
    id: 'shop',
    name: '商城原型',
    year: '2021',
    role: ['交互'],
    cover: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=1200&auto=format&fit=crop',
    url: 'https://example.com',
    description: '虚拟道具商城与结算流程体验验证。',
    tech: ['Figma', 'Prototype'],
  },
  {
    id: 'tools',
    name: '设计工具小站',
    year: '2020',
    role: ['前端'],
    cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200&auto=format&fit=crop',
    url: 'https://example.com',
    description: '常用设计计算器与对照表合集。',
    tech: ['Next.js', 'Tailwind'],
  },
]
