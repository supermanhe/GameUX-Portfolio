import { Skeleton } from '@/components/ui/skeleton'
import { CasesGridSkeleton } from '@/components/skeletons/cases-grid-skeleton'

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-48" />
        </div>
      </header>

      <section className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </section>

      <section className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <CasesGridSkeleton />
      </section>
    </div>
  )
}
