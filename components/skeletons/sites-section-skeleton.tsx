import { Skeleton } from '@/components/ui/skeleton'

export function SitesSectionSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="card-base">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
