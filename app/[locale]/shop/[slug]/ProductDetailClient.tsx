'use client'

import { m, type Variants } from 'framer-motion'
import { ProductImageGallery } from '@/components/shop/ProductImageGallery'
import { cn } from '@/lib/utils'

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

  // Parse Key Specs for Grid if possible (assuming comma separated)
  const specItems = keySpec ? keySpec.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-32 lg:pb-16">
        
        {/* Ambient Glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-hp-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Gallery */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="opacity-0"
          >
            <ProductImageGallery images={images} cloudinaryIds={cloudinaryIds} alt={name ?? ''} />
          </m.div>

          {/* Details */}
          <m.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={cn("mt-10 sm:px-0 lg:mt-0 flex flex-col opacity-0", isRtl && "text-right")}
          >
            <m.div variants={fadeInUp}>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-hp-foreground sm:text-5xl lg:text-6xl">{name}</h1>
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
              <m.div variants={fadeInUp} className="mt-10 border-y border-hp-border py-6">
                <div className={cn("grid gap-6 grid-cols-1 min-[360px]:grid-cols-2", isRtl && "text-right")}>
                  {specItems.map((spec, i) => {
                    // Try to separate numbers from text to make numbers bold (Premium typography)
                    // e.g. "30 KM Range" -> "30 KM" and "Range"
                    const match = spec.match(/^([\d\.]+\s*[a-zA-Z]+)(.*)/)
                    if (match) {
                      return (
                        <div key={i} className="flex flex-col">
                          <span className="font-display text-2xl font-bold text-hp-foreground">{match[1]}</span>
                          <span className="text-sm font-medium text-hp-muted">{match[2].trim()}</span>
                        </div>
                      )
                    }
                    // Fallback if it doesn't match the pattern
                    return (
                      <div key={i} className="flex flex-col">
                        <span className="font-display text-lg font-bold text-hp-foreground">{spec}</span>
                      </div>
                    )
                  })}
                </div>
              </m.div>
            )}

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
            <m.div variants={fadeInUp} className="mt-12 space-y-12">
              <section>
                <h3 className="text-lg font-semibold text-hp-foreground mb-4">{t.overview}</h3>
                <p className="text-base text-hp-muted leading-relaxed whitespace-pre-wrap">{description}</p>
              </section>
            </m.div>
          </m.div>
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-white/10 bg-black/80 backdrop-blur-2xl p-4 safe-area-bottom">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center rounded-2xl bg-hp-primary px-4 py-4 text-base font-bold text-white shadow-hp-glow"
        >
          {t.orderViaWhatsApp}
        </a>
      </div>
    </>
  )
}
