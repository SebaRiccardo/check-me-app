# Chat Persistence Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                     (app/(tabs)/chat.tsx)                    │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Header    │  │   Messages  │  │   Input Area     │   │
│  │  [+] [📱]   │  │  (scrolling)│  │  [Send Button]   │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Chat List Modal                          │    │
│  │  - All conversations                               │    │
│  │  - Preview, count, timestamp                       │    │
│  │  - Delete buttons                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      React Hooks Layer                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  useChat (AI SDK)                                  │    │
│  │  - messages, sendMessage, status                   │    │
│  │  - onFinish callback                               │    │
│  │  - Server-side ID generation                       │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  useChatPersistence                                │    │
│  │  - createNewChat()                                 │    │
│  │  - loadChatMessages()                              │    │
│  │  - saveChatMessages()                              │    │
│  │  - removeChat()                                    │    │
│  │  - chats list state                                │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Persistence Layer                          │
│                   (lib/chat-store.ts)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Database Operations                               │    │
│  │  - initChatDatabase()                              │    │
│  │  - createChat(userId)                              │    │
│  │  - loadChat(chatId)                                │    │
│  │  - saveChat({ chatId, messages })                  │    │
│  │  - deleteChat(chatId)                              │    │
│  │  - getUserChats(userId)                            │    │
│  │  - chatExists(chatId, userId)                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                           │
│                      (chats.db)                              │
│                                                              │
│  ┌────────────────────────┐  ┌─────────────────────────┐   │
│  │   chats table          │  │   messages table        │   │
│  ├────────────────────────┤  ├─────────────────────────┤   │
│  │ id (PK)                │  │ id (PK)                 │   │
│  │ user_id                │  │ chat_id (FK)            │   │
│  │ created_at             │  │ content (JSON)          │   │
│  │ updated_at             │  │ created_at              │   │
│  └────────────────────────┘  └─────────────────────────┘   │
│                                                              │
│  Indexes: idx_chats_user_id, idx_messages_chat_id          │
│  Journal Mode: WAL                                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Integration                         │
│                   (app/api/chat+api.ts)                      │
│                                                              │
│  - Receives: { message, chatId, model, webSearch }          │
│  - Sends only last message to AI                            │
│  - Generates server-side message IDs                         │
│  - Returns: Stream of UI messages                            │
│  - Client saves via onFinish                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. New Chat Creation Flow

```
User taps [+] button
         │
         ▼
   handleNewChat()
         │
         ▼
   createNewChat()
         │
         ▼
   generateId() → SQL INSERT into chats
         │
         ▼
   setCurrentChatId(newId)
         │
         ▼
   setMessages([])
         │
         ▼
   Empty chat displayed
```

### 2. Message Sending Flow

```
User types and sends message
         │
         ▼
   sendMessage({ text })
         │
         ▼
   Message added to local state
         │
         ▼
   Only last message sent to API ──────┐
         │                              │
         ▼                              │
   API processes with AI                │
         │                              │
         ▼                              │
   Server generates message ID          │
         │                              │
         ▼                              │
   Stream response back                 │
         │                              │
         ▼                              │
   onFinish callback triggered          │
         │                              │
         ▼                              │
   saveChatMessages(chatId, messages) ◄─┘
         │
         ▼
   SQL TRANSACTION:
   - DELETE old messages
   - INSERT all messages
   - UPDATE chat.updated_at
         │
         ▼
   Messages persisted to SQLite
```

### 3. Chat Loading Flow

```
User selects chat from list
         │
         ▼
   handleSelectChat(chatId)
         │
         ▼
   setCurrentChatId(chatId)
         │
         ▼
   useEffect detects chatId change
         │
         ▼
   loadChatMessages(chatId)
         │
         ▼
   SQL SELECT from messages table
         │
         ▼
   Parse JSON content
         │
         ▼
   setMessages(loadedMessages)
         │
         ▼
   UI displays conversation
```

### 4. Chat Deletion Flow

```
User taps trash icon on chat
         │
         ▼
   handleDeleteChat(chatId)
         │
         ▼
   removeChat(chatId)
         │
         ▼
   SQL DELETE from chats
         │
         ▼
   CASCADE DELETE messages
         │
         ▼
   if (deleted === current) {
         │
         ▼
     createNewChat()
   }
         │
         ▼
   refreshChats()
         │
         ▼
   Chat list updated
```

