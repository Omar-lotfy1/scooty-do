'use client'

import { m, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ 
          duration: 0.4, 
          ease: "easeInOut"
        }}
        className="flex-1 flex flex-col w-full h-full"
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}
