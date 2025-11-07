import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase/supabase';
import { LogOut, Settings, HelpCircle, Palette, User } from 'lucide-react-native';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: typeof Settings;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <View className="flex-row items-center">
          <Icon as={icon} size={20} className="text-foreground mr-3" />
          <Text className="text-base text-foreground">{label}</Text>
        </View>
        <Icon as={LogOut} size={20} className="text-muted-foreground rotate-180" />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { session, profile } = useAuthContext();

  const handleSignOut = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const user = session?.user;
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const displayName =
    user?.user_metadata?.full_name || profile?.full_name || 'Usuario';
  const email = user?.email || '';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      {/* Header */}
      <View className="px-6 mb-8">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-bold text-foreground">Perfil</Text>
          <Pressable onPress={() => Alert.alert('Información', 'Cerrar no implementado')}>
            <Text className="text-2xl text-foreground">×</Text>
          </Pressable>
        </View>

        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <View className="flex-row items-center">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-16 h-16 rounded-full bg-muted"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-muted items-center justify-center">
                  <Icon as={User} size={32} className="text-muted-foreground" />
                </View>
              )}

              <View className="ml-4 flex-1">
                <Text className="text-xl font-semibold text-card-foreground mb-1">
                  {displayName}
                </Text>
                <Text className="text-sm text-muted-foreground">{email}</Text>
              </View>
            </View>

            {/* Client Badge */}
            <View className="mt-4 flex-row items-center">
              <View className="bg-primary/10 rounded-full px-3 py-1">
                <Text className="text-xs font-semibold text-primary">Cliente</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Menu Options */}
      <View className="bg-card border-y border-border mb-6">
        <MenuItem
          icon={Settings}
          label="Configuración del perfil"
          onPress={() => Alert.alert('Información', 'Configuración del perfil no implementada')}
        />
        <MenuItem
          icon={HelpCircle}
          label="Ayuda y comentarios"
          onPress={() => Alert.alert('Información', 'Ayuda y comentarios no implementados')}
        />
        <MenuItem
          icon={Palette}
          label="Apariencia"
          onPress={() => Alert.alert('Información', 'Configuración de apariencia no implementada')}
        />
      </View>

      {/* Sign Out Button */}
      <View className="px-6">
        <Button
          variant="outline"
          onPress={handleSignOut}
          className="border-destructive"
        >
          <Icon as={LogOut} size={20} className="text-destructive mr-2" />
          <Text className="text-destructive font-semibold">Cerrar Sesión</Text>
        </Button>

        {/* Version Info */}
        <View className="mt-6 items-center">
          <Text className="text-sm text-muted-foreground">Versión 1.5.1 (60)</Text>
          <Text className="text-xs text-muted-foreground mt-1">#8800410</Text>
        </View>
      </View>
    </ScrollView>
  );
}
