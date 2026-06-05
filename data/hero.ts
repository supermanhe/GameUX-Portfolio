import { withMinimumDelay } from '@/lib/sleep'

export type HeroContent = {
  headline: string[]
  description: string
  resumeUrl: string
  email: string
  githubUrl: string
  skillsTitle: string
  skills: string[]
}

const heroContent: HeroContent = {
  headline: [
    '你好，我是何梓超',
    '你好，我专注游戏UX 9年',
    '你好，我把复杂玩法翻译成清晰体验',
    '你好，我是Vibecoder',
    '你好，我用AI原型连接玩家体验与系统设计',
  ],
  description: '网易游戏《大话西游2》、昆仑万维《圣境之塔》UX负责人；热爱游戏，专注游戏UX 9年',
  resumeUrl:
    'https://res.cloudinary.com/dnhjgceru/image/upload/v1761579250/Portfolio_avdl1u.jpg',
  email: 'chinagdmz@gmail.com',
  githubUrl: 'https://github.com/supermanhe',
  skillsTitle: '技能 / 工具',
  skills: ['Figma', 'Unity', 'Axure', 'AI Coding', 'Photoshop'],
}

export async function getHeroContent() {
  return withMinimumDelay(Promise.resolve(heroContent))
}
