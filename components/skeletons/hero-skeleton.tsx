import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
  return (
    <section className="grid min-h-[calc(100dvh-7rem)] gap-12 pt-16 md:pt-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
      <div className="space-y-5 pb-4">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-16 w-full max-w-3xl md:h-24" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-36 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-2">
        <Skeleton className="aspect-[4/5] w-full rounded-md" />
      </div>
    </section>
  )
}
