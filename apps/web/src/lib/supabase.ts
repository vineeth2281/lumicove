import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iyrknxjwhfwrtppbtiqf.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_xL08dM72AYTsfforiW94Gw_nbdg_2GY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
