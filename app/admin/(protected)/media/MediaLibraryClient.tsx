'use client'

import { useState } from 'react'
import { CldImage, CldUploadButton } from 'next-cloudinary'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Loader2, Image as ImageIcon, FolderOpen } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'

type MediaRecord = {
  id: string
  url: string
  public_id: string
  file_name: string
  folder: string
  created_at: string | null
}

type Folder = 'All' | 'Products' | 'Banners' | 'General'
const FOLDERS: Folder[] = ['All', 'Products', 'Banners', 'General']
const UPLOAD_FOLDER_MAP: Record<string, string> = {
  Products: 'scooty-do/products',
  Banners: 'scooty-do/banners',
  General: 'scooty-do/general',
}

export default function MediaLibraryClient({ initialMedia }: { initialMedia: MediaRecord[] }) {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()
  const [media, setMedia] = useState<MediaRecord[]>(initialMedia)
  const [activeFolder, setActiveFolder] = useState<Folder>('All')
  const [uploadFolder, setUploadFolder] = useState<'Products' | 'Banners' | 'General'>('General')
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = activeFolder === 'All' ? media : media.filter((m) => m.folder === activeFolder)

  const refreshMedia = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false })
    setMedia(data ?? [])
  }

  const handleUploadSuccess = async (result: any) => {
    const infos = Array.isArray(result?.info) ? result.info : [result?.info]
    const uploaded = infos.filter((info: { public_id?: string; secure_url?: string }) => info?.public_id && info?.secure_url)

    if (!uploaded.length) {
      toast.error('Upload failed')
      return
    }

    let successCount = 0
    for (const info of uploaded) {
      const public_id = info.public_id
      const secure_url = info.secure_url
      const fileName = info.original_filename ?? public_id.split('/').pop() ?? 'image'

      const { error } = await supabase.from('media').insert({
        url: secure_url,
        public_id,
        file_name: fileName,
        folder: uploadFolder,
      })
      if (!error) {
        successCount++
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file${successCount !== 1 ? 's' : ''} uploaded!`)
      await refreshMedia()
    }

    setUploading(false)
  }

  const handleDelete = async (item: MediaRecord) => {
    setDeleting(item.id)
    try {
      // 1. Delete from Cloudinary first
      const res = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: item.public_id }),
      })
      if (!res.ok) throw new Error('Cloudinary deletion failed')

      // 2. Delete from Supabase
      const { error } = await supabase.from('media').delete().eq('id', item.id)
      if (error) throw error

      toast.success('Image deleted')
      setMedia((prev) => prev.filter((m) => m.id !== item.id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{l('mediaLibrary')}</h2>
          <p className="mt-1 text-sm text-zinc-500">{media.length} file{media.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value as typeof uploadFolder)}
            className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="General">Folder: General</option>
            <option value="Products">Folder: Products</option>
            <option value="Banners">Folder: Banners</option>
          </select>
          <CldUploadButton
            uploadPreset="scooty do"
            options={{ multiple: true }}
            onOpen={() => setUploading(true)}
            onClose={() => setUploading(false)}
            onSuccess={async (result: any) => {
              await handleUploadSuccess(result)
              setUploading(false)
            }}
            onError={() => {
              setUploading(false)
              toast.error('Upload failed')
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-colors"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload Images'}
          </CldUploadButton>
        </div>
      </div>

      {/* Folder filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FOLDERS.map((folder) => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              activeFolder === folder
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            {folder}
            {folder !== 'All' && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs">
                {media.filter((m) => m.folder === folder).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20">
          <ImageIcon className="h-10 w-10 text-zinc-600 mb-3" />
          <p className="font-medium text-zinc-400">No media found</p>
          <p className="mt-1 text-sm text-zinc-600">Upload images using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
                <CldImage
                  src={item.public_id}
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  alt={item.file_name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-white">{item.file_name}</p>
                <span className="mt-1 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400">
                  {item.folder}
                </span>
              </div>
              {/* Delete overlay */}
              <button
                onClick={() => handleDelete(item)}
                disabled={deleting === item.id}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-400 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:border-red-500/50 hover:text-red-400 disabled:opacity-60"
              >
                {deleting === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
