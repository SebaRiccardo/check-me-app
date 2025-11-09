import { AuthContext, UserSession } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase/supabase";
import type { Session } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { AppState, Platform } from "react-native";
import { jwtDecode } from "jwt-decode";

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

const extractAdminClaim = (session: Session | null): boolean => {
  if (!session) return false;

  try {
    const jwt = jwtDecode(session.access_token) as any;
    return jwt.app_metadata?.admin || false;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return false;
  }
};

const getSessionWithAdminClaim = (session: Session | null) => {
  if (!session) return null;

  const is_admin = extractAdminClaim(session);
  return {
    ...session,
    user: {
      ...session.user,
      is_admin,
    },
  };
};

export default function AuthProvider({ children }: PropsWithChildren) {
  useAsyncStorageDevTools();
  const [session, setSession] = useState<UserSession | undefined | null>();
  const [profile, setProfile] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      }
      if (session) {
        const sessionWithAdmin = getSessionWithAdminClaim(session);
        setSession(sessionWithAdmin);
      }
      setIsLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event });
      if (session) {
        const sessionWithAdmin = getSessionWithAdminClaim(session);
        setSession(sessionWithAdmin);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch the profile when the session changes
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(data);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: session != undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
