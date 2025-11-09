# Chat Message Persistence Implementation

## Overview

This implementation adds message persistence to the CheckMe AI chat using Expo SQLite, following the AI SDK chatbot persistence guide. Messages are stored locally on the device and persist across app restarts.

## Architecture

### Database Schema

The implementation uses two main tables:

#### `chats` table

- `id` (TEXT, PRIMARY KEY): Unique chat identifier
- `user_id` (TEXT): User who owns the chat
- `created_at` (INTEGER): Timestamp when chat was created
- `updated_at` (INTEGER): Timestamp of last update

#### `messages` table

- `id` (TEXT, PRIMARY KEY): Unique message identifier
- `chat_id` (TEXT, FOREIGN KEY): Reference to parent chat
- `content` (TEXT): JSON-serialized UIMessage object
- `created_at` (INTEGER): Timestamp when message was created

### Key Features

1. **SQLite Storage**: Uses `expo-sqlite` for local database storage
2. **Message History**: Loads previous messages when opening a chat
3. **Multiple Chats**: Users can create and switch between multiple conversations
4. **Server-side IDs**: Message IDs are generated on the server for consistency
5. **Optimized Requests**: Only sends the last message to the API, loads previous messages from local database
6. **Auto-save**: Messages are automatically saved after each AI response
7. **Web Support**: Metro config updated to support WASM files for web compatibility

## Files Created/Modified

### New Files

1. **`lib/chat-store.ts`**
   - Database initialization and table creation
   - CRUD operations for chats and messages
   - Utility functions for chat management
2. **`hooks/use-chat-persistence.ts`**
   - React hook for managing chat persistence
   - Provides functions to create, load, save, and delete chats
   - Manages database initialization state
3. **`components/chat-list.tsx`**
   - UI component to display list of chats
   - Shows chat previews, timestamps, and message counts
   - Allows creating new chats and deleting existing ones

### Modified Files

1. **`app/api/chat+api.ts`**
   - Updated request schema to accept both `message` and `messages`
   - Added support for `chatId` parameter
   - Implemented server-side ID generation with `createIdGenerator`
   - Added `originalMessages` to response for proper history tracking

2. **`app/(tabs)/chat.tsx`**
   - Integrated `useChatPersistence` hook
   - Added chat ID state management
   - Implemented message loading on chat switch
   - Added message saving in `onFinish` callback
   - Added chat list modal with navigation
   - Optimized to send only last message to API
3. **`metro.config.js`**
   - Added WASM asset support for web compatibility
   - Added COEP and COOP headers for SharedArrayBuffer support

## Usage Flow

### Starting a New Chat

1. User opens the app
2. If no current chat exists, a new chat is automatically created
3. User can also manually create a new chat via the "+" button

### Sending Messages

1. User types a message and sends it
2. The message is added to local state
3. Only the last message is sent to the API (via `prepareSendMessagesRequest`)
4. API generates a response with server-side message IDs
5. When response completes, `onFinish` callback saves all messages to SQLite

### Loading Chat History

1. User selects a chat from the chat list
2. `loadChatMessages()` retrieves messages from SQLite
3. Messages are set to the `useChat` state via `setMessages()`
4. UI displays the conversation history

### Switching Between Chats

1. User opens the chat list modal (MessageSquare icon)
2. User selects a different chat
3. Current chat ID updates
4. Messages for the selected chat are loaded from SQLite
5. UI updates to show the selected conversation

## Database Operations

### Initialize Database

```typescript
await initChatDatabase();
```

### Create New Chat

```typescript
const chatId = await createChat(userId);
```

### Load Chat Messages

```typescript
const messages = await loadChat(chatId);
```

### Save Chat Messages

```typescript
await saveChat({ chatId, messages });
```

### Get User's Chats

```typescript
const chats = await getUserChats(userId);
```

### Delete Chat

```typescript
await deleteChat(chatId);
```

## Performance Optimizations

1. **WAL Journal Mode**: Enabled for better concurrent read/write performance
2. **Indexes**: Created on `chat_id` and `user_id` for faster queries
3. **Transactions**: Used for atomic operations when saving multiple messages
4. **Minimal Data Transfer**: Only last message sent to API, not entire history
5. **Lazy Loading**: Messages loaded only when chat is opened

## Security Considerations

1. **User Isolation**: Each chat is associated with a user ID from Supabase auth
2. **Validation**: `chatExists()` function ensures user owns the chat before operations
3. **Local Storage**: Data stored locally on device, not exposed to other apps
4. **Foreign Key Constraints**: Cascade delete ensures no orphaned messages

## Web Compatibility

The implementation supports web through:

- WASM assets for SQLite web implementation
- COEP and COOP headers for SharedArrayBuffer
- Cross-platform database API from expo-sqlite

## Future Enhancements

Possible improvements:

1. **Search**: Add full-text search across messages
2. **Export**: Allow users to export conversations
3. **Cloud Sync**: Optional cloud backup via Supabase
4. **Message Editing**: Edit or delete individual messages
5. **Chat Names**: Allow users to name conversations
6. **Attachments**: Support for images and files
7. **Pagination**: Load messages in chunks for very long conversations

## Troubleshooting

### Database not initializing

- Check that `expo-sqlite` is properly installed
- Ensure app has proper permissions (handled automatically by Expo)

### Messages not persisting

- Verify `onFinish` callback is being called
- Check console for database errors
- Ensure chat ID is properly set

### Chat list not updating

- Call `refreshChats()` after operations
- Check that user ID is available from auth context

## Testing

To test the implementation:

1. Send messages in a chat
2. Close and reopen the app
3. Verify messages are still there
4. Create multiple chats
5. Switch between chats
6. Delete a chat
7. Test on different platforms (iOS, Android, Web)
