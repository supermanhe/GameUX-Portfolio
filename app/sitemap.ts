import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://example.com'
  const items: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/projects`, lastModified: new Date() },
    { url: `${base}/sites`, lastModified: new Date() },
  ]
  projects.forEach((p) => {
    items.push({ url: `${base}/projects/${p.slug}`, lastModified: new Date() })
    p.cases.forEach((c) => items.push({ url: `${base}/projects/${p.slug}/${c.id}`, lastModified: new Date() }))
  })
  return items
}

