import { useEffect, useState } from "react";
import { UIMessage } from "ai";
import {
  initChatDatabase,
  createChat,
  loadChat,
  saveChat,
  getUserChats,
  deleteChat,
  chatExists,
  getChatPreview,
} from "@/lib/chat-store";

export interface ChatInfo {
  id: string;
  created_at: number;
  updated_at: number;
  message_count: number;
  preview?: string;
}

/**
 * Hook to manage chat persistence with SQLite
 */
export function useChatPersistence(userId: string | undefined) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database on mount
  useEffect(() => {
    initChatDatabase()
      .then(() => {
        setIsInitialized(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error initializing chat database:", error);
        setIsLoading(false);
      });
  }, []);

  // Load user's chats
  const loadUserChats = async () => {
    if (!userId || !isInitialized) return;

    try {
      setIsLoading(true);
      const userChats = await getUserChats(userId);

      // Load previews for each chat
      const chatsWithPreviews = await Promise.all(
        userChats.map(async (chat) => {
          const preview = await getChatPreview(chat.id);
          return { ...chat, preview: preview ?? undefined };
        }),
      );

      setChats(chatsWithPreviews);
    } catch (error) {
      console.error("Error loading user chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && userId) {
      loadUserChats();
    }
  }, [isInitialized, userId]);

  /**
   * Create a new chat
   */
  const createNewChat = async (): Promise<string | null> => {
    if (!userId || !isInitialized) return null;

    try {
      const chatId = await createChat(userId);
      await loadUserChats(); // Refresh the list
      return chatId;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  /**
   * Load messages for a specific chat
   */
  const loadChatMessages = async (chatId: string): Promise<UIMessage[]> => {
    if (!isInitialized) return [];

    try {
      return await loadChat(chatId);
    } catch (error) {
      console.error("Error loading chat messages:", error);
      return [];
    }
  };

  /**
   * Save messages for a chat
   */
  const saveChatMessages = async (
    chatId: string,
    messages: UIMessage[],
  ): Promise<void> => {
    if (!isInitialized) return;

    try {
      await saveChat({ chatId, messages });
      await loadUserChats(); // Refresh the list to update timestamps
    } catch (error) {
      console.error("Error saving chat messages:", error);
    }
  };

  /**
   * Delete a chat
   */
  const removeChat = async (chatId: string): Promise<void> => {
    if (!isInitialized) return;

    try {
      await deleteChat(chatId);
      await loadUserChats(); // Refresh the list
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  /**
   * Check if a chat exists and belongs to the user
   */
  const checkChatExists = async (chatId: string): Promise<boolean> => {
    if (!userId || !isInitialized) return false;

    try {
      return await chatExists(chatId, userId);
    } catch (error) {
      console.error("Error checking chat existence:", error);
      return false;
    }
  };

  return {
    isInitialized,
    isLoading,
    chats,
    createNewChat,
    loadChatMessages,
    saveChatMessages,
    removeChat,
    checkChatExists,
    refreshChats: loadUserChats,
  };
}
