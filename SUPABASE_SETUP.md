# 🚀 دليل ربط موقع "رؤيا العقارية" بقاعدة بيانات Supabase (خطوة بخطوة)

تم تجهيز جميع ملفات الموقع البرمجية لتتصل تلقائياً بقاعدة بيانات **Supabase** السحابية. اتبع الخطوات البسيطة التالية لإتمام الربط خلال 3 دقائق:

---

## 1️⃣ الخطوة الأولى: إنشاء مشروع مجاني على Supabase

1. ادخل إلى موقع [supabase.com](https://supabase.com/) وقم بتسجيل الدخول أو إنشاء حساب مجاني جديد.
2. اضغط على زر **"New project"** (مشروع جديد).
3. اختر اسماً لمشروعك (مثلاً: `ruya-aqar`).
4. اختر كلمة مرور قوية لقاعدة البيانات (Database Password).
5. اختر المنطقة الجغرافية الأقرب (مثلاً: `Frankfurt` أو `Bahrain` لسرعة عالية).
6. اضغط على **"Create new project"** وانتظر دقيقة حتى يكتمل تجهيز المشروع.

---

## 2️⃣ الخطوة الثانية: إنشاء الجداول وتجهيز البيانات (SQL Schema)

1. في القائمة الجانبية اليسرى في لوحة تحكم Supabase، اضغط على أيقونة **SQL Editor** (علامة `>_`).
2. اضغط على **"New query"** (استعلام جديد).
3. افتح الملف المجهز لك في المشروع: `supabase/schema.sql`.
4. انسخ كامل محتوى الملف، وألصقه في محرر الاستعلامات في Supabase.
5. اضغط على زر **"Run"** (أو اضغط `Ctrl + Enter`).
6. ستحصل فوراً على رسالة: `Success. No rows returned`.
   *(هذا الأمر أنشأ لك جدول العقارات `properties`، وجدول طلبات الزوار `property_requests`، وإحصائيات الزيارات، وضبط سياسات الأمان RLS، وأضاف بيانات العقارات الأولية السورية تلقائياً!)*

---

## 3️⃣ الخطوة الثالثة: نسخ مفاتيح الربط إلى ملف `.env.local`

1. في القائمة الجانبية اليسرى في لوحة Supabase، اضغط على أيقونة الإعدادات **Project Settings** (أيقونة الترس ⚙️ في الأسفل).
2. اختر قسم **API** (أو **Data API**).
3. ستجد قسمين رئيسيين:
   - **Project URL**: انسخ الرابط الذي يبدأ بـ `https://xxxx.supabase.co`.
   - **Project API Keys**: انسخ المفتاح المسمى **`anon` `public`**.
4. افتح الملف [.env.local](file:///c:/Users/PC/Desktop/websit2/.env.local) في مشروعك وضع القيمتين كالتالي:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. احفظ الملف (`Ctrl + S`).

---

## 4️⃣ الخطوة الرابعة: تشغيل الموقع والتأكد من الاتصال

1. أعد تشغيل سيرفر التطوير بالأمر:
   ```bash
   npm run dev
   ```
2. افتح صفحة إدارة العقارات في لوحة التحكم:
   `http://localhost:3000/admin/properties`
3. ستلاحظ في أعلى الصفحة ظهور شارة خضراء مميزة:
   🟢 **متصل بـ Supabase Cloud**
4. الآن، أي عقار تضيفه أو تعدله أو تحذفه، وأي طلب يرسله الزوار، سيتم حفظه مباشرة في قاعدة بيانات Supabase السحابية ويبقى محفوظاً بأمان دائم!

---

## 📁 ملخص الملفات التي تم إعدادها في المشروع:

1. [supabase/schema.sql](file:///c:/Users/PC/Desktop/websit2/supabase/schema.sql): كود الـ SQL لإنشاء الجداول وسياسات الأمان والبيانات الأولية.
2. [.env.example](file:///c:/Users/PC/Desktop/websit2/.env.example): نموذج لمتغيرات البيئة.
3. [.env.local](file:///c:/Users/PC/Desktop/websit2/.env.local): الملف الفعلي الذي تضع فيه مفاتيح Supabase الخاصة بك.
4. [src/lib/supabase.ts](file:///c:/Users/PC/Desktop/websit2/src/lib/supabase.ts): اتصال العميل وفحص الرابط التلقائي.
5. [src/lib/supabaseService.ts](file:///c:/Users/PC/Desktop/websit2/src/lib/supabaseService.ts): دوال التعامل مع الجداول (إضافة، تعديل، حذف، جلب).
6. [src/lib/store.ts](file:///c:/Users/PC/Desktop/websit2/src/lib/store.ts): نظام المزامنة الثنائي (سحابي + محلي في حال انقطاع النت).
