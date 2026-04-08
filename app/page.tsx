import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { ValuePropsSection } from '@/components/sections/value-props-section'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { SitesSectionLoader } from '@/components/sections/sites-section-loader'
import { HeroSkeleton } from '@/components/skeletons/hero-skeleton'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { SitesSectionSkeleton } from '@/components/skeletons/sites-section-skeleton'
import { DelayedRender } from '@/components/skeletons/delayed-render'

export default function Page() {
  return (
    <div className="space-y-16">
      <Suspense fallback={<DelayedRender><HeroSkeleton /></DelayedRender>}>
        <HeroSection />
      </Suspense>

      <section id="value-props" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">我主要解决这三类问题</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            从复杂系统梳理，到交互落地，再到原型验证，是我这几年最稳定的工作主线。
          </p>
        </div>
        <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={3} /></DelayedRender>}>
          <ValuePropsSection />
        </Suspense>
      </section>

      <section id="projects" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">代表项目</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            负责过 MMO 与移动端项目的核心交互设计，重点关注复杂系统、商业化体验与长期运营迭代。
          </p>
        </div>
        <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={4} /></DelayedRender>}>
          <ProjectsGrid />
        </Suspense>
      </section>

      <section id="sites" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">原型实验 / 独立开发</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            我会用 AI Coding、前端和现成资源快速搭建可玩的 Demo，把一些交互想法尽快变成可体验的原型。
          </p>
        </div>
        <Suspense fallback={<DelayedRender><SitesSectionSkeleton items={3} /></DelayedRender>}>
          <SitesSectionLoader />
        </Suspense>
      </section>
    </div>
  )
}

