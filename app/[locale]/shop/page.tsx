import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { ShopGrid } from '@/components/shop/ShopGrid'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: titleData } = (await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `seo_shop_title_${locale}`)
    .single()) as any

  const { data: descData } = (await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `seo_shop_description_${locale}`)
    .single()) as any

  return {
    title: titleData?.value ? String(titleData.value) : 'Shop | Scooty Do',
    description: descData?.value ? String(descData.value) : 'Browse our premium electric scooters',
    alternates: {
      languages: {
        en: '/en/shop',
        ar: '/ar/shop',
      },
    },
  }
}

export default async function ShopPage() {
  const t = await getTranslations('Shop')
  const supabase = await createClient()

  const { data: rawProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const products = rawProducts as unknown as Product[]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <div className="mb-8 rtl:text-right">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t('title')}
        </h1>
      </div>
      
      <ShopGrid initialProducts={products || []} />
    </div>
  )
}
