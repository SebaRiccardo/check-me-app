import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_COMPLETED_KEY = "@onboarding_completed";

/**
 * Hook to check if user has completed onboarding
 */
export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      setIsOnboardingComplete(value === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setIsOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      setIsOnboardingComplete(false);
      return true;
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      return false;
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      setIsOnboardingComplete(true);
      return true;
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return false;
    }
  };

  return {
    isOnboardingComplete,
    isLoading,
    resetOnboarding,
    completeOnboarding,
    refresh: checkOnboardingStatus,
  };
}
