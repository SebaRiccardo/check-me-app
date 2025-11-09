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
  Image,
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
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    // Clear previous error
    setError(null);

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña");
      return;
    }

    if (isSignUp && !firstName.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    if (isSignUp && !username.trim()) {
      setError("Por favor ingresa un nombre de usuario");
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
          setError("Este correo ya está registrado. Por favor inicia sesión.");
          setIsSignUp(false);
        } else {
          // Alert.alert("Éxito", "¡Cuenta creada! Por favor inicia sesión.", [
          //   { text: "OK", onPress: () => setIsSignUp(false) },
          // ]);
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
      console.log(error.message);
      setError(error.message || "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  // Clean password when switching between sign in/up modes
  useEffect(() => {
    setPassword("");
    setError(null); // Clear error when switching modes
  }, [isSignUp]);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View className="flex-1 px-4">
          {/* Header */}
          <Image source={require('@/assets/images/icon.png')} className="w-24 h-24 my-5 self-center mb-6" />
          <View className="mb-12">
            <Text className="mb-2 text-4xl text-center font-bold text-foreground">
              {isSignUp ? "¡Comencemos!" : "¡Bienvenido!"}
            </Text>
            <Text className="text-base text-center text-gray-400">
              {isSignUp
                ? "Crea tu cuenta para continuar"
                : "Inicia sesión en tu cuenta."}
            </Text>
          </View>

          {/* Error Alert */}
          {error && (
            <View className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4">
              <Text className="text-sm font-medium text-red-500">{error}</Text>
            </View>
          )}

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
                 className="h-14"
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
                className="h-14"
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
              className="h-14"
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
                className="h-14"
                editable={!isLoading}
              />
                <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ 
                  position: "absolute", 
                  bottom: 4, 
                  right: 4,
                  padding: 12,
                  minHeight: 44,
                  minWidth: 44,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                disabled={isLoading}
                >
                <Icon
                  as={showPassword ? EyeOff : Eye}
                  size={25}
                  className="text-primary"
                />
                </Pressable>
            </View>
          </View>

          {/* Sign In/Up Button */}
          <Button
            onPress={handleAuth}
            disabled={isLoading}
            className="mb-6 h-14"
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
              className=" h-14 rounded-none px-2"
            >
              <Text className="text-base font-bold text-primary">
                {isSignUp ? "Inicia sesión" : "Regístrate aqui"}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
