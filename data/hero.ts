import { withMinimumDelay } from '@/lib/sleep'

export type HeroContent = {
  headline: string
  description: string
  resumeUrl: string
  email: string
  githubUrl: string
  avatar: string
  skillsTitle: string
  skills: string[]
}

const heroContent: HeroContent = {
  headline: '何梓超 · 游戏 UX 设计师',
  description: '把交互方案推进到可验证原型',
  resumeUrl:
    'https://res.cloudinary.com/dnhjgceru/image/upload/v1761579250/Portfolio_avdl1u.jpg',
  email: 'chinagdmz@gmail.com',
  githubUrl: 'https://github.com/supermanhe',
  avatar: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761574783/%E6%88%91%E7%9A%84%E8%82%96%E5%83%8F_2_cohql6.png',
  skillsTitle: '技能 / 工具',
  skills: ['Figma', 'Unity', 'Axure', 'AI Coding', 'Photoshop'],
}

export async function getHeroContent() {
  return withMinimumDelay(Promise.resolve(heroContent))
}
