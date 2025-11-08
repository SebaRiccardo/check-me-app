import { CreateVerificationFormContent } from "@/components/create-verification-form-content";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateVerificationModal() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to community tab after successful creation
    router.back();
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 pb-4 pt-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className=" p-2 bg-gray-100 rounded-full"
        >
          <X size={25} className="text-primary" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-center text-2xl font-bold text-primary">
            Nueva Verificación
          </Text>
          <Text className="text-center text-sm text-gray-400">
            Comparte lo que sabes con la comunidad
          </Text>
        </View>
      </View>
      <CreateVerificationFormContent onSuccess={handleSuccess} useScrollView />
    </View>
  );
}
