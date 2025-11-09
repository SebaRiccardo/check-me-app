import { View, TouchableOpacity, FlatList } from "react-native";
import { MessageSquare, Trash2, Plus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ChatInfo } from "@/hooks/use-chat-persistence";

interface ChatListProps {
  chats: ChatInfo[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatList({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString("es-ES", { weekday: "short" });
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground">Chats</Text>
          <TouchableOpacity
            onPress={onNewChat}
            className="rounded-lg flex-row gap-2 px-3 items-center bg-primary p-2"
          >
            <Icon as={Plus} size={20} className="text-primary-foreground" />
            <Text className="text-white">Nuevo chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectChat(item.id)}
            className={`mb-2 flex-row items-center justify-between rounded-lg border p-3 ${
              currentChatId === item.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <View className="flex-1 flex-row items-center gap-3">
              <View
                className={`rounded-lg p-2 ${
                  currentChatId === item.id ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <Icon
                  as={MessageSquare}
                  size={20}
                  className={
                    currentChatId === item.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />
              </View>
              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  className={`text-sm font-medium ${
                    currentChatId === item.id
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {item.preview || "Nueva conversación"}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted-foreground">
                    {item.message_count} mensajes
                  </Text>
                  <Text className="text-xs text-muted-foreground">•</Text>
                  <Text className="text-xs text-muted-foreground">
                    {formatDate(item.updated_at)}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="mt-1 text-xs font-mono text-muted-foreground/60"
                >
                  ID: {item.id}
                </Text>
              </View>
            </View>
            {currentChatId !== item.id && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDeleteChat(item.id);
                }}
                className="ml-2 rounded-lg bg-destructive/10 p-2"
              >
                <Icon as={Trash2} size={16} className="text-destructive" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <View className="mb-4 size-16 items-center justify-center rounded-full bg-muted">
              <Icon
                as={MessageSquare}
                size={32}
                className="text-muted-foreground"
              />
            </View>
            <Text className="mb-2 text-center text-base font-medium text-foreground">
              No hay conversaciones
            </Text>
            <Text className="text-center text-sm text-muted-foreground">
              Crea una nueva conversación para comenzar
            </Text>
          </View>
        }
      />
    </View>
  );
}
