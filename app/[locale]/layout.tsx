import type { Metadata } from 'next'
import { Outfit, Plus_Jakarta_Sans, Tajawal } from 'next/font/google'
import '@/app/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DynamicFloatingWhatsApp } from '@/components/ui/DynamicFloatingWhatsApp'
import { LazyMotion, domMax } from 'framer-motion'
import { createClient } from '@/lib/supabase/server'
import { ScrollBehavior } from '@/components/ScrollBehavior'
import { PageTransition } from '@/components/motion/PageTransition'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})
const tajawal = Tajawal({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['300', '400', '500', '700', '800', '900'],
  display: 'swap',
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'ar' ? 'en' : 'ar'
  const baseUrl = 'https://www.scootydo.online'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'Scooty Do — Electric Scooters in Egypt | سكوتر كهربائي في مصر',
      template: '%s | Scooty Do',
    },
    description: 'Premier supplier of high-performance electric scooters in Egypt. Fast delivery and localized warranty. | أفضل سكوترات كهربائية في مصر.',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        [locale]: `${baseUrl}/${locale}`,
        [otherLocale]: `${baseUrl}/${otherLocale}`,
        'x-default': `${baseUrl}/en`,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const supabase = await createClient()
  const { data: annSettings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', [
      'announcement_visible',
      'announcement_text_en',
      'announcement_text_ar',
      'announcement_bg_color',
      'whatsapp_number',
      'ticker_segment_2_en',
      'ticker_segment_2_ar',
      'ticker_segment_3_en',
      'ticker_segment_3_ar',
      'ticker_segment_4_en',
      'ticker_segment_4_ar',
    ])

  const annMap = Object.fromEntries(
    (annSettings ?? []).map((r) => [r.key, String(r.value ?? '')])
  )
  const announcementVisible = annMap.announcement_visible === 'true'
  const announcementText =
    locale === 'ar'
      ? annMap.announcement_text_ar || ''
      : annMap.announcement_text_en || ''
  const announcementBg =
    (annMap.announcement_bg_color as 'orange' | 'black') || 'orange'
  const whatsappNumber =
    annMap.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${outfit.variable} ${tajawal.variable} ${locale === 'ar' ? 'font-arabic' : ''}`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.cloudinary.com" />
        <link rel="dns-prefetch" href="https://api.cloudinary.com" />
      </head>
      <body className="min-h-screen bg-hp-background font-sans text-hp-foreground antialiased selection:bg-hp-primary/20 selection:text-hp-foreground flex flex-col">
        <ScrollBehavior />
        <NextIntlClientProvider messages={messages}>
          <LazyMotion features={domMax}>
          <Header
            announcementVisible={announcementVisible}
            announcementText={announcementText}
            announcementBg={announcementBg}
            tickerSegment2={locale === 'ar' ? annMap.ticker_segment_2_ar : annMap.ticker_segment_2_en}
            tickerSegment3={locale === 'ar' ? annMap.ticker_segment_3_ar : annMap.ticker_segment_3_en}
            tickerSegment4={locale === 'ar' ? annMap.ticker_segment_4_ar : annMap.ticker_segment_4_en}
          />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <DynamicFloatingWhatsApp phoneNumber={whatsappNumber} />
          <Footer />
          </LazyMotion>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
