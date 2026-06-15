/**
 * “关于我”页内容
 *
 * - lines：对话气泡里逐字蹦出的文案（按行换行展示）
 * - 联系方式复用 hero 的简历 / 邮箱 / GitHub
 */

export type AboutContent = {
  lines: string[]
  /** 需用主题色高亮的句子（出现在 lines 中的子串） */
  highlight: string
  resumeUrl: string
  email: string
  githubUrl: string
}

export const aboutContent: AboutContent = {
  lines: [
    '嗨！我是超，来自广州。白天做游戏，晚上折腾 AI 和新技术。',
    '热衷于让游戏变得更清晰、更直觉、更好用——游戏不只是给一部分人玩，而是让所有人都能享受。',
    '对前沿科技有强烈的兴趣，喜欢用各种 AI 工具探索新可能！',
    '目前在做一个 3D Survivors-like 游戏，梦想是做出一款让所有人都觉得好玩的游戏。',
    '您可以通过以下方式联系我：',
  ],
  highlight: '游戏不只是给一部分人玩，而是让所有人都能享受。',
  resumeUrl:
    'https://res.cloudinary.com/dnhjgceru/image/upload/v1781530105/2026%E7%AE%80%E5%8E%86_kdmnwh.png',
  email: 'chinagdmz@gmail.com',
  githubUrl: 'https://github.com/supermanhe',
}