## Component Hierarchy

```
App
 └── (tabs)
      └── chat.tsx
           ├── ChatList Modal
           │    └── FlatList
           │         └── ChatListItem[]
           │              ├── Preview Text
           │              ├── Message Count
           │              ├── Timestamp
           │              └── Delete Button
           │
           └── Main Chat
                ├── Header
                │    ├── [+] New Chat Button
                │    └── [📱] Chat List Button
                │
                ├── Conversation
                │    └── Messages[]
                │         ├── User Message
                │         ├── AI Response
                │         ├── Tool Calls (optional)
                │         └── Sources (optional)
                │
                └── PromptInput
                     ├── Tools Toggle
                     ├── Model Select
                     └── Send Button
```

## State Management

```
┌─────────────────────────────────────┐
│        Component State              │
│  (app/(tabs)/chat.tsx)              │
├─────────────────────────────────────┤
│ - currentChatId                     │
│ - showChatList                      │
│ - selectedModel                     │
│ - webSearch                         │
│ - showTools                         │
│ - input                             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│    useChatPersistence State         │
├─────────────────────────────────────┤
│ - isInitialized                     │
│ - isLoading                         │
│ - chats[]                           │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        useChat State                │
│        (AI SDK)                     │
├─────────────────────────────────────┤
│ - messages[]                        │
│ - status                            │
│ - error                             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      SQLite Database                │
│      (Persistent Storage)           │
└─────────────────────────────────────┘
```

## Network Optimization

```
Traditional Approach (Without Optimization):
┌────────────┐                    ┌────────────┐
│   Client   │                    │   Server   │
│            │ ─── All Messages ─→│            │
│  1MB data  │                    │  Processes │
│            │ ←── AI Response ───│            │
└────────────┘                    └────────────┘

Our Optimized Approach:
┌────────────┐                    ┌────────────┐
│   Client   │                    │   Server   │
│            │ ─ Last Message ──→ │            │
│  10KB data │    + chatId        │  Processes │
│            │ ←── AI Response ───│            │
└────────────┘                    └────────────┘
      │                                  │
      ▼                                  │
 Load previous                           │
 from SQLite                             │
      │                                  │
      └──────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────┐
│         User Authentication         │
│         (Supabase Auth)             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      User ID from Session           │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│    Chat Ownership Validation        │
│    chatExists(chatId, userId)       │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      SQLite Local Storage           │
│      (Device-only access)           │
└─────────────────────────────────────┘
```

## Performance Characteristics

```
Operation          | Complexity | Time (avg) | Notes
-------------------|------------|------------|------------------
Create Chat        | O(1)       | < 10ms     | Single INSERT
Load Messages      | O(n)       | < 100ms    | Indexed SELECT
Save Messages      | O(n)       | < 200ms    | Transaction
Delete Chat        | O(n)       | < 50ms     | CASCADE DELETE
Get User Chats     | O(n log n) | < 100ms    | JOIN + ORDER BY
Chat List Refresh  | O(n*m)     | < 200ms    | Multiple queries

n = number of messages
m = number of chats
```

## Storage Estimates

```
Message Size Breakdown:
- Message ID:       ~20 bytes
- Role:             ~10 bytes
- Text content:     ~500 bytes (average)
- Tool calls:       ~200 bytes (if present)
- Sources:          ~300 bytes (if present)
- Metadata:         ~100 bytes

Average per message: ~1KB
100 messages:        ~100KB
1000 messages:       ~1MB

Database overhead:   ~20-30%
```

## Technology Stack

```
┌──────────────────────────────────────┐
│           Frontend Layer             │
│  - React Native                      │
│  - TypeScript                        │
│  - Expo Router                       │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│         State Management             │
│  - React Hooks                       │
│  - AI SDK (useChat)                  │
│  - Custom Hooks                      │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│        Persistence Layer             │
│  - Expo SQLite                       │
│  - TypeScript                        │
│  - SQL Queries                       │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│         Platform Layer               │
│  iOS: Native SQLite                  │
│  Android: Native SQLite              │
│  Web: WASM SQLite                    │
└──────────────────────────────────────┘
```
