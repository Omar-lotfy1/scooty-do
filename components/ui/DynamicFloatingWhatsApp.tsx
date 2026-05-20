'use client'

import dynamic from 'next/dynamic'

const FloatingWhatsApp = dynamic(
  () => import('./FloatingWhatsApp').then((mod) => mod.FloatingWhatsApp),
  { ssr: false }
)

export function DynamicFloatingWhatsApp({ phoneNumber }: { phoneNumber?: string }) {
  return <FloatingWhatsApp phoneNumber={phoneNumber} />
}
