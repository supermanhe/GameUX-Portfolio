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
  headline: '何梓超 · 游戏UX设计 · 独立开发者',
  description: '网易游戏《大话西游2》、昆仑万维《圣境之塔》UX负责人；热爱游戏，专注游戏UX 8年',
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
