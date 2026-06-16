import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://erkpduqvsfpvyjestzbv.supabase.co';
const supabaseAnonKey = 'sb_publishable_yBnqCKAMDj4qzbvvOseLMw__TAmfqFo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);