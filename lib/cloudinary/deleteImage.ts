import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type DeleteResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Deletes an image from Cloudinary by its public ID.
 * Must be called server-side only (uses CLOUDINARY_API_SECRET).
 * Call this BEFORE deleting any Supabase record referencing the image.
 */
export async function deleteImage(publicId: string): Promise<DeleteResult> {
  if (!publicId) {
    return { success: false, error: 'No public ID provided' }
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result === 'ok' || result.result === 'not found') {
      // 'not found' is treated as success to avoid blocking DB deletions
      return { success: true }
    }
    return { success: false, error: `Cloudinary returned: ${result.result}` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Cloudinary error'
    console.error('[deleteImage] Cloudinary deletion failed:', message)
    return { success: false, error: message }
  }
}
