'use client'

import Link from 'next/link'
import { Package, Layers, AlertTriangle, Image, TrendingDown } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel, type AdminLabelKey } from '@/lib/admin-labels'

type LowStockProduct = { id: string; name_en: string; stock_count: number | null }

export function DashboardClient({
  totalProducts,
  totalStock,
  lowStockCount,
  mediaCount,
  lowStockProducts,
}: {
  totalProducts: number
  totalStock: number
  lowStockCount: number
  mediaCount: number
  lowStockProducts: LowStockProduct[]
}) {
  const { lang } = useAdminLang()
  const l = (key: AdminLabelKey) => adminLabel(lang, key)

  const statCards = [
    {
      label: l('totalProducts'),
      value: totalProducts,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: l('totalStock'),
      value: totalStock.toLocaleString(),
      icon: Layers,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: l('lowStockAlerts'),
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      label: l('mediaFiles'),
      value: mediaCount,
      icon: Image,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">{l('welcome')}</h2>
        <p className="mt-1 text-sm text-zinc-500">{l('welcomeSub')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`rounded-2xl border ${card.border} ${card.bg} p-5 transition-transform hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} border ${card.border}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {lowStockProducts.length > 0 ? (
        <LowStockPanel l={l} lowStockProducts={lowStockProducts} />
      ) : (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
          <p className="text-sm font-medium text-green-400">{l('allWellStocked')}</p>
        </div>
      )}
    </div>
  )
}

function LowStockPanel({
  l,
  lowStockProducts,
}: {
  l: (key: AdminLabelKey) => string
  lowStockProducts: LowStockProduct[]
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <TrendingDown className="h-5 w-5 text-orange-400" />
        <h3 className="font-semibold text-white">{l('lowStockWarnings')}</h3>
        <span className="ml-auto rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-medium text-orange-400">
          {lowStockProducts.length}
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {lowStockProducts.map((product) => {
          const stock = product.stock_count ?? 0
          const isCritical = stock <= 5
          return (
            <div
              key={product.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                  <Package className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{product.name_en}</p>
                  <p className="text-xs text-zinc-500">{l('stock')}</p>
                </div>
              </div>
              <LowStockActions stock={stock} isCritical={isCritical} l={l} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LowStockActions({
  stock,
  isCritical,
  l,
}: {
  stock: number
  isCritical: boolean
  l: (key: AdminLabelKey) => string
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
          isCritical ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
        }`}
      >
        {stock}
      </span>
      <Link
        href="/admin/products"
        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-orange-500/50 hover:text-orange-400"
      >
        {l('edit')}
      </Link>
    </div>
  )
}
