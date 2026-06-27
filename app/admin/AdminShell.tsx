'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { m, LazyMotion, domMax, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Toaster } from 'sonner'
import {
  LayoutDashboard,
  Package,
  Home,
  MessageCircle,
  Megaphone,
  Image,
  Search,
  Menu,
  X,
  LogOut,
  Zap,
  Languages,
  ChevronRight,
  Globe,
} from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel, type AdminLabelKey } from '@/lib/admin-labels'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const NAV_GROUPS = [
  {
    label: 'Content',
    links: [
      { href: '/admin/dashboard',   labelKey: 'dashboard'      as AdminLabelKey, icon: LayoutDashboard },
      { href: '/admin/products',    labelKey: 'products'       as AdminLabelKey, icon: Package },
      { href: '/admin/homepage',    labelKey: 'homepageEditor' as AdminLabelKey, icon: Home },
    ],
  },
  {
    label: 'Marketing',
    links: [
      { href: '/admin/announcement', labelKey: 'announcementBar'   as AdminLabelKey, icon: Megaphone },
      { href: '/admin/whatsapp',     labelKey: 'whatsappSettings'  as AdminLabelKey, icon: MessageCircle },
      { href: '/admin/cta-image',    labelKey: 'ctaImage'          as AdminLabelKey, icon: Image },
      { href: '/admin/lifestyle',    labelKey: 'lifestyleGallery'  as AdminLabelKey, icon: Image },
    ],
  },
  {
    label: 'Settings',
    links: [
      { href: '/admin/media', labelKey: 'mediaLibrary' as AdminLabelKey, icon: Image },
      { href: '/admin/seo',   labelKey: 'seoSettings'  as AdminLabelKey, icon: Search },
    ],
  },
]

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode
  email: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, toggleLang } = useAdminLang()
  const l = (key: AdminLabelKey) => adminLabel(lang, key)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const allLinks = NAV_GROUPS.flatMap((g) => g.links)
  const pageTitle =
    allLinks.find((link) => link.href === pathname)?.labelKey
      ? l(allLinks.find((link) => link.href === pathname)!.labelKey)
      : 'Admin Panel'

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const userInitial = email?.[0]?.toUpperCase() ?? 'A'

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-xl opacity-50 blur-md"
            style={{ background: '#ff6b00' }}
          />
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff8a33 100%)' }}
          >
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <span
            className="block text-lg font-bold leading-none tracking-tight text-white"
            style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)' }}
          >
            Scooty <span style={{ color: '#ff6b00' }}>DO</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Admin Panel
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 mb-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.links.map(({ href, labelKey, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
                    style={{
                      background: active ? 'rgba(255,107,0,0.12)' : 'transparent',
                      color: active ? '#ff6b00' : 'rgb(161,161,170)',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                        e.currentTarget.style.color = '#fff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'rgb(161,161,170)'
                      }
                    }}
                  >
                    {/* Active indicator */}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                        style={{ background: '#ff6b00' }}
                      />
                    )}
                    <Icon
                      className="h-4 w-4 shrink-0"
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    <span className="flex-1">{l(labelKey)}</span>
                    {active && (
                      <ChevronRight className="h-3 w-3 opacity-60" strokeWidth={2} />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="p-3">
        <div
          className="rounded-2xl p-3"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #ff6b00, #ff8a33)' }}
            >
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{email}</p>
              <p className="text-[10px] text-zinc-500">Administrator</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            Back to Storefront
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {signingOut ? l('signingOut') : l('signOut')}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.cloudinary.com" />
        <link rel="dns-prefetch" href="https://api.cloudinary.com" />
      </head>
      <body
        className="antialiased font-sans"
        style={{ background: '#080808', color: '#fff' }}
      >
        <LazyMotion features={domMax}>
          <div className="flex h-screen overflow-hidden">

            {/* ── Desktop Sidebar ── */}
            <aside
              className="hidden w-64 shrink-0 lg:flex lg:flex-col"
              style={{
                background: '#0f0f0f',
                borderRight: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <SidebarContent />
            </aside>

            {/* ── Mobile overlay ── */}
            <AnimatePresence>
              {mobileOpen && (
                <>
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                  />
                  <m.aside
                    initial={{ x: -280 }}
                    animate={{ x: 0 }}
                    exit={{ x: -280 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
                    style={{
                      background: '#0f0f0f',
                      borderRight: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <SidebarContent />
                  </m.aside>
                </>
              )}
            </AnimatePresence>

            {/* ── Main area ── */}
            <div className="flex flex-1 flex-col overflow-hidden">

              {/* Top bar */}
              <header
                className="flex h-16 shrink-0 items-center justify-between px-4 lg:px-6"
                style={{
                  background: 'rgba(15,15,15,0.85)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div>
                    <h1
                      className="text-sm font-semibold text-white leading-none"
                      style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)' }}
                    >
                      {pageTitle}
                    </h1>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Scooty DO Admin</p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  {/* Lang toggle */}
                  <button
                    type="button"
                    onClick={toggleLang}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {l('langToggle')}
                  </button>

                  {/* Go to site */}
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Home className="h-3.5 w-3.5" />
                    Back to Storefront
                  </Link>

                  {/* User avatar */}
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #ff6b00, #ff8a33)' }}
                    title={email}
                  >
                    {userInitial}
                  </div>

                  {/* Sign out */}
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgb(161,161,170)',
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {signingOut ? l('signingOut') : l('signOut')}
                  </button>
                </div>
              </header>

              {/* Page content */}
              <main
                className="flex-1 overflow-y-auto"
                style={{ background: '#080808' }}
              >
                <m.div
                  key={pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="h-full"
                >
                  {children}
                </m.div>
              </main>
            </div>
          </div>

          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontFamily: 'var(--font-sans, Plus Jakarta Sans, sans-serif)',
              },
            }}
          />
        </LazyMotion>
      </body>
    </html>
  )
}
