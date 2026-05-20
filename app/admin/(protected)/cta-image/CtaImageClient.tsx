'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CldImage, CldUploadButton } from 'next-cloudinary'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { ctaImageSchema, type CtaImageFormValues } from '@/lib/validations/admin'
import { Upload, Loader2 } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

const SETTINGS_KEYS: (keyof CtaImageFormValues)[] = ['cta_image_url', 'cta_image_public_id']

export default function CtaImageClient({ defaults }: { defaults: Record<string, string> }) {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()
  const [imageUrl, setImageUrl] = useState(defaults.cta_image_url ?? '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CtaImageFormValues>({
    resolver: zodResolver(ctaImageSchema),
    defaultValues: {
      cta_image_url: defaults.cta_image_url ?? '',
      cta_image_public_id: defaults.cta_image_public_id ?? '',
    },
  })

  const handleUploadSuccess = async (result: any) => {
    const info = result?.info
    const public_id = info?.public_id
    const secure_url = info?.secure_url
    if (!public_id || !secure_url) {
      toast.error('Upload failed')
      return
    }

    setImageUrl(secure_url)
    setValue('cta_image_url', secure_url)
    setValue('cta_image_public_id', public_id)
    toast.success('CTA image uploaded!')
  }

  const onSubmit = async (values: CtaImageFormValues) => {
    const rows = SETTINGS_KEYS.map((key) => ({ key, value: values[key] ?? '' }))
    const { error } = await supabase.from('site_settings').upsert(rows)
    if (error) {
      toast.error(error.message)
      return
    }

    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'homepage' }),
    })

    toast.success('CTA image saved!')
  }

  const fieldCls = 'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'
  const labelCls = 'mb-1.5 block text-xs font-medium text-zinc-400'

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">CTA Featured Image</h2>
        <p className="mt-1 text-sm text-zinc-500">Upload and manage the featured image shown in the homepage CTA block.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Upload Image</label>
              <CldUploadButton
                uploadPreset="scooty do"
                options={{ multiple: false }}
                onOpen={() => setUploading(true)}
                onClose={() => setUploading(false)}
                onSuccess={handleUploadSuccess}
                onError={() => {
                  setUploading(false)
                  toast.error('Upload failed')
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading…' : 'Upload new image'}
              </CldUploadButton>
            </div>
            <div>
              <label className={labelCls}>Current Image URL</label>
              <input
                type="text"
                {...register('cta_image_url')}
                value={imageUrl}
                onChange={(event) => {
                  const value = event.target.value
                  setImageUrl(value)
                  setValue('cta_image_url', value)
                }}
                className={fieldCls}
                placeholder="https://..."
              />
            </div>
          </div>

          {imageUrl ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/5">
                <img src={imageUrl} alt="CTA featured image preview" className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 text-sm text-zinc-400">Preview of the active featured image.</p>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
              No CTA image uploaded yet. Upload a JPG, PNG, or WebP file to update the homepage CTA.
            </div>
          )}
        </div>

        <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-white/10 bg-zinc-950/90 px-6 py-4 backdrop-blur-sm lg:-mx-8 lg:px-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save CTA Image
          </button>
        </div>
      </form>
    </div>
  )
}
