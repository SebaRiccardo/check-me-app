import { Text } from "@/components/ui/text";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import { Pressable, View, ScrollView } from "react-native";
import { cn } from "@/lib/utils";

export type ControlledSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  options: readonly string[] | string[];
  placeholder?: string;
};

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  error,
  options,
  placeholder = "Seleccionar...",
}: ControlledSelectProps<T>) {
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => field.onChange(option)}
            className={cn(
              "mr-2 rounded-full border px-4 py-2",
              field.value === option
                ? "border-primary bg-primary"
                : "border-border bg-background",
            )}
          >
            <Text
              className={cn(
                "text-sm font-medium",
                field.value === option
                  ? "text-primary-foreground"
                  : "text-foreground",
              )}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {error && <Text className="mt-1 text-xs text-destructive">{error}</Text>}
    </View>
  );
}
