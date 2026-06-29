'use client'

import { useState, useRef } from 'react'
import { CldImage, CldUploadButton } from 'next-cloudinary'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Image as ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react'

type LifestyleImage = { url: string; public_id: string }

export default function LifestyleClient({ initialImages }: { initialImages: LifestyleImage[] }) {
  const [images, setImages] = useState<LifestyleImage[]>(initialImages)
  const imagesRef = useRef<LifestyleImage[]>(initialImages)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null)
  
  const supabase = createClient()
  const MAX_IMAGES = 10

  const handleImageUploadSuccess = async (result: any) => {
    const infos = Array.isArray(result?.info) ? result.info : [result?.info]
    const uploaded = infos.filter((info: any) => info?.public_id && info?.secure_url)

    if (!uploaded.length) {
      toast.error('Upload failed')
      return
    }

    const newImages = uploaded.map((info: any) => ({
      url: info.secure_url,
      public_id: info.public_id,
    }))

    const combined = [...imagesRef.current, ...newImages].slice(0, MAX_IMAGES)
    imagesRef.current = combined
    setImages(combined)
    saveToDatabase(combined)
    toast.success(`${newImages.length} image(s) added`)
  }

  const removeImage = async (idx: number) => {
    setDeletingIdx(idx)
    const currentList = imagesRef.current
    const img = currentList[idx]
    if (!img) return
    
    try {
      // Delete from Cloudinary
      const res = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: img.public_id }),
      })

      if (!res.ok) {
        throw new Error('Failed to delete image from Cloudinary')
      }

      // Update state and DB
      const newImages = currentList.filter((_, i) => i !== idx)
      imagesRef.current = newImages
      setImages(newImages)
      saveToDatabase(newImages)
      toast.success('Image deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    } finally {
      setDeletingIdx(null)
    }
  }

  const saveToDatabase = async (currentImages: LifestyleImage[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    setSaving(true)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase.from('site_settings').upsert({
          key: 'lifestyle_images',
          value: currentImages,
        })
        if (error) throw error

        // Revalidate the homepage so changes appear immediately
        await fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scope: 'homepage' }),
        })
      } catch (err: any) {
        toast.error('Failed to save to database')
      } finally {
        setSaving(false)
        saveTimeoutRef.current = null
      }
    }, 500)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-orange-500" />
            Lifestyle Gallery
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the scrolling lifestyle images on the homepage. Max {MAX_IMAGES} images. 
            ({images.length}/{MAX_IMAGES} used)
          </p>
        </div>

        {images.length < MAX_IMAGES && (
          <CldUploadButton
            uploadPreset="scooty do"
            options={{ multiple: true, maxFiles: MAX_IMAGES - images.length }}
            onOpen={() => setUploading(true)}
            onClose={() => setUploading(false)}
            onSuccess={handleImageUploadSuccess}
            onError={() => {
              setUploading(false)
              toast.error('Upload failed')
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-colors"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload Images'}
          </CldUploadButton>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon className="h-12 w-12 text-zinc-600 mb-4" />
            <p className="font-medium text-white">No images uploaded yet</p>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm">
              Upload images here to replace the default placeholder gallery on the homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <div key={img.public_id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-zinc-800 shadow-sm">
                <CldImage
                  src={img.public_id}
                  width={400}
                  height={600}
                  alt={`Lifestyle ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                  <button
                    onClick={() => removeImage(idx)}
                    disabled={deletingIdx === idx}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-400 disabled:opacity-50 transition-colors"
                  >
                    {deletingIdx === idx ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
