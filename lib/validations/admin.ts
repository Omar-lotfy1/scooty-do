import { z } from 'zod'

// ── Auth ──────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

// ── Products ──────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name_en: z.string().min(1, 'Product name (English) is required'),
  name_ar: z.string().min(1, 'Product name (Arabic) is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock_count: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  description_en: z.string(),
  description_ar: z.string(),
  key_spec_en: z.string(),
  key_spec_ar: z.string(),
  badge_status: z.enum(['In Stock', 'Limited Stock', 'Almost Gone']),
  images: z.array(z.string()),
  image_public_ids: z.array(z.string()),
})
export type ProductFormValues = z.infer<typeof productSchema>

// ── Homepage / Site Settings ──────────────────────────────────────────────────

export const homepageSchema = z.object({
  hero_headline_en: z.string(),
  hero_headline_ar: z.string(),
  hero_subheadline_en: z.string(),
  hero_subheadline_ar: z.string(),
  hero_cta_en: z.string(),
  hero_cta_ar: z.string(),
  cta_image_url: z.string(),
  cta_image_public_id: z.string(),
  hero_image_url: z.string(),
  hero_image_public_id: z.string(),
  stats_total_stock: z.string(),
  stats_models: z.string(),
  stats_delivery_en: z.string(),
  stats_delivery_ar: z.string(),
  features_title_en: z.string(),
  features_title_ar: z.string(),
  feature_1_en: z.string(),
  feature_1_ar: z.string(),
  feature_1_desc_en: z.string(),
  feature_1_desc_ar: z.string(),
  feature_2_en: z.string(),
  feature_2_ar: z.string(),
  feature_2_desc_en: z.string(),
  feature_2_desc_ar: z.string(),
  feature_3_en: z.string(),
  feature_3_ar: z.string(),
  feature_3_desc_en: z.string(),
  feature_3_desc_ar: z.string(),
  feature_4_en: z.string(),
  feature_4_ar: z.string(),
  feature_4_desc_en: z.string(),
  feature_4_desc_ar: z.string(),
  feature_5_en: z.string(),
  feature_5_ar: z.string(),
  feature_5_desc_en: z.string(),
  feature_5_desc_ar: z.string(),
})
export type HomepageFormValues = z.infer<typeof homepageSchema>

export const ctaImageSchema = z.object({
  cta_image_url: z.string(),
  cta_image_public_id: z.string(),
})
export type CtaImageFormValues = z.infer<typeof ctaImageSchema>

// ── WhatsApp ──────────────────────────────────────────────────────────────────

export const whatsappSchema = z.object({
  whatsapp_number: z
    .string()
    .min(1, 'WhatsApp number is required')
    .regex(/^\d{10,15}$/, 'Enter a valid international number (digits only, e.g. 201234567890)'),
})
export type WhatsappFormValues = z.infer<typeof whatsappSchema>


// ── Announcement Bar ──────────────────────────────────────────────────────────

export const announcementSchema = z.object({
  announcement_visible: z.boolean(),
  announcement_text_en: z.string(),
  announcement_text_ar: z.string(),
  announcement_bg_color: z.enum(['orange', 'black']),
  // Editable ticker segments
  ticker_segment_2_en: z.string(),
  ticker_segment_2_ar: z.string(),
  ticker_segment_3_en: z.string(),
  ticker_segment_3_ar: z.string(),
  ticker_segment_4_en: z.string(),
  ticker_segment_4_ar: z.string(),
})
export type AnnouncementFormValues = z.infer<typeof announcementSchema>

// ── SEO ───────────────────────────────────────────────────────────────────────

export const seoPageSchema = z.object({
  title_en: z.string(),
  title_ar: z.string(),
  description_en: z.string(),
  description_ar: z.string(),
  keyword_en: z.string(),
  keyword_ar: z.string(),
})
export type SeoPageFormValues = z.infer<typeof seoPageSchema>

// ── Contact Page ──────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  contact_title_en: z.string().min(1, 'Title is required'),
  contact_title_ar: z.string().min(1, 'Title is required'),
  contact_subtitle_en: z.string(),
  contact_subtitle_ar: z.string(),
  contact_info_cards: z.object({
    email_title_en: z.string(),
    email_title_ar: z.string(),
    email_desc_en: z.string(),
    email_desc_ar: z.string(),
    email_address: z.string(),
    phone_title_en: z.string(),
    phone_title_ar: z.string(),
    phone_desc_en: z.string(),
    phone_desc_ar: z.string(),
    phone_number: z.string(),
  }),
  contact_hubs: z.array(
    z.object({
      name_en: z.string().min(1, 'Name is required'),
      name_ar: z.string().min(1, 'Name is required'),
      desc_en: z.string(),
      desc_ar: z.string(),
      hours_en: z.string(),
      hours_ar: z.string(),
      mapUrl: z.string(),
      coordinate: z.string(),
    })
  ),
  contact_faqs: z.array(
    z.object({
      q_en: z.string().min(1, 'Question is required'),
      q_ar: z.string().min(1, 'Question is required'),
      a_en: z.string().min(1, 'Answer is required'),
      a_ar: z.string().min(1, 'Answer is required'),
    })
  ),
})
export type ContactFormValues = z.infer<typeof contactSchema>
