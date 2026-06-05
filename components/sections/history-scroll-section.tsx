import { HistoryScroll } from '@/components/sections/history-scroll'
import { getHeroContent } from '@/data/hero'

export async function HistoryScrollSection({ src }: { src: string }) {
  const data = await getHeroContent()
  return <HistoryScroll data={data} src={src} />
}
