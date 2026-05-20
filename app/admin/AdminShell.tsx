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
} from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel, type AdminLabelKey } from '@/lib/admin-labels'

const NAV_LINKS: { href: string; labelKey: AdminLabelKey; icon: typeof LayoutDashboard }[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/products', labelKey: 'products', icon: Package },
  { href: '/admin/homepage', labelKey: 'homepageEditor', icon: Home },
  { href: '/admin/whatsapp', labelKey: 'whatsappSettings', icon: MessageCircle },
  { href: '/admin/announcement', labelKey: 'announcementBar', icon: Megaphone },
  { href: '/admin/media', labelKey: 'mediaLibrary', icon: Image },
  { href: '/admin/cta-image', labelKey: 'ctaImage', icon: Image },
  { href: '/admin/lifestyle', labelKey: 'lifestyleGallery', icon: Image },
  { href: '/admin/seo', labelKey: 'seoSettings', icon: Search },
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

  const pageTitle =
    NAV_LINKS.find((link) => link.href === pathname)?.labelKey
      ? l(NAV_LINKS.find((link) => link.href === pathname)!.labelKey)
      : 'Admin Panel'

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-orange-500">Scooty Do</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {NAV_LINKS.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'border-l-2 border-orange-500 bg-orange-500/10 text-orange-500'
                    : 'border-l-2 border-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {l(labelKey)}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="truncate text-xs text-zinc-400">{email}</p>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut className="h-3 w-3" />
            {signingOut ? l('signingOut') : l('signOut')}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.cloudinary.com" />
        <link rel="dns-prefetch" href="https://api.cloudinary.com" />
      </head>
      <body className="bg-zinc-950 text-white antialiased">
        <LazyMotion features={domMax}>
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-900 lg:flex lg:flex-col">
            <SidebarContent />
          </aside>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {mobileOpen && (
              <>
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileOpen(false)}
                />
                <m.aside
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-zinc-900 lg:hidden"
                >
                  <SidebarContent />
                </m.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-zinc-900/80 px-4 backdrop-blur-sm lg:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-base font-semibold text-white">{pageTitle}</h1>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:border-orange-500/50 hover:text-orange-400"
                >
                  <Languages className="h-3.5 w-3.5" />
                  {l('langToggle')}
                </button>
                <span className="text-sm text-zinc-500 truncate max-w-[200px]">{email}</span>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {signingOut ? l('signingOut') : l('signOut')}
                </button>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              <m.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
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
            style: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
          }}
        />
        </LazyMotion>
      </body>
    </html>
  )
}

