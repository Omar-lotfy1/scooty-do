import { createClient } from '@/lib/supabase/server'
import LifestyleClient from './LifestyleClient'

export const revalidate = 0

export default async function LifestylePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'lifestyle_images')
    .single()

  let initialImages: { url: string; public_id: string }[] = []
  
  if (data?.value) {
    try {
      initialImages = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
    } catch (e) {
      console.error('Failed to parse lifestyle_images', e)
    }
  }

  return <LifestyleClient initialImages={initialImages} />
}
