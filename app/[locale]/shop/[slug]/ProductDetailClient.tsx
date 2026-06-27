'use client'

import { useState, useEffect } from 'react'
import { m, type Variants } from 'framer-motion'
import { ProductImageGallery } from '@/components/shop/ProductImageGallery'
import { cn } from '@/lib/utils'
import { Gauge, Battery, Zap, Shield, Maximize2, Cpu, Weight } from 'lucide-react'

function getSpecDetails(spec: string, isRtl: boolean) {
  let label = ''
  let value = spec
  let IconComponent = Zap

  const cleanSpec = spec.toLowerCase()
  if (cleanSpec.includes('speed') || cleanSpec.includes('سرعة')) {
    IconComponent = Gauge
    label = isRtl ? 'السرعة القصوى' : 'Top Speed'
    value = spec.replace(/^(Top Speed:|سرعة لحد|سرعة)/gi, '').trim()
  } else if (cleanSpec.includes('range') || cleanSpec.includes('مدى')) {
    IconComponent = Battery
    label = isRtl ? 'المدى' : 'Range'
    value = spec.replace(/^(Range:|مدى قيادة لحد|مدى)/gi, '').trim()
  } else if (cleanSpec.includes('motor') || cleanSpec.includes('موتور') || spec.match(/\d+W\b/i)) {
    IconComponent = Cpu
    label = isRtl ? 'المحرك' : 'Motor Power'
    value = spec.replace(/^(Motor:|موتور)/gi, '').trim()
  } else if (cleanSpec.includes('load') || cleanSpec.includes('وزن') || cleanSpec.includes('يستحمل')) {
    IconComponent = Weight
    label = isRtl ? 'الحمل الأقصى' : 'Max Load'
    value = spec.replace(/^(Max Load:|يستحمل وزن لحد|يستحمل)/gi, '').trim()
  } else if (cleanSpec.includes('braking') || cleanSpec.includes('فرامل')) {
    IconComponent = Shield
    label = isRtl ? 'الفرامل' : 'Braking'
    value = spec.replace(/^(Dual Braking System|نظام فرامل مزدوج|فرامل)/gi, '').trim()
    if (!value) value = isRtl ? 'نظام مزدوج' : 'Dual System'
  } else if (cleanSpec.includes('design') || cleanSpec.includes('تصميم') || cleanSpec.includes('يتطوي')) {
    IconComponent = Maximize2
    label = isRtl ? 'التصميم' : 'Design'
    value = spec.replace(/^(Foldable Design|تصميم بيتطوي|بيتطوي)/gi, '').trim()
    if (!value) value = isRtl ? 'قابل للطي' : 'Foldable'
  } else {
    const numMatch = spec.match(/^([\d\.]+\s*[a-zA-Zأ-ي]+)(.*)/)
    if (numMatch) {
      value = numMatch[1]
      label = numMatch[2].trim()
    } else {
      label = isRtl ? 'مواصفات' : 'Specification'
      value = spec
    }
  }

  value = value.replace(/^[:\s\-]+|[:\s\-]+$/g, '').trim()
  label = label.replace(/^[:\s\-]+|[:\s\-]+$/g, '').trim()

  if (!isRtl && value) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }

  return { label, value, IconComponent }
}

interface ProductDetailClientProps {
  name: string
  description: string
  price: number
  keySpec: string | null
  isAvailable: boolean
  stockCount: number
  whatsappUrl: string
  images: string[]
  cloudinaryIds: string[]
  t: {
    price: string
    currency: string
    orderViaWhatsApp: string
    inStock: string
    outOfStock: string
    overview: string
    specs: string
    deliveryWarranty: string
    warrantyText: string
    deliveryText: string
  }
  locale: string
}

