import { UserProfile } from "@/types/profiles";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type UserSession = Session & { user: { is_admin?: boolean } };

export type AuthData = {
  session?: UserSession | null;
  profile?: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
});

export const useAuth = () => useContext(AuthContext);
