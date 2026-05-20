import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/admin/DashboardClient'

export const metadata = { title: 'Dashboard — Scooty Do Admin' }

async function getStats() {
  const supabase = await createClient()

  const [productsRes, mediaRes] = await Promise.all([
    supabase.from('products').select('id, name_en, stock_count'),
    supabase.from('media').select('id', { count: 'exact', head: true }),
  ])

  const products = productsRes.data ?? []
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + (p.stock_count ?? 0), 0)
  const lowStockProducts = products.filter((p) => (p.stock_count ?? 0) <= 10)
  const mediaCount = mediaRes.count ?? 0

  return { totalProducts, totalStock, lowStockCount: lowStockProducts.length, mediaCount, lowStockProducts }
}

export default async function DashboardPage() {
  const stats = await getStats()
  return <DashboardClient {...stats} />
}
