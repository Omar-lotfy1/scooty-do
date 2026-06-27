import { Link } from '@/i18n/routing'
import { Database } from '@/types/database'
import { ShoppingCart, Gauge, Battery } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

type Product = Database['public']['Tables']['products']['Row']

function parseCardSpecs(keySpec: string | null, isRtl: boolean) {
  const specs = {
    speed: '',
    range: ''
  }
  if (!keySpec) return specs

  const items = (keySpec.includes(',')
    ? keySpec.split(',')
    : keySpec.split(/(?=(?:Range:|Motor|\d+W|Foldable|Dual|\d+(?:\.\d+)?\"|LED|Bluetooth|Max Load:|Speed:|مدى|موتور|تصميم|نظام|كاوتش|شاشة|بيدعم|يستحمل))/i)
  ).map(s => s.trim()).filter(Boolean)

  items.forEach(item => {
    const clean = item.toLowerCase()
    if (clean.includes('speed') || clean.includes('سرعة')) {
      specs.speed = item.replace(/^(Top Speed:|سرعة لحد|سرعة|:\s*)/gi, '').trim()
    } else if (clean.includes('range') || clean.includes('مدى')) {
      specs.range = item.replace(/^(Range:|مدى قيادة لحد|مدى|:\s*)/gi, '').trim()
    }
  })

  specs.speed = specs.speed.replace(/^[:\s\-]+|[:\s\-]+$/g, '').trim()
  specs.range = specs.range.replace(/^[:\s\-]+|[:\s\-]+$/g, '').trim()

  return specs
}

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const cardSpecs = parseCardSpecs(isRtl ? product.key_spec_ar : product.key_spec_en, isRtl)

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop'

  const secondaryImageUrl = product.images && product.images.length > 1 
    ? product.images[1] 
    : null

  const secondaryPublicId = product.image_public_ids && product.image_public_ids.length > 1 
    ? product.image_public_ids[1] 
    : null

  return (
    <Link href={`/shop/${product.slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-hp-primary/10 hover:shadow-[0_20px_45px_rgba(255,107,0,0.08)]">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white border border-slate-100">
          {product.image_public_ids && product.image_public_ids.length > 0 ? (
            <>
              <CldImage
                src={product.image_public_ids[0]}
                width={600}
                height={750}
                crop="pad"
                background="white"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={product.name_en}
                className="h-full w-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
              />
              {secondaryPublicId && (
                <CldImage
                  src={secondaryPublicId}
                  width={600}
                  height={750}
                  crop="pad"
                  background="white"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={product.name_en}
                  className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                />
              )}
            </>
          ) : (
            <>
              <Image
                src={imageUrl}
                alt={product.name_en}
                width={600}
                height={750}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
              />
              {secondaryImageUrl && (
                <Image
                  src={secondaryImageUrl}
                  alt={product.name_en}
                  width={600}
                  height={750}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                />
              )}
            </>
          )}
          {!product.is_available && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-stone-900">
                {product.name_ar ? 'نفدت الكمية' : 'Out of Stock'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-1 flex-col rtl:text-right">
          <h3 className="text-lg font-bold text-stone-900 line-clamp-1">
            <span className="ltr:block rtl:hidden">{product.name_en}</span>
            <span className="ltr:hidden rtl:block">{product.name_ar}</span>
          </h3>
          <p className="mt-1 text-sm text-stone-500 line-clamp-2 flex-1">
            <span className="ltr:block rtl:hidden">{product.description_en}</span>
            <span className="ltr:hidden rtl:block">{product.description_ar}</span>
          </p>

          {/* Speed & Range mini spec row */}
          {(cardSpecs.speed || cardSpecs.range) && (
            <div className={cn("mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500", isRtl && "flex-row-reverse")}>
              {cardSpecs.speed && (
                <span className="flex items-center gap-1 rounded-lg bg-slate-100/80 px-2 py-1 text-[10px] text-slate-600">
                  <Gauge size={11} className="text-hp-primary" />
                  <span>{cardSpecs.speed}</span>
                </span>
              )}
              {cardSpecs.range && (
                <span className="flex items-center gap-1 rounded-lg bg-slate-100/80 px-2 py-1 text-[10px] text-slate-600">
                  <Battery size={11} className="text-hp-primary" />
                  <span>{cardSpecs.range}</span>
                </span>
              )}
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-orange-600">
              <span className="ltr:inline rtl:hidden">EGP {product.price?.toLocaleString('en-EG') ?? product.price}</span>
              <span className="ltr:hidden rtl:inline">{product.price?.toLocaleString('ar-EG') ?? product.price} ج.م</span>
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white transition-transform group-hover:scale-110">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
