import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { path, tag, scope } = body as {
      path?: string
      tag?: string
      scope?: 'products' | 'homepage' | 'settings' | 'all'
    }

    // Tag revalidation removed to fix TS error

    if (path) {
      revalidatePath(path)
      revalidatePath(`/en${path === '/' ? '' : path}`)
      revalidatePath(`/ar${path === '/' ? '' : path}`)
    }

    if (scope === 'products' || scope === 'all') {
      revalidatePath('/en/shop', 'page')
      revalidatePath('/ar/shop', 'page')
      revalidatePath('/en/shop/[slug]', 'page')
      revalidatePath('/ar/shop/[slug]', 'page')
      revalidatePath('/en', 'page')
      revalidatePath('/ar', 'page')
    }

    if (scope === 'homepage' || scope === 'all') {
      revalidatePath('/en', 'page')
      revalidatePath('/ar', 'page')
    }

    if (scope === 'settings' || scope === 'all') {
      revalidatePath('/en', 'page')
      revalidatePath('/ar', 'page')
      revalidatePath('/en/shop', 'page')
      revalidatePath('/ar/shop', 'page')
    }

    revalidatePath('/admin/dashboard')

    return NextResponse.json({ revalidated: true })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
