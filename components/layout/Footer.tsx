"use client"

import React from 'react';
import { Mail, MapPin, Phone, Send, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/routing';
import type { SiteConfig } from '@/types/homepage';
import siteData from '@/data/site.json';

const site = siteData as SiteConfig;

export function Footer() {
  const year = new Date().getFullYear();
  const t = useTranslations('Footer');
  return (
    <footer id="footer" className="py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 relative">


        {/* Links grid */}
        <div className="mt-14 grid gap-10 border-b border-hp-border pb-10 md:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-8 sm:grid-cols-3">
            {site.footer.footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold text-hp-foreground">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-hp-muted transition-colors hover:text-hp-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <div>
              <p className="text-sm font-semibold text-hp-foreground">Follow Scooty DO</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {site.footer.socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-hp-border bg-white px-4 py-2 text-sm font-medium text-hp-muted transition-all hover:border-hp-primary hover:text-hp-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-hp-muted">
              {site.footer.legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-hp-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-hp-muted gap-4 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <span>&copy; {year} {site.siteName}. {t('rights')}</span>
            <span className="text-xs">
              Designed & Developed by <strong className="text-hp-foreground font-semibold">R&O Tech Solutions</strong>
            </span>
          </div>

          {/* Hidden admin access — only visible on hover */}
          <a
            href="/admin"
            aria-label="Admin"
            className="text-xs font-bold tracking-widest text-hp-border opacity-20 transition-all duration-500 hover:text-hp-primary hover:opacity-100 hover:shadow-hp-glow select-none"
          >
            &amp;DO
          </a>
        </div>
      </div>
    </footer>
  );
}
