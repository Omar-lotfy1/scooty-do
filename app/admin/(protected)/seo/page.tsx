'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { seoPageSchema, type SeoPageFormValues } from '@/lib/validations/admin'
import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

const PAGES = ['home', 'shop', 'contact'] as const
type PageKey = typeof PAGES[number]

const PAGE_LABELS: Record<PageKey, string> = {
  home: 'Home',
  shop: 'Shop',
  contact: 'Contact',
}

const DEFAULT_HOME_TITLE_EN = 'Scooty Do — Smart Electric Scooters in Egypt'

function SeoTabForm({ page, defaults }: { page: PageKey; defaults: Record<string, string> }) {
  const supabase = createClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SeoPageFormValues>({
    resolver: zodResolver(seoPageSchema),
    defaultValues: {
      title_en: defaults[`seo_${page}_title_en`] ?? (page === 'home' ? DEFAULT_HOME_TITLE_EN : ''),
      title_ar: defaults[`seo_${page}_title_ar`] ?? '',
      description_en: defaults[`seo_${page}_description_en`] ?? '',
      description_ar: defaults[`seo_${page}_description_ar`] ?? '',
      keyword_en: defaults[`seo_${page}_keyword_en`] ?? '',
      keyword_ar: defaults[`seo_${page}_keyword_ar`] ?? '',
    },
  })

  const onSubmit = async (values: SeoPageFormValues) => {
    const rows = [
      { key: `seo_${page}_title_en`, value: values.title_en },
      { key: `seo_${page}_title_ar`, value: values.title_ar },
      { key: `seo_${page}_description_en`, value: values.description_en },
      { key: `seo_${page}_description_ar`, value: values.description_ar },
      { key: `seo_${page}_keyword_en`, value: values.keyword_en },
      { key: `seo_${page}_keyword_ar`, value: values.keyword_ar },
    ]

    const { error } = await supabase.from('site_settings').upsert(rows)
    if (error) {
      toast.error(error.message)
      return
    }
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'all' }),
    })
    toast.success(`${PAGE_LABELS[page]} SEO saved!`)
  }

  const fieldCls = 'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'
  const labelCls = 'mb-1.5 block text-xs font-medium text-zinc-400'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>SEO Title (English)</label>
          <input {...register('title_en')} className={fieldCls} placeholder="Page Title | Scooty Do" />
        </div>
        <div>
          <label className={labelCls}>SEO Title (Arabic)</label>
          <input {...register('title_ar')} className={fieldCls} dir="rtl" placeholder="عنوان الصفحة | سكوتي دو" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Meta Description (English)</label>
          <textarea {...register('description_en')} rows={3} className={fieldCls} placeholder="A brief description for search engines…" />
        </div>
        <div>
          <label className={labelCls}>Meta Description (Arabic)</label>
          <textarea {...register('description_ar')} rows={3} className={fieldCls} dir="rtl" placeholder="وصف مختصر لمحركات البحث…" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Focus Keyword (English)</label>
          <input {...register('keyword_en')} className={fieldCls} placeholder="electric scooter Egypt" />
        </div>
        <div>
          <label className={labelCls}>Focus Keyword (Arabic)</label>
          <input {...register('keyword_ar')} className={fieldCls} dir="rtl" placeholder="سكوتر كهربائي مصر" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-60 transition-colors"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save {PAGE_LABELS[page]} SEO
      </button>
    </form>
  )
}

export default function SeoPage() {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<PageKey>('home')
  const [settings, setSettings] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  // Load once on mount
  useState(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .like('key', 'seo_%')
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const row of data ?? []) {
          map[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value)
        }
        setSettings(map)
        setLoading(false)
      })
  })

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{l('seoSettings')}</h2>
        <p className="mt-1 text-sm text-zinc-500">Manage meta titles, descriptions, and keywords for each page.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-zinc-900 p-1">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => setActiveTab(page)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === page
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {PAGE_LABELS[page]}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-zinc-800" />
            ))}
          </div>
        ) : (
          <SeoTabForm key={activeTab} page={activeTab} defaults={settings ?? {}} />
        )}
      </div>
    </div>
  )
}
