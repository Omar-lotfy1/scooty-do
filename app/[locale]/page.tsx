import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/home/sections/HeroSection'
import { TrustStrip } from '@/components/home/sections/TrustStrip'
import { FeaturesSection } from '@/components/home/sections/FeaturesSection'
import { ProductGridSection } from '@/components/home/sections/ProductGridSection'
import { CTASections } from '@/components/home/sections/CTASections'
import homepageDataEn from '@/data/homepage.json'
import homepageDataAr from '@/data/homepage_ar.json'
import type { HomePageContent, ProductSectionContent, FeatureSectionContent } from '@/types/homepage'
import type { Database } from '@/types/database'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const EnvironmentalImpact = dynamic(
  () => import('@/components/home/sections/EnvironmentalImpact').then((mod) => mod.EnvironmentalImpact),
  { ssr: true }
)

const TestimonialsSection = dynamic(
  () => import('@/components/home/sections/TestimonialsSection').then((mod) => mod.TestimonialsSection),
  { ssr: true }
)

const LifestyleGallery = dynamic(
  () => import('@/components/home/sections/LifestyleGallery').then((mod) => mod.LifestyleGallery),
  { ssr: true }
)

function EnvironmentalImpactSkeleton() {
  return (
    <div className="py-24 lg:py-32 bg-hp-background/50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="h-6 w-1/3 bg-hp-border rounded-full" />
            <div className="h-12 w-3/4 bg-hp-border rounded-xl" />
            <div className="h-24 w-full bg-hp-border rounded-2xl" />
          </div>
          <div className="h-[400px] bg-hp-border rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  )
}

function TestimonialsSkeleton() {
  return (
    <div className="py-24 lg:py-32 bg-hp-background/50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 mb-14">
          <div className="h-6 w-24 bg-hp-border rounded-full" />
          <div className="h-10 w-64 bg-hp-border rounded-xl" />
          <div className="h-6 w-96 bg-hp-border rounded-lg" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-hp-card border border-hp-border rounded-[2rem] p-7 space-y-6">
              <div className="h-6 w-12 bg-hp-border rounded-full" />
              <div className="h-16 w-full bg-hp-border rounded-xl" />
              <div className="h-10 w-1/2 bg-hp-border rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LifestyleSkeleton() {
  return (
    <div className="py-24 lg:py-32 bg-hp-background/50 animate-pulse">
      <div className="flex flex-col items-center space-y-4 mb-16 px-4">
        <div className="h-6 w-24 bg-hp-border rounded-full" />
        <div className="h-12 w-80 bg-hp-border rounded-xl" />
        <div className="h-6 w-96 bg-hp-border rounded-lg" />
      </div>
      <div className="flex gap-6 overflow-hidden px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[18rem] h-[24rem] sm:w-[22rem] sm:h-[30rem] bg-hp-border rounded-[2.5rem] shrink-0" />
        ))}
      </div>
    </div>
  )
}

type Product = Database['public']['Tables']['products']['Row']

export const revalidate = 60

function settingStr(value: unknown): string {
  if (value == null) return ''
  return String(value)
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: titleData } = (await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `seo_home_title_${locale}`)
    .single()) as { data: { value: unknown } | null }

  const { data: descData } = (await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `seo_home_description_${locale}`)
    .single()) as { data: { value: unknown } | null }

  const hp = (locale === 'ar' ? homepageDataAr : homepageDataEn) as HomePageContent

  return {
    title: titleData?.value ? settingStr(titleData.value) : hp.seo.title,
    description: descData?.value ? settingStr(descData.value) : hp.seo.description,
    keywords: hp.seo.keywords,
    alternates: {
      languages: { en: '/en', ar: '/ar' },
    },
  }
}

function buildFeaturesContent(
  settings: Record<string, string>,
  locale: string,
  hp: HomePageContent
): FeatureSectionContent {
  const title =
    locale === 'ar'
      ? settings.features_title_ar || hp.features.title
      : settings.features_title_en || hp.features.title

  const items = [1, 2, 3, 4, 5]
    .map((n, i) => {
      const titleKey = locale === 'ar' ? `feature_${n}_ar` : `feature_${n}_en`
      const descKey = locale === 'ar' ? `feature_${n}_desc_ar` : `feature_${n}_desc_en`
      const itemTitle = settings[titleKey]
      if (!itemTitle) return null
      return {
        title: itemTitle,
        description: settings[descKey] || hp.features.items[i]?.description || '',
        stat: hp.features.items[i]?.stat ?? '',
        icon: hp.features.items[i]?.icon ?? 'zap',
      }
    })
    .filter(Boolean) as FeatureSectionContent['items']

  return {
    ...hp.features,
    title,
    items: items.length ? items : hp.features.items,
  }
}

