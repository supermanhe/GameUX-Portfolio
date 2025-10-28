import { withMinimumDelay } from '@/lib/sleep'

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
    id: '3dhalloween',
    name: '3D版陀螺仪控制的吸血鬼生存者',
    year: '2025',
    role: ['双端交互', '陀螺仪', '震动反馈', '3D'],
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761572624/%E5%B0%81%E9%9D%A2_dhbf2g.gif',
    url: 'https://halloween-survivors-3d.netlify.app/',
    description: '利用业余时间开发了一款万圣节主题的吸血鬼生存like游戏。使用了Youware平台的移动端模版，可以快速集成手机陀螺仪和马达震动。',
    tech: ['React + TypeScript', 'Tailwind', 'Three.js'],
  },
  {
    id: 'merge',
    name: '合成星见雅',
    year: '2025',
    role: ['物理引擎', '前端'],
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761572456/Frame_1_1_ut20sp.png',
    url: 'https://merge-into-miyabi.netlify.app/',
    description: '利用Matter.js提供的物理引擎，快速开发合成大西瓜换皮demo，资源来自米哈游官网',
    tech: ['HTML5+CSS3', 'JavaScript', 'Matter.js'],
  },
  {
    id: '3DGallery',
    name: '3D沉浸式画廊，可自由行走',
    year: '2025',
    role: ['3D', '前端'],
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761573683/20251027-220018_aq2dwu.gif',
    url: 'https://3dartgalleryonlinev2.netlify.app/',
    description: '游戏内核心指标实时可视化原型。',
    tech: ['Next.js', 'D3.js'],
  },
]

export async function getSites() {
  return withMinimumDelay(Promise.resolve(sites))
}
