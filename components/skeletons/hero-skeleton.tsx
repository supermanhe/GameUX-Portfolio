import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
  return (
    <section className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
      <div className="mx-auto h-40 w-40 overflow-hidden rounded-full ring-1 ring-border md:h-40 md:w-40">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-7 w-[280px] md:w-[360px]" />
        <Skeleton className="h-4 w-[320px]" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="md:col-span-2 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-56" />
      </div>
    </section>
  )
}
