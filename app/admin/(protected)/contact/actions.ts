'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { contactSchema, type ContactFormValues } from '@/lib/validations/admin'

export async function updateContactSettings(data: ContactFormValues) {
  const supabase = await createClient()

  // Validate the input on the server
  const parsed = contactSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid contact form data provided' }
  }

  const values = parsed.data

  // Convert the structured object back to individual rows for the site_settings table
  const rows = [
    { key: 'contact_title_en', value: values.contact_title_en },
    { key: 'contact_title_ar', value: values.contact_title_ar },
    { key: 'contact_subtitle_en', value: values.contact_subtitle_en },
    { key: 'contact_subtitle_ar', value: values.contact_subtitle_ar },
    // Storing structured objects as JSONB strings
    { key: 'contact_info_cards', value: JSON.stringify(values.contact_info_cards) },
    { key: 'contact_hubs', value: JSON.stringify(values.contact_hubs) },
    { key: 'contact_faqs', value: JSON.stringify(values.contact_faqs) },
  ]

  // Full UPSERT - replaces any existing value for these keys entirely
  const { error } = await supabase.from('site_settings').upsert(rows)

  if (error) {
    return { error: error.message }
  }

  // Revalidate both language paths for contact page
  revalidatePath('/[locale]/contact', 'page')
  revalidatePath('/contact')

  return { success: true }
}
