import { Hero } from '@/components/hero'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { sites } from '@/data/sites'
import { SitesSection } from '@/components/sites-section'

export default function Page() {
  return (
    <div className="space-y-16">
      <Hero />
      <section id="projects" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">参与项目</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            负责上线项目的核心体验设计，覆盖端游与移动端，强调指标驱动与跨团队协作，从定位、指标拆解到视觉动效落地形成完整闭环。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} p={project} />
          ))}
        </div>
      </section>

      <section id="sites" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">已做项目（网站集合）</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            侧重实用的设计资产与前端实现，涵盖设计系统、数据看板与活动页面。点击卡片可查看更多介绍与在线预览。
          </p>
        </div>
        <SitesSection items={sites} />
      </section>
    </div>
  )
}

