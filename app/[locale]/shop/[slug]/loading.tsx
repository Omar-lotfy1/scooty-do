import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12 rtl:flex-row-reverse">
        
        {/* Images skeleton */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-100">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Info skeleton */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0 rtl:text-right">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-10 w-32 mb-6" />
          
          <div className="space-y-3 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <Skeleton className="h-16 w-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