export function ProductDetailClient({
  name,
  description,
  price,
  keySpec,
  isAvailable,
  stockCount,
  whatsappUrl,
  images,
  cloudinaryIds,
  t,
  locale
}: ProductDetailClientProps) {
  const isRtl = locale === 'ar'
  const [weight, setWeight] = useState(80)
  const [mode, setMode] = useState<'eco' | 'normal' | 'sport'>('normal')
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowSticky(true)
      } else {
        setShowSticky(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const baseRange = (() => {
    if (!keySpec) return 45
    const match = keySpec.match(/(\d+)\s*(?:km|كم)/i)
    return match ? parseInt(match[1], 10) : 45
  })()

  const weightFactor = weight === 60 ? 1.1 : weight === 80 ? 1.0 : weight === 100 ? 0.9 : 0.8
  const modeFactor = mode === 'eco' ? 1.15 : mode === 'normal' ? 1.0 : 0.8
  const estimatedRange = Math.round(baseRange * weightFactor * modeFactor)

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  }

  // Parse Key Specs for Grid (supports comma, newline, or space-separated lists of spec keywords)
  const specItems = keySpec
    ? (keySpec.includes(',')
        ? keySpec.split(',')
        : keySpec.split(/(?=(?:Range:|Motor|\d+W|Foldable|Dual|\d+(?:\.\d+)?\"|LED|Bluetooth|Max Load:|Speed:|مدى|موتور|تصميم|نظام|كاوتش|شاشة|بيدعم|يستحمل))/i)
      ).map(s => s.trim()).filter(Boolean)
    : []

  return (
    <>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-32 md:pb-16">
        {/* Ambient Glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-hp-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 items-start">
          {/* Left Column: Sticky Gallery */}
          <div className="lg:sticky lg:top-28 self-start z-10">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductImageGallery images={images} cloudinaryIds={cloudinaryIds} alt={name ?? ''} />
            </m.div>
          </div>

          {/* Right Column: Scrollable Details */}
          <m.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={cn("mt-8 sm:px-0 lg:mt-0 flex flex-col", isRtl && "text-right")}
          >
            <m.div variants={fadeInUp}>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-hp-foreground sm:text-5xl lg:text-6xl">{name}</h1>
            </m.div>

            <m.div variants={fadeInUp} className="mt-4">
              <h2 className="sr-only">{t.price}</h2>
              <p className="text-3xl tracking-tight text-hp-primary font-bold">
                {price.toLocaleString(isRtl ? 'ar-EG' : 'en-EG')}{' '}
                <span className="text-xl font-semibold text-hp-muted">{t.currency}</span>
              </p>
            </m.div>
            
            <m.div variants={fadeInUp} className="mt-6">
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <span className={cn("text-sm font-medium text-hp-foreground flex items-center gap-2", isRtl && "flex-row-reverse")}>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </span>
                    {t.inStock}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-500">{t.outOfStock}</span>
                )}
              </div>
            </m.div>

            {/* Premium Typographic Grid for Specs */}
            {specItems.length > 0 && (
              <m.div variants={fadeInUp} className="mt-8 border-t border-hp-border/60 pt-8 pb-2">
                <h3 className={cn("text-xs font-bold uppercase tracking-wider text-hp-muted mb-4", isRtl && "text-right")}>
                  {t.specs}
                </h3>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {specItems.map((spec, i) => {
                    const { label, value, IconComponent } = getSpecDetails(spec, isRtl)
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 shadow-sm transition-all duration-200 hover:border-hp-primary/20 hover:bg-white hover:shadow-md",
                          isRtl ? "text-right items-end" : "text-left items-start"
                        )}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-hp-primary">
                          <IconComponent size={15} strokeWidth={2.2} />
                        </div>
                        <div className="space-y-0.5 w-full">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                            {label}
                          </p>
                          <p className="font-display text-[13px] font-black text-slate-800 leading-snug">
                            {value}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </m.div>
            )}

            {/* Dynamic Range Estimator Card */}
            <m.div variants={fadeInUp} className="mt-8 border-t border-hp-border/60 pt-8">
              <div className="rounded-2xl border border-orange-500/10 bg-orange-500/[0.02] p-5 shadow-sm">
                <div className={cn("flex flex-col gap-1 mb-4", isRtl && "text-right")}>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 justify-start rtl:justify-end">
                    <Zap size={14} className="text-orange-500 animate-pulse" />
                    <span>{isRtl ? 'حاسبة المدى الذكية' : 'Smart Range Estimator'}</span>
                  </h4>
                  <p className="text-xs text-stone-500">
                    {isRtl ? 'احسب مدى القيادة التقريبي حسب وزنك ونمط السرعة' : 'Adjust parameters to estimate your real-world riding range.'}
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Rider Weight Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">{isRtl ? 'وزن السائق' : 'Rider Weight'}</span>
                      <span className="text-orange-600 font-bold">{weight} {isRtl ? 'كجم' : 'kg'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400">60kg</span>
                      <input
                        type="range"
                        min="60"
                        max="120"
                        step="20"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-[10px] font-bold text-slate-400">120kg</span>
                    </div>
                  </div>

                  {/* Speed Mode Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-500 text-left rtl:text-right">
                      {isRtl ? 'وضع القيادة' : 'Riding Mode'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'eco', label_en: 'ECO Mode', label_ar: 'الوضع الاقتصادي', desc_en: '15 km/h limit', desc_ar: 'سرعة ١٥ كم/س' },
                        { key: 'normal', label_en: 'Normal', label_ar: 'العادي', desc_en: '25 km/h standard', desc_ar: 'سرعة ٢٥ كم/س' },
                        { key: 'sport', label_en: 'Sport Mode', label_ar: 'الوضع الرياضي', desc_en: 'Max performance', desc_ar: 'أقصى أداء' },
                      ].map((item) => {
                        const active = mode === item.key
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setMode(item.key as any)}
                            className={cn(
                              "flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all cursor-pointer",
                              active
                                ? "border-orange-500 bg-orange-50/50 text-orange-600 shadow-sm"
                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                            )}
                          >
                            <span className="text-[11px] font-bold">{isRtl ? item.label_ar : item.label_en}</span>
                            <span className="text-[8px] opacity-75 mt-0.5">{isRtl ? item.desc_ar : item.desc_en}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Calculated Output Display */}
                  <div className="flex items-center justify-between rounded-xl bg-orange-500/5 p-4 border border-orange-500/10">
                    <span className="text-xs font-semibold text-slate-600">
                      {isRtl ? 'المدى المتوقع:' : 'Estimated Range:'}
                    </span>
                    <span className="text-xl font-black text-orange-600 flex items-baseline gap-1">
                      <m.span
                        key={estimatedRange}
                        initial={{ scale: 0.7, opacity: 0.4 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                        className="inline-block"
                      >
                        {estimatedRange}
                      </m.span>
                      <span className="text-xs font-bold text-orange-500/80">{isRtl ? 'كم' : 'km'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Desktop CTA (Hidden on mobile to use sticky bar instead) */}
            <m.div variants={fadeInUp} className="mt-10 hidden sm:flex">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center rounded-2xl bg-hp-primary px-8 py-5 text-lg font-bold text-white transition-all duration-300 hover:bg-hp-primary-bright shadow-hp-glow hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] focus:outline-none"
              >
                {t.orderViaWhatsApp}
              </a>
            </m.div>
            
            {/* Extended Details / Editorial Layout */}
            <m.div variants={fadeInUp} className="mt-12">
              <section className="rounded-2xl border border-hp-border/80 bg-hp-surface/30 p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-hp-primary mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-hp-primary" />
                  {t.overview}
                </h3>
                <div className="space-y-4">
                  {description.split('\n\n').filter(Boolean).map((para, idx) => (
                    <p
                      key={idx}
                      className={cn(
                        "text-sm leading-relaxed text-slate-600",
                        idx === 0 && "text-slate-800 text-[15px] font-medium leading-relaxed"
                      )}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            </m.div>

            {/* Specs Accordions for Info/Policies */}
            <m.div variants={fadeInUp} className="mt-6 space-y-2">
              {[
                {
                  id: 'delivery',
                  title_en: 'Shipping & Delivery',
                  title_ar: 'الشحن والتوصيل',
                  content_en: 'We ship across Egypt. Cairo & Giza within 24 hours. Alexandria within 48 hours. Other governorates in 2-3 days.',
                  content_ar: 'نشحن لجميع محافظات مصر. التوصيل للقاهرة والجيزة خلال ٢٤ ساعة. الإسكندرية في ٤٨ ساعة. باقي المحافظات خلال يومين إلى ٣ أيام.',
                },
                {
                  id: 'warranty',
                  title_en: 'Warranty & Service',
                  title_ar: 'الضمان والصيانة',
                  content_en: 'Enjoy 1-Year comprehensive warranty on the motor, battery pack, and controller. Free diagnostic services at our center.',
                  content_ar: 'استمتع بضمان شامل لمدة عام على المحرك والبطارية والكنترولر. نقدم فحص مجاني في مركز صيانة Scooty Do الخاص بنا.',
                },
                {
                  id: 'returns',
                  title_en: 'Easy 14-Day Returns',
                  title_ar: 'الاسترجاع السهل خلال ١٤ يوم',
                  content_en: 'Hassle-free 14 days refund policy. The product must be in its original package and unused condition.',
                  content_ar: 'استرجاع واسترداد كامل للأموال خلال ١٤ يوم. يجب أن يكون السكوتر بحالته الأصلية غير المستخدمة وداخل كرتونته.',
                },
              ].map((accordion) => {
                const isOpen = openAccordion === accordion.id
                return (
                  <div key={accordion.id} className="rounded-2xl border border-hp-border/80 bg-hp-surface/30 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? null : accordion.id)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left rtl:text-right cursor-pointer"
                    >
                      <span className="text-xs font-bold text-stone-900">
                        {isRtl ? accordion.title_ar : accordion.title_en}
                      </span>
                      <span className={cn("text-stone-400 transition-transform duration-200 text-[10px]", isOpen && "rotate-180")}>
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-white/40 px-5 py-4 text-xs leading-relaxed text-slate-500 rtl:text-right">
                        {isRtl ? accordion.content_ar : accordion.content_en}
                      </div>
                    )}
                  </div>
                )
              })}
            </m.div>

          </m.div>
        </div>
      </div>

      {/* Desktop Smooth Scrolling Sticky Top Bar */}
      {showSticky && (
        <m.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-0 inset-x-0 z-50 hidden sm:flex border-b border-hp-border bg-white/95 backdrop-blur-md px-8 py-3.5 shadow-sm justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-black text-stone-950">{name}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-base font-black text-orange-600">
              {isRtl ? `${price.toLocaleString('ar-EG')} ج.م` : `EGP ${price.toLocaleString('en-EG')}`}
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-hp-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-hp-primary-bright shadow-hp-glow hover:shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
            >
              {t.orderViaWhatsApp}
            </a>
          </div>
        </m.div>
      )}

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200/80 bg-white/80 backdrop-blur-xl p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center rounded-2xl bg-hp-primary px-4 py-4 text-base font-bold text-white shadow-hp-glow active:scale-[0.98] transition-transform"
        >
          {t.orderViaWhatsApp}
        </a>
      </div>
    </>
  )
}
