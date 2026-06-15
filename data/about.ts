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
    'https://res.cloudinary.com/dnhjgceru/image/upload/v1781529062/%E6%B8%B8%E6%88%8F%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%B8%88-%E4%BD%95%E6%A2%93%E8%B6%85-%E4%B9%90%E6%B8%B8%E6%96%B9%E8%88%9F_ru6tpj.pdf',
  email: 'chinagdmz@gmail.com',
  githubUrl: 'https://github.com/supermanhe',
}
