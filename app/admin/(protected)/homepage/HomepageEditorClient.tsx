'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { CldImage, CldUploadButton } from 'next-cloudinary'
import { createClient } from '@/lib/supabase/client'
import { homepageSchema, type HomepageFormValues } from '@/lib/validations/admin'
import { Upload, Loader2, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

const SETTINGS_KEYS: (keyof HomepageFormValues)[] = [
  'hero_headline_en', 'hero_headline_ar',
  'hero_subheadline_en', 'hero_subheadline_ar',
  'hero_cta_en', 'hero_cta_ar',
  'cta_image_url', 'cta_image_public_id',
  'hero_image_url', 'hero_image_public_id',
  'stats_total_stock', 'stats_models',
  'stats_delivery_en', 'stats_delivery_ar',
  'features_title_en', 'features_title_ar',
  'feature_1_en', 'feature_1_ar', 'feature_1_desc_en', 'feature_1_desc_ar',
  'feature_2_en', 'feature_2_ar', 'feature_2_desc_en', 'feature_2_desc_ar',
  'feature_3_en', 'feature_3_ar', 'feature_3_desc_en', 'feature_3_desc_ar',
  'feature_4_en', 'feature_4_ar', 'feature_4_desc_en', 'feature_4_desc_ar',
  'feature_5_en', 'feature_5_ar', 'feature_5_desc_en', 'feature_5_desc_ar',
]

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-white/2 transition-colors"
      >
        <h3 className="font-semibold text-white">{title}</h3>
        {open ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </button>
      {open && <div className="border-t border-white/10 px-6 pb-6 pt-5 space-y-4">{children}</div>}
    </div>
  )
}

