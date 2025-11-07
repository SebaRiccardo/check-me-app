import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase/supabase';
import { useRouter } from 'expo-router';
import { Chrome } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    if (isSignUp && !firstName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    if (isSignUp && !username.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario');
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
            }
          }
        });

        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          Alert.alert('Información', 'Este correo ya está registrado. Por favor inicia sesión.');
          setIsSignUp(false);
        } else {
          Alert.alert(
            'Éxito',
            '¡Cuenta creada! Por favor revisa tu correo para verificar tu cuenta.',
            [{ text: 'OK', onPress: () => setIsSignUp(false) }]
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
      Alert.alert('Error', error.message || 'Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <Text className="text-4xl font-bold text-foreground mb-2">
              {isSignUp ? "¡Comencemos!" : '¡Bienvenido!'}
            </Text>
            <Text className="text-base text-muted-foreground">
              {isSignUp ? 'Crea tu cuenta para continuar' : 'Inicia sesión o crea una cuenta.'}
            </Text>
          </View>

          {/* First Name Input (only for sign up) */}
          {isSignUp && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-1">Nombre</Text>
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
              <Text className="text-sm font-medium text-foreground mb-1">Usuario</Text>
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
            <Text className="text-sm font-medium text-foreground mb-1">Correo electrónico</Text>
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
            <Text className="text-sm font-medium text-foreground mb-1">Contraseña</Text>
            <Input
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Sign In/Up Button */}
          <Button
            onPress={handleAuth}
            disabled={isLoading}
            className="mb-6"
            size="lg"
          >
            <Text className="text-primary-foreground font-bold text-base">
              {isLoading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
            </Text>
          </Button>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-sm text-muted-foreground">o</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Google OAuth Button */}
          <Button
            variant="outline"
            className="mb-8"
            disabled={isLoading}
            onPress={() => Alert.alert('Información', 'El inicio de sesión con Google aún no está configurado')}
          >
            <Icon as={Chrome} size={20} className="text-foreground mr-2" />
            <Text className="text-foreground font-medium">Continuar con Google</Text>
          </Button>

          {/* Toggle Sign In/Up */}
          <View className="flex-row items-center justify-center">
            <Text className="text-base text-foreground">
              {isSignUp ? '¿Ya tienes una cuenta? ' : "¿No tienes una cuenta? "}
            </Text>
            <Button
              variant="ghost"
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="p-0 h-auto"
            >
              <Text className="text-base text-primary font-bold">
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
