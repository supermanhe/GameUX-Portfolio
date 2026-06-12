import Image from 'next/image'
import { ArrowUpRight, FileCode2 } from 'lucide-react'

const SKILLS = [
  {
    no: '01',
    title: 'figma-json-assets-handoff',
    role: '设计编译 · 交付管线',
    description: '将 Figma 设计稿按命名规则编译为可运行的 Unity UI Prefab。',
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781274965/aiux2_q4qdoc.webp',
    href: 'https://github.com/supermanhe/figma-json-assets-handoff',
  },
  {
    no: '02',
    title: 'game-ui-doc-skill',
    role: '设计源 · 文档工程化',
    description: '生成同时服务设计评审与 AI 执行的人机双读交互文档。',
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781274965/aiux3_ebzijg.webp',
    href: 'https://github.com/supermanhe/game-ui-doc-skill',
  },
  {
    no: '03',
    title: 'vibegame-studio',
    role: '多代理 · 需求验证',
    description: '让垂直策划 Agent 协同展开需求，并由制作人 Agent 评审收口。',
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781274965/aiux4_bytyqm.webp',
    href: 'https://github.com/supermanhe/vibegame-studio',
  },
] as const

export function AiuxSkillsShowcase() {
  return (
    <section className="aiux-skills" aria-labelledby="aiux-skills-title">
      <header className="aiux-skills-head">
        <div>
          <p className="font-pixel">OPEN SOURCE · TOOLKIT</p>
          <h2 id="aiux-skills-title">我的 Skill</h2>
          <p className="aiux-skills-intro">把反复使用的设计判断与交付流程，沉淀成可以直接运行、持续迭代的开源工具。</p>
        </div>
      </header>

      <div className="aiux-skills-grid">
        {SKILLS.map((skill) => (
          <a
            key={skill.title}
            className="aiux-skill-card focus-ring"
            href={skill.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`在 GitHub 查看 ${skill.title} skill`}
          >
            <Image src={skill.cover} alt="" fill className="aiux-skill-card-cover" sizes="(max-width: 900px) 88vw, 33vw" />
            <span className="aiux-skill-card-shade" aria-hidden="true" />
            <span className="aiux-skill-card-top">
              <span className="font-pixel">{skill.no}</span>
              <span className="aiux-skill-card-tag font-pixel">
                <FileCode2 aria-hidden="true" />
                SKILL
              </span>
            </span>
            <span className="aiux-skill-card-copy">
              <span className="aiux-skill-card-role font-pixel">{skill.role}</span>
              <strong>{skill.title}</strong>
              <span className="aiux-skill-card-description">{skill.description}</span>
              <span className="aiux-skill-card-link">
                GitHub
                <ArrowUpRight aria-hidden="true" />
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
