-- ================================================================
-- مشروع "رؤيا العقارية" - كود إعداد قاعدة بيانات Supabase (PostgreSQL)
-- انسخ هذا الكود بالكامل، وافتحه في لوحة تحكم Supabase -> SQL Editor -> New Query
-- ثم اضغط Run لتجهيز الجداول وسياسات الأمان والبيانات الأولية بنقرة واحدة!
-- ================================================================

-- 1. إنشاء جدول العقارات (properties)
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    purpose TEXT NOT NULL CHECK (purpose IN ('sale', 'rent')),
    type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'land', 'commercial')),
    price NUMERIC NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    area NUMERIC NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    living_rooms INTEGER DEFAULT 0,
    parking INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    views_count INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. إنشاء جدول طلبات العقارات من الزوار (property_requests)
CREATE TABLE IF NOT EXISTS public.property_requests (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('buy', 'rent')),
    type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'land', 'commercial')),
    city TEXT NOT NULL,
    district TEXT,
    budget_min NUMERIC DEFAULT 0,
    budget_max NUMERIC DEFAULT 0,
    bedrooms INTEGER DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    views_count INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. إنشاء جدول إحصائيات الزيارات (website_visits)
CREATE TABLE IF NOT EXISTS public.website_visits (
    id SERIAL PRIMARY KEY,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. فهارس تسريع البحث (Indexes)
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_purpose ON public.properties(purpose);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.property_requests(status);

-- ================================================================
-- 5. تفعيل سياسات الأمان (Row Level Security - RLS)
-- ================================================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_visits ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة العقارات المتاحة والمعروضة
DROP POLICY IF EXISTS "Public can view properties" ON public.properties;
CREATE POLICY "Public can view properties" 
ON public.properties FOR SELECT 
USING (true);

-- السماح بالتحكم الكامل بالعقارات (إضافة، تعديل، حذف) عبر مفتاح anon للوحة الإدارة
DROP POLICY IF EXISTS "Manage properties policy" ON public.properties;
CREATE POLICY "Manage properties policy" 
ON public.properties FOR ALL 
USING (true)
WITH CHECK (true);

-- السماح للزوار بتقديم طلب عقار جديد
DROP POLICY IF EXISTS "Public can insert property requests" ON public.property_requests;
CREATE POLICY "Public can insert property requests" 
ON public.property_requests FOR INSERT 
WITH CHECK (true);

-- السماح بقراءة وإدارة الطلبات
DROP POLICY IF EXISTS "Manage property requests" ON public.property_requests;
CREATE POLICY "Manage property requests" 
ON public.property_requests FOR ALL 
USING (true)
WITH CHECK (true);

-- السماح بتسجيل الزيارات
DROP POLICY IF EXISTS "Public can insert visits" ON public.website_visits;
CREATE POLICY "Public can insert visits" 
ON public.website_visits FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read visits" ON public.website_visits;
CREATE POLICY "Public can read visits" 
ON public.website_visits FOR SELECT 
USING (true);

-- ================================================================
-- 6. دوال زيادة العدادات الذاتية (Views & WhatsApp Clicks)
-- ================================================================

CREATE OR REPLACE FUNCTION public.increment_property_views(prop_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.properties
    SET views_count = COALESCE(views_count, 0) + 1
    WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_property_whatsapp(prop_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.properties
    SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1
    WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 7. بيانات أولية جاهزة (Initial Seed Data)
-- ================================================================

INSERT INTO public.properties (
    id, code, title, description, purpose, type, price, city, district, address, 
    latitude, longitude, area, bedrooms, bathrooms, living_rooms, parking, status, 
    images, video_url, features, views_count, whatsapp_clicks, featured, created_at
) VALUES 
(
    'prop-1', 
    'REF-101', 
    'فيلا مودرن فاخرة مع مسبح خاص وحديقة واسعة في يعفور', 
    'فيلا فخمة بتصميم معماري حديث وتشطيبات سوبر ديلوكس VIP في أرقى مناطق ريف دمشق (يعفور). تتألف من طابقين وتراس بانورامي، مسبح خاص بنظام تدفئة، طاقة شمسية متكاملة، بئر ماء خاص مرخص، مولدة كهرباء، غرفة حارس وخدم، وحديقة منسقة بمساحة واسعة. طابو أخضر 2400 سهم نظامي جاهز للفراغ الفوري.',
    'sale', 
    'villa', 
    580000, 
    'ريف دمشق', 
    'يعفور', 
    'شارع الفلل الحديثة، يعفور، ريف دمشق', 
    33.5138, 
    36.1425, 
    650, 
    5, 
    6, 
    2, 
    3, 
    'available', 
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    '["طابو أخضر 2400 سهم", "مسبح خاص مجهز", "طاقة شمسية كاملة", "بئر ماء مرخص", "حديقة واسعة", "تدفئة وتكييف مركزي", "غرفة حارس", "مولدة كهرباء"]'::jsonb,
    245, 
    38, 
    true, 
    NOW() - INTERVAL '10 days'
),
(
    'prop-2', 
    'REF-102', 
    'شقة سكنية فخمة بتشطيب سوبر ديلوكس في أبو رمانة', 
    'شقة راقية في قلب أرقى أحياء دمشق (أبو رمانة). تتميز بكسوة رخامية إيطالية، إطلالة رائعة على حديقة الجاحظ، مصعد خاص، تدفئة وتكييف مركزي، وموقف سيارة خاص بالقبو. طابو ملك نظامي جاهز للتسجيل الفوري.',
    'sale', 
    'apartment', 
    290000, 
    'دمشق', 
    'أبو رمانة', 
    'بالقرب من حديقة الجاحظ، أبو رمانة، دمشق', 
    33.5192, 
    36.2845, 
    220, 
    3, 
    3, 
    1, 
    1, 
    'available', 
    '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    NULL,
    '["طابو أخضر نظامي", "كسوة رخام إيطالي", "موقف قبو خاص", "مصعد حديث", "طاقة شمسية", "موقع دبلوماسي راقٍ"]'::jsonb,
    312, 
    52, 
    true, 
    NOW() - INTERVAL '9 days'
),
(
    'prop-3', 
    'REF-103', 
    'شقة مفروشة بالكامل للإيجار السنوي في تنظيم كفرسوسة', 
    'شقة دوبلكس مفروشة بأرقى المفروشات العصرية في منطقة كفرسوسة الراقية، قريبة من الشام سيتي سنتر والمراكز الحيوية. مجهزة بنظام طاقة شمسية متكامل يغذي كامل المنزل، ومطبخ متكامل بجميع الأدوات الكهربائية.',
    'rent', 
    'apartment', 
    2400, 
    'دمشق', 
    'كفرسوسة', 
    'بالقرب من الشام سيتي سنتر، كفرسوسة، دمشق', 
    33.4981, 
    36.2734, 
    180, 
    3, 
    3, 
    1, 
    1, 
    'available', 
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    NULL,
    '["مفروشة بالكامل VIP", "نظام طاقة شمسية 24 ساعة", "مصعد يعمل باستمرار", "موقف سيارات", "حراسة مدار الساعة"]'::jsonb,
    198, 
    29, 
    false, 
    NOW() - INTERVAL '8 days'
)
ON CONFLICT (id) DO NOTHING;
