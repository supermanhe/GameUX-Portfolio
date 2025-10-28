import { SitesSection } from '@/components/sites-section'
import { getSites } from '@/data/sites'

export async function SitesSectionLoader() {
  const items = await getSites()
  return <SitesSection items={items} />
}
