import { ActivityIndicator, View } from "react-native";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <View className={className}>
      <ActivityIndicator size="small" color="#6366f1" />
    </View>
  );
}
