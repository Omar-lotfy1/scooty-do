'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Clock, ArrowUpRight, Compass } from 'lucide-react'

interface HubData {
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  hours_en: string;
  hours_ar: string;
  mapUrl: string;
  coordinate: string;
}

export function ExperienceHubs({ dynamicHubs = [] }: { dynamicHubs?: HubData[] }) {
  const t = useTranslations('ExperienceHubs')
  const locale = useLocale()
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null)

  useEffect(() => {
    // Check operating hours: 10:00 AM to 9:00 PM Cairo Local Time
    const checkCairoTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Cairo',
          hour: 'numeric',
          hour12: false,
        })
        const hour = parseInt(formatter.format(new Date()), 10)
        setIsOpenNow(hour >= 10 && hour < 21)
      } catch (e) {
        // Fallback to local device time if formatter fails
        const hour = new Date().getHours()
        setIsOpenNow(hour >= 10 && hour < 21)
      }
    }

    checkCairoTime()
    const interval = setInterval(checkCairoTime, 60000) // update every minute
    return () => clearInterval(interval)
  }, [])

  const fallbackHubs = [
    {
      name: t('cairoName'),
      desc: t('cairoDesc'),
      hours: t('cairoHours'),
      mapUrl: 'https://maps.google.com/?q=Heliopolis+Cairo+Egypt',
      gradient: 'from-orange-500/10 to-amber-500/5',
      coordinate: '30.0903, 31.3218',
    },
    {
      name: t('alexName'),
      desc: t('alexDesc'),
      hours: t('alexHours'),
      mapUrl: 'https://maps.google.com/?q=Stanley+Bridge+Alexandria+Egypt',
      gradient: 'from-blue-500/10 to-cyan-500/5',
      coordinate: '31.2357, 29.9485',
    },
  ]

  const mappedDynamicHubs = dynamicHubs.map((hub, i) => ({
    name: locale === 'ar' ? hub.name_ar : hub.name_en,
    desc: locale === 'ar' ? hub.desc_ar : hub.desc_en,
    hours: locale === 'ar' ? hub.hours_ar : hub.hours_en,
    mapUrl: hub.mapUrl,
    gradient: i % 2 === 0 ? 'from-orange-500/10 to-amber-500/5' : 'from-blue-500/10 to-cyan-500/5',
    coordinate: hub.coordinate,
  }))

  const hubs = mappedDynamicHubs.length > 0 ? mappedDynamicHubs : fallbackHubs

  return (
    <section className="mt-24 border-t border-stone-200/60 pt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {hubs.map((hub, index) => (
          <div
            key={index}
            className="group relative rounded-[2rem] border border-stone-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-[0_20px_50px_rgba(255,107,0,0.04)] overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Mesh Gradient Map Placeholder */}
            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${hub.gradient} rounded-bl-[5rem] opacity-70 transition-all duration-500 group-hover:scale-110 z-0`} />

            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <MapPin className="h-6 w-6" />
                </div>
                
                {/* Live pulsing open/closed status badge */}
                {isOpenNow !== null && (
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      isOpenNow
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {isOpenNow ? t('openNow') : t('closed')}
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                {hub.name}
              </h3>
              
              <p className="mt-4 text-stone-600 leading-relaxed max-w-md">
                {hub.desc}
              </p>

              <div className="mt-6 flex flex-col gap-3 border-t border-stone-100 pt-6">
                <div className="flex items-center gap-2.5 text-sm text-stone-500">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span>{hub.hours}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-stone-400">
                  <Compass className="w-4 h-4" />
                  <span className="font-mono text-xs select-all">{hub.coordinate}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap gap-4 pt-4 border-t border-stone-50">
              <a
                href={hub.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group/link"
              >
                {t('getDirections')}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
