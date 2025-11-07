import { Text } from '@/components/ui/text';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Pressable, View, ScrollView } from 'react-native';
import { cn } from '@/lib/utils';

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
  placeholder = 'Seleccionar...',
}: ControlledSelectProps<T>) {
  const { field } = useController({
    control,
    name,
  });

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
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
              'mr-2 px-4 py-2 rounded-full border',
              field.value === option
                ? 'bg-primary border-primary'
                : 'bg-background border-border'
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                field.value === option
                  ? 'text-primary-foreground'
                  : 'text-foreground'
              )}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {error && (
        <Text className="text-destructive text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
