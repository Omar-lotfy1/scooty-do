import { Link } from '@/i18n/routing'
import { Database } from '@/types/database'
import { ShoppingCart } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

import Image from 'next/image'

type Product = Database['public']['Tables']['products']['Row']

export function ProductCard({ product }: { product: Product }) {
  // Using the first image or a placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop'

  return (
    <Link href={`/shop/${product.slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white border border-slate-100">
          {product.image_public_ids && product.image_public_ids.length > 0 ? (
            <CldImage
              src={product.image_public_ids[0]}
              width={600}
              height={750}
              crop="pad"
              background="white"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={product.name_en}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={product.name_en}
              width={600}
              height={750}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {!product.is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
