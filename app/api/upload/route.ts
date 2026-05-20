import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    error: 'Cloudinary uploads are unsigned. Use the browser upload widget and /api/cloudinary/delete for image deletion.',
  }, { status: 405 })
}
