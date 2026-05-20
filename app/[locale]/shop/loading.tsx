import { ShopGridSkeleton } from '@/components/ui/SectionSkeleton'

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-10 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="mt-4 h-6 w-64 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      <ShopGridSkeleton />
    </div>
  )
}
