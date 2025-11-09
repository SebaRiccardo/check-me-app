import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetch as expoFetch } from "expo/fetch";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  ArrowDown,
  Bot,
  Globe,
  Send,
  Sparkles,
  Wrench,
  MessageSquare,
  Plus,
} from "lucide-react-native";

import { useAuth } from "@/hooks/use-auth-context";
import { useChatPersistence } from "@/hooks/use-chat-persistence";
import { generateAPIUrl } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ChatList } from "@/components/chat-list";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Loader } from "@/components/ai-elements/loader";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "@/components/ai-elements/sources";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from "@/components/ui/select";
import { Toggle, ToggleIcon } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

const MODEL_OPTIONS: Option[] = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

const FALLBACK_MODEL: Option = MODEL_OPTIONS[0];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedModel, setSelectedModel] = useState<Option>(FALLBACK_MODEL);
  const [webSearch, setWebSearch] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Get user ID from session
  const userId = session?.user?.id;

  // Initialize chat persistence
  const {
    isInitialized,
    chats,
    createNewChat,
    loadChatMessages,
    saveChatMessages,
    removeChat,
    refreshChats,
  } = useChatPersistence(userId);

  // Load the last chat on mount, or create a new one if no chats exist
  useEffect(() => {
    if (isInitialized && userId && !currentChatId && !hasInitialized) {
      setHasInitialized(true);
      
      // If there are existing chats, load the most recent one
      if (chats.length > 0) {
        const lastChat = chats[0]; // Chats are ordered by updated_at DESC
        console.log("Loading last chat with ID:", lastChat.id);
        setCurrentChatId(lastChat.id);
      } else {
        // No chats exist, create a new one
        createNewChat().then((chatId) => {
          console.log("Created new chat with ID:", chatId);
          if (chatId) {
            setCurrentChatId(chatId);
          }
        });
      }
    }
  }, [isInitialized, userId, currentChatId, chats, hasInitialized, createNewChat]);

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

  const modelValue = useMemo(
    () => selectedModel?.value ?? FALLBACK_MODEL?.value ?? "gemini-2.0-flash",
    [selectedModel],
  );

  const { messages, error, sendMessage, status, setMessages } = useChat({
    id: currentChatId ?? undefined,
    transport: new DefaultChatTransport({
      fetch: expoFetch as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
      headers: {
        Authorization: session.access_token
          ? `Bearer ${session.access_token}`
          : "",
      },
      body: () => ({
        model: modelValue,
        webSearch,
        chatId: currentChatId,
      }),
      // Only send the last message to reduce bandwidth
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            message: messages[messages.length - 1],
            chatId: id,
            model: modelValue,
            webSearch,
          },
        };
      },
    }),
    onFinish: async ({ messages: finishedMessages }) => {
      // Save messages to SQLite after AI response is complete
      if (currentChatId && isInitialized) {
        await saveChatMessages(currentChatId, finishedMessages);
      }
    },
    onError: (cause) => console.error("chat api error", cause.message),
  });

  // Load messages from SQLite when chat ID changes
  useEffect(() => {
    if (currentChatId && isInitialized) {
      loadChatMessages(currentChatId).then((loadedMessages) => {
        setMessages(loadedMessages);
      });
    }
  }, [currentChatId, isInitialized]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId) {
      setCurrentChatId(newChatId);
      setMessages([]);
      setShowChatList(false);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    setShowChatList(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    await removeChat(chatId);
    if (chatId === currentChatId) {
      // If we deleted the current chat, create a new one
      const newChatId = await createNewChat();
      if (newChatId) {
        setCurrentChatId(newChatId);
        setMessages([]);
      }
    }
    await refreshChats();
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
          Ocurrio un error al procesar tu solicitud.
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

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={"padding"}
      >
        <View
          className="border-b border-border bg-card px-4 pb-4"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-2 size-9 items-center justify-center rounded-md bg-primary">
                <Icon as={Bot} size={22} className="text-white" />
              </View>
              <View>
                <Text className="text-lg font-bold text-foreground">
                  Hola, me llamo Clarity 
                </Text>
                <Text className="text-sm text-gray-500">
                  Tu asistente de verificación
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleNewChat}
                className="size-10 items-center justify-center rounded-lg bg-primary/10"
              >
                <Icon as={Plus} size={20} className="text-primary" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowChatList(true)}
                className="size-10 items-center justify-center rounded-lg bg-primary/10"
              >
                <Icon as={MessageSquare} size={20} className="text-primary" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Conversation className="flex-1">
          <ConversationContent
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ paddingTop: 24 }}
          >
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center px-4 py-20">
                <View className="mb-4 size-20 items-center justify-center rounded-full bg-blue-200 ">
                  <Icon as={Sparkles} size={40} className="text-white" />
                </View>
                <Text className="mb-2 text-center text-xl font-bold text-foreground">
                  ¡Hola! Soy tu asistente de verificación
                </Text>
                <Text className="text-center text-base text-muted-foreground">
                  Envía una afirmación y confirmaré su veracidad usando fuentes
                  confiables.
                </Text>
              </View>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";
                const textParts = message.parts.filter(
                  (part: any) => part.type === "text",
                );
                const sourceParts = message.parts.filter(
                  (part: any) => part.type === "source-url",
                );
                const toolParts = message.parts.filter((part: any) =>
                  part.type.startsWith("tool-"),
                );

                if (
                  textParts.length === 0 &&
                  sourceParts.length === 0 &&
                  toolParts.length === 0
                ) {
                  return null;
                }

                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent className="flex flex-col gap-2">
                      {textParts.map((part: any, index: number) => (
                        <View
                          key={`${message.id}-text-${index}`}
                          className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                            isUser
                              ? "self-end bg-primary"
                              : "self-start bg-gray-50"
                          }`}
                        >
                          <Text
                            className={`text-base leading-5 ${
                              isUser
                                ? "text-primary-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {part.text}
                          </Text>
                        </View>
                      ))}

                      {!isUser && showTools && toolParts.length > 0 ? (
                        <View className="gap-2">
                          {toolParts.map((part: any, index: number) => {
                            const isCompleted =
                              part.state === "output-available" ||
                              part.state === "output-error";

                            return (
                              <Tool
                                key={`${message.id}-tool-${index}`}
                                defaultOpen={isCompleted}
                              >
                                <ToolHeader
                                  title={part.toolName || "Herramienta"}
                                  type={part.type}
                                  state={part.state}
                                />
                                <ToolContent>
                                  {part.input && (
                                    <ToolInput input={part.input} />
                                  )}
                                  {(part.output || part.errorText) && (
                                    <ToolOutput
                                      output={part.output}
                                      errorText={part.errorText}
                                    />
                                  )}
                                </ToolContent>
                              </Tool>
                            );
                          })}
                        </View>
                      ) : null}

                      {!isUser && sourceParts.length > 0 ? (
                        <Sources>
                          <SourcesTrigger count={sourceParts.length} />
                          <SourcesContent>
                            {sourceParts.map((part: any, index: number) => (
                              <Source
                                key={`${message.id}-source-${index}`}
                                href={part.url}
                                title={part.title ?? part.url}
                                description={part.snippet}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      ) : null}
                    </MessageContent>
                  </Message>
                );
              })
            )}
            {isStreaming ? <Loader className="px-2" /> : null}
          </ConversationContent>

          {messages.length > 0 ? (
            <ConversationScrollButton
              className="absolute bottom-4 right-4 size-10"
              onPress={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              <ArrowDown size={18} color="white" />
            </ConversationScrollButton>
          ) : null}
        </Conversation>

        <PromptInput className="bg-transparent rounded-none bordert-0 pb-0">
          {session.user.is_admin && (
            <PromptInputTools className="mb-2">
              <ScrollView
                className="gap-4"
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <Toggle
                  pressed={webSearch}
                  onPressedChange={setWebSearch}
                  variant="outline"
                  size="sm"
                
                >
                  <ToggleIcon as={Globe} />
                  <Text className="text-sm font-medium">
                    {webSearch ? "Búsqueda web" : "Sin búsqueda"}
                  </Text>
                </Toggle>

                <Select
                  value={selectedModel}
                  onValueChange={(option) =>
                    setSelectedModel(option ?? FALLBACK_MODEL)
                  }
                >
                  <SelectTrigger className="mx-2 h-9 border-muted bg-muted/20">
                    <SelectValue placeholder="Selecciona un modelo" />
                  </SelectTrigger>
                  <SelectContent align="center">
                    {MODEL_OPTIONS.map((option) => (
                      <SelectItem
                        key={option?.value}
                        value={option?.value ?? ""}
                        label={option?.label ?? ""}
                      />
                    ))}
                  </SelectContent>
                </Select>
                <Toggle
                  pressed={showTools}
                  onPressedChange={setShowTools}
                  variant="outline"
                  size="sm"
                >
                  <ToggleIcon as={Wrench} />
                  <Text className="text-sm font-medium">
                    {showTools ? "Ver búsqueda web" : "Ocultar búsqueda web"}
                  </Text>
                </Toggle>
              </ScrollView>
            </PromptInputTools>
          )}
          <PromptInputBody className="flex-row items-end gap-2">
            <PromptInputTextarea
              value={input}
              onChangeText={setInput}
              placeholder="Describe la afirmación que quieres verificar..."
              textAlignVertical="top"
            />
            <PromptInputSubmit
              status={isStreaming ? "streaming" : "idle"}
              disabled={isStreaming || !input.trim()}
              onPress={handleSend}
              className="size-12"
            >
              <View className="flex-row items-center gap-2 ">
                <Icon as={Send} size={18} className="text-primary-foreground" />
              </View>
            </PromptInputSubmit>
          </PromptInputBody>
        </PromptInput>
      </KeyboardAvoidingView>

      {/* Chat List Modal */}
      <Modal
        hardwareAccelerated
        //navigationBarTranslucent
        visible={showChatList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowChatList(false)}
        allowSwipeDismissal={true}
      >
        <View
          className="flex-1"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          <ChatList
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
          />
          <View className="px-6">
            <Button onPress={() => setShowChatList(false)}>
              <Text>Cerrar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}
