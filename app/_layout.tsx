import "@/global.css";
import { NAV_THEME } from "@/lib/theme";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useOnboarding } from "@/hooks/use-onboarding";

import { StyleSheet, View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AuthProvider from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { VerificationsProvider } from "@/providers/verifications-provider";
import { SplashScreenController } from "@/components/splash-screen-controller";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn } = useAuthContext();
  const { isOnboardingComplete, isLoading } = useOnboarding();

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {/* Public screens - accessible to all */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-verification"
          options={{
            presentation: "containedModal",
            headerShown: false,
            headerTitle: "Nueva Verificación",
            headerBackTitle: "Cancelar",
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <QueryProvider>
          <AuthProvider>
            <VerificationsProvider autoSubscribe={true} autoFetch={true}>
              <SplashScreenController />
              <RootNavigator />
            </VerificationsProvider>
          </AuthProvider>
        </QueryProvider>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
