import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/50 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md p-4 transition-all">
      {/* Image placeholder - enforcing aspect ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content placeholder */}
      <div className="mt-4 flex flex-col space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
