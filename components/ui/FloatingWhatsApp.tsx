'use client'

import { MessageCircle } from 'lucide-react'
import { m } from 'framer-motion'
import { useLocale } from 'next-intl'

export function FloatingWhatsApp({ phoneNumber }: { phoneNumber?: string }) {
  const locale = useLocale()
  const number = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const message =
    locale === 'ar' ? 'مرحباً، أود الاستفسار عن' : 'Hello, I would like to inquire about'
  const whatsappUrl = number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : '#'

  if (!number) return null

  return (
    <m.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl rtl:left-6 rtl:right-auto"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </m.a>
  )
}
