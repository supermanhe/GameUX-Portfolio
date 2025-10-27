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
            近年主要负责的线上项目，覆盖端游与移动端
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
          <h2 className="text-2xl font-bold tracking-tight">独立开发</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            利用AI Coding和开源美术资源，全栈开发Demo
          </p>
        </div>
        <SitesSection items={sites} />
      </section>
    </div>
  )
}

