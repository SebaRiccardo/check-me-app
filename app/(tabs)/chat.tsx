import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuthContext } from "@/hooks/use-auth-context";
import { generateAPIUrl } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Bot, Send } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function UserMessage({
  message,
  avatarUrl,
}: {
  message: UIMessage;
  avatarUrl?: string | null;
}) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View className="mb-4 flex-row items-end justify-end px-4">
      <View className="mr-2 max-w-[75%] rounded-2xl rounded-br-sm bg-blue-500 px-4 py-3">
        {message.parts.map((part: any, i: number) => {
          if (part.type === "text") {
            return (
              <Text
                key={`${message.id}-${i}`}
                className="text-base leading-5 text-white"
              >
                {part.text}
              </Text>
            );
          }
          return null;
        })}
      </View>
      <Avatar alt="User avatar" className="size-8">
        {avatarUrl ? (
          <AvatarImage source={{ uri: avatarUrl }} />
        ) : (
          <AvatarFallback>
            <Text className="text-sm font-bold text-white">
              {getInitials("Usuario")}
            </Text>
          </AvatarFallback>
        )}
      </Avatar>
    </View>
  );
}

function BotMessage({ message }: { message: UIMessage }) {
  return (
    <View className="mb-4 flex-row items-end px-4">
      <View className="mr-2 size-8 items-center justify-center rounded-md bg-primary">
        <Icon as={Bot} size={18} className="text-white" />
      </View>
      <View className="max-w-[75%] rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
        {message.parts.map((part: any, i: number) => {
          if (part.type === "text") {
            return (
              <Text
                key={`${message.id}-${i}`}
                className="text-base leading-5 text-gray-900"
              >
                {part.text}
              </Text>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
}

const models = [
  {
    name: 'Gemini 2.0 Flash',
    value: 'gemini-2.0-flash',
  },
  {
    name: 'Gemini 2.5 Flash',
    value: 'gemini-2.5-flash',
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { session, profile } = useAuthContext();
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [input, setInput] = useState("");

  // Verificar si el usuario está autenticado
  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <View className="mb-4 size-16 items-center justify-center rounded-full bg-muted">
          <Icon as={Bot} size={32} className="text-muted-foreground" />
        </View>
        <Text className="mb-2 text-center text-lg font-bold text-foreground">
          Inicia sesión para usar el chat
        </Text>
        <Text className="text-center text-base text-muted-foreground">
          Necesitas estar autenticado para poder chatear con el asistente
        </Text>
      </View>
    );
  }

  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
      headers: (): Record<string, string> => {
        const token = session?.access_token;
        if (!token) {
          return {};
        }
        return { Authorization: `Bearer ${token}` };
      },
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  const avatarUrl =
    session?.user?.user_metadata?.avatar_url || profile?.avatar_url;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(
      { text: input },
      {
        body: {
          models: model,
          webSearch: webSearch,
        },
      },
    );
    setInput("");
    // Scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <View className="mb-4 size-16 items-center justify-center rounded-full bg-destructive/10">
          <Icon as={Bot} size={32} className="text-destructive" />
        </View>
        <Text className="mb-2 text-center text-lg font-bold text-foreground">
          Error en el chat
        </Text>
        <Text className="text-center text-base text-destructive">
          {error.message}
        </Text>
        {error.message.includes("autorizado") ||
        error.message.includes("Sesión") ? (
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            Por favor, cierra sesión y vuelve a iniciar sesión
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      className="flex-1 bg-background"
      // keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
    >
      {/* Header */}
      <View
        className="border-b border-border bg-card px-6 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center">
          <View className="mr-3 size-10 items-center justify-center rounded-md bg-primary">
            <Icon as={Bot} size={22} className="text-white" />
          </View>
          <View>
            <Text className="text-xl font-bold text-foreground">
              ChackMe IA
            </Text>
            <Text className="text-sm text-muted-foreground">
              Siempre listo para ayudarte
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 16,
        }}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="mb-4 size-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <Icon as={Bot} size={40} className="text-white" />
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-foreground">
              ¡Hola! Soy tu asistente
            </Text>
            <Text className="text-center text-base text-muted-foreground">
              Hazme cualquier pregunta y te ayudaré con información verificada
            </Text>
          </View>
        ) : (
          messages.map((m) =>
            m.role === "user" ? (
              <UserMessage key={m.id} message={m} avatarUrl={avatarUrl} />
            ) : (
              <BotMessage key={m.id} message={m} />
            ),
          )
        )}
      </ScrollView>

      {/* Input */}
      <View className="px-2 py-2">
        <View className="flex-row items-center space-x-4 ">
          <TextInput
            className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-base text-foreground"
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            multiline
            maxLength={500}
          />
          <Button
            onPress={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="ml-1 size-12 rounded-full"
          >
            <Icon as={Send} size={22} className="text-primary-foreground" />
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
