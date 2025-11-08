import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { CreateVerificationForm } from "@/components/create-verification-bottom-sheet-form";
import { VerificationCard } from "@/components/verification-card";
import {
  useVerifications,
  type VerificationWithProfile,
} from "@/hooks/use-verifications";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Plus, RefreshCcw } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-base text-muted-foreground">
        No hay verificaciones aún.{"\n"}
        Sé el primero en compartir una verificación.
      </Text>
    </View>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="mb-2 text-center text-base text-destructive">
        Error al cargar verificaciones
      </Text>
      <Text className="mb-4 text-center text-sm text-muted-foreground">
        {error.message}
      </Text>
      <Button onPress={onRetry} variant="outline">
        <Icon as={RefreshCcw} size={16} className="mr-2 text-foreground" />
        <Text className="text-foreground">Reintentar</Text>
      </Button>
    </View>
  );
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { verifications, isLoading, error, refetch } = useVerifications();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // const handleOpenBottomSheet = useCallback(() => {
  //   bottomSheetRef.current?.expand();
  // }, []);

  // const handleCloseBottomSheet = useCallback(() => {
  //   bottomSheetRef.current?.close();
  // }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">
          Cargando verificaciones...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <ErrorState error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="border-b border-border bg-card px-6 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground">
              Comunidad
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Verificaciones compartidas por usuarios
            </Text>
          </View>
        </View>
      </View>

      {/* Verifications List */}
      <FlashList
        data={verifications}
        renderItem={({ item }: { item: VerificationWithProfile }) => (
          <VerificationCard verification={item} />
        )}
        keyExtractor={(item: VerificationWithProfile) => item.id}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 16,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}
