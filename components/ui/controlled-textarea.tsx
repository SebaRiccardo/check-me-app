import { TextArea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/text";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import type { TextInputProps } from "react-native";
import { View } from "react-native";

export type ControlledTextAreaProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
};

export function ControlledTextArea<T extends FieldValues>({
  control,
  name,
  label,
  error,
  ...inputProps
}: ControlledTextAreaProps<T>) {
  const { field } = useController({
    control,
    name,
  });

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-sm font-medium text-foreground">
          {label}
        </Text>
      )}
      <TextArea
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        {...inputProps}
      />
      {error && <Text className="mt-1 text-xs text-destructive">{error}</Text>}
    </View>
  );
}
