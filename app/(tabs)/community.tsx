import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CreateVerificationForm } from '@/components/create-verification-form';
import { VerificationCard } from '@/components/verification-card';
import { useVerifications } from '@/hooks/use-verifications';
import BottomSheet from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { Plus, RefreshCcw } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Verification } from '@/types/verification';

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-muted-foreground text-base">
        No hay verificaciones aún.{'\n'}
        Sé el primero en compartir una verificación.
      </Text>
    </View>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-destructive text-base mb-2">
        Error al cargar verificaciones
      </Text>
      <Text className="text-center text-muted-foreground text-sm mb-4">
        {error.message}
      </Text>
      <Button onPress={onRetry} variant="outline">
        <Icon as={RefreshCcw} size={16} className="text-foreground mr-2" />
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

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">Cargando verificaciones...</Text>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View
          className="bg-card border-b border-border px-6 pb-4"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-foreground">Comunidad</Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Verificaciones compartidas por usuarios
              </Text>
            </View>
            <Button
              onPress={handleOpenBottomSheet}
              size="icon"
              className="rounded-full"
            >
              <Icon as={Plus} size={24} className="text-primary-foreground" />
            </Button>
          </View>
        </View>

        {/* Verifications List */}
        <FlashList
          data={verifications}
          renderItem={({ item }: { item: Verification }) => (
            <VerificationCard verification={item} />
          )}
          keyExtractor={(item: Verification) => item.id}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={<EmptyState />}
        />

        {/* Create Verification Bottom Sheet */}
        <CreateVerificationForm
          ref={bottomSheetRef}
          onSuccess={handleCloseBottomSheet}
        />
      </View>
    </GestureHandlerRootView>
  );
}
