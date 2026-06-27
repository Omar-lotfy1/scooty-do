'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* ── Back to Storefront Button ── */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-all"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.color = 'rgb(161,161,170)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Storefront
      </Link>

      {/* ── Ambient background glows ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {/* Large orange glow top-right */}
        <div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, #ff6b00 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Subtle orange glow bottom-left */}
        <div
          className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, #ff8a33 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Center warm glow behind card */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-[0.06]"
          style={{
            background:
              'radial-gradient(circle, #ff6b00 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,107,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Floating scooter speed lines decoration ── */}
      <div
        className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 opacity-20"
        aria-hidden="true"
      >
        {[80, 56, 96, 40, 72].map((w, i) => (
          <div
            key={i}
            className="h-[2px] rounded-full"
            style={{
              width: `${w}px`,
              background: 'linear-gradient(90deg, transparent, #ff6b00)',
            }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 opacity-20"
        aria-hidden="true"
      >
        {[72, 96, 48, 80, 56].map((w, i) => (
          <div
            key={i}
            className="h-[2px] rounded-full"
            style={{
              width: `${w}px`,
              background: 'linear-gradient(270deg, transparent, #ff6b00)',
            }}
          />
        ))}
      </div>

      {/* ── Login card ── */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '28px',
          backdropFilter: 'blur(24px)',
          boxShadow:
            '0 0 0 1px rgba(255,107,0,0.08), 0 32px 80px -16px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Orange top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-24 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #ff6b00, transparent)' }}
        />

        <div className="p-10">
          {/* ── Brand header ── */}
          <div className="mb-10 flex flex-col items-center text-center gap-4">
            {/* Logo mark */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl opacity-40 blur-xl"
                style={{ background: '#ff6b00' }}
              />
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #ff6b00 0%, #ff8a33 100%)',
                  boxShadow: '0 8px 24px -4px rgba(255,107,0,0.5)',
                }}
              >
                <Zap className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <h1
                className="text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-display, Outfit, system-ui)' }}
              >
                Scooty DO
              </h1>
              <p className="mt-1 text-sm text-zinc-400 font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Sign in to continue
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                  strokeWidth={1.8}
                />
                <input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="admin@scootydo.com"
                  autoComplete="email"
                  className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.email
                      ? '1px solid rgba(248,113,113,0.6)'
                      : '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => {
                    if (!errors.email)
                      e.currentTarget.style.border = '1px solid rgba(255,107,0,0.6)'
                    e.currentTarget.style.background = 'rgba(255,107,0,0.04)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.email
                      ? '1px solid rgba(248,113,113,0.6)'
                      : '1px solid rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                  strokeWidth={1.8}
                />
                <input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl pl-11 pr-14 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.password
                      ? '1px solid rgba(248,113,113,0.6)'
                      : '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => {
                    if (!errors.password)
                      e.currentTarget.style.border = '1px solid rgba(255,107,0,0.6)'
                    e.currentTarget.style.background = 'rgba(255,107,0,0.04)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.password
                      ? '1px solid rgba(248,113,113,0.6)'
                      : '1px solid rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-orange-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #ff6b00 0%, #ff8a33 100%)',
                boxShadow: '0 8px 28px -6px rgba(255,107,0,0.5)',
              }}
            >
              {/* Shimmer hover effect */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* ── Footer note ── */}
          <p className="mt-8 text-center text-xs text-zinc-600">
            Scooty DO · Admin Access Only
          </p>
        </div>
      </div>
    </div>
  )
}
