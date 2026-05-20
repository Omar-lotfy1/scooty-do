'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { announcementSchema, type AnnouncementFormValues } from '@/lib/validations/admin'
import { Megaphone, Loader2 } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

export default function AnnouncementPage() {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, isLoading },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['announcement_visible', 'announcement_text_en', 'announcement_text_ar', 'announcement_bg_color'])

      const map: Record<string, string | boolean> = {}
      for (const row of data ?? []) {
        map[row.key] = typeof row.value === 'string' ? row.value : (row.value as boolean)
      }

      return {
        announcement_visible: map['announcement_visible'] === true || map['announcement_visible'] === 'true',
        announcement_text_en: (map['announcement_text_en'] as string) ?? '',
        announcement_text_ar: (map['announcement_text_ar'] as string) ?? '',
        announcement_bg_color: ((map['announcement_bg_color'] as string) ?? 'orange') as 'orange' | 'black',
      }
    },
  })

  const visible = watch('announcement_visible')
  const textEn = watch('announcement_text_en')
  const textAr = watch('announcement_text_ar')
  const bgColor = watch('announcement_bg_color')

  const onSubmit = async (values: AnnouncementFormValues) => {
    const rows = [
      { key: 'announcement_visible', value: values.announcement_visible },
      { key: 'announcement_text_en', value: values.announcement_text_en },
      { key: 'announcement_text_ar', value: values.announcement_text_ar },
      { key: 'announcement_bg_color', value: values.announcement_bg_color },
    ]

    const { error } = await supabase.from('site_settings').upsert(rows)
    if (error) {
      toast.error(error.message)
      return
    }
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'settings' }),
    })
    toast.success('Announcement bar saved!')
  }

  const fieldCls = 'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{l('announcementBar')}</h2>
        <p className="mt-1 text-sm text-zinc-500">Configure the sitewide announcement banner.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Visibility toggle */}
          <div className="flex items-center justify-between rounded-xl bg-zinc-800/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Show Announcement Bar Sitewide</p>
              <p className="text-xs text-zinc-500 mt-0.5">Displays at the top of every page</p>
            </div>
            <Controller
              name="announcement_visible"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${field.value ? 'bg-orange-500' : 'bg-zinc-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${field.value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              )}
            />
          </div>

          {/* Text fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Announcement Text (English)</label>
              <input {...register('announcement_text_en')} className={fieldCls} placeholder="Free delivery on orders over 500 EGP" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Announcement Text (Arabic)</label>
              <input {...register('announcement_text_ar')} className={fieldCls} dir="rtl" placeholder="توصيل مجاني على الطلبات التي تزيد عن 500 جنيه" />
            </div>
          </div>

          {/* Color swatches */}
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-400">Background Color</p>
            <div className="flex gap-3">
              <Controller
                name="announcement_bg_color"
                control={control}
                render={({ field }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => field.onChange('orange')}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${field.value === 'orange' ? 'border-orange-500 bg-orange-500/20 text-orange-400' : 'border-white/10 text-zinc-400 hover:border-white/20'}`}
                    >
                      <span className="h-4 w-4 rounded-full bg-orange-500" />
                      Orange
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('black')}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${field.value === 'black' ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-zinc-400 hover:border-white/20'}`}
                    >
                      <span className="h-4 w-4 rounded-full bg-zinc-900 border border-white/20" />
                      Black
                    </button>
                  </>
                )}
              />
            </div>
          </div>

          {/* Live preview */}
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-400">Live Preview</p>
            <div
              className={`rounded-xl px-4 py-2.5 text-center text-sm font-medium transition-all ${
                bgColor === 'orange'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-900 text-white border border-white/20'
              } ${!visible ? 'opacity-40' : ''}`}
            >
              {textEn || 'Your announcement text will appear here…'}
            </div>
            {textAr && (
              <div
                className={`mt-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium transition-all ${
                  bgColor === 'orange' ? 'bg-orange-500 text-white' : 'bg-zinc-900 text-white border border-white/20'
                } ${!visible ? 'opacity-40' : ''}`}
                dir="rtl"
              >
                {textAr}
              </div>
            )}
            {!visible && <p className="mt-1 text-center text-xs text-zinc-600">Bar is hidden — toggle visibility above to show</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {l('save')}
          </button>
        </form>
      </div>
    </div>
  )
}
