import { ProjectCard } from '@/components/projects/project-card'
import { getProjects } from '@/data/projects'
import { cn } from '@/lib/utils'

export async function ProjectsGrid({ className }: { className?: string }) {
  const list = await getProjects()
  return (
    <div className={cn('grid gap-8 md:grid-cols-2', className)}>
      {list.map((project, index) => (
        <ProjectCard key={project.slug} p={project} index={index} />
      ))}
    </div>
  )
}
