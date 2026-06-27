'use client'

import Link from 'next/link'
import {
  Package,
  Layers,
  AlertTriangle,
  Image,
  TrendingDown,
  ArrowRight,
  Zap,
  Activity,
} from 'lucide-react'
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
      accent: '#3b82f6',
      accentBg: 'rgba(59,130,246,0.1)',
      accentBorder: 'rgba(59,130,246,0.2)',
      href: '/admin/products',
    },
    {
      label: l('totalStock'),
      value: totalStock.toLocaleString(),
      icon: Layers,
      accent: '#22c55e',
      accentBg: 'rgba(34,197,94,0.1)',
      accentBorder: 'rgba(34,197,94,0.2)',
      href: '/admin/products',
    },
    {
      label: l('lowStockAlerts'),
      value: lowStockCount,
      icon: AlertTriangle,
      accent: '#ff6b00',
      accentBg: 'rgba(255,107,0,0.1)',
      accentBorder: 'rgba(255,107,0,0.2)',
      href: '/admin/products',
      warn: lowStockCount > 0,
    },
    {
      label: l('mediaFiles'),
      value: mediaCount,
      icon: Image,
      accent: '#a855f7',
      accentBg: 'rgba(168,85,247,0.1)',
      accentBorder: 'rgba(168,85,247,0.2)',
      href: '/admin/media',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl">

      {/* ── Welcome header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'rgba(255,107,0,0.15)' }}
            >
              <Zap size={14} style={{ color: '#ff6b00' }} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Overview
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)' }}
          >
            {l('welcome')}
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">{l('welcomeSub')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-green-400"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <Activity size={11} strokeWidth={2} />
          Site Live
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: card.accentBg,
                border: `1px solid ${card.accentBorder}`,
              }}
            >
              {/* Subtle top accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-px rounded-full opacity-50"
                style={{ background: card.accent }}
              />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                    {card.label}
                  </p>
                  <p
                    className="text-3xl font-black"
                    style={{
                      color: '#fff',
                      fontFamily: 'var(--font-display, Outfit, sans-serif)',
                    }}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: card.accentBg, border: `1px solid ${card.accentBorder}` }}
                >
                  <Icon className="h-5 w-5" style={{ color: card.accent }} strokeWidth={1.8} />
                </div>
              </div>

              {/* Bottom arrow on hover */}
              <div className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-60 transition-opacity"
                style={{ color: card.accent }}
              >
                <span>View</span>
                <ArrowRight size={11} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Low stock panel ── */}
      {lowStockProducts.length > 0 ? (
        <LowStockPanel l={l} lowStockProducts={lowStockProducts} />
      ) : (
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
          }}
        >
          <div className="mb-2 flex justify-center">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)' }}
            >
              <Layers size={18} style={{ color: '#22c55e' }} strokeWidth={1.8} />
            </div>
          </div>
          <p className="text-sm font-semibold text-green-400">{l('allWellStocked')}</p>
          <p className="mt-0.5 text-xs text-zinc-600">All products have sufficient inventory.</p>
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
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: 'rgba(255,107,0,0.15)' }}
        >
          <TrendingDown className="h-4 w-4" style={{ color: '#ff6b00' }} strokeWidth={2} />
        </div>
        <h3
          className="font-semibold text-white"
          style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)' }}
        >
          {l('lowStockWarnings')}
        </h3>
        <span
          className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: 'rgba(255,107,0,0.15)', color: '#ff6b00' }}
        >
          {lowStockProducts.length}
        </span>
      </div>

      {/* Rows */}
      <div>
        {lowStockProducts.map((product, i) => {
          const stock = product.stock_count ?? 0
          const isCritical = stock <= 5
          return (
            <div
              key={product.id}
              className="group flex items-center justify-between px-6 py-4 transition-colors"
              style={{
                borderBottom:
                  i < lowStockProducts.length - 1
                    ? '1px solid rgba(255,255,255,0.04)'
                    : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <Package className="h-4 w-4 text-zinc-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{product.name_en}</p>
                  <p className="text-xs text-zinc-600">{l('stock')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                  style={{
                    background: isCritical
                      ? 'rgba(239,68,68,0.15)'
                      : 'rgba(255,107,0,0.15)',
                    color: isCritical ? '#f87171' : '#ff6b00',
                  }}
                >
                  {stock}
                </span>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all hover:text-orange-400"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgb(161,161,170)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                    e.currentTarget.style.color = '#ff6b00'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = 'rgb(161,161,170)'
                  }}
                >
                  {l('edit')}
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
