import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Logo/Image Section */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Placeholder for app logo/image */}

        <Image
          source={require("@/assets/images/undraw_reviewed-docs_tng3.png")}
          className="size-96"
          resizeMode="contain"
        />

        {/* App Name */}
        <Text className="mb-2 text-4xl font-bold text-foreground">
          Check<Text className="text-5xl text-primary">ME</Text>
        </Text>
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
            Iniciar Sesión o Registrarse
          </Text>
        </Button>
      </View>
    </View>
  );
}
