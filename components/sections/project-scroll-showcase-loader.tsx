import { getProjects } from '@/data/projects'
import { ProjectScrollShowcase } from '@/components/sections/project-scroll-showcase'

export async function ProjectScrollShowcaseLoader() {
  const projects = await getProjects()
  return <ProjectScrollShowcase projects={projects} />
}
