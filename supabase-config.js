// ⚠️ دخل هنا المعلومات ديالك
const SUPABASE_URL = 'https://jkvkdttklfelyhpuuczr.supabase.co'; // دخل الرابط ديالك هنا
const SUPABASE_KEY = 'sb_publishable_88s8gE770CAQeoyEOs3FoQ_6bBbxHZk'; // دخل المفتاح اللي كوبيتي هنا

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ Supabase init OK');
