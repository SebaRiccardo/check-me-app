import { Redirect } from "expo-router";
import {
  useOnboarding,
} from "@/hooks/use-onboarding";
import { useAuth } from "@/hooks/use-auth-context";
import OnboardingContent from "@/components/onboarding-content";


export default function OnboardingScreen() {
  const { session } = useAuth();
  const { isOnboardingComplete } = useOnboarding();

  if (isOnboardingComplete) {
   
    if(session){
      return <Redirect href="(tabs)" />;
    }
    return <Redirect href="/welcome" />;
  }

  return (
   <OnboardingContent/>
  );
}


