import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { AlertCircle } from 'lucide-react'

export default async function ProductNotFound() {
  const t = await getTranslations('NotFound')

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <AlertCircle className="h-10 w-10 text-slate-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
        {t('title')}
      </h2>
      <p className="mb-8 max-w-md text-slate-500">
        {t('description')}
      </p>
      <Link
        href="/shop"
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {t('back')}
      </Link>
    </div>
  )
}
