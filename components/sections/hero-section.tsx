import { Hero } from '@/components/hero'
import { getHeroContent } from '@/data/hero'

export async function HeroSection() {
  const data = await getHeroContent()
  return <Hero data={data} />
}
