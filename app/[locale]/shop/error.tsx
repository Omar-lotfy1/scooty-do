'use client'

import { AlertCircle } from 'lucide-react'

export default function ShopError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
        Failed to load products
      </h2>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        Try again
      </button>
    </div>
  )
}
