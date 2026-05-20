'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { whatsappSchema, type WhatsappFormValues } from '@/lib/validations/admin'
import { MessageCircle, Loader2, ExternalLink } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

export default function WhatsAppPage() {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()
  const [defaultNumber, setDefaultNumber] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<WhatsappFormValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'whatsapp_number')
        .single()
      const number = typeof data?.value === 'string' ? data.value : ''
      setDefaultNumber(number)
      return { whatsapp_number: number }
    },
  })

  const number = watch('whatsapp_number') ?? defaultNumber
  const waLink = number ? `https://wa.me/${number}` : ''

  const onSubmit = async (values: WhatsappFormValues) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'whatsapp_number', value: values.whatsapp_number })

    if (error) {
      toast.error(error.message)
      return
    }
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'settings' }),
    })
    toast.success('WhatsApp number updated!')
  }

  const fieldCls = 'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{l('whatsappSettings')}</h2>
        <p className="mt-1 text-sm text-zinc-500">Manage your WhatsApp Business contact number.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
            <MessageCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-white">WhatsApp Business Number</p>
            <p className="text-xs text-zinc-500">International format — digits only, no spaces or symbols</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Phone Number (e.g. 201234567890)
            </label>
            <input
              {...register('whatsapp_number')}
              className={fieldCls}
              placeholder="201234567890"
              disabled={isLoading}
            />
            {errors.whatsapp_number && (
              <p className="mt-1 text-xs text-red-400">{errors.whatsapp_number.message}</p>
            )}
          </div>

          {/* Live preview */}
          {waLink && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-xs font-medium text-green-400 mb-2">Live WhatsApp Link Preview</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-300 underline underline-offset-4 hover:text-green-200 break-all"
              >
                {waLink}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          )}

          <div className="rounded-xl border border-white/5 bg-zinc-800/50 p-4">
            <p className="text-xs text-zinc-500">
              💡 Updating this number updates all <span className="text-white font-medium">Order via WhatsApp</span> buttons sitewide automatically.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {l('saveNumber')}
          </button>
        </form>
      </div>
    </div>
  )
}
