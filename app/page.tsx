import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { ProjectScrollShowcaseLoader } from '@/components/sections/project-scroll-showcase-loader'
import { SitesSectionLoader } from '@/components/sections/sites-section-loader'
import { HeroSkeleton } from '@/components/skeletons/hero-skeleton'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { SitesSectionSkeleton } from '@/components/skeletons/sites-section-skeleton'
import { DelayedRender } from '@/components/skeletons/delayed-render'
import { GsapReveal } from '@/components/motion/gsap-reveal'

export default function Page() {
  return (
    <div className="pb-10">
      <Suspense fallback={<DelayedRender><HeroSkeleton /></DelayedRender>}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={2} /></DelayedRender>}>
        <ProjectScrollShowcaseLoader />
      </Suspense>

      <section id="sites" className="container space-y-8 py-16 md:py-24">
        <GsapReveal>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">Playable prototypes</p>
            <h2 className="font-editorial mt-3 text-4xl font-black leading-tight md:text-6xl">独立开发</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            利用AI Coding和开源美术资源，全栈开发Demo
            </p>
          </div>
        </GsapReveal>
        <Suspense fallback={<DelayedRender><SitesSectionSkeleton items={3} /></DelayedRender>}>
          <SitesSectionLoader />
        </Suspense>
      </section>
    </div>
  )
}

