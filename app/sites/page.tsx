import { sites } from '@/data/sites'
import { SitesSection } from '@/components/sites-section'

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">已做项目（网站集合）</h1>
        <p className="mt-2 text-sm text-muted-foreground">点击卡片查看详情，支持内嵌交互预览（若被拦截则提供外链）。</p>
      </div>
      <SitesSection items={sites} />
    </div>
  )
}

