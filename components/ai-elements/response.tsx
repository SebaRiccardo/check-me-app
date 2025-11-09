import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/utils";

interface ResponseProps {
  children: ReactNode;
  className?: string;
}

export function Response({ children, className }: ResponseProps) {
  return (
    <View className={cn("rounded-2xl bg-card px-4 py-3 shadow-sm", className)}>
      <Text className="text-base leading-5 text-foreground">{children}</Text>
    </View>
  );
}
