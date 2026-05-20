-- Add new columns to products table for admin panel
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_public_ids TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS key_spec_en TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS key_spec_ar TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_status TEXT DEFAULT 'In Stock';

-- Media table for the media library
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  folder TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media
CREATE POLICY "Public media viewable by everyone."
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated can insert media."
  ON media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated can delete media."
  ON media FOR DELETE
  USING (auth.role() = 'authenticated');

-- GRANT for Data API exposure (Supabase breaking change Apr 28 2026:
-- new tables are NOT auto-exposed, must be explicitly granted)
GRANT SELECT ON media TO anon, authenticated;
GRANT INSERT, DELETE ON media TO authenticated;

-- Update existing products seed to have Mi Electric Scooter data
-- (kept separate so existing products are preserved)
INSERT INTO products (slug, name_en, name_ar, description_en, description_ar, price, stock_count, badge_status, is_available)
VALUES
  ('mi-electric-scooter', 'Mi Electric Scooter', 'سكوتر شاومي الكهربائي', 'Reliable and efficient electric scooter for daily urban commuting.', 'سكوتر كهربائي موثوق وفعال للتنقل اليومي في المدينة.', 12800, 24, 'In Stock', true),
  ('mi-electric-scooter-essential', 'Mi Electric Scooter Essential', 'سكوتر شاومي الكهربائي Essential', 'Entry-level electric scooter with essential features for everyday use.', 'سكوتر كهربائي للمبتدئين بمميزات أساسية للاستخدام اليومي.', 11600, 8, 'Limited Stock', true),
  ('mi-electric-scooter-pro', 'Mi Electric Scooter Pro', 'سكوتر شاومي الكهربائي Pro', 'Professional-grade electric scooter with extended range and power.', 'سكوتر كهربائي احترافي بمدى موسع وقوة عالية.', 15800, 5, 'Almost Gone', true),
  ('mi-scooter-pro-2', 'Mi Scooter Pro 2', 'سكوتر شاومي Pro 2', 'Next-generation pro scooter with dual suspension and top performance.', 'سكوتر احترافي من الجيل التالي مع تعليق مزدوج وأداء متميز.', 18800, 97, 'In Stock', true),
  ('mi-scooter-1s', 'Mi Scooter 1S', 'سكوتر شاومي 1S', 'Smart scooter with app connectivity and enhanced safety features.', 'سكوتر ذكي مع اتصال بالتطبيق وميزات أمان محسّنة.', 13800, 106, 'In Stock', true)
ON CONFLICT (slug) DO NOTHING;
