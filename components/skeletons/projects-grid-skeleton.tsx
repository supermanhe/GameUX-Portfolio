import { Skeleton } from '@/components/ui/skeleton'

export function ProjectsGridSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="card-base">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
