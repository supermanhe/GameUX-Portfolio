import { Skeleton } from '@/components/ui/skeleton'

export function CasesGridSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border/60 bg-card/70 p-0 shadow-soft">
          <div className="h-72 overflow-hidden rounded-t-2xl">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-2 p-5 text-sm">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
