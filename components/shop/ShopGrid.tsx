'use client'

import { useState } from 'react'
import { useShopStore } from '@/store/shopStore'
import { ProductCard } from '@/components/ui/ProductCard'
import { Database } from '@/types/database'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { m } from 'framer-motion'

type Product = Database['public']['Tables']['products']['Row']

export function ShopGrid({ initialProducts }: { initialProducts: Product[] }) {
  const t = useTranslations('Shop')
  const { sortBy, inStockOnly, setSortBy, setInStockOnly } = useShopStore()
  const [activeCategory, setActiveCategory] = useState("All Models")

  const categories = [
    { key: "All Models", label: t('catAll') },
    { key: "Commuter", label: t('catCommuter') },
    { key: "Performance", label: t('catPerformance') },
    { key: "Portable", label: t('catPortable') }
  ]

  // Filter products
  let filtered = [...initialProducts]
  
  if (inStockOnly) {
    filtered = filtered.filter(p => p.is_available)
  }

  if (activeCategory !== "All Models") {
    filtered = filtered.filter(p => {
      const term = activeCategory.toLowerCase()
      const searchable = `${p.name_en} ${p.description_en} ${p.key_spec_en}`.toLowerCase()
      return searchable.includes(term)
    })
  }

  // Sort products
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
  }

  return (
    <div>
      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-3 rtl:flex-row-reverse">
        {categories.map((cat) => {
          const active = activeCategory === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="relative rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none cursor-pointer"
              style={{
                color: active ? '#fff' : '#6b7280',
                border: '1px solid transparent',
              }}
            >
              {active && (
                <m.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 -z-10 rounded-full bg-hp-primary shadow-hp-glow"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {!active && (
                <div className="absolute inset-0 -z-10 rounded-full border border-slate-200 bg-white hover:border-hp-primary/30 transition-colors" />
              )}
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center rtl:flex-row-reverse">
        <div className="flex items-center gap-2 rtl:flex-row-reverse">
          <Switch 
            id="in-stock" 
            checked={inStockOnly} 
            onCheckedChange={setInStockOnly}
          />
          <Label htmlFor="in-stock" className="text-sm font-medium text-stone-700">
            {t('inStockOnly')}
          </Label>
        </div>

        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('featured')}</SelectItem>
              <SelectItem value="newest">{t('newest')}</SelectItem>
              <SelectItem value="price_asc">{t('priceLowHigh')}</SelectItem>
              <SelectItem value="price_desc">{t('priceHighLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 shadow-xl">
            <svg className="h-10 w-10 text-hp-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{t('noProducts')}</h3>
          <p className="mt-2 max-w-sm text-slate-500">
            {t('noProductsDesc')}
          </p>
        </div>
      )}
    </div>
  )
}
