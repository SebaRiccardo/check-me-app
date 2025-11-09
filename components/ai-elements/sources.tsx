import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Linking, Modal, Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ExternalLink, X, BookOpen } from "lucide-react-native";

interface SourcesContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SourcesContext = createContext<SourcesContextValue | undefined>(
  undefined,
);

function useSourcesContext() {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error("Sources components deben usarse dentro de <Sources>");
  }
  return context;
}

interface SourcesProps {
  children: ReactNode;
  className?: string;
}

export function Sources({ children, className }: SourcesProps) {
  const [open, setOpen] = useState(false);

  return (
    <SourcesContext.Provider value={{ open, setOpen }}>
      <View className={cn("mt-3 px-4", className)}>{children}</View>
    </SourcesContext.Provider>
  );
}

interface SourcesTriggerProps {
  count: number;
  className?: string;
}

export function SourcesTrigger({ count, className }: SourcesTriggerProps) {
  const { setOpen } = useSourcesContext();
  if (count === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("self-start rounded-full", className)}
      onPress={() => setOpen(true)}
    >
      <View className="flex-row items-center">
        <Icon as={BookOpen} size={16} className="text-primary" />
        <Text className="ml-2 text-sm font-medium text-foreground">
          Ver fuentes ({count})
        </Text>
      </View>
    </Button>
  );
}

interface SourcesContentProps {
  title?: string;
  children: ReactNode;
}

export function SourcesContent({
  title = "Fuentes consultadas",
  children,
}: SourcesContentProps) {
  const { open, setOpen } = useSourcesContext();

  if (!open) {
    return null;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)}>
        <Pressable className="mt-auto rounded-t-3xl bg-card px-6 pb-8 pt-6 shadow-lg">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">
              {title}
            </Text>
            <Button size="icon" variant="ghost" onPress={() => setOpen(false)}>
              <Icon as={X} size={18} className="text-muted-foreground" />
            </Button>
          </View>
          <ScrollView
            className="max-h-[320px]"
            contentContainerStyle={{ gap: 12 }}
          >
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface SourceProps {
  href: string;
  title?: string;
  description?: string;
}

export function Source({ href, title, description }: SourceProps) {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(href);
      if (supported) {
        await Linking.openURL(href);
      }
    } catch (error) {
      console.error("No se pudo abrir la fuente", error);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-start justify-between rounded-2xl border border-border bg-background px-4 py-3"
    >
      <View className="flex-1 pr-3">
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={2}
        >
          {title ?? href}
        </Text>
        {description ? (
          <Text
            className="mt-1 text-xs text-muted-foreground"
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
        <Text className="mt-1 text-xs text-primary" numberOfLines={1}>
          {href}
        </Text>
      </View>
      <Icon as={ExternalLink} size={18} className="text-primary" />
    </Pressable>
  );
}
