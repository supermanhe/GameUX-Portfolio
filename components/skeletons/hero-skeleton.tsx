import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
  return (
    <section className="min-h-[calc(100dvh-7rem)] pt-16 md:pt-20">
      <div className="mx-auto max-w-3xl space-y-5 pb-4">
        <Skeleton className="mx-auto h-4 w-56" />
        <Skeleton className="mx-auto h-16 w-full max-w-3xl md:h-24" />
        <Skeleton className="mx-auto h-16 w-full max-w-2xl" />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Skeleton className="h-11 w-36 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </section>
  )
}
