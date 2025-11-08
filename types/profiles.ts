import { Database } from "@/lib/supabase/database.types";

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
