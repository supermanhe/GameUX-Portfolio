import { sites } from '@/data/sites'
import { SitesSection } from '@/components/sites-section'
import { GsapReveal } from '@/components/motion/gsap-reveal'

export default function SitesPage() {
  return (
    <div className="container space-y-10 pb-12 pt-16">
      <GsapReveal>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">Playable prototypes</p>
          <h1 className="font-editorial mt-3 text-5xl font-black leading-tight md:text-7xl">已做项目（网站集合）</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            点击卡片查看详情，支持内嵌交互预览（若被拦截则提供外链）。
          </p>
        </div>
      </GsapReveal>
      <SitesSection items={sites} />
    </div>
  )
}

