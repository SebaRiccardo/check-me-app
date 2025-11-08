import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { VerificationWithProfile } from "@/hooks/use-verifications";
import { ExternalLink } from "lucide-react-native";
import { Image, View, Pressable, Linking, Alert } from "react-native";

type VerificationCardProps = {
  verification: VerificationWithProfile;
};

export function VerificationCard({ verification }: VerificationCardProps) {
  const formattedDate = new Date(verification.created_at).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
    },
  );

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName =
    verification.profiles?.full_name ||
    verification.profiles?.username ||
    "Usuario";
  const username = verification.profiles?.username || "usuario";
  const avatarUrl = verification.profiles?.avatar_url;
  const hasNewsUrl = !!verification.news_url;

  const handleTitlePress = () => {
    if (!verification.news_url) return;

    Alert.alert(
      "Abrir enlace",
      `¿Deseas abrir este enlace?\n\n${verification.news_url}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Abrir",
          onPress: () => {
            Linking.openURL(verification.news_url!).catch((err) => {
              console.error("Error opening URL:", err);
              Alert.alert("Error", "No se pudo abrir el enlace");
            });
          },
        },
      ],
    );
  };

  // Determine badge color based on category
  const getBadgeColor = () => {
    switch (verification.category.toLowerCase()) {
      case "verdadero":
        return "bg-green-500 border-green-500";
      case "falso":
        return "bg-red-500 border-red-500";
      case "falta contexto":
        return "bg-yellow-500 border-yellow-500";
      default:
        return "bg-blue-500 border-blue-500";
    }
  };

  const getBadgeTextColor = () => {
    switch (verification.category.toLowerCase()) {
      case "verdadero":
        return "text-green-600";
      case "falso":
        return "text-red-600";
      case "falta contexto":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <View className="border-b border-gray-200 bg-white px-4 py-3">
      {/* Header */}
      <View className="flex-row">
        <View className="flex-1">
          <View className="mb-4 flex-row items-center">
            <View className="mr-2 mt-1">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 36, height: 36, borderRadius: 24 }}
                />
              ) : (
                <View className="size-9 items-center justify-center rounded-full bg-gray-300">
                  <Text className="text-base font-bold text-white">
                    {getInitials(displayName)}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-col justify-center">
              <View className="flex-row gap-2 -mb-1">
                <Text
                  className="text-base font-bold text-gray-900"
                  numberOfLines={1}
                >
                  {displayName}
                </Text>
                <Text className="text-gray-500 text-base">·</Text>
                <Text className="text-gray-500 text-base">{formattedDate}</Text>
              </View>
              <Text className="leading-4 text-sm text-gray-500">
                @{username}
              </Text>
            </View>
          </View>

          {/* "Noticia Analizada" Label */}
          <View className="flex-col">
            <View className="flex-col ">
              <View className="flex-row gap-2 items-center">
                <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Noticia Analizada
                </Text>
                <View
                  className={`self-start rounded-full border px-3 py-0.5 ${getBadgeColor()}`}
                >
                  <Text className={`text-xs font-bold text-white`}>
                    {verification.category}
                  </Text>
                </View>
              </View>
              {/* Title */}
              <Pressable
                className=""
                onPress={handleTitlePress}
                disabled={!hasNewsUrl}
              >
                <Text
                  className={`mb-1 italic text-base tracking-tight leading-5 text-wrap font-semibold ${
                    hasNewsUrl ? "text-blue-500 underline" : "text-gray-900"
                  }`}
                  numberOfLines={4}
                  variant="p"
                >
                  "{verification.title}"
                </Text>
              </Pressable>
            </View>

            {/* Description */}
            <View className="p-2 bg-gray-50 border-gray-100 border rounded-xl my-2">
              <Text className="mb-3 text-base tracking-wide font-normal text-gray-900">
                {verification.description}
              </Text>
            </View>
          </View>

          {/* Image */}
          {verification.image_url && (
            <View className="mb-3 overflow-hidden rounded-2xl border border-gray-200">
              <Image
                source={{ uri: verification.image_url }}
                style={{ width: "100%", height: 280 }}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
