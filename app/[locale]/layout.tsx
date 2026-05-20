import { Inter, Space_Grotesk, Cairo } from 'next/font/google'
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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' })

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
      className={`${inter.variable} ${spaceGrotesk.variable} ${cairo.variable} ${locale === 'ar' ? 'font-arabic' : ''}`}
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
