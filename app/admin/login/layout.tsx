import '@/app/globals.css'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'

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

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased font-sans">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
