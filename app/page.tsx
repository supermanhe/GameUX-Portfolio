import { Suspense } from 'react'
import { HistoryScrollSection } from '@/components/sections/history-scroll-section'
import { HomeLoopVideo } from '@/components/sections/home-loop-video'
import { SkillScroll } from '@/components/sections/skill-scroll'
import { AboutSection } from '@/components/sections/about-section'
import { ProjectScrollShowcaseLoader } from '@/components/sections/project-scroll-showcase-loader'
import { SitesSectionLoader } from '@/components/sections/sites-section-loader'
import { HeroSkeleton } from '@/components/skeletons/hero-skeleton'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { SitesSectionSkeleton } from '@/components/skeletons/sites-section-skeleton'
import { DelayedRender } from '@/components/skeletons/delayed-render'
import { GsapReveal } from '@/components/motion/gsap-reveal'
import { RestoreProjectScroll } from '@/components/motion/restore-project-scroll'

export default function Page() {
  return (
    <div>
      <HomeLoopVideo src="/home-loop.mp4" transitionSrc="/zoom-transition.mp4" />
      <RestoreProjectScroll />
      <Suspense fallback={<DelayedRender><HeroSkeleton /></DelayedRender>}>
        <HistoryScrollSection src="/history.mp4" />
      </Suspense>
      <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={2} /></DelayedRender>}>
        <ProjectScrollShowcaseLoader />
      </Suspense>

      <section id="sites" className="container space-y-8 py-16 md:py-24">
        <div className="flex items-start justify-between gap-8">
          <GsapReveal>
            <div className="max-w-3xl">
              <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary">Playable prototypes</p>
              <h2 className="font-editorial mt-3 text-4xl font-black leading-tight md:text-6xl">独立开发</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              利用AI Coding和开源美术资源，全栈开发Demo
              </p>
            </div>
          </GsapReveal>

          {/* 动漫人物编程小动画：纯白背景视频盖在浅色底上用 multiply 只留人物，
              再用径向遮罩羽化边缘 + 一圈橙色微光，柔和融入暗色页面（装饰、无音频） */}
          <div className="relative hidden shrink-0 self-center md:block" aria-hidden="true">
            <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.16),transparent_70%)] blur-lg" />
            <div className="relative isolate aspect-square w-[190px] [-webkit-mask-image:radial-gradient(circle_at_50%_46%,#000_70%,transparent_90%)] [mask-image:radial-gradient(circle_at_50%_46%,#000_70%,transparent_90%)] lg:w-[230px]">
              <div className="absolute inset-0 bg-[#efe7d8]" />
              <video
                src="/coding.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-multiply"
              />
            </div>
          </div>
        </div>
        <Suspense fallback={<DelayedRender><SitesSectionSkeleton items={3} /></DelayedRender>}>
          <SitesSectionLoader />
        </Suspense>
      </section>

      <SkillScroll src="/skill.mp4" />

      <AboutSection src="/ending.mp4" />
    </div>
  )
}