function badgeLabel(status: string | null, t: (key: string) => string): string {
  switch (status) {
    case 'Almost Gone':
      return t('almostGone')
    case 'Limited Stock':
      return t('limitedStock')
    default:
      return t('inStock')
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const hp = (locale === 'ar' ? homepageDataAr : homepageDataEn) as HomePageContent
  const tProducts = await getTranslations('Products')
  const tHero = await getTranslations('Hero')

  const supabase = await createClient()

  const [productsRes, settingsRes] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at')
      .limit(8),
    supabase.from('site_settings').select('key, value'),
  ])

  const liveProducts = (productsRes.data ?? []) as unknown as Product[]

  const rawSettings = Object.fromEntries(
    (settingsRes.data ?? []).map((r) => [r.key, r.value])
  )
  const stringSettings: Record<string, string> = {}
  for (const [key, val] of Object.entries(rawSettings)) {
    if (val !== null && typeof val !== 'object') {
      stringSettings[key] = settingStr(val)
    } else if (val === null) {
      stringSettings[key] = ''
    }
  }

  const lifestyleImagesVal = rawSettings.lifestyle_images
  let lifestyleImages = null
  if (lifestyleImagesVal) {
    try {
      lifestyleImages = typeof lifestyleImagesVal === 'string'
        ? JSON.parse(lifestyleImagesVal)
        : lifestyleImagesVal
    } catch (e) {
      console.error('Failed to parse lifestyle_images', e)
    }
  }

  const localizedName = locale === 'ar' ? 'name_ar' : 'name_en'
  const localizedDesc = locale === 'ar' ? 'description_ar' : 'description_en'

  const heroHeadline =
    locale === 'ar'
      ? stringSettings.hero_headline_ar || hp.hero.title
      : stringSettings.hero_headline_en || hp.hero.title

  const heroSub =
    locale === 'ar'
      ? stringSettings.hero_subheadline_ar || hp.hero.description
      : stringSettings.hero_subheadline_en || hp.hero.description

  const heroCta =
    locale === 'ar'
      ? stringSettings.hero_cta_ar || hp.hero.primaryCta.label
      : stringSettings.hero_cta_en || hp.hero.primaryCta.label

  const heroImage = stringSettings.hero_image_url || hp.hero.image.src

  const statsOverride = [
    {
      value: stringSettings.stats_models || hp.hero.stats[0]?.value || '',
      label: tHero('statRange'),
    },
    {
      value: hp.hero.stats[1]?.value || '',
      label: tHero('statPayload'),
    },
    {
      value: stringSettings.stats_total_stock || hp.hero.stats[2]?.value || '',
      label: tHero('statStock'),
    },
  ]

  const heroForLocale = {
    ...hp.hero,
    eyebrow: tHero('eyebrow'),
    accent: tHero('accent'),
    secondaryCta: {
      ...hp.hero.secondaryCta,
      label: tHero('secondaryCta'),
    },
  }

  const featuresContent = buildFeaturesContent(stringSettings, locale, hp)

  const productContent: ProductSectionContent =
    liveProducts.length > 0
      ? {
          ...hp.products,
          eyebrow: tProducts('eyebrow'),
          title: tProducts('title'),
          description: tProducts('description'),
          items: liveProducts.slice(0, 4).map((p) => ({
            id: p.id,
            name: p[localizedName] ?? '',
            category: badgeLabel(p.badge_status, tProducts),
            price: p.price ?? 0,
            stock: p.stock_count ?? 0,
            tagline: (() => {
              const raw = (p[localizedDesc] ?? '') as string
              return raw.length > 80 ? raw.slice(0, 80).trimEnd() + '…' : raw
            })(),
            image: {
              src: p.images && p.images.length > 0 ? p.images[0] : '/images/scooter-3.png',
              alt: p[localizedName] ?? '',
              width: 900,
              height: 900,
            },
            specs: [
              {
                label: tProducts('speed'),
                value: (() => {
                  const raw = (p.key_spec_en?.split(',')[0] ?? '').trim()
                  // Extract a pattern like "25 km/h" or "45km/h" from any long string
                  const match = raw.match(/(\d+(?:\.\d+)?\s*km\/h)/i)
                  return match ? match[1] : raw.slice(0, 20) || '25 km/h'
                })(),
              },
              {
                label: tProducts('battery'),
                value: (() => {
                  const raw = locale === 'ar'
                    ? (p.key_spec_ar?.split(',')[1] ?? '').trim()
                    : (p.key_spec_en?.split(',')[1] ?? '').trim()
                  return raw.slice(0, 24) || (locale === 'ar' ? 'بطارية طويلة المدى' : 'Long-range')
                })(),
              },
            ],
            primaryCta: { label: tProducts('reserveNow'), href: `/${locale}/shop/${p.slug}` },
          })),
          viewMoreLabel: tProducts('viewMoreModels'),
          viewMoreHref: '/shop',
        }
      : {
          ...hp.products,
          eyebrow: tProducts('eyebrow'),
          title: tProducts('title'),
          description: tProducts('description'),
          viewMoreLabel: tProducts('viewMoreModels'),
          viewMoreHref: '/shop',
        }

  return (
    <div className="flex flex-col">
      <HeroSection
        hero={heroForLocale}
        headlineOverride={heroHeadline}
        subOverride={heroSub}
        ctaOverride={heroCta}
        imageOverride={heroImage}
        imagePublicIdOverride={stringSettings.hero_image_public_id}
        statsOverride={statsOverride}
      />
      <TrustStrip items={hp.trustStrip} />
      <FeaturesSection content={featuresContent} />
      <ProductGridSection content={productContent} />
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection content={hp.testimonials} />
      </Suspense>
      <Suspense fallback={<EnvironmentalImpactSkeleton />}>
        <EnvironmentalImpact />
      </Suspense>
      <Suspense fallback={<LifestyleSkeleton />}>
        <LifestyleGallery images={lifestyleImages} />
      </Suspense>
    </div>
  )
}
