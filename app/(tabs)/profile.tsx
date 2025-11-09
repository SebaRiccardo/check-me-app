import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useOnboarding } from "@/hooks/use-onboarding";
import { supabase } from "@/lib/supabase/supabase";
import { router } from "expo-router";
import {
  LogOut,
  Settings,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  Globe,
  Smartphone,
  User,
  HelpCircle,
} from "lucide-react-native";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function InfoRow({
  icon,
  label,
  value,
  valueColor = "text-foreground",
  leftIcon,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  valueColor?: string;
  leftIcon?: any;
}) {
  return (
    <View className="flex-row items-center py-0 gap-2">
      {/* <View className="size-9 p-2 items-center justify-center bg-gray-100 rounded-full">
        <Icon as={icon} size={20} className="text-gray-400" />
      </View> */}
      <View className="flex-1 w-full justify-between flex-row-reverse">
        <View className="flex-row items-center gap-1">
          {leftIcon}
          <Text className={`text-base ${valueColor}`}>{value}</Text>
        </View>
        <Text className="mb1 text-sm font-normal  tracking-wide text-gray-500">
          {label}
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mb-4 mt-6 px-4">
      <Text className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { session, profile } = useAuthContext();
  const { resetOnboarding } = useOnboarding();

  const handleSignOut = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const handleRestartOnboarding = async () => {
    Alert.alert(
      "Reiniciar Tutorial",
      "¿Querés ver el tutorial de introducción nuevamente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ver Tutorial",
          onPress: async () => {
            const success = await resetOnboarding();
            if (success) {
              // Sign out to trigger onboarding flow
              await supabase.auth.signOut();
            } else {
              Alert.alert("Error", "No se pudo reiniciar el tutorial");
            }
          },
        },
      ],
    );
  };

  const user = session?.user;
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const displayName =
    user?.user_metadata?.full_name || profile?.full_name || "Usuario";
  const username =
    profile?.username || user?.user_metadata?.username || "@usuario";
  const email = user?.email || "";
  const emailVerified = user?.email_confirmed_at ? true : false;
  const phoneVerified = user?.phone_confirmed_at ? true : false;

  // Auth provider info
  const authProvider = user?.app_metadata?.provider || "email";
  const providerName =
    authProvider === "email"
      ? "Email/Contraseña"
      : authProvider.charAt(0).toUpperCase() + authProvider.slice(1);

  // Format dates
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No disponible";

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No disponible";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      {/* Header */}
      <View className="items-center px-6">
        {/* Avatar */}
        <View className="mb-4">
          <Avatar className="size-24" alt={profile?.full_name!}>
            <AvatarImage source={{ uri: avatarUrl }} />
            <AvatarFallback>
              <Text>{getInitials(profile?.full_name!)}</Text>
            </AvatarFallback>
          </Avatar>
        </View>

        {/* User Info */}
        <Text className="text-center text-2xl font-bold text-foreground">
          {displayName}
        </Text>
        <Text className="text-center text-xl text-gray-400">@{username}</Text>
      </View>

      {/* Auth Information */}
      <SectionHeader title="Tu cuenta" />
      <Card className="p-0 bg-white border-0">
        <CardContent className="px-4 gap-4">
          <InfoRow
            icon={Shield}
            label="Metodo de inicio"
            value={providerName}
          />
          <InfoRow
            icon={Mail}
            label="Email"
            value={email}
            leftIcon={
              emailVerified ? (
                <Icon
                  as={CheckCircle2}
                  size={20}
                  fill={"#22c55e"}
                  className="ml-2 text-white"
                />
              ) : (
                <Icon as={XCircle} size={16} className="ml-2 text-red-500" />
              )
            }
          />
          {user?.phone && (
            <>
              <InfoRow icon={Smartphone} label="Teléfono" value={user.phone} />
              <View className="flex-row items-start py-3">
                <View className="w-10">
                  <Icon
                    as={CheckCircle2}
                    size={20}
                    className="text-muted-foreground"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Teléfono Verificado
                  </Text>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-base ${phoneVerified ? "text-green-600" : "text-red-600"}`}
                    >
                      {phoneVerified ? "Verificado" : "No verificado"}
                    </Text>
                    {phoneVerified ? (
                      <Icon
                        as={CheckCircle2}
                        size={16}
                        className="ml-2 text-green-500"
                      />
                    ) : (
                      <Icon
                        as={XCircle}
                        size={16}
                        className="ml-2 text-red-500"
                      />
                    )}
                  </View>
                </View>
              </View>
            </>
          )}
          <View className="gap-4">
            <InfoRow icon={Calendar} label="Cuenta creada" value={createdAt} />
            <InfoRow icon={Calendar} label="Último acceso" value={lastSignIn} />
          </View>
        </CardContent>
      </Card>

      {/* Actions */}
      <View className="px-4 gap-3">
        <Button variant="outline" onPress={handleRestartOnboarding}>
          <Icon as={HelpCircle} size={20} className="mr-2 text-primary" />
          <Text className="font-semibold text-primary">Ver Tutorial</Text>
        </Button>

        <Button
          variant="outline"
          onPress={handleSignOut}
          className="border-destructive"
        >
          <Icon as={LogOut} size={20} className="mr-2 text-destructive" />
          <Text className="font-semibold text-destructive">Cerrar Sesión</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