export default function HomepageEditorClient({ defaults }: { defaults: Record<string, string> }) {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()
  const [heroImage, setHeroImage] = useState(defaults['hero_image_url'] ?? '')
  const [heroPublicId, setHeroPublicId] = useState(defaults['hero_image_public_id'] ?? '')
  const [uploadingHero, setUploadingHero] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<HomepageFormValues>({
    resolver: zodResolver(homepageSchema),
    defaultValues: Object.fromEntries(
      SETTINGS_KEYS.map((k) => [k, defaults[k] ?? ''])
    ) as HomepageFormValues,
  })

  const handleHeroUploadSuccess = async (result: any) => {
    const info = result?.info
    const public_id = info?.public_id
    const secure_url = info?.secure_url
    if (!public_id || !secure_url) {
      toast.error('Hero image upload failed')
      return
    }

    setHeroImage(secure_url)
    setHeroPublicId(public_id)
    setValue('hero_image_url', secure_url)
    setValue('hero_image_public_id', public_id)
    toast.success('Hero image uploaded!')
  }

  const onSubmit = async (values: HomepageFormValues) => {
    const rows = SETTINGS_KEYS.map((key) => ({
      key,
      value: values[key] ?? '',
    }))
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
    toast.success('Homepage settings saved!')
  }

  const fieldCls = 'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'
  const labelCls = 'mb-1.5 block text-xs font-medium text-zinc-400'

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{l('homepageEditor')}</h2>
        <p className="mt-1 text-sm text-zinc-500">Edit all homepage content and settings in one place.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero Section */}
        <Section title="🚀 Hero Section">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Headline (English)</label>
              <input {...register('hero_headline_en')} className={fieldCls} placeholder="Ride Smarter. Live Better." />
            </div>
            <div>
              <label className={labelCls}>Headline (Arabic)</label>
              <input {...register('hero_headline_ar')} className={fieldCls} dir="rtl" placeholder="اركب بذكاء. عش بشكل أفضل." />
            </div>
            <div>
              <label className={labelCls}>Subheadline (English)</label>
              <input {...register('hero_subheadline_en')} className={fieldCls} placeholder="Premium electric scooters…" />
            </div>
            <div>
              <label className={labelCls}>Subheadline (Arabic)</label>
              <input {...register('hero_subheadline_ar')} className={fieldCls} dir="rtl" placeholder="سكوترات كهربائية فاخرة…" />
            </div>
            <div>
              <label className={labelCls}>CTA Button (English)</label>
              <input {...register('hero_cta_en')} className={fieldCls} placeholder="Shop Now" />
            </div>
            <div>
              <label className={labelCls}>CTA Button (Arabic)</label>
              <input {...register('hero_cta_ar')} className={fieldCls} dir="rtl" placeholder="تسوق الآن" />
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <label className={labelCls}>Hero Image</label>
            <CldUploadButton
              uploadPreset="scooty do"
              options={{ multiple: false }}
              onOpen={() => setUploadingHero(true)}
              onClose={() => setUploadingHero(false)}
              onSuccess={handleHeroUploadSuccess}
              onError={() => {
                setUploadingHero(false)
                toast.error('Upload failed')
              }}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
            >
              {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploadingHero ? 'Uploading…' : 'Upload Hero Image'}
            </CldUploadButton>
            {heroImage && (
              <div className="mt-3 relative h-48 w-full overflow-hidden rounded-xl border border-white/10">
                {heroPublicId ? (
                  <CldImage
                    src={heroPublicId}
                    width={720}
                    height={480}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt="Hero"
                    className="object-cover"
                  />
                ) : (
                  <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
                )}
              </div>
            )}
          </div>
        </Section>

        {/* Stats Banner */}
        <Section title="📊 Stats Banner">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Total Stock Number</label>
              <input {...register('stats_total_stock')} className={fieldCls} placeholder="500+" />
            </div>
            <div>
              <label className={labelCls}>Number of Models</label>
              <input {...register('stats_models')} className={fieldCls} placeholder="5" />
            </div>
            <div>
              <label className={labelCls}>Delivery Message (English)</label>
              <input {...register('stats_delivery_en')} className={fieldCls} placeholder="Same-day delivery in Cairo" />
            </div>
            <div>
              <label className={labelCls}>Delivery Message (Arabic)</label>
              <input {...register('stats_delivery_ar')} className={fieldCls} dir="rtl" placeholder="توصيل في نفس اليوم بالقاهرة" />
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section title="⚡ Features Section" defaultOpen={false}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Features Section Title (English)</label>
              <input {...register('features_title_en')} className={fieldCls} placeholder="Why Choose Scooty Do?" />
            </div>
            <div>
              <label className={labelCls}>Features Section Title (Arabic)</label>
              <input {...register('features_title_ar')} className={fieldCls} dir="rtl" placeholder="لماذا تختار سكوتي دو؟" />
            </div>
          </div>

          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="rounded-xl border border-white/10 bg-zinc-800/40 p-4 space-y-3">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Feature {n}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Title (English)</label>
                  <input {...register(`feature_${n}_en` as keyof HomepageFormValues)} className={fieldCls} placeholder={`Feature ${n} title`} />
                </div>
                <div>
                  <label className={labelCls}>Title (Arabic)</label>
                  <input {...register(`feature_${n}_ar` as keyof HomepageFormValues)} className={fieldCls} dir="rtl" placeholder={`عنوان الميزة ${n}`} />
                </div>
                <div>
                  <label className={labelCls}>Description (English)</label>
                  <input {...register(`feature_${n}_desc_en` as keyof HomepageFormValues)} className={fieldCls} placeholder="Brief description…" />
                </div>
                <div>
                  <label className={labelCls}>Description (Arabic)</label>
                  <input {...register(`feature_${n}_desc_ar` as keyof HomepageFormValues)} className={fieldCls} dir="rtl" placeholder="وصف مختصر…" />
                </div>
              </div>
            </div>
          ))}
        </Section>

        {/* Save button */}
        <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-white/10 bg-zinc-950/90 px-6 py-4 backdrop-blur-sm lg:-mx-8 lg:px-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {l('saveChanges')}
          </button>
        </div>
      </form>
    </div>
  )
}
