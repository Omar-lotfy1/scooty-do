'use client'

import { useCallback, useEffect, useState } from 'react'

export type AdminLang = 'en' | 'ar'

const STORAGE_KEY = 'adminLang'

export function useAdminLang() {
  const [lang, setLangState] = useState<AdminLang>('en')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLang | null
    if (stored === 'en' || stored === 'ar') {
      setLangState(stored)
    }
    setReady(true)
  }, [])

  const setLang = useCallback((next: AdminLang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: AdminLang = prev === 'en' ? 'ar' : 'en'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { lang, setLang, toggleLang, ready }
}
