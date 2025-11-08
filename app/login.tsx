import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "expo-router";
import { Chrome, Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña");
      return;
    }

    if (isSignUp && !firstName.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre");
      return;
    }

    if (isSignUp && !username.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre de usuario");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: firstName.trim(),
              username: username.trim(),
            },
          },
        });

        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          Alert.alert(
            "Información",
            "Este correo ya está registrado. Por favor inicia sesión.",
          );
          setIsSignUp(false);
        } else {
          Alert.alert(
            "Éxito",
            "¡Cuenta creada! Por favor revisa tu correo para verificar tu cuenta.",
            [{ text: "OK", onPress: () => setIsSignUp(false) }],
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Navigation is handled by auth state change in AuthProvider
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  // Clean password when switching between sign in/up modes
  useEffect(() => {
    setPassword("");
  }, [isSignUp]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="mb-12">
            <Text className="mb-2 text-4xl font-bold text-foreground">
              {isSignUp ? "¡Comencemos!" : "¡Bienvenido!"}
            </Text>
            <Text className="text-base text-muted-foreground">
              {isSignUp
                ? "Crea tu cuenta para continuar"
                : "Inicia sesión en tu cuenta."}
            </Text>
          </View>

          {/* First Name Input (only for sign up) */}
          {isSignUp && (
            <View className="mb-4">
              <Text className="mb-1 text-sm font-medium text-foreground">
                Nombre
              </Text>
              <Input
                placeholder="Ingresa tu nombre"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          )}

          {/* Username Input (only for sign up) */}
          {isSignUp && (
            <View className="mb-4">
              <Text className="mb-1 text-sm font-medium text-foreground">
                Usuario
              </Text>
              <Input
                placeholder="Elige un nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          )}

          {/* Email Input */}
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-foreground">
              Correo electrónico
            </Text>
            <Input
              placeholder="Ingresa tu correo"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="mb-1 text-sm font-medium text-foreground">
              Contraseña
            </Text>
            <View className="relative ">
              <Input
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Sign In/Up Button */}
          <Button
            onPress={handleAuth}
            disabled={isLoading}
            className="mb-6"
            size="lg"
          >
            <Text className="text-base font-bold text-primary-foreground">
              {isLoading
                ? "Cargando..."
                : isSignUp
                  ? "Registrarse"
                  : "Iniciar Sesión"}
            </Text>
          </Button>

          {/* Divider */}
          {/* <View className="mb-6 flex-row items-center">
            <View className="h-px flex-1 bg-border" />
            <Text className="mx-4 text-sm text-muted-foreground">o</Text>
            <View className="h-px flex-1 bg-border" />
          </View> */}

          {/* Google OAuth Button */}
          {/* <Button
            variant="outline"
            className="mb-8"
            disabled={isLoading}
            onPress={() =>
              Alert.alert(
                "Información",
                "El inicio de sesión con Google aún no está configurado",
              )
            }
          >
            <Icon as={Chrome} size={20} className="mr-2 text-foreground" />
            <Text className="font-medium text-foreground">
              Continuar con Google
            </Text>
          </Button> */}

          {/* Toggle Sign In/Up */}
          <View className="flex-row items-center justify-center">
            <Text className="text-base text-foreground">
              {isSignUp ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
            </Text>
            <Button
              variant="ghost"
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="h-auto p-0"
            >
              <Text className="text-base font-bold text-primary">
                {isSignUp ? "Inicia sesión" : "Regístrate"}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
