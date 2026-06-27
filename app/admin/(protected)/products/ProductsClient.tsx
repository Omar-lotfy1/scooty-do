'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { CldImage, CldUploadButton } from 'next-cloudinary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { productSchema, type ProductFormValues } from '@/lib/validations/admin'
import { Plus, Edit, Trash2, X, Upload, Loader2, Package } from 'lucide-react'
import { useAdminLang } from '@/lib/admin-lang'
import { adminLabel } from '@/lib/admin-labels'
import { cn } from '@/lib/utils'

type Product = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  price: number
  stock_count: number | null
  badge_status: string | null
  images: string[] | null
  image_public_ids: string[] | null
  key_spec_en: string | null
  key_spec_ar: string | null
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseKeySpecString(specStr: string | null, isRtl: boolean) {
  const defaultValues = {
    speed: isRtl ? '25 كم/ساعة' : '25 km/h',
    range: isRtl ? 'لحد 45 كم' : 'Up to 45 km',
    motor: isRtl ? '300 واط' : '300W',
    load: isRtl ? '100 كجم' : '100 kg',
    braking: isRtl ? 'نظام فرامل مزدوج' : 'Dual Braking',
    design: isRtl ? 'تصميم بيتطوي' : 'Foldable Design',
  }

  if (!specStr) return defaultValues

  const specItems = (specStr.includes(',')
    ? specStr.split(',')
    : specStr.split(/(?=(?:Range:|Motor|\d+W|Foldable|Dual|\d+(?:\.\d+)?\"|LED|Bluetooth|Max Load:|Speed:|مدى|موتور|تصميم|نظام|كاوتش|شاشة|بيدعم|يستحمل))/i)
  ).map(s => s.trim()).filter(Boolean)

  const res = { ...defaultValues }

  specItems.forEach((spec) => {
    const cleanSpec = spec.toLowerCase()
    if (cleanSpec.includes('speed') || cleanSpec.includes('سرعة')) {
      res.speed = spec.replace(/^(Top Speed:|سرعة لحد|سرعة|:\s*)/gi, '').trim()
    } else if (cleanSpec.includes('range') || cleanSpec.includes('مدى')) {
      res.range = spec.replace(/^(Range:|مدى قيادة لحد|مدى|:\s*)/gi, '').trim()
    } else if (cleanSpec.includes('motor') || cleanSpec.includes('موتور') || spec.match(/\d+W\b/i)) {
      res.motor = spec.replace(/^(Motor:|موتور|:\s*)/gi, '').trim()
    } else if (cleanSpec.includes('load') || cleanSpec.includes('وزن') || cleanSpec.includes('يستحمل')) {
      res.load = spec.replace(/^(Max Load:|يستحمل وزن لحد|يستحمل|:\s*)/gi, '').trim()
    } else if (cleanSpec.includes('braking') || cleanSpec.includes('فرامل')) {
      res.braking = spec.replace(/^(Dual Braking System|نظام فرامل مزدوج|فرامل|:\s*)/gi, '').trim()
    } else if (cleanSpec.includes('design') || cleanSpec.includes('تصميم') || cleanSpec.includes('يتطوي')) {
      res.design = spec.replace(/^(Foldable Design|تصميم بيتطوي|بيتطوي|:\s*)/gi, '').trim()
    }
  })

  // Strip leading/trailing colons
  Object.keys(res).forEach((k) => {
    const key = k as keyof typeof res
    res[key] = res[key].replace(/^[:\s\-]+|[:\s\-]+$/g, '').trim()
  })

  return res
}

function badgeStyle(status: string | null) {
  switch (status) {
    case 'Almost Gone': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'Limited Stock': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    default: return 'bg-green-500/20 text-green-400 border-green-500/30'
  }
}

// ── Delete Image Helper (calls server-side Cloudinary deletion route) ─────────

async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  const res = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  })
  return res.ok
}

