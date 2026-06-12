import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://szvttdbffzlqyzubkyjr.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZViQ62EjqBW0eVjzfmiz4g_nBkz8RcD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);