import { useAuth } from "@/hooks/use-auth-context";
import { useOnboarding } from "@/hooks/use-onboarding";

import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuth();
  const { isLoading: isLoadingOnboarding } = useOnboarding();

  if (!isLoading && !isLoadingOnboarding) {
    SplashScreen.hideAsync();
  }

  return null;
}
