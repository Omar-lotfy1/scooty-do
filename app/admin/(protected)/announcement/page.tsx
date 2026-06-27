'use client'

import { useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { announcementSchema, type AnnouncementFormValues } from '@/lib/validations/admin'
import {
  Megaphone, Loader2, Zap, Truck, ShieldCheck, Star,
  Eye, EyeOff, ChevronRight
} from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

// ── Shared styles ──────────────────────────────────────────────────────────────
const fieldCls =
  'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'

const SUPABASE_KEYS = [
  'announcement_visible',
  'announcement_text_en',
  'announcement_text_ar',
  'announcement_bg_color',
  'ticker_segment_2_en',
  'ticker_segment_2_ar',
  'ticker_segment_3_en',
  'ticker_segment_3_ar',
  'ticker_segment_4_en',
  'ticker_segment_4_ar',
]

// ── Mini components ────────────────────────────────────────────────────────────
function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description?: string
  icon?: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-zinc-900 overflow-hidden">
      {/* Card header */}
      <div className="flex items-start gap-3 border-b border-white/8 px-6 py-4">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
            <Icon size={15} strokeWidth={2} />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Ticker preview pill ────────────────────────────────────────────────────────
function TickerPill({
  icon: Icon,
  text,
  dim,
}: {
  icon: React.ElementType
  text: string
  dim?: boolean
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 transition-opacity ${dim ? 'opacity-30' : 'opacity-100'}`}
    >
      <Icon size={12} strokeWidth={2.2} />
      <span>{text}</span>
    </span>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AnnouncementPage() {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, isLoading },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', SUPABASE_KEYS)

      const map: Record<string, string | boolean> = {}
      for (const row of data ?? []) {
        map[row.key] = typeof row.value === 'string' ? row.value : (row.value as boolean)
      }

      return {
        announcement_visible:
          map['announcement_visible'] === true || map['announcement_visible'] === 'true',
        announcement_text_en: (map['announcement_text_en'] as string) ?? '',
        announcement_text_ar: (map['announcement_text_ar'] as string) ?? '',
        announcement_bg_color: ((map['announcement_bg_color'] as string) ?? 'orange') as
          | 'orange'
          | 'black',
        ticker_segment_2_en:
          (map['ticker_segment_2_en'] as string) ?? 'Fast Cairo & Alexandria Delivery',
        ticker_segment_2_ar:
          (map['ticker_segment_2_ar'] as string) ?? 'توصيل سريع للقاهرة والإسكندرية',
        ticker_segment_3_en:
          (map['ticker_segment_3_en'] as string) ?? '1-Year Warranty on All Models',
        ticker_segment_3_ar:
          (map['ticker_segment_3_ar'] as string) ?? 'ضمان سنة على جميع الموديلات',
        ticker_segment_4_en:
          (map['ticker_segment_4_en'] as string) ?? '188 Scooters In Stock — Order Today',
        ticker_segment_4_ar:
          (map['ticker_segment_4_ar'] as string) ?? '١٨٨ سكوتر متاح — اطلب الآن',
      }
    },
  })

  // Watched values for live preview
  const visible = watch('announcement_visible')
  const bgColor = watch('announcement_bg_color')
  const seg1En = watch('announcement_text_en')
  const seg2En = watch('ticker_segment_2_en')
  const seg3En = watch('ticker_segment_3_en')
  const seg4En = watch('ticker_segment_4_en')

  const segments = [
    { icon: Zap, text: seg1En || 'Segment 1 — e.g. Free Delivery' },
    { icon: Truck, text: seg2En || 'Segment 2' },
    { icon: ShieldCheck, text: seg3En || 'Segment 3' },
    { icon: Star, text: seg4En || 'Segment 4' },
  ]

  const onSubmit = async (values: AnnouncementFormValues) => {
    const rows = SUPABASE_KEYS.map((key) => ({
      key,
      value: (values as Record<string, unknown>)[key] ?? '',
    }))

    const { error } = await supabase.from('site_settings').upsert(rows)
    if (error) {
      toast.error(error.message)
      return
    }
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'settings' }),
    })
    toast.success('Announcement bar saved & published!')
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-8">
      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
          <Megaphone size={18} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{l('announcementBar')}</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Control the scrolling announcement ticker shown across all pages.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Visibility + color ── */}
        <SectionCard
          title="Bar Settings"
          description="Toggle visibility and choose the bar color theme."
          icon={Eye}
        >
          {/* Visibility toggle */}
          <div className="flex items-center justify-between rounded-xl bg-zinc-800/60 px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-white">Show Announcement Bar Sitewide</p>
              <p className="mt-0.5 text-xs text-zinc-500">Displays at the top of every page</p>
            </div>
            <Controller
              name="announcement_visible"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    field.value ? 'bg-orange-500' : 'bg-zinc-700'
                  }`}
                  aria-label="Toggle announcement visibility"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      field.value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            />
          </div>

          {/* Color picker */}
          <div>
            <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Bar Color
            </p>
            <Controller
              name="announcement_bg_color"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange('orange')}
                    className={`flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                      field.value === 'orange'
                        ? 'border-orange-500 bg-orange-500/15 text-orange-400 shadow-[0_0_20px_rgba(255,107,0,0.15)]'
                        : 'border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm" />
                    Scooty Orange
                    {field.value === 'orange' && (
                      <span className="ml-1 rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400">
                        Active
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('black')}
                    className={`flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                      field.value === 'black'
                        ? 'border-white/30 bg-white/8 text-white'
                        : 'border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <span className="h-3.5 w-3.5 rounded-full bg-zinc-900 ring-1 ring-white/20" />
                    Stealth Black
                    {field.value === 'black' && (
                      <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-300">
                        Active
                      </span>
                    )}
                  </button>
                </div>
              )}
            />
          </div>
        </SectionCard>

        {/* ── Ticker segments ── */}
        <SectionCard
          title="Ticker Segments"
          description="Each segment scrolls continuously in the bar. All 4 show in both languages."
          icon={ChevronRight}
        >
          {/* Segment 1 */}
          <div className="rounded-xl border border-white/8 bg-zinc-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <Zap size={12} strokeWidth={2.5} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Segment 1 — Main Announcement
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="English">
                <input
                  {...register('announcement_text_en')}
                  className={fieldCls}
                  placeholder="e.g. Free delivery this weekend"
                />
              </FieldRow>
              <FieldRow label="Arabic">
                <input
                  {...register('announcement_text_ar')}
                  className={fieldCls}
                  dir="rtl"
                  placeholder="مثال: توصيل مجاني هذا الأسبوع"
                />
              </FieldRow>
            </div>
          </div>

          {/* Segment 2 */}
          <div className="rounded-xl border border-white/8 bg-zinc-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <Truck size={12} strokeWidth={2.5} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Segment 2 — Delivery Info
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="English">
                <input
                  {...register('ticker_segment_2_en')}
                  className={fieldCls}
                  placeholder="e.g. Fast Cairo & Alexandria Delivery"
                />
              </FieldRow>
              <FieldRow label="Arabic">
                <input
                  {...register('ticker_segment_2_ar')}
                  className={fieldCls}
                  dir="rtl"
                  placeholder="توصيل سريع للقاهرة والإسكندرية"
                />
              </FieldRow>
            </div>
          </div>

          {/* Segment 3 */}
          <div className="rounded-xl border border-white/8 bg-zinc-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <ShieldCheck size={12} strokeWidth={2.5} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Segment 3 — Trust / Warranty
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="English">
                <input
                  {...register('ticker_segment_3_en')}
                  className={fieldCls}
                  placeholder="e.g. 1-Year Warranty on All Models"
                />
              </FieldRow>
              <FieldRow label="Arabic">
                <input
                  {...register('ticker_segment_3_ar')}
                  className={fieldCls}
                  dir="rtl"
                  placeholder="ضمان سنة على جميع الموديلات"
                />
              </FieldRow>
            </div>
          </div>

          {/* Segment 4 */}
          <div className="rounded-xl border border-white/8 bg-zinc-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <Star size={12} strokeWidth={2.5} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Segment 4 — Stock / Urgency
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="English">
                <input
                  {...register('ticker_segment_4_en')}
                  className={fieldCls}
                  placeholder="e.g. 188 Scooters In Stock — Order Today"
                />
              </FieldRow>
              <FieldRow label="Arabic">
                <input
                  {...register('ticker_segment_4_ar')}
                  className={fieldCls}
                  dir="rtl"
                  placeholder="١٨٨ سكوتر متاح — اطلب الآن"
                />
              </FieldRow>
            </div>
          </div>
        </SectionCard>

        {/* ── Live preview ── */}
        <SectionCard
          title="Live Preview"
          description="This is how the bar will look on the website (English ticker shown)."
          icon={Eye}
        >
          <div
            className={`relative overflow-hidden rounded-xl transition-all ${!visible ? 'opacity-40 grayscale' : ''}`}
            style={{ height: '48px' }}
          >
            {/* Bar */}
            <div
              className="absolute inset-0 flex items-center"
              style={{
                background:
                  bgColor === 'orange'
                    ? 'linear-gradient(135deg, #ff6b00 0%, #ff8a33 100%)'
                    : '#111111',
              }}
            >
              {/* Left fade */}
              <div
                className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12"
                style={{
                  background:
                    bgColor === 'orange'
                      ? 'linear-gradient(90deg, #ff6b00 0%, transparent 100%)'
                      : 'linear-gradient(90deg, #111 0%, transparent 100%)',
                }}
              />
              {/* Right fade */}
              <div
                className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12"
                style={{
                  background:
                    bgColor === 'orange'
                      ? 'linear-gradient(270deg, #ff7a1a 0%, transparent 100%)'
                      : 'linear-gradient(270deg, #111 0%, transparent 100%)',
                }}
              />

              {/* Ticker content */}
              <div className="flex h-full items-center overflow-hidden px-4 text-xs font-semibold text-white">
                <div
                  className="flex items-center gap-0 whitespace-nowrap"
                  style={{ animation: 'ticker-scroll 18s linear infinite' }}
                >
                  {[0, 1].map((pass) => (
                    <span key={pass} className="inline-flex items-center">
                      {segments.map((seg, i) => (
                        <span key={i} className="inline-flex items-center">
                          <TickerPill icon={seg.icon} text={seg.text} />
                          {i < segments.length - 1 && (
                            <span className="mx-5 inline-block h-1 w-1 rounded-full bg-white/50 shrink-0" />
                          )}
                        </span>
                      ))}
                      <span className="inline-block w-20 shrink-0" />
                    </span>
                  ))}
                </div>
              </div>

              {/* ✕ button preview */}
              <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white/80 text-[10px]">
                ✕
              </div>
            </div>
            <style>{`
              @keyframes ticker-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
          {!visible && (
            <p className="text-center text-xs text-zinc-600">
              Bar is hidden — toggle &quot;Show Announcement Bar&quot; above to enable
            </p>
          )}
        </SectionCard>

        {/* ── Save button ── */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-zinc-600">Changes publish instantly across all pages.</p>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-60 transition-all"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Megaphone className="h-4 w-4" />
            )}
            {isSubmitting ? 'Saving…' : l('save')}
          </button>
        </div>
      </form>
    </div>
  )
}
