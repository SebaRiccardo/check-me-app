import { supabase } from "@/lib/supabase/supabase";
import type {
  Verification,
  VerificationInsert,
  VerificationUpdate,
} from "@/types/verification";
import { useEffect, useState } from "react";

export type VerificationWithProfile = Verification & {
  profiles: {
    avatar_url: string | null;
    full_name: string | null;
    username: string | null;
  } | null;
};

export function useVerifications() {
  const [verifications, setVerifications] = useState<VerificationWithProfile[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVerifications = async (isRefreshing?: boolean) => {
    try {
      if (!isRefreshing) setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("verifications")
        .select(
          `
          *,
          profiles!verifications_user_id_fkey1 (
            avatar_url,
            full_name,
            username
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setVerifications(data || []);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching verifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("verifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "verifications",
        },
        () => {
          fetchVerifications();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    verifications,
    isLoading,
    error,
    refetch: () => fetchVerifications(true),
  };
}

export function useCreateVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createVerification = async (
    verification: VerificationInsert,
  ): Promise<VerificationWithProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from("verifications")
        .insert(verification)
        .select(
          `
          *,
          profiles!verifications_user_id_fkey1 (
            avatar_url,
            full_name,
            username
          )
        `,
        )
        .single();

      if (createError) throw createError;

      return data;
    } catch (err) {
      setError(err as Error);
      console.error("Error creating verification:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createVerification,
    isLoading,
    error,
  };
}

export function useUpdateVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateVerification = async (
    id: string,
    updates: VerificationUpdate,
  ): Promise<VerificationWithProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from("verifications")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          profiles!verifications_user_id_fkey1 (
            avatar_url,
            full_name,
            username
          )
        `,
        )
        .single();

      if (updateError) throw updateError;

      return data;
    } catch (err) {
      setError(err as Error);
      console.error("Error updating verification:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateVerification,
    isLoading,
    error,
  };
}

export function useDeleteVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteVerification = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from("verifications")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      setError(err as Error);
      console.error("Error deleting verification:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteVerification,
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
