import { Text } from "@/components/ui/text";
import { CreateVerificationFormContent } from "@/components/create-verification-form-content";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CreateVerificationFormProps = {
  onSuccess?: () => void;
};

export const CreateVerificationForm = forwardRef<
  BottomSheet,
  CreateVerificationFormProps
>(({ onSuccess }, ref) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["95%"], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} />,
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#FFFFFF" }}
      handleIndicatorStyle={{ backgroundColor: "#E7E9EA" }}
    >
      <BottomSheetView style={{ flex: 1, paddingBottom: insets.bottom }}>
        {/* Header */}
        <View className="px-6 pb-2">
          <Text className="text-center text-lg font-bold text-primary">
            Nueva Verificación
          </Text>
          <Text className="text-center text-sm text-gray-400">
            Comparte lo que sabes con la comunidad
          </Text>
        </View>

        {/* Form */}
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 10,
          }}
        >
          <CreateVerificationFormContent
            onSuccess={onSuccess}
            useScrollView={false}
          />
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

CreateVerificationForm.displayName = "CreateVerificationForm";
