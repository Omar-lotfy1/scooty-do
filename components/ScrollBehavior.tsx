'use client'

import { useEffect } from 'react'

export function ScrollBehavior() {
  useEffect(() => {
    try {
      const isLowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      // @ts-ignore
      const isLowMem = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (isLowCpu || isLowMem || prefersReducedMotion) {
        document.documentElement.setAttribute('data-scroll-behavior', 'auto');
        document.documentElement.style.scrollBehavior = 'auto';
      }
    } catch (e) {}
  }, [])

  return null
}
