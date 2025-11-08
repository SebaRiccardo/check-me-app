import { Database } from "@/lib/supabase/database.types";

export type Verification = Database["public"]["Tables"]["verifications"]["Row"];
export type VerificationInsert =
  Database["public"]["Tables"]["verifications"]["Insert"];
export type VerificationUpdate =
  Database["public"]["Tables"]["verifications"]["Update"];

export const VERIFICATION_CATEGORIES = [
  "Verdadero",
  "Falso",
  "Falta Contexto",
] as const;

export type VerificationCategory = (typeof VERIFICATION_CATEGORIES)[number];
