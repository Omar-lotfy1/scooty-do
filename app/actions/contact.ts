'use server'

import { createClient } from '@/lib/supabase/server'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'

export async function submitContact(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = contactSchema.parse(data)
    
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          message: validatedData.message,
        }
      ])
      
    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Contact submission error:', error)
    return { success: false, error: 'Failed to submit message. Please try again later.' }
  }
}
