import { createClient } from '@/lib/supabase/server'
import MediaLibraryClient from './MediaLibraryClient'

export const metadata = { title: 'Media Library — Scooty Do Admin' }

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  return <MediaLibraryClient initialMedia={media ?? []} />
}
