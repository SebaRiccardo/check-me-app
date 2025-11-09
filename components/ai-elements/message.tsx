import type { ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

interface MessageProps {
  from: "user" | "assistant" | "system";
  children: ReactNode;
  className?: string;
}

export function Message({ from, children, className }: MessageProps) {
  const isUser = from === "user";
  const alignment = isUser ? "items-end" : "items-start";
  return (
    <View className={cn("mb-4 px-2", alignment, className)}>{children}</View>
  );
}

interface MessageContentProps {
  children: ReactNode;
  className?: string;
}

export function MessageContent({ children, className }: MessageContentProps) {
  return <View className={className}>{children}</View>;
}
