import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ProductImageGallery } from '@/components/shop/ProductImageGallery'
import { ProductDetailClient } from './ProductDetailClient'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

export const revalidate = 60

function settingStr(value: unknown): string {
  if (value == null) return ''
  return String(value)
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name_en, name_ar, description_en, description_ar')
    .eq('slug', slug)
    .single()

  const typedProduct = product as unknown as Pick<
    Product,
    'name_en' | 'name_ar' | 'description_en' | 'description_ar'
  > | null

  if (!typedProduct) {
    return { title: 'Not Found | Scooty Do' }
  }

  const title = locale === 'ar' ? typedProduct.name_ar : typedProduct.name_en
  const description = locale === 'ar' ? typedProduct.description_ar : typedProduct.description_en

  return {
    title: `${title} | Scooty Do`,
    description,
    alternates: {
      languages: {
        en: `/en/shop/${slug}`,
        ar: `/ar/shop/${slug}`,
      },
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations('Shop')
  const supabase = await createClient()

  const [{ data: rawProduct }, { data: waData }] = await Promise.all([
    supabase.from('products').select('*').eq('slug', slug).single(),
    supabase.from('site_settings').select('value').eq('key', 'whatsapp_number').single(),
  ])

  const product = rawProduct as unknown as Product | null

  if (!product) {
    notFound()
  }

  const name = locale === 'ar' ? product.name_ar : product.name_en
  const description = locale === 'ar' ? product.description_ar : product.description_en
  const keySpec = locale === 'ar' ? product.key_spec_ar : product.key_spec_en

  const whatsappNumber =
    settingStr(waData?.value) || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const message =
    locale === 'ar'
      ? `مرحباً، أود طلب السكوتر: ${product.name_ar}`
      : `Hello, I would like to order the scooter: ${product.name_en}`
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : '#'

  const cloudinaryIds = product.image_public_ids ?? []
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop']

  const tStrings = {
    price: t('price'),
    currency: t('currency'),
    orderViaWhatsApp: t('orderViaWhatsApp'),
    inStock: t('inStock'),
    outOfStock: t('outOfStock'),
    overview: t('overview'),
    specs: t('specs'),
    deliveryWarranty: t('deliveryWarranty'),
    warrantyText: t('warrantyText'),
    deliveryText: t('deliveryText'),
  }

  return (
    <ProductDetailClient
      name={name ?? ''}
      description={description ?? ''}
      price={product.price}
      keySpec={keySpec}
      isAvailable={product.is_available ?? false}
      stockCount={product.stock_count ?? 0}
      whatsappUrl={whatsappUrl}
      images={images}
      cloudinaryIds={cloudinaryIds}
      t={tStrings}
      locale={locale}
    />
  )
}
