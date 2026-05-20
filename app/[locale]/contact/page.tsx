import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { ContactForm } from '@/components/contact/ContactForm'
import { ExperienceHubs } from '@/components/contact/ExperienceHubs'
import { ContactFAQ } from '@/components/contact/ContactFAQ'
import { Mail, Phone } from 'lucide-react'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: titleData } = (await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `seo_contact_title_${locale}`)
    .single()) as any

  const { data: descData } = (await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `seo_contact_description_${locale}`)
    .single()) as any

  return {
    title: titleData?.value ? String(titleData.value) : 'Contact Us | Scooty Do',
    description: descData?.value ? String(descData.value) : 'Get in touch with our team',
    alternates: {
      languages: {
        en: '/en/contact',
        ar: '/ar/contact',
      },
    },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('Contact')
  const supabase = await createClient()

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', [
      'contact_title_en',
      'contact_title_ar',
      'contact_subtitle_en',
      'contact_subtitle_ar',
      'contact_info_cards',
      'contact_hubs',
      'contact_faqs'
    ])

  const settings: Record<string, any> = {}
  for (const row of settingsData ?? []) {
    if (["contact_info_cards", "contact_hubs", "contact_faqs"].includes(row.key)) {
      settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    } else {
      settings[row.key] = typeof row.value === 'string' ? row.value : String(row.value);
    }
  }

  const title = (locale === 'ar' ? settings.contact_title_ar : settings.contact_title_en) || t('title')
  const subtitle = (locale === 'ar' ? settings.contact_subtitle_ar : settings.contact_subtitle_en) || t('subtitle')

  const infoCards = settings.contact_info_cards || {}
  const emailTitle = (locale === 'ar' ? infoCards.email_title_ar : infoCards.email_title_en) || t('emailUs')
  const emailDesc = (locale === 'ar' ? infoCards.email_desc_ar : infoCards.email_desc_en) || t('emailUsDesc')
  const emailAddress = infoCards.email_address || 'support@scootydo.com'

  const phoneTitle = (locale === 'ar' ? infoCards.phone_title_ar : infoCards.phone_title_en) || t('callUs')
  const phoneDesc = (locale === 'ar' ? infoCards.phone_desc_ar : infoCards.phone_desc_en) || t('callUsDesc')
  const phoneNumber = infoCards.phone_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  const hubs = Array.isArray(settings.contact_hubs) ? settings.contact_hubs : []
  const faqs = Array.isArray(settings.contact_faqs) ? settings.contact_faqs : []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-slate-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 rtl:flex-row-reverse">
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 rtl:text-right">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Mail className="w-40 h-40" />
            </div>
            <div className="relative z-10 flex items-start gap-4 rtl:flex-row-reverse">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{emailTitle}</h3>
                <p className="mt-2 text-slate-500">{emailDesc}</p>
                <a href={`mailto:${emailAddress}`} className="mt-4 block font-semibold text-orange-600 hover:text-orange-500">
                  {emailAddress}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <Phone className="w-40 h-40" />
            </div>
            <div className="relative z-10 flex items-start gap-4 rtl:flex-row-reverse">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{phoneTitle}</h3>
                <p className="mt-2 text-slate-500">{phoneDesc}</p>
                <a href={`tel:${phoneNumber}`} className="mt-4 block font-semibold text-orange-600 hover:text-orange-500" dir="ltr">
                  {phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 backdrop-blur-md">
          <ContactForm />
        </div>

      </div>

      {/* Experience Centers (Flagship Showrooms) */}
      <ExperienceHubs dynamicHubs={hubs} />

      {/* Instant FAQ Accordion Engine */}
      <ContactFAQ dynamicFaqs={faqs} />
    </div>
  )
}
