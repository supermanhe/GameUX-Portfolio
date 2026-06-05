/**
 * “我的工具”页技能数据
 *
 * - level：0~100 熟练度，进度条目标值（具体数值后续由本人指定，这里先放合理默认）
 * - at：0~1 的滚动进度阈值，决定该组在角色下滑到何处时浮现（与 skill.mp4 节奏对齐）
 * - tools[].icon：现成开源单色图标（public/skills/*.svg，用 mask 着色）；
 *   没有现成图标的先用占位（label + 品牌色），后续可替换为上传的 logo。
 */

export type SkillTool = {
  name: string
  /** 现成开源单色图标路径（svg）；缺省则用占位 */
  icon?: string
  /** 图标/占位的品牌着色 */
  color: string
  /** 占位用的短标签（无 icon 时显示，如 Ps、LO） */
  label?: string
}

export type SkillGroup = {
  id: string
  title: string
  /** 0~100 熟练度 */
  level: number
  /** 0~1 滚动进度阈值，决定浮现时机 */
  at: number
  tools: SkillTool[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'design',
    title: '绘图工具',
    level: 95,
    at: 0.16,
    tools: [
      { name: 'Figma', icon: '/skills/figma.svg', color: '#F24E1E' },
      { name: 'Photoshop', label: 'Ps', color: '#31A8FF' },
    ],
  },
  {
    id: 'ai-coding',
    title: 'AI Coding',
    level: 90,
    at: 0.31,
    tools: [
      { name: 'Claude', icon: '/skills/claude.svg', color: '#D97757' },
      { name: 'Codex', icon: '/skills/codex.svg', color: '#FFFFFF' },
    ],
  },
  {
    id: 'ai-gen',
    title: 'AI 生成',
    level: 85,
    at: 0.46,
    tools: [
      // Seedance 暂无开源图标，先用占位（后续可替换上传的 logo）
      { name: 'Seedance', label: 'SD', color: '#3B82F6' },
      { name: 'Lovart', icon: '/skills/lovart.svg', color: '#F472B6' },
    ],
  },
  {
    id: 'engine',
    title: '游戏引擎',
    level: 78,
    at: 0.61,
    tools: [
      { name: 'Unity', icon: '/skills/unity.svg', color: '#FFFFFF' },
      { name: 'Godot', icon: '/skills/godotengine.svg', color: '#478CBF' },
    ],
  },
]
