import { forwardRef } from "react";
import type { ReactNode } from "react";
import {
  ScrollView,
  ScrollViewProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface ConversationProps {
  children: ReactNode;
  className?: string;
}

export function Conversation({ children, className }: ConversationProps) {
  return <View className={cn("flex-1", className)}>{children}</View>;
}

interface ConversationContentProps extends ScrollViewProps {
  className?: string;
  children: ReactNode;
}

export const ConversationContent = forwardRef<
  ScrollView,
  ConversationContentProps
>(({ className, children, contentContainerStyle, ...props }, ref) => {
  return (
    <ScrollView
      ref={ref}
      className={cn("flex-1", className)}
      contentContainerStyle={[{ paddingVertical: 16 }, contentContainerStyle]}
      {...props}
    >
      {children}
    </ScrollView>
  );
});
ConversationContent.displayName = "ConversationContent";

interface ConversationScrollButtonProps {
  onPress?: () => void;
  className?: string;
  children?: ReactNode;
}

export function ConversationScrollButton({
  onPress,
  className,
  children,
}: ConversationScrollButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        "rounded-full bg-primary p-2 justify-center items-center shadow-md",
        className,
      )}
    >
      {children}
    </TouchableOpacity>
  );
}
