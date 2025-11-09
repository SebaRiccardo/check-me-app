import { supabase } from "@/lib/supabase/supabase";
import type {
  VerificationInsert,
  VerificationUpdate,
} from "@/types/verification";
import { useContext, useState } from "react";
import {
  VerificationsContext,
  type VerificationWithProfile,
} from "@/providers/verifications-provider";

export type { VerificationWithProfile };

/**
 * Hook para acceder al contexto de verificaciones
 */
export function useVerificationsContext() {
  const context = useContext(VerificationsContext);

  if (context === undefined) {
    throw new Error(
      "useVerificationsContext debe usarse dentro de un VerificationsProvider",
    );
  }

  return context;
}

export function useVerifications() {
  return useVerificationsContext();
}

export function useCreateVerification() {
  const { createVerification, error } = useVerificationsContext();
  const [isLoading, setIsLoading] = useState(false);

  const create = async (
    verification: VerificationInsert,
  ): Promise<VerificationWithProfile | null> => {
    setIsLoading(true);
    const result = await createVerification(verification);
    setIsLoading(false);
    return result;
  };

  return {
    createVerification: create,
    isLoading,
    error,
  };
}

/**
 * Hook para actualizar verificaciones
 * @deprecated Usa useVerificationsContext().updateVerification directamente
 */
export function useUpdateVerification() {
  const { updateVerification, error } = useVerificationsContext();
  const [isLoading, setIsLoading] = useState(false);

  const update = async (
    id: string,
    updates: VerificationUpdate,
  ): Promise<VerificationWithProfile | null> => {
    setIsLoading(true);
    const result = await updateVerification(id, updates);
    setIsLoading(false);
    return result;
  };

  return {
    updateVerification: update,
    isLoading,
    error,
  };
}

/**
 * Hook para eliminar verificaciones
 * @deprecated Usa useVerificationsContext().deleteVerification directamente
 */
export function useDeleteVerification() {
  const { deleteVerification, error } = useVerificationsContext();
  const [isLoading, setIsLoading] = useState(false);

  const remove = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    const result = await deleteVerification(id);
    setIsLoading(false);
    return result;
  };

  return {
    deleteVerification: remove,
    isLoading,
    error,
  };
}

export async function uploadVerificationImage(
  userId: string,
  uri: string,
): Promise<string | null> {
  try {
    // Get file extension
    const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    console.log("Uploading file:", fileName);

    // Create form data for React Native
    const formData = new FormData();

    // @ts-ignore - React Native FormData accepts this format
    formData.append("file", {
      uri,
      type: `image/${fileExt}`,
      name: fileName,
    });

    // Use Supabase storage upload with form data
    const { data, error } = await supabase.storage
      .from("verification-images")
      .upload(fileName, formData as any, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("verification-images")
      .getPublicUrl(data.path);

    console.log("Upload successful:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
