import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { View } from 'react-native';

export type ControlledInputProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
};

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  ...inputProps
}: ControlledInputProps<T>) {
  const { field } = useController({
    control,
    name,
  });

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
      )}
      <Input
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        {...inputProps}
      />
      {error && (
        <Text className="text-destructive text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
