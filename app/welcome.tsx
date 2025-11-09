import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useEffect } from "react";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOnboardingComplete, isLoading } = useOnboarding();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isLoading && isOnboardingComplete === false) {
      router.push("/onboarding" as any);
    }
  }, [isOnboardingComplete, isLoading]);

  // Don't render welcome screen if we're about to redirect
  if (isLoading || isOnboardingComplete === false) {
    return null;
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Logo/Image Section */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Placeholder for app logo/image */}

        <Image
          source={require("@/assets/images/wordmark.png")}
          className="w-96 h-20 "
          resizeMode="contain"
        />

        <Text className="mb-12 text-center text-base text-muted-foreground">
          Tus noticias y actualizaciones diarias
        </Text>
      </View>

      {/* Bottom Buttons Section */}
      <View className="px-6 pb-8" style={{ paddingBottom: insets.bottom + 32 }}>
        <Button
          onPress={() => router.push("/login")}
          className="mb-4 h-16"
          size="lg"
        >
          <Text className="text-lg font-semibold text-primary-foreground">
            Comenzar
          </Text>
        </Button>
      </View>
    </View>
  );
}
