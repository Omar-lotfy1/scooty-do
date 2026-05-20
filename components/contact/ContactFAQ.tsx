'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FaqData {
  q_en: string;
  q_ar: string;
  a_en: string;
  a_ar: string;
}

export function ContactFAQ({ dynamicFaqs = [] }: { dynamicFaqs?: FaqData[] }) {
  const t = useTranslations('ContactFAQ')
  const locale = useLocale()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const fallbackFaqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ]

  const mappedDynamicFaqs = dynamicFaqs.map(faq => ({
    q: locale === 'ar' ? faq.q_ar : faq.q_en,
    a: locale === 'ar' ? faq.a_ar : faq.a_en,
  }))

  const faqItems = mappedDynamicFaqs.length > 0 ? mappedDynamicFaqs : fallbackFaqs

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="mt-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className="rounded-3xl border border-stone-200/80 bg-white p-6 transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left rtl:text-right gap-4 focus:outline-none group cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3 text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  <HelpCircle className="w-5 h-5 text-orange-500 shrink-0" />
                  {item.q}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-stone-50 text-stone-500 transition-transform duration-300 group-hover:bg-orange-50 group-hover:text-orange-600 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-4 text-stone-600 border-t border-stone-100 leading-relaxed text-base">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
