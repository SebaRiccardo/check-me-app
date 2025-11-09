import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { CreateVerificationForm } from "@/components/create-verification-bottom-sheet-form";
import { VerificationCard } from "@/components/verification-card";
import { AdminApprovalBottomSheet } from "@/components/admin-approval-bottom-sheet";
import {
  useVerifications,
  type VerificationWithProfile,
} from "@/hooks/use-verifications";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Plus, RefreshCcw, Clock, CheckCircle2 } from "lucide-react-native";
import { useCallback, useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  View,
  Pressable,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/hooks/use-auth-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function EmptyState({ isPendingView }: { isPendingView?: boolean }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Image
        source={
          isPendingView
            ? require("@/assets/images/undraw_completed-tasks_1j9z.png")
            : require("@/assets/images/undraw_post-online_cjn9.png")
        }
        style={{
          width: 350,
          height: 350,
          marginBottom: 24,
        }}
        resizeMode="contain"
      />
      <Text className="mb-2 text-center text-xl font-bold text-foreground">
        {isPendingView ? "¡Todo al día!" : "Aún no hay verificaciones"}
      </Text>
      <Text className="text-center text-base text-gray-400">
        {isPendingView
          ? "No hay verificaciones pendientes de aprobación."
          : "Sé el primero en compartir una verificación con la comunidad."}
      </Text>
    </View>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Image
        source={require("@/assets/images/undraw_online-articles_g9cg.png")}
        style={{
          width: 280,
          height: 200,
          marginBottom: 24,
          opacity: 0.6,
        }}
        resizeMode="contain"
      />
      <Text className="mb-2 text-center text-xl font-bold text-destructive">
        Error al cargar verificaciones
      </Text>
      <Text className="mb-6 text-center text-base text-muted-foreground">
        {error.message}
      </Text>
      <Button
        onPress={onRetry}
        variant="outline"
        className="flex-row items-center"
      >
        <Icon as={RefreshCcw} size={16} className="mr-2 text-foreground" />
        <Text className="text-foreground">Reintentar</Text>
      </Button>
    </View>
  );
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const approvalBottomSheetRef = useRef<BottomSheet>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [selectedVerification, setSelectedVerification] =
    useState<VerificationWithProfile | null>(null);
  const { session } = useAuth();
  const {
    verifications,
    isLoading,
    error,
    refetch,
    pendingCount,
    fetchPendingCount,
    approveVerification,
    rejectVerification,
    fetchVerifications,
  } = useVerifications();

  const isAdmin = session?.user?.is_admin || false;

  // Fetch pending count when screen is focused (only for admins)
  useFocusEffect(
    useCallback(() => {
      if (isAdmin) {
        fetchPendingCount();
      }
    }, [isAdmin, fetchPendingCount]),
  );

  // Fetch verifications based on current view
  useEffect(() => {
    fetchVerifications(false, showPending);
  }, [showPending, fetchVerifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch(showPending);
    if (isAdmin) {
      await fetchPendingCount();
    }
    setIsRefreshing(false);
  };

  const handleToggleView = () => {
    setShowPending((prev) => !prev);
  };

  const handleVerificationPress = (verification: VerificationWithProfile) => {
    if (isAdmin && showPending) {
      setSelectedVerification(verification);
      approvalBottomSheetRef.current?.expand();
    }
  };

  const handleApprove = async (id: string): Promise<boolean> => {
    const success = await approveVerification(id);
    if (success && isAdmin) {
      await fetchPendingCount();
    }
    return success;
  };

  const handleReject = async (id: string): Promise<boolean> => {
    const success = await rejectVerification(id);
    if (success && isAdmin) {
      await fetchPendingCount();
    }
    return success;
  };

  const handleCloseApprovalSheet = () => {
    approvalBottomSheetRef.current?.close();
    setSelectedVerification(null);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="border-b border-border bg-card px-4 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-3xl font-bold text-foreground">
                Comunidad
              </Text>
              {isAdmin && (
                <Pressable
                  onPress={handleToggleView}
                  className={cn(
                    "ml-2 flex-row items-center rounded-lg border px-4 py-2 active:bg-muted",
                    showPending
                      ? "border-primary bg-white"
                      : "border-border bg-primary",
                  )}
                >
                  {!showPending && pendingCount > 0 && (
                    <Badge variant="destructive" className="">
                      <Text className="text-xs font-bold text-white">
                        {pendingCount}
                      </Text>
                    </Badge>
                  )}

                  <View className="ml-2">
                    <Text
                      className={cn(
                        "text-sm font-semibold",
                        showPending ? "text-primary" : "text-white",
                      )}
                    >
                      {showPending ? "Ver Auditadas" : "Sin auditar"}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
            <Text className="mt-1 text-base text-gray-500">
              {showPending
                ? "Verificaciones pendientes de aprobación"
                : "Verificaciones compartidas por usuarios"}
            </Text>
          </View>
        </View>
      </View>

      {/* Conditional Content: Loading, Error, or List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch(showPending)} />
      ) : (
        <FlashList
          data={verifications}
          renderItem={({ item }: { item: VerificationWithProfile }) => (
            <Pressable
              onPress={() => handleVerificationPress(item)}
              disabled={!isAdmin || !showPending}
            >
              <VerificationCard
                verification={item}
                isAdmin={isAdmin}
                isPendingView={showPending}
              />
            </Pressable>
          )}
          keyExtractor={(item: VerificationWithProfile) => item.id}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={<EmptyState isPendingView={showPending} />}
        />
      )}

      {/* Admin Approval Bottom Sheet */}
      <AdminApprovalBottomSheet
        ref={approvalBottomSheetRef}
        verification={selectedVerification}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={handleCloseApprovalSheet}
      />
    </View>
  );
}
