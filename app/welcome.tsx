import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Logo/Image Section */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Placeholder for app logo/image */}
        <View className="w-48 h-48 rounded-3xl bg-primary/10 items-center justify-center mb-8">
          {/* Replace this View with your actual logo image:
          <Image 
            source={require('@/assets/images/logo.png')} 
            className="w-48 h-48"
            resizeMode="contain"
          /> */}
          <Text className="text-6xl font-bold text-primary">CM</Text>
        </View>
        
        {/* App Name */}
        <Text className="text-4xl font-bold text-foreground mb-2">
          Check Me
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-12">
          Tus noticias y actualizaciones diarias
        </Text>
      </View>

      {/* Bottom Buttons Section */}
      <View className="px-6 pb-8" style={{ paddingBottom: insets.bottom + 32 }}>
        <Button
          onPress={() => router.push('/login')}
          className="mb-4"
          size="lg"
        >
          <Text className="text-primary-foreground font-semibold text-lg">
            Iniciar Sesión o Registrarse
          </Text>
        </Button>
        
        <Text className="text-xs text-muted-foreground text-center">
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
        </Text>
      </View>
    </View>
  );
}
