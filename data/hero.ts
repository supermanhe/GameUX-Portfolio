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
  headline: '把游戏体验问题，做成可落地交互与可验证原型的人',
  description:
    '8 年游戏 UX 经验，负责过《大话西游2》《圣境之塔》等项目核心交互。近年持续用 AI Coding、前端原型和可玩 Demo，把设计判断从静态稿推进到真实体验验证。',
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
