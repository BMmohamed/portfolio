import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// Check if credentials exist and are not default placeholder text
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * اختبار الاتصال بقاعدة بيانات Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; count?: number }> {
  if (!supabase || !isSupabaseConfigured) {
    return {
      success: false,
      message: 'بيانات Supabase غير مكتملة في ملف .env.local (يرجى إضافة NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY)',
    };
  }

  try {
    const { count, error } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        success: false,
        message: `خطأ في الاتصال بـ Supabase: ${error.message} (تأكد من تنفيذ كود supabase/schema.sql)`,
      };
    }

    return {
      success: true,
      message: `تم الاتصال بقاعدة بيانات Supabase بنجاح! عدد العقارات الحالية: ${count || 0}`,
      count: count || 0,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `تعذر الاتصال بـ Supabase: ${err.message || 'خطأ غير معروف'}`,
    };
  }
}
