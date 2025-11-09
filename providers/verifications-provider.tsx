import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/supabase";
import type {
  Verification,
  VerificationInsert,
  VerificationUpdate,
} from "@/types/verification";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type VerificationWithProfile = Verification & {
  profiles: {
    avatar_url: string | null;
    full_name: string | null;
    username: string | null;
  } | null;
};

interface VerificationsContextValue {
  // Estado
  verifications: VerificationWithProfile[];
  isLoading: boolean;
  error: Error | null;
  isSubscribed: boolean;

  // Acciones de fetch
  fetchVerifications: (isRefreshing?: boolean) => Promise<void>;
  refetch: () => Promise<void>;

  // Suscripción en tiempo real
  subscribe: () => RealtimeChannel;
  unsubscribe: () => void;

  // CRUD operations
  createVerification: (
    verification: VerificationInsert,
  ) => Promise<VerificationWithProfile | null>;
  updateVerification: (
    id: string,
    updates: VerificationUpdate,
  ) => Promise<VerificationWithProfile | null>;
  deleteVerification: (id: string) => Promise<boolean>;
}

export const VerificationsContext = createContext<
  VerificationsContextValue | undefined
>(undefined);

interface VerificationsProviderProps {
  children: ReactNode;
  autoSubscribe?: boolean;
  autoFetch?: boolean;
}

export function VerificationsProvider({
  children,
  autoSubscribe = true,
  autoFetch = true,
}: VerificationsProviderProps) {
  const [verifications, setVerifications] = useState<VerificationWithProfile[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /**
   * Obtiene el perfil asociado a una verificación
   */
  const fetchVerificationProfile = async (
    userId: string,
  ): Promise<VerificationWithProfile["profiles"]> => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, username")
        .eq("id", userId)
        .single();

      return data || null;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  /**
   * Obtiene todas las verificaciones con sus perfiles
   */
  const fetchVerifications = useCallback(
    async (isRefreshing?: boolean) => {
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
    },
    [],
  );

  /**
   * Suscribe a cambios en tiempo real y actualiza el estado local
   */
  const subscribe = useCallback((): RealtimeChannel => {
    // Si ya hay un canal activo, desuscribirse primero
    if (channel) {
      supabase.removeChannel(channel);
    }

    const newChannel = supabase
      .channel("verifications-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "verifications",
        },
        async (payload) => {
          const newVerification = payload.new as Verification;
          const profile = await fetchVerificationProfile(
            newVerification.user_id,
          );

          setVerifications((prev) => [
            { ...newVerification, profiles: profile },
            ...prev,
          ]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "verifications",
        },
        async (payload) => {
          const updatedVerification = payload.new as Verification;
          const profile = await fetchVerificationProfile(
            updatedVerification.user_id,
          );

          setVerifications((prev) =>
            prev.map((v) =>
              v.id === updatedVerification.id
                ? { ...updatedVerification, profiles: profile }
                : v,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "verifications",
        },
        (payload) => {
          const deletedVerification = payload.old as Verification;

          setVerifications((prev) =>
            prev.filter((v) => v.id !== deletedVerification.id),
          );
        },
      )
      .subscribe();

    setChannel(newChannel);
    setIsSubscribed(true);

    return newChannel;
  }, [channel]);

  /**
   * Desuscribe del canal de tiempo real
   */
  const unsubscribe = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
      setIsSubscribed(false);
    }
  }, [channel]);

  /**
   * Crea una nueva verificación
   */
  const createVerification = useCallback(
    async (
      verification: VerificationInsert,
    ): Promise<VerificationWithProfile | null> => {
      try {
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

        // Si no está suscrito, actualizar manualmente el estado
        if (!isSubscribed) {
          setVerifications((prev) => [data, ...prev]);
        }

        return data;
      } catch (err) {
        setError(err as Error);
        console.error("Error creating verification:", err);
        return null;
      }
    },
    [isSubscribed],
  );

  /**
   * Actualiza una verificación existente
   */
  const updateVerification = useCallback(
    async (
      id: string,
      updates: VerificationUpdate,
    ): Promise<VerificationWithProfile | null> => {
      try {
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

        // Si no está suscrito, actualizar manualmente el estado
        if (!isSubscribed) {
          setVerifications((prev) =>
            prev.map((v) => (v.id === id ? data : v)),
          );
        }

        return data;
      } catch (err) {
        setError(err as Error);
        console.error("Error updating verification:", err);
        return null;
      }
    },
    [isSubscribed],
  );

  /**
   * Elimina una verificación
   */
  const deleteVerification = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const { error: deleteError } = await supabase
          .from("verifications")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Si no está suscrito, actualizar manualmente el estado
        if (!isSubscribed) {
          setVerifications((prev) => prev.filter((v) => v.id !== id));
        }

        return true;
      } catch (err) {
        setError(err as Error);
        console.error("Error deleting verification:", err);
        return false;
      }
    },
    [isSubscribed],
  );

  // Efecto para fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchVerifications();
    }
  }, [autoFetch, fetchVerifications]);

  // Efecto para suscripción automática
  useEffect(() => {
    if (autoSubscribe) {
      const channel = subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [autoSubscribe]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channel]);

  const value: VerificationsContextValue = {
    verifications,
    isLoading,
    error,
    isSubscribed,
    fetchVerifications,
    refetch: () => fetchVerifications(true),
    subscribe,
    unsubscribe,
    createVerification,
    updateVerification,
    deleteVerification,
  };

  return (
    <VerificationsContext.Provider value={value}>
      {children}
    </VerificationsContext.Provider>
  );
}

