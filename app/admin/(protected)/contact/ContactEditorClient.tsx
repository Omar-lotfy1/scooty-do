'use client'

import { useState, useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { contactSchema, type ContactFormValues } from '@/lib/validations/admin'
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'
import { updateContactSettings } from './actions'

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

export default function ContactEditorClient({ defaults }: { defaults: Record<string, any> }) {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contact_title_en: defaults.contact_title_en || '',
      contact_title_ar: defaults.contact_title_ar || '',
      contact_subtitle_en: defaults.contact_subtitle_en || '',
      contact_subtitle_ar: defaults.contact_subtitle_ar || '',
      contact_info_cards: defaults.contact_info_cards || {
        email_title_en: '', email_title_ar: '', email_desc_en: '', email_desc_ar: '', email_address: '',
        phone_title_en: '', phone_title_ar: '', phone_desc_en: '', phone_desc_ar: '', phone_number: '',
      },
      contact_hubs: Array.isArray(defaults.contact_hubs) ? defaults.contact_hubs : [],
      contact_faqs: Array.isArray(defaults.contact_faqs) ? defaults.contact_faqs : [],
    },
  })

  const { fields: hubFields, append: appendHub, remove: removeHub } = useFieldArray({
    control,
    name: 'contact_hubs',
  })

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: 'contact_faqs',
  })

  const onSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      const result = await updateContactSettings(values)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Contact settings saved!')
      }
    })
  }

  const isSaving = isPending || isSubmitting

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{l('contactPageEditor')}</h1>
          <p className="mt-2 text-zinc-400">Manage contact details, hubs, and FAQs across the site.</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-full bg-hp-primary px-6 py-2.5 font-medium text-black hover:bg-hp-primary/90 focus:outline-none focus:ring-2 focus:ring-hp-primary/50 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            l('saveChanges')
          )}
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Header Section */}
        <Section title="Header Section">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">Title (English)</label>
              <input {...register('contact_title_en')} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-white focus:border-hp-primary focus:outline-none" />
              {errors.contact_title_en && <p className="text-red-500 text-xs mt-1">{errors.contact_title_en.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">Title (Arabic)</label>
              <input {...register('contact_title_ar')} dir="rtl" className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-white focus:border-hp-primary focus:outline-none" />
              {errors.contact_title_ar && <p className="text-red-500 text-xs mt-1">{errors.contact_title_ar.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">Subtitle (English)</label>
              <textarea {...register('contact_subtitle_en')} rows={2} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-white focus:border-hp-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">Subtitle (Arabic)</label>
              <textarea {...register('contact_subtitle_ar')} dir="rtl" rows={2} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-white focus:border-hp-primary focus:outline-none" />
            </div>
          </div>
        </Section>

        {/* Info Cards Section */}
        <Section title="Info Cards (Email & Phone)">
          <div className="space-y-6">
            <div className="rounded-lg border border-white/5 bg-black/20 p-4 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Email Card</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title (EN)</label>
                  <input {...register('contact_info_cards.email_title_en')} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title (AR)</label>
                  <input {...register('contact_info_cards.email_title_ar')} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Description (EN)</label>
                  <input {...register('contact_info_cards.email_desc_en')} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Description (AR)</label>
                  <input {...register('contact_info_cards.email_desc_ar')} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Support Email Address</label>
                  <input {...register('contact_info_cards.email_address')} type="email" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/5 bg-black/20 p-4 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Phone Card</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title (EN)</label>
                  <input {...register('contact_info_cards.phone_title_en')} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title (AR)</label>
                  <input {...register('contact_info_cards.phone_title_ar')} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Description (EN)</label>
                  <input {...register('contact_info_cards.phone_desc_en')} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Description (AR)</label>
                  <input {...register('contact_info_cards.phone_desc_ar')} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Phone Number Link</label>
                  <input {...register('contact_info_cards.phone_number')} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Experience Hubs Manager */}
        <Section title="Experience Hubs (Locations)">
          <div className="space-y-4">
            {hubFields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg border border-white/10 bg-black/40 p-4 space-y-4">
                <button
                  type="button"
                  onClick={() => removeHub(index)}
                  className="absolute right-3 top-3 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-white/5 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <h4 className="text-sm font-semibold text-zinc-300">Hub #{index + 1}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Name (EN)</label>
                    <input {...register(`contact_hubs.${index}.name_en`)} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    {errors.contact_hubs?.[index]?.name_en && <p className="text-red-500 text-xs mt-1">{errors.contact_hubs[index].name_en.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Name (AR)</label>
                    <input {...register(`contact_hubs.${index}.name_ar`)} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    {errors.contact_hubs?.[index]?.name_ar && <p className="text-red-500 text-xs mt-1">{errors.contact_hubs[index].name_ar.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Description (EN)</label>
                    <textarea {...register(`contact_hubs.${index}.desc_en`)} rows={2} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Description (AR)</label>
                    <textarea {...register(`contact_hubs.${index}.desc_ar`)} dir="rtl" rows={2} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Hours (EN)</label>
                    <input {...register(`contact_hubs.${index}.hours_en`)} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Hours (AR)</label>
                    <input {...register(`contact_hubs.${index}.hours_ar`)} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                  </div>
                  <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Google Maps URL</label>
                      <input {...register(`contact_hubs.${index}.mapUrl`)} placeholder="https://maps.google.com/..." className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Coordinates (lat, lng)</label>
                      <input {...register(`contact_hubs.${index}.coordinate`)} placeholder="30.0903, 31.3218" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendHub({ name_en: '', name_ar: '', desc_en: '', desc_ar: '', hours_en: '', hours_ar: '', mapUrl: '', coordinate: '' })}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 p-4 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" /> Add New Hub
            </button>
          </div>
        </Section>

        {/* FAQ Manager */}
        <Section title="Frequently Asked Questions (FAQs)">
          <div className="space-y-4">
            {faqFields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg border border-white/10 bg-black/40 p-4 space-y-4">
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute right-3 top-3 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-white/5 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <GripVertical className="h-4 w-4 opacity-50" /> FAQ #{index + 1}
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Question (EN)</label>
                    <input {...register(`contact_faqs.${index}.q_en`)} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    {errors.contact_faqs?.[index]?.q_en && <p className="text-red-500 text-xs mt-1">{errors.contact_faqs[index].q_en.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Question (AR)</label>
                    <input {...register(`contact_faqs.${index}.q_ar`)} dir="rtl" className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    {errors.contact_faqs?.[index]?.q_ar && <p className="text-red-500 text-xs mt-1">{errors.contact_faqs[index].q_ar.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Answer (EN)</label>
                    <textarea {...register(`contact_faqs.${index}.a_en`)} rows={3} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    {errors.contact_faqs?.[index]?.a_en && <p className="text-red-500 text-xs mt-1">{errors.contact_faqs[index].a_en.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Answer (AR)</label>
                    <textarea {...register(`contact_faqs.${index}.a_ar`)} dir="rtl" rows={3} className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white" />
                    {errors.contact_faqs?.[index]?.a_ar && <p className="text-red-500 text-xs mt-1">{errors.contact_faqs[index].a_ar.message}</p>}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendFaq({ q_en: '', q_ar: '', a_en: '', a_ar: '' })}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 p-4 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" /> Add New FAQ
            </button>
          </div>
        </Section>
      </form>
    </div>
  )
}
