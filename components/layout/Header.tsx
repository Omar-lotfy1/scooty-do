'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Zap, Truck, ShieldCheck, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { m, AnimatePresence } from 'framer-motion';

export interface HeaderAnnouncementProps {
  announcementVisible?: boolean;
  announcementText?: string;
  announcementBg?: 'orange' | 'black';
  tickerSegment2?: string;
  tickerSegment3?: string;
  tickerSegment4?: string;
}

/** Divider dot between ticker segments */
function TickerDot({ dark }: { dark?: boolean }) {
  return (
    <span
      className="mx-6 inline-block h-1 w-1 rounded-full shrink-0 opacity-60"
      style={{ background: dark ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.5)' }}
      aria-hidden="true"
    />
  );
}

/** A single announcement ticker segment */
function TickerSegment({
  icon: Icon,
  text,
  dark,
}: {
  icon: React.ElementType;
  text: string;
  dark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 shrink-0">
      <Icon size={13} strokeWidth={2.2} className="opacity-80" />
      <span className="tracking-wide">{text}</span>
    </span>
  );
}

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/shop', labelKey: 'shop' },
  { href: '/contact', labelKey: 'contact' }
];

export function Header({
  announcementVisible = false,
  announcementText = '',
  announcementBg = 'orange',
  tickerSegment2 = 'Fast Cairo & Alexandria Delivery',
  tickerSegment3 = '1-Year Warranty on All Models',
  tickerSegment4 = '188 Scooters In Stock — Order Today',
}: HeaderAnnouncementProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const nextLocale = locale === 'ar' ? 'en' : 'ar';
  const langLabel = locale === 'ar' ? 'English' : 'عربي';

  const LanguageSwitcher = () => (
    <div className="flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
      <Link
        href={pathname as '/'}
        locale="en"
        className={cn(
          "flex h-8 items-center justify-center rounded-full px-3.5 text-xs font-bold transition-all",
          locale === 'en' 
            ? "bg-[#E64A19] text-white shadow-sm" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
        )}
      >
        EN
      </Link>
      <Link
        href={pathname as '/'}
        locale="ar"
        className={cn(
          "flex h-8 items-center justify-center rounded-full px-3.5 text-xs font-bold transition-all",
          locale === 'ar' 
            ? "bg-[#E64A19] text-white shadow-sm" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
        )}
      >
        عربي
      </Link>
    </div>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <AnimatePresence>
        {announcementVisible && announcementText && !dismissed && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={cn(
              'relative overflow-hidden text-xs font-semibold',
              announcementBg === 'orange'
                ? 'text-white'
                : 'text-white'
            )}
            style={{
              height: '48px',
              background: announcementBg === 'orange'
                ? 'linear-gradient(135deg, #ff6200 0%, #ff7a1a 50%, #ff6b00 100%)'
                : '#0f0f0f',
              borderBottom: announcementBg === 'orange'
                ? '1px solid rgba(255,120,20,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: announcementBg === 'orange'
                ? '0 1px 0 rgba(255,160,80,0.25) inset, 0 2px 12px rgba(255,107,0,0.2)'
                : '0 1px 0 rgba(255,255,255,0.04) inset',
            }}
          >
            {/* Inner top highlight line for glass feel */}
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-px"
              style={{
                background: announcementBg === 'orange'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(255,200,120,0.6) 50%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* Left edge fade */}
            <div
              className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20"
              style={{
                background: announcementBg === 'orange'
                  ? 'linear-gradient(90deg, #ff6200 0%, transparent 100%)'
                  : 'linear-gradient(90deg, #0f0f0f 0%, transparent 100%)',
              }}
              aria-hidden="true"
            />
            {/* Right edge fade + dismiss zone */}
            <div
              className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20"
              style={{
                background: announcementBg === 'orange'
                  ? 'linear-gradient(270deg, #ff6b00 0%, transparent 100%)'
                  : 'linear-gradient(270deg, #0f0f0f 0%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* Scrolling ticker */}
            <div className="flex h-full items-center overflow-hidden px-14">
              <div
                className="flex items-center whitespace-nowrap"
                style={{ animation: 'ticker-scroll 32s linear infinite' }}
              >
                {[0, 1].map((pass) => (
                  <span key={pass} className="inline-flex items-center">
                    <TickerSegment
                      icon={Zap}
                      text={announcementText}
                      dark={announcementBg !== 'orange'}
                    />
                    <TickerDot dark={announcementBg !== 'orange'} />
                    <TickerSegment
                      icon={Truck}
                      text={tickerSegment2}
                      dark={announcementBg !== 'orange'}
                    />
                    <TickerDot dark={announcementBg !== 'orange'} />
                    <TickerSegment
                      icon={ShieldCheck}
                      text={tickerSegment3}
                      dark={announcementBg !== 'orange'}
                    />
                    <TickerDot dark={announcementBg !== 'orange'} />
                    <TickerSegment
                      icon={Star}
                      text={tickerSegment4}
                      dark={announcementBg !== 'orange'}
                    />
                    <span className="inline-block w-28 shrink-0" aria-hidden="true" />
                  </span>
                ))}
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all hover:bg-white/30 hover:scale-110 rtl:left-3 rtl:right-auto"
              aria-label="Dismiss announcement"
            >
              <X size={12} strokeWidth={2.5} />
            </button>

            <style>{`
              @keyframes ticker-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </m.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'transition-all duration-500 ease-out',
          scrolled ? 'hp-glass-panel border-b border-hp-border shadow-hp-soft backdrop-blur-xl' : 'bg-transparent'
        )}
      >
        <div 
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-8 rtl:flex-row-reverse transition-all duration-500",
            scrolled ? "h-16" : "h-24"
          )}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="https://res.cloudinary.com/dxe7xgi2r/image/upload/v1779312650/WhatsApp_Image_2026-05-20_at_11.50.53_PM-removebg-preview_edbsxn.png" 
              alt="Scooty DO Logo" 
              className="h-16 w-16 object-cover"
            />
            <span className="font-display text-xl font-bold tracking-tight text-hp-foreground sm:text-2xl">
              Scooty <span className="text-hp-primary">DO</span>
            </span>
          </Link>

          <nav 
            className="hidden items-center gap-2 lg:flex rtl:flex-row-reverse"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredPath === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href as any}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  className={cn(
                    'relative px-4 py-2 text-base font-medium transition-colors',
                    isActive ? 'text-hp-primary' : 'text-hp-muted hover:text-hp-foreground'
                  )}
                >
                  <span className="relative z-10">{t(link.labelKey)}</span>

                  {isHovered && (
                    <m.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 z-0 rounded-full bg-black/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}

                  {isActive && (
                    <m.div
                      layoutId="nav-active-underline"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-hp-primary shadow-[0_0_8px_rgba(255,107,0,0.8)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex rtl:flex-row-reverse">
            <LanguageSwitcher />
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-hp-primary px-6 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(255,107,0,0.3)] transition-all duration-300 hover:bg-hp-primary-bright focus-visible:outline-none"
              >
                {t('shopNow')}
              </Link>
            </m.div>
          </div>

          <div className="flex items-center gap-3 lg:hidden rtl:flex-row-reverse">
            <LanguageSwitcher />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-hp-border bg-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hp-glass-panel border-b border-hp-border lg:hidden overflow-hidden bg-white/95 backdrop-blur-3xl"
          >
            <m.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 sm:px-6"
            >
              {navLinks.map((link) => (
                <m.div key={link.href} variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -10 }
                }}>
                  <Link
                    href={link.href as any}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-2xl border px-4 py-3 text-base font-medium transition-colors",
                      pathname === link.href 
                        ? "border-hp-primary/20 bg-hp-primary/5 text-hp-primary" 
                        : "border-transparent text-hp-foreground hover:border-hp-border hover:bg-white"
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                </m.div>
              ))}
              
              <m.div variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -10 }
              }} className="pt-2">
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-hp-primary px-5 text-sm font-semibold text-white shadow-hp-glow"
                >
                  {t('shopNow')}
                </Link>
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

