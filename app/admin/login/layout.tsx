import '@/app/globals.css'
import { Toaster } from 'sonner'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
