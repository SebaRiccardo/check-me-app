# Chat Persistence Quick Start Guide

## What's New

Your CheckMe AI app now has **message persistence**! This means:

- ✅ Conversations are saved automatically
- ✅ Messages persist across app restarts
- ✅ Create and manage multiple conversations
- ✅ Switch between different chat threads
- ✅ Delete unwanted conversations

## How to Use

### Starting a New Conversation

1. **Automatic Creation**: When you open the app, a new chat is created automatically if none exists
2. **Manual Creation**: Tap the **+** icon in the top-right corner to start a fresh conversation

### Viewing Chat History

1. Tap the **message square icon** (📱) in the top-right corner
2. A modal will appear showing all your conversations
3. Each chat shows:
   - Preview of the first message
   - Number of messages
   - Last update time

### Switching Between Chats

1. Open the chat list (message square icon)
2. Tap on any conversation to open it
3. Your messages will load from the database
4. Continue the conversation where you left off

### Deleting a Chat

1. Open the chat list
2. Tap the **trash icon** next to any conversation
3. The chat and all its messages will be permanently deleted
4. If you delete the current chat, a new one is created automatically

## Technical Details

### Data Storage

- **Location**: SQLite database on your device (`chats.db`)
- **Structure**: Two tables - `chats` and `messages`
- **Privacy**: All data stored locally, not sent to external servers

### Message Optimization

The app is optimized for performance:

- Only the **last message** is sent to the API
- Previous messages are loaded from the local database
- This reduces bandwidth and improves response time

### Platforms Supported

- ✅ iOS
- ✅ Android
- ✅ Web (with SharedArrayBuffer support)

## Tips

1. **Long Conversations**: Messages are stored efficiently, but very long conversations may take a moment to load
2. **Storage Space**: Each message is small (~1-5KB), so you can have thousands of messages without issues
3. **Backup**: Data is stored locally. If you uninstall the app, conversations will be lost (cloud sync coming soon!)

## User Experience Flow

```
1. Open App
   ↓
2. Database Initializes
   ↓
3. Current Chat Loads (or New Chat Created)
   ↓
4. Send Message
   ↓
5. Message Saved Automatically
   ↓
6. AI Response Received
   ↓
7. All Messages Saved to Database
```

## What Gets Saved

Each message includes:

- Message ID (unique identifier)
- Role (user or assistant)
- Text content
- Tool calls (if web search was used)
- Sources (URLs and snippets)
- Timestamps

## Features in Action

### Chat List Example

```
┌─────────────────────────────────────┐
│  Conversaciones              [+]    │
├─────────────────────────────────────┤
│ 💬 ¿Es cierto que...?        🗑️    │
│    5 mensajes • Hace 2h             │
├─────────────────────────────────────┤
│ 💬 Verificar información...  🗑️    │
│    12 mensajes • Ayer               │
├─────────────────────────────────────┤
│ 💬 ¿Qué tan confiable...?    🗑️    │
│    8 mensajes • 3 días              │
└─────────────────────────────────────┘
```

## Troubleshooting

### Messages Not Saving

- **Check**: Is the database initialized? Look for initialization errors in console
- **Solution**: Restart the app

### Chat List Not Updating

- **Check**: Did you close the modal after creating/deleting?
- **Solution**: Reopen the chat list to refresh

### Old Messages Not Loading

- **Check**: Is the correct chat selected?
- **Solution**: Tap the chat in the list to ensure it's loaded

### App Crashes on Chat Operations

- **Check**: Is expo-sqlite installed? Run `pnpm install`
- **Solution**: Clear app data and restart

## Development Notes

For developers working on this feature:

### Key Files

- `lib/chat-store.ts` - Database operations
- `hooks/use-chat-persistence.ts` - React hook for persistence
- `components/chat-list.tsx` - Chat list UI
- `app/(tabs)/chat.tsx` - Main chat screen with persistence integration
- `app/api/chat+api.ts` - API route with server-side ID generation

### Testing Checklist

- [ ] Create new chat
- [ ] Send messages
- [ ] Close and reopen app
- [ ] Verify messages persist
- [ ] Switch between chats
- [ ] Delete a chat
- [ ] Create chat after delete
- [ ] Test on all platforms

## Future Enhancements

Coming soon:

- 🔜 Search across all conversations
- 🔜 Export conversations
- 🔜 Cloud backup and sync
- 🔜 Custom chat names/titles
- 🔜 Message editing and deletion
- 🔜 Share conversations

## Need Help?

If you encounter issues:

1. Check the console for error messages
2. Review the full documentation in `docs/CHAT_PERSISTENCE.md`
3. Check that all dependencies are installed
4. Verify database permissions on your device
