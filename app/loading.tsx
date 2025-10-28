import { HeroSkeleton } from '@/components/skeletons/hero-skeleton'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { SitesSectionSkeleton } from '@/components/skeletons/sites-section-skeleton'

export default function Loading() {
  return (
    <div className="space-y-16">
      <HeroSkeleton />
      <section id="projects" className="space-y-6">
        <div>
          <div className="h-7 w-40 rounded-md bg-muted/60" />
          <div className="mt-2 h-4 w-60 rounded-md bg-muted/60" />
        </div>
        <ProjectsGridSkeleton items={4} />
      </section>
      <section id="sites" className="space-y-6">
        <div>
          <div className="h-7 w-32 rounded-md bg-muted/60" />
          <div className="mt-2 h-4 w-56 rounded-md bg-muted/60" />
        </div>
        <SitesSectionSkeleton items={3} />
      </section>
    </div>
  )
}