// ── Product Form Modal ─────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!product
  const supabase = createClient()

  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [publicIds, setPublicIds] = useState<string[]>(product?.image_public_ids ?? [])
  const [uploading, setUploading] = useState(false)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return
    const reorderedImages = [...images]
    const reorderedPublicIds = [...publicIds]

    const [movedImage] = reorderedImages.splice(draggedIdx, 1)
    const [movedPublicId] = reorderedPublicIds.splice(draggedIdx, 1)

    reorderedImages.splice(idx, 0, movedImage)
    reorderedPublicIds.splice(idx, 0, movedPublicId)

    setImages(reorderedImages)
    setPublicIds(reorderedPublicIds)
    setDraggedIdx(null)
    toast.success('Images reordered (drag-and-drop)')
  }

  const parsedSpecsEn = parseKeySpecString(product?.key_spec_en ?? null, false)
  const parsedSpecsAr = parseKeySpecString(product?.key_spec_ar ?? null, true)

  interface ExtendedProductFormValues extends ProductFormValues {
    spec_speed_en?: string
    spec_speed_ar?: string
    spec_range_en?: string
    spec_range_ar?: string
    spec_motor_en?: string
    spec_motor_ar?: string
    spec_load_en?: string
    spec_load_ar?: string
    spec_braking_en?: string
    spec_braking_ar?: string
    spec_design_en?: string
    spec_design_ar?: string
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExtendedProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name_en: product?.name_en ?? '',
      name_ar: product?.name_ar ?? '',
      price: product?.price ?? 0,
      stock_count: product?.stock_count ?? 0,
      description_en: product?.description_en ?? '',
      description_ar: product?.description_ar ?? '',
      key_spec_en: product?.key_spec_en ?? '',
      key_spec_ar: product?.key_spec_ar ?? '',
      // Structured specs
      spec_speed_en: parsedSpecsEn.speed,
      spec_speed_ar: parsedSpecsAr.speed,
      spec_range_en: parsedSpecsEn.range,
      spec_range_ar: parsedSpecsAr.range,
      spec_motor_en: parsedSpecsEn.motor,
      spec_motor_ar: parsedSpecsAr.motor,
      spec_load_en: parsedSpecsEn.load,
      spec_load_ar: parsedSpecsAr.load,
      spec_braking_en: parsedSpecsEn.braking,
      spec_braking_ar: parsedSpecsAr.braking,
      spec_design_en: parsedSpecsEn.design,
      spec_design_ar: parsedSpecsAr.design,
      badge_status: (product?.badge_status as any) ?? 'In Stock',
      images: product?.images ?? [],
      image_public_ids: product?.image_public_ids ?? [],
    },
  })

  const handleImageUploadSuccess = async (result: any) => {
    const infos = Array.isArray(result?.info) ? result.info : [result?.info]
    const uploaded = infos.filter((info: any) => info?.public_id && info?.secure_url)

    if (!uploaded.length) {
      toast.error('Upload failed')
      return
    }

    setImages((prev) => [...prev, ...uploaded.map((info: any) => info.secure_url)])
    setPublicIds((prev) => [...prev, ...uploaded.map((info: any) => info.public_id)])
    toast.success(`${uploaded.length} image(s) uploaded`)
  }

  const removeImage = async (idx: number) => {
    const pid = publicIds[idx]
    if (!pid) {
      setImages((prev) => prev.filter((_, i) => i !== idx))
      setPublicIds((prev) => prev.filter((_, i) => i !== idx))
      return
    }

    const res = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId: pid }),
    })

    if (!res.ok) {
      toast.error('Failed to delete image from Cloudinary')
      return
    }

    const newImages = images.filter((_, i) => i !== idx)
    const newPublicIds = publicIds.filter((_, i) => i !== idx)
    setImages(newImages)
    setPublicIds(newPublicIds)

    if (product?.id) {
      const { error } = await supabase.from('products').update({ images: newImages, image_public_ids: newPublicIds }).eq('id', product.id)
      if (error) {
        toast.error(error.message)
        return
      }
    }

    toast.success('Image deleted')
  }

  const onSubmit = async (values: any) => {
    // Compile structured specs into standard comma-separated key specs
    const key_spec_en = [
      `Top Speed: ${values.spec_speed_en || '25 km/h'}`,
      `Range: ${values.spec_range_en || 'Up to 45 km'}`,
      `Motor: ${values.spec_motor_en || '300W'}`,
      `Max Load: ${values.spec_load_en || '100 kg'}`,
      `Braking: ${values.spec_braking_en || 'Dual Braking'}`,
      `Design: ${values.spec_design_en || 'Foldable Design'}`,
    ].join(', ')

    const key_spec_ar = [
      `سرعة لحد ${values.spec_speed_ar || '25 كم/ساعة'}`,
      `مدى قيادة لحد ${values.spec_range_ar || '45 كم'}`,
      `موتور ${values.spec_motor_ar || '300 واط'}`,
      `يستحمل وزن لحد ${values.spec_load_ar || '100 كجم'}`,
      `فرامل ${values.spec_braking_ar || 'نظام فرامل مزدوج'}`,
      `تصميم ${values.spec_design_ar || 'تصميم بيتطوي'}`,
    ].join(', ')

    const slug = product?.slug ?? slugify(values.name_en)
    const payload = {
      slug,
      name_en: values.name_en,
      name_ar: values.name_ar,
      price: values.price,
      stock_count: values.stock_count,
      description_en: values.description_en,
      description_ar: values.description_ar,
      key_spec_en,
      key_spec_ar,
      badge_status: values.badge_status,
      images,
      image_public_ids: publicIds,
      is_available: values.stock_count > 0,
    }

    let error
    if (isEdit && product) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', product.id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }

    if (error) {
      toast.error(error.message)
      return
    }

    // Revalidate via API
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'products' }),
    })

    toast.success(isEdit ? 'Product updated!' : 'Product created!')
    onSaved()
    onClose()
  }

  const fieldCls = 'w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors'
  const labelCls = 'block text-xs font-medium text-zinc-400 mb-1'
  const errCls = 'text-xs text-red-400 mt-0.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Product Name (English) *</label>
                <input {...register('name_en')} className={fieldCls} placeholder="Mi Electric Scooter" />
                {errors.name_en && <p className={errCls}>{errors.name_en.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Product Name (Arabic) *</label>
                <input {...register('name_ar')} className={fieldCls} dir="rtl" placeholder="سكوتر شاومي" />
                {errors.name_ar && <p className={errCls}>{errors.name_ar.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Price (EGP) *</label>
                <input type="number" {...register('price', { valueAsNumber: true })} className={fieldCls} placeholder="12800" />
                {errors.price && <p className={errCls}>{errors.price.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Stock Quantity *</label>
                <input type="number" {...register('stock_count', { valueAsNumber: true })} className={fieldCls} placeholder="24" />
                {errors.stock_count && <p className={errCls}>{errors.stock_count.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Badge Status</label>
                <select {...register('badge_status')} className={fieldCls}>
                  <option value="In Stock">In Stock</option>
                  <option value="Limited Stock">Limited Stock</option>
                  <option value="Almost Gone">Almost Gone</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Description (English)</label>
                <textarea {...register('description_en')} rows={3} className={fieldCls} placeholder="Describe the product…" />
              </div>
              <div>
                <label className={labelCls}>Description (Arabic)</label>
                <textarea {...register('description_ar')} rows={3} className={fieldCls} dir="rtl" placeholder="وصف المنتج…" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-6">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-orange-500/20 text-orange-500 font-bold text-xs">S</span>
                <h4 className="text-sm font-semibold text-white">Product Specifications</h4>
              </div>

              {/* Speed & Range */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Top Speed (EN)</label>
                    <input {...register('spec_speed_en')} className={fieldCls} placeholder="e.g. 25 km/h" />
                  </div>
                  <div>
                    <label className={labelCls}>السرعة القصوى (AR)</label>
                    <input {...register('spec_speed_ar')} className={fieldCls} dir="rtl" placeholder="مثال: 25 كم/ساعة" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Range / Battery (EN)</label>
                    <input {...register('spec_range_en')} className={fieldCls} placeholder="e.g. Up to 45 km" />
                  </div>
                  <div>
                    <label className={labelCls}>المدى (AR)</label>
                    <input {...register('spec_range_ar')} className={fieldCls} dir="rtl" placeholder="مثال: لحد 45 كم" />
                  </div>
                </div>
              </div>

              {/* Motor & Max Load */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Motor Power (EN)</label>
                    <input {...register('spec_motor_en')} className={fieldCls} placeholder="e.g. 300W" />
                  </div>
                  <div>
                    <label className={labelCls}>المحرك (AR)</label>
                    <input {...register('spec_motor_ar')} className={fieldCls} dir="rtl" placeholder="مثال: 300 واط" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Max Load (EN)</label>
                    <input {...register('spec_load_en')} className={fieldCls} placeholder="e.g. 100 kg" />
                  </div>
                  <div>
                    <label className={labelCls}>الحمل الأقصى (AR)</label>
                    <input {...register('spec_load_ar')} className={fieldCls} dir="rtl" placeholder="مثال: 100 كجم" />
                  </div>
                </div>
              </div>

              {/* Brakes & Design */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Braking System (EN)</label>
                    <input {...register('spec_braking_en')} className={fieldCls} placeholder="e.g. Dual Braking" />
                  </div>
                  <div>
                    <label className={labelCls}>نظام الفرامل (AR)</label>
                    <input {...register('spec_braking_ar')} className={fieldCls} dir="rtl" placeholder="مثال: نظام فرامل مزدوج" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Design/Folding (EN)</label>
                    <input {...register('spec_design_en')} className={fieldCls} placeholder="e.g. Foldable Design" />
                  </div>
                  <div>
                    <label className={labelCls}>التصميم (AR)</label>
                    <input {...register('spec_design_ar')} className={fieldCls} dir="rtl" placeholder="مثال: تصميم بيتطوي" />
                  </div>
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Product Images</label>
                {images.length > 1 && (
                  <span className="text-[10px] text-zinc-500 font-medium">
                    Drag and drop images to reorder. The first image will be the primary cover.
                  </span>
                )}
              </div>
              <CldUploadButton
                uploadPreset="scooty do"
                options={{
                  multiple: true,
                  cropping: true,
                  croppingAspectRatio: 0.8,
                  showSkipCropButton: true,
                  croppingDefaultSelectionRatio: 0.8,
                }}
                onOpen={() => setUploading(true)}
                onClose={() => setUploading(false)}
                onSuccess={handleImageUploadSuccess}
                onError={() => {
                  setUploading(false)
                  toast.error('Upload failed')
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors w-full"
              >
                <Upload className="h-4 w-4 shrink-0" />
                {uploading ? 'Uploading…' : 'Upload images'}
              </CldUploadButton>

              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx)}
                      className={cn(
                        "group relative h-20 w-20 overflow-hidden rounded-xl border transition-all cursor-move active:scale-95 active:rotate-2",
                        draggedIdx === idx ? "border-orange-500 opacity-40 scale-90" : "border-white/10 hover:border-white/30"
                      )}
                      title="Drag to reorder"
                    >
                      {publicIds[idx] ? (
                        <CldImage
                          src={publicIds[idx]}
                          width={160}
                          height={160}
                          alt={`Product image ${idx + 1}`}
                          className="object-cover h-full w-full pointer-events-none"
                        />
                      ) : (
                        <img src={url} alt={`Product image ${idx + 1}`} className="h-full w-full object-cover pointer-events-none" />
                      )}
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-orange-500 text-[8px] font-black uppercase text-white px-1 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-5 w-5 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5">
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting || uploading}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-400 disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirmation Modal ──────────────────────────────────────────────────

function DeleteModal({
  product,
  onClose,
  onDeleted,
}: {
  product: Product
  onClose: () => void
  onDeleted: () => void
}) {
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      // Delete each Cloudinary image first
      const pids = product.image_public_ids ?? []
      await Promise.all(pids.map((pid) => deleteCloudinaryImage(pid)))

      // Delete from Supabase
      const { error } = await supabase.from('products').delete().eq('id', product.id)
      if (error) throw error

      await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'products' }),
      })

      toast.success('Product deleted')
      onDeleted()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 mb-4">
          <Trash2 className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Delete Product</h3>
        <p className="mt-2 text-sm text-zinc-400">
          This will permanently delete <span className="font-semibold text-white">{product.name_en}</span> and all its images from Cloudinary. This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-400 disabled:opacity-60"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {deleting ? 'Deleting…' : 'Delete Forever'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Products Client Component ────────────────────────────────────────────

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const { lang } = useAdminLang()
  const l = (key: Parameters<typeof adminLabel>[1]) => adminLabel(lang, key)
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [modalProduct, setModalProduct] = useState<Product | null | 'new'>('new' as 'new' | Product | null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  // Reset modal state
  const openNew = () => setModalProduct(null)
  const openEdit = (p: Product) => setModalProduct(p)

  const refreshProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
  }, [supabase])

  // Start with modal closed
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{l('products')}</h2>
          <p className="mt-1 text-sm text-zinc-500">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true) }}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {l('newProduct')}
        </button>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Package className="h-10 w-10 text-zinc-600 mb-3" />
          <p className="font-medium text-zinc-400">No products yet</p>
          <p className="mt-1 text-sm text-zinc-600">Add your first product to get started.</p>
          <button
            onClick={() => { setEditProduct(null); setShowModal(true) }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-400"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name_en}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-5 w-5 text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name_en}</p>
                          <p className="text-xs text-zinc-500 dir-rtl">{product.name_ar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">
                      {product.price.toLocaleString('en-EG')} EGP
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-medium ${(product.stock_count ?? 0) <= 5 ? 'text-red-400' : (product.stock_count ?? 0) <= 10 ? 'text-orange-400' : 'text-white'}`}>
                        {product.stock_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeStyle(product.badge_status)}`}>
                        {product.badge_status ?? 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditProduct(product); setShowModal(true) }}
                          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-red-500/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null) }}
          onSaved={refreshProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={refreshProducts}
        />
      )}
    </div>
  )
}
