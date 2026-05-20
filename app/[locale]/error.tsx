'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
        Something went wrong!
      </h2>
      <p className="mb-8 max-w-md text-slate-500">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
      >
        Try again
      </button>
    </div>
  )
}
