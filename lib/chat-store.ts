import * as SQLite from "expo-sqlite";
import { UIMessage } from "ai";
import { generateId } from "ai";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database and create tables if needed
 */
export async function initChatDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("chats.db");

  // Enable WAL mode for better performance
  await db.execAsync("PRAGMA journal_mode = WAL");

  // Create chats table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Create messages table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      chat_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
    );
  `);

  // Create index for faster queries
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
    CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
  `);

  return db;
}

/**
 * Get the database instance
 */
async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    return await initChatDatabase();
  }
  return db;
}

/**
 * Create a new chat for a user
 */
export async function createChat(userId: string): Promise<string> {
  const database = await getDB();
  const id = generateId();
  const now = Date.now();

  await database.runAsync(
    "INSERT INTO chats (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)",
    id,
    userId,
    now,
    now,
  );

  return id;
}

/**
 * Load chat messages from database
 */
export async function loadChat(chatId: string): Promise<UIMessage[]> {
  const database = await getDB();

  const rows = await database.getAllAsync<{ content: string }>(
    "SELECT content FROM messages WHERE chat_id = ? ORDER BY created_at ASC",
    chatId,
  );

  return rows.map((row) => JSON.parse(row.content) as UIMessage);
}

/**
 * Save chat messages to database
 */
export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const database = await getDB();
  const now = Date.now();

  await database.withTransactionAsync(async () => {
    // Delete existing messages for this chat
    await database.runAsync("DELETE FROM messages WHERE chat_id = ?", chatId);

    // Insert all messages
    for (const message of messages) {
      await database.runAsync(
        "INSERT INTO messages (id, chat_id, content, created_at) VALUES (?, ?, ?, ?)",
        message.id,
        chatId,
        JSON.stringify(message),
        now,
      );
    }

    // Update chat's updated_at timestamp
    await database.runAsync(
      "UPDATE chats SET updated_at = ? WHERE id = ?",
      now,
      chatId,
    );
  });
}

/**
 * Get all chats for a user
 */
export async function getUserChats(userId: string): Promise<
  Array<{
    id: string;
    created_at: number;
    updated_at: number;
    message_count: number;
  }>
> {
  const database = await getDB();

  const rows = await database.getAllAsync<{
    id: string;
    created_at: number;
    updated_at: number;
    message_count: number;
  }>(
    `SELECT 
      c.id, 
      c.created_at, 
      c.updated_at,
      COUNT(m.id) as message_count
    FROM chats c
    LEFT JOIN messages m ON c.id = m.chat_id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.updated_at DESC`,
    userId,
  );

  return rows;
}

/**
 * Delete a chat and all its messages
 */
export async function deleteChat(chatId: string): Promise<void> {
  const database = await getDB();
  await database.runAsync("DELETE FROM chats WHERE id = ?", chatId);
}

/**
 * Check if a chat exists and belongs to a user
 */
export async function chatExists(
  chatId: string,
  userId: string,
): Promise<boolean> {
  const database = await getDB();

  const result = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM chats WHERE id = ? AND user_id = ?",
    chatId,
    userId,
  );

  return (result?.count ?? 0) > 0;
}

/**
 * Get the first message of a chat (for preview purposes)
 */
export async function getChatPreview(chatId: string): Promise<string | null> {
  const database = await getDB();

  const result = await database.getFirstAsync<{ content: string }>(
    "SELECT content FROM messages WHERE chat_id = ? ORDER BY created_at ASC LIMIT 1",
    chatId,
  );

  if (!result) return null;

  const message = JSON.parse(result.content) as UIMessage;
  const textPart = message.parts.find((part: any) => part.type === "text");

  return textPart ? (textPart as any).text : null;
}
