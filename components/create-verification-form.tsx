import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledTextArea } from "@/components/ui/controlled-textarea";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  uploadVerificationImage,
  useCreateVerification,
} from "@/hooks/use-verifications";
import { VERIFICATION_CATEGORIES } from "@/types/verification";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { ImageIcon, Upload, X } from "lucide-react-native";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image as RNImage,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { useAuthContext } from "@/hooks/use-auth-context";

const verificationSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  news_id: z.string().optional(),
  news_url: z
    .string()
    .url("La URL de la noticia debe ser válida")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Selecciona una categoría"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

type CreateVerificationFormProps = {
  onSuccess?: () => void;
};

export const CreateVerificationForm = forwardRef<
  BottomSheet,
  CreateVerificationFormProps
>(({ onSuccess }, ref) => {
  const insets = useSafeAreaInsets();
  const { session } = useAuthContext();
  const { createVerification, isLoading } = useCreateVerification();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      title: "",
      description: "",
      news_id: "",
      news_url: "",
      category: "",
    },
  });

  const snapPoints = useMemo(() => ["95%"], []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tus fotos para subir imágenes",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.4,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} />,
    [],
  );
  const removeImage = () => {
    setImageUri(null);
  };

  const onSubmit = async (data: VerificationFormData) => {
    if (!session?.user?.id) {
      Alert.alert("Error", "Debes iniciar sesión para crear una verificación");
      return;
    }

    try {
      let uploadedImageUrl: string | null = null;

      // Upload image if selected
      if (imageUri) {
        setIsUploadingImage(true);
        console.log(imageUri);
        uploadedImageUrl = await uploadVerificationImage(
          session.user.id,
          imageUri,
        );
        setIsUploadingImage(false);

        if (!uploadedImageUrl) {
          Alert.alert("Error", "No se pudo subir la imagen");
          return;
        }
      }

      // Create verification
      const verification = await createVerification({
        user_id: session.user.id,
        title: data.title,
        description: data.description,
        news_id: data.news_id || null,
        news_url: data.news_url || null,
        category: data.category,
        image_url: uploadedImageUrl,
      });

      if (verification) {
        Alert.alert("Éxito", "Verificación creada exitosamente");
        reset();
        setImageUri(null);
        onSuccess?.();
      } else {
        Alert.alert("Error", "No se pudo crear la verificación");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      Alert.alert("Error", "Ocurrió un error al crear la verificación");
    }
  };

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
        <View className="px-6">
          <Text className="text-center text-lg font-bold text-primary">
            Nueva Verificación
          </Text>
          <Text className="text-center text-sm text-gray-400">
            Comparte lo que sabes con la comunidad
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 10,
          }}
        >
          <ControlledInput
            control={control}
            name="title"
            label="Título"
            placeholder="Ej: Verificación de noticia sobre..."
            error={errors.title?.message}
          />

          <ControlledTextArea
            control={control}
            name="description"
            label="Descripción"
            placeholder="Describe los detalles de tu verificación..."
            error={errors.description?.message}
          />

          {/* <ControlledInput
              control={control}
              name="news_id"
              label="ID de Noticia (Opcional)"
              placeholder="Relacionar con una noticia específica"
              error={errors.news_id?.message}
            /> */}

          <ControlledInput
            control={control}
            name="news_url"
            label="Link de Noticia (Opcional)"
            placeholder="https://ejemplo.com/noticia"
            error={errors.news_url?.message}
          />

          <ControlledSelect
            control={control}
            name="category"
            label="Categoría"
            options={VERIFICATION_CATEGORIES}
            error={errors.category?.message}
          />

          {/* Image Picker */}
          <View className="mb-4">
            {imageUri ? (
              <View className="relative">
                <View className="h-32 w-full overflow-hidden rounded-lg bg-muted">
                  <RNImage
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
                <Pressable
                  onPress={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-2"
                >
                  <Icon as={X} size={16} className="text-white" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={pickImage}
                className="h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50"
              >
                <Icon
                  as={Upload}
                  size={32}
                  className="mb-2 text-muted-foreground"
                />
                <Text className="text-sm text-muted-foreground">
                  Toca para seleccionar imagen
                </Text>
              </Pressable>
            )}
          </View>

          {/* Submit Button */}
          <View className="mb-2 rounded-3xl bg-orange-50 p-2">
            <Text className="text-center text-sm text-orange-600">
              <Text className="font-semibold text-orange-500">Aviso:</Text> Tu
              verificación será revisada por nuestro equipo de moderación y
              sistemas de IA antes de ser publicada. Este proceso puede tomar
              entre 5-15 minutos.
            </Text>
          </View>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || isUploadingImage}
            size="lg"
            className="mt-2"
          >
            {isLoading || isUploadingImage ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-bold text-primary-foreground">
                Subir Verificación
              </Text>
            )}
          </Button>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

CreateVerificationForm.displayName = "CreateVerificationForm";
