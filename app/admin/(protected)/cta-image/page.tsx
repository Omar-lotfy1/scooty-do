import { createClient } from '@/lib/supabase/server'
import CtaImageClient from './CtaImageClient'

export const metadata = { title: 'CTA Featured Image — Scooty Do Admin' }

export default async function CtaImagePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['cta_image_url', 'cta_image_public_id'])

  const defaults: Record<string, string> = {}
  for (const row of data ?? []) {
    defaults[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value)
  }

  return <CtaImageClient defaults={defaults} />
}
