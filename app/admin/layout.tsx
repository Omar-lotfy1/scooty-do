import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scooty Do Admin',
  description: 'Admin dashboard for Scooty Do',
}

// This is the root layout for all /admin/* routes.
// - The (protected) route group uses AdminShell which renders its own <html><body>
// - The login route group uses LoginLayout below which also provides <html><body>
// We must NOT add <html><body> here or it will double-wrap.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
