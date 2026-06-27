import { MetadataRoute } from 'next'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const revalidate = 3600 // Revalidate sitemap cache hourly

const locales = ['en', 'ar']
const baseUrl = 'https://www.scootydo.online'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_available', true)

  const productUrls: MetadataRoute.Sitemap = (products || []).flatMap((product) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/shop/${product.slug}`,
      lastModified: product.updated_at || new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/shop/${product.slug}`,
          ar: `${baseUrl}/ar/shop/${product.slug}`,
          'x-default': `${baseUrl}/en/shop/${product.slug}`,
        },
      },
    }))
  )

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/shop', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const staticUrls: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page.path}`,
          ar: `${baseUrl}/ar${page.path}`,
          'x-default': `${baseUrl}/en${page.path}`,
        },
      },
    }))
  )

  return [...staticUrls, ...productUrls]
}
