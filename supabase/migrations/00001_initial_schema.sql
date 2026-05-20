-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  features_en TEXT[] DEFAULT '{}',
  features_ar TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Index for slug as requested
CREATE INDEX idx_products_slug ON products(slug);

-- Site Settings Table (Key-Value pair)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Products: Everyone can read, only authenticated can write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON products FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert products."
  ON products FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Users can update products."
  ON products FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Users can delete products."
  ON products FOR DELETE
  USING ( auth.role() = 'authenticated' );

-- Site Settings: Everyone can read, only authenticated can write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public site settings are viewable by everyone."
  ON site_settings FOR SELECT
  USING ( true );

CREATE POLICY "Only authenticated can insert site settings."
  ON site_settings FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Only authenticated can update site settings."
  ON site_settings FOR UPDATE
  USING ( auth.role() = 'authenticated' );

-- Contact Submissions: Public can insert, only authenticated can read/update
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions."
  ON contact_submissions FOR INSERT
  WITH CHECK ( true );

CREATE POLICY "Only authenticated can view contact submissions."
  ON contact_submissions FOR SELECT
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Only authenticated can update contact submissions."
  ON contact_submissions FOR UPDATE
  USING ( auth.role() = 'authenticated' );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Seed Data (5 Products)
INSERT INTO products (slug, name_en, name_ar, description_en, description_ar, price, is_available, stock_count) VALUES
('scooty-pro-max', 'Scooty Pro Max', 'سكوتي برو ماكس', 'The ultimate electric scooter with extended range and dual motors.', 'السكوتر الكهربائي الأفضل بمدى ممتد ومحركين.', 899.99, true, 20),
('scooty-city-lite', 'Scooty City Lite', 'سكوتي سيتي لايت', 'Lightweight and foldable scooter perfect for daily urban commuting.', 'سكوتر خفيف الوزن وقابل للطي مثالي للتنقل اليومي في المدينة.', 449.99, true, 50),
('scooty-off-road', 'Scooty Off-Road', 'سكوتي للطرق الوعرة', 'Robust scooter designed for all terrains with heavy-duty suspension.', 'سكوتر متين مصمم لجميع التضاريس مع نظام تعليق للخدمة الشاقة.', 1199.99, true, 10),
('scooty-cruiser', 'Scooty Cruiser', 'سكوتي كروزر', 'Comfortable ride with a wider deck and built-in seat.', 'رحلة مريحة مع سطح أوسع ومقعد مدمج.', 699.99, true, 15),
('scooty-kids-spark', 'Scooty Kids Spark', 'سكوتي كيدز سبارك', 'Safe and fun scooter for kids with LED light-up wheels.', 'سكوتر آمن وممتع للأطفال بعجلات مضيئة LED.', 199.99, true, 30);

-- Seed Site Settings
INSERT INTO site_settings (key, value) VALUES
('seo_home_title_en', '"Scooty Do | Premium Electric Scooters"'),
('seo_home_title_ar', '"سكوتر دو | سكوترات كهربائية فاخرة"'),
('seo_home_description_en', '"Discover the best electric scooters for urban commuting and off-road adventures."'),
('seo_home_description_ar', '"اكتشف أفضل السكوترات الكهربائية للتنقل في المدينة ومغامرات الطرق الوعرة."'),
('seo_shop_title_en', '"Shop | Scooty Do"'),
('seo_shop_title_ar', '"المتجر | سكوتر دو"'),
('seo_shop_description_en', '"Browse our collection of premium electric scooters."'),
('seo_shop_description_ar', '"تصفح مجموعتنا من السكوترات الكهربائية الفاخرة."'),
('seo_contact_title_en', '"Contact Us | Scooty Do"'),
('seo_contact_title_ar', '"اتصل بنا | سكوتر دو"'),
('seo_contact_description_en', '"Get in touch with our team for support or inquiries."'),
('seo_contact_description_ar', '"تواصل مع فريقنا للحصول على الدعم أو الاستفسارات."');
