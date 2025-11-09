import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { VerificationWithProfile } from "@/hooks/use-verifications";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CheckCircle, XCircle } from "lucide-react-native";
import React, { forwardRef, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  View,
} from "react-native";

type AdminApprovalBottomSheetProps = {
  verification: VerificationWithProfile | null;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
  onClose: () => void;
};

const getInitials = (name: string | null | undefined) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const AdminApprovalBottomSheet = forwardRef<
  BottomSheet,
  AdminApprovalBottomSheetProps
>(({ verification, onApprove, onReject, onClose }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} />,
    [],
  );
  if (!verification) return null;

  const formattedDate = new Date(verification.created_at).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const displayName =
    verification.profiles?.full_name ||
    verification.profiles?.username ||
    "Usuario";
  const username = verification.profiles?.username || "usuario";
  const avatarUrl = verification.profiles?.avatar_url;
  const hasNewsUrl = !!verification.news_url;

  const handleApprove = () => {
    Alert.alert(
      "Aprobar Verificación",
      "¿Estás seguro de que deseas aprobar esta verificación? Se publicará en la comunidad.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aprobar",
          style: "default",
          onPress: async () => {
            setIsLoading(true);
            setActionType("approve");
            const success = await onApprove(verification.id);
            setIsLoading(false);
            setActionType(null);

            if (success) {
              Alert.alert("Éxito", "Verificación aprobada correctamente", [
                {
                  text: "OK",
                  onPress: onClose,
                },
              ]);
            } else {
              Alert.alert("Error", "No se pudo aprobar la verificación");
            }
          },
        },
      ],
    );
  };

  const handleReject = () => {
    Alert.alert(
      "Rechazar Verificación",
      "¿Estás seguro de que deseas rechazar esta verificación? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            setActionType("reject");
            const success = await onReject(verification.id);
            setIsLoading(false);
            setActionType(null);

            if (success) {
              Alert.alert("Éxito", "Verificación rechazada y eliminada", [
                {
                  text: "OK",
                  onPress: onClose,
                },
              ]);
            } else {
              Alert.alert("Error", "No se pudo rechazar la verificación");
            }
          },
        },
      ],
    );
  };

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

  const getBadgeColor = () => {
    switch (verification.category.toLowerCase()) {
      case "verdadero":
        return "bg-green-500";
      case "falso":
        return "bg-red-500";
      case "falta contexto":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["95%"]}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#fff" }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <ScrollView className="px-4">
          {/* Header */}
          <View className="mb-4 border-b border-gray-200 pb-4">
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Revisión de Verificación
            </Text>
            <Text className="text-sm text-gray-500">
              Revisa los detalles antes de aprobar o rechazar
            </Text>
          </View>

          {/* User Info */}
          <View className="mb-2 flex-row items-center">
            <View className="mr-3">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : (
                <View className="size-12 items-center justify-center rounded-full bg-gray-300">
                  <Text className="text-lg font-bold text-white">
                    {getInitials(displayName)}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {displayName}
              </Text>
              <Text className="text-sm text-gray-500">@{username}</Text>
              <Text className="text-xs text-gray-400">{formattedDate}</Text>
            </View>
          </View>

          {/* Category Badge */}
          <View className="mb-3">
            <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Categoría
            </Text>
            <View
              className={`self-start rounded-full px-4 py-2 ${getBadgeColor()}`}
            >
              <Text className="text-sm font-bold text-white">
                {verification.category}
              </Text>
            </View>
          </View>

          {/* Title */}
          <View className="mb-4">
            <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Noticia Analizada
            </Text>
            <Pressable onPress={handleTitlePress} disabled={!hasNewsUrl}>
              <Text
                className={`text-base font-semibold leading-5 ${
                  hasNewsUrl ? "text-blue-500 underline" : "text-gray-900"
                }`}
              >
                "{verification.title}"
              </Text>
            </Pressable>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Análisis
            </Text>
            <View className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <Text className="text-base leading-6 text-gray-900">
                {verification.description}
              </Text>
            </View>
          </View>

          {/* Image */}
          {verification.image_url && (
            <View className="mb-2">
              <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Imagen Adjunta
              </Text>
              <View className="overflow-hidden rounded-2xl border border-gray-200">
                <Image
                  source={{ uri: verification.image_url }}
                  style={{ width: "100%", height: 250 }}
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
        </ScrollView>
        <View className="flex-row gap-4 w-full sticky bottom-0 border-t px-4 pt-4 border-gray-200">
          <Button
            onPress={handleReject}
            disabled={isLoading}
            variant="destructive"
            className="flex-1 w-full"
            size="lg"
          >
            {isLoading && actionType === "reject" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon as={XCircle} size={20} className="mr-2 text-white" />
                <Text className="text-base font-semibold text-white">
                  Rechazar
                </Text>
              </>
            )}
          </Button>
          <Button
            onPress={handleApprove}
            disabled={isLoading}
            className="flex-1 bg-green-500"
            size="lg"
          >
            {isLoading && actionType === "approve" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon as={CheckCircle} size={20} className="mr-2 text-white" />
                <Text className="text-base font-semibold text-white">
                  Aprobar
                </Text>
              </>
            )}
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

AdminApprovalBottomSheet.displayName = "AdminApprovalBottomSheet";
