# Chat Persistence Testing Guide

## Pre-Testing Setup

1. **Ensure expo-sqlite is installed**:

   ```bash
   pnpm install
   ```

2. **Start the development server**:

   ```bash
   pnpm start
   ```

3. **Open the app** on your preferred platform

## Test Scenarios

### Test 1: Basic Message Persistence

**Goal**: Verify messages are saved and loaded correctly

1. Open the app
2. Send a message: "Test message 1"
3. Wait for AI response
4. Send another message: "Test message 2"
5. Wait for AI response
6. **Close the app completely** (swipe away, not just minimize)
7. **Reopen the app**
8. ✅ **Expected**: Both messages and responses are visible

### Test 2: Multiple Chat Creation

**Goal**: Verify users can create and manage multiple chats

1. Open the app
2. Send a message: "First chat message"
3. Tap the **+** icon in top-right
4. New chat should open with empty conversation
5. Send a message: "Second chat message"
6. Tap the **message square icon** 📱
7. ✅ **Expected**: See 2 chats in the list

### Test 3: Chat Switching

**Goal**: Verify users can switch between chats without losing data

1. Create 2 chats with different messages (as in Test 2)
2. Open the chat list (message square icon)
3. Select the first chat
4. ✅ **Expected**: First chat's messages load
5. Open chat list again
6. Select the second chat
7. ✅ **Expected**: Second chat's messages load
8. No messages from first chat should appear

### Test 4: Chat Deletion

**Goal**: Verify chats can be deleted properly

1. Create 3 chats with messages
2. Open the chat list
3. Note the current number of chats
4. Tap the **trash icon** on one chat
5. ✅ **Expected**: Chat is removed from list
6. Chat count decreases by 1
7. If deleted chat was current, new chat is created
8. Close and reopen app
9. ✅ **Expected**: Deleted chat is still gone

### Test 5: Chat List Display

**Goal**: Verify chat list shows correct information

1. Create a chat and send: "What is the capital of France?"
2. Wait for response
3. Open chat list
4. ✅ **Expected**: See:
   - Preview: "What is the capital of France?"
   - Message count: 2 (your message + AI response)
   - Timestamp: "Hace X minutos" or similar
5. Create another chat and send more messages
6. Open chat list
7. ✅ **Expected**: Most recent chat appears at top

### Test 6: Message Count Accuracy

**Goal**: Verify message counts are correct

1. Create a new chat
2. Send 3 messages (wait for responses)
3. Open chat list
4. ✅ **Expected**: Message count shows "6 mensajes" (3 user + 3 AI)
5. Send 2 more messages
6. Reopen chat list
7. ✅ **Expected**: Message count shows "10 mensajes"

### Test 7: Timestamp Updates

**Goal**: Verify timestamps update correctly

1. Create a chat
2. Note the timestamp in chat list
3. Wait 1 minute
4. Send a message in that chat
5. Open chat list
6. ✅ **Expected**: Timestamp updated to reflect recent activity

### Test 8: Web Search Tool Persistence

**Goal**: Verify tool calls are saved and restored

1. Ensure "Búsqueda web" is enabled
2. Send: "¿Cuál es la temperatura actual en Madrid?"
3. Wait for AI response with web search tool
4. ✅ **Expected**: Tool call visible in chat
5. Close and reopen app
6. ✅ **Expected**: Tool call still visible with same data

### Test 9: Long Conversation

**Goal**: Verify performance with many messages

1. Create a new chat
2. Send 20+ messages (you can automate this in code if needed)
3. ✅ **Expected**: All messages load without lag
4. Scroll works smoothly
5. Close and reopen app
6. ✅ **Expected**: All messages still present

### Test 10: Empty Chat Handling

**Goal**: Verify empty chats are handled correctly

1. Create a new chat
2. **Don't send any messages**
3. Open chat list
4. ✅ **Expected**: Chat appears with "Nueva conversación" as preview
5. Message count: 0
6. Can delete the empty chat

### Test 11: Server-side ID Generation

**Goal**: Verify message IDs are consistent

1. Open developer console
2. Send a message
3. Log the message object
4. ✅ **Expected**: Message ID starts with "msg" (from server generator)
5. Close app, reopen
6. Check the same message
7. ✅ **Expected**: Same message ID

### Test 12: Optimized Request (Only Last Message)

**Goal**: Verify only last message is sent to API

1. Open developer tools network tab
2. Send first message
3. Send second message
4. Check the API request payload
5. ✅ **Expected**: Only the second message in request
6. Not the entire conversation history

### Test 13: Cross-Platform Consistency

**Goal**: Verify works on all platforms

**iOS**:

1. Run on iOS simulator/device
2. Execute Tests 1-5
3. ✅ **Expected**: All pass

**Android**:

1. Run on Android emulator/device
2. Execute Tests 1-5
3. ✅ **Expected**: All pass

**Web**:

1. Run in web browser
2. Execute Tests 1-5
3. ✅ **Expected**: All pass (with WASM SQLite)

### Test 14: User Isolation

**Goal**: Verify chats are user-specific

1. Login as User A
2. Create chats and send messages
3. Logout
4. Login as User B
5. ✅ **Expected**: No chats from User A visible
6. Create new chats as User B
7. Logout and login as User A
8. ✅ **Expected**: Original User A chats are back

### Test 15: Error Handling

**Goal**: Verify graceful error handling

**Database Error**:

1. Manually corrupt database (advanced)
2. ✅ **Expected**: App shows error, doesn't crash

**Network Error**:

1. Disable internet
2. Send a message
3. ✅ **Expected**: Error shown, but local messages persist

**Auth Error**:

1. Logout while in chat
2. ✅ **Expected**: Redirected to login, chats preserved

## Performance Testing

### Load Time Test

1. Create 10 chats
2. Add 50 messages to one chat
3. Open that chat
4. ✅ **Expected**: Loads in < 1 second

### Memory Test

1. Create 20 chats
2. Add 100 messages total
3. Switch between chats repeatedly
4. ✅ **Expected**: No memory leaks, smooth performance

### Database Size Test

1. Create 100 messages
2. Check database file size
3. ✅ **Expected**: Reasonable size (< 1MB for 100 messages)

## Automated Testing Script

Here's a simple test you can add to your test suite:

```typescript
import {
  initChatDatabase,
  createChat,
  saveChat,
  loadChat,
  deleteChat,
} from "@/lib/chat-store";

describe("Chat Persistence", () => {
  const userId = "test-user-123";

  beforeAll(async () => {
    await initChatDatabase();
  });

  it("should create and load a chat", async () => {
    const chatId = await createChat(userId);
    expect(chatId).toBeTruthy();

    const messages = [
      { id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] },
    ];

    await saveChat({ chatId, messages });
    const loaded = await loadChat(chatId);

    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("1");
  });

  it("should delete a chat", async () => {
    const chatId = await createChat(userId);
    await deleteChat(chatId);

    const loaded = await loadChat(chatId);
    expect(loaded).toHaveLength(0);
  });
});
```

## Bug Report Template

If you find issues, use this template:

```markdown
**Bug**: [Brief description]

**Steps to Reproduce**:

1.
2.
3.

**Expected Behavior**:

**Actual Behavior**:

**Platform**: iOS / Android / Web

**Error Messages**:
```

**Screenshots**:
[If applicable]

**Console Logs**:
\```
[Paste logs here]
\```

```

## Success Criteria

All tests should pass with:
- ✅ No crashes
- ✅ No data loss
- ✅ No console errors
- ✅ Smooth performance
- ✅ Correct UI updates
- ✅ Proper error handling

## Troubleshooting

### Issue: Messages not persisting
- Check console for database errors
- Verify `onFinish` callback is triggered
- Ensure `chatId` is set

### Issue: Chat list not updating
- Call `refreshChats()` explicitly
- Check that `userId` is available

### Issue: Slow performance
- Check database file size
- Verify indexes are created
- Check for memory leaks

### Issue: Web platform errors
- Verify metro config has WASM support
- Check COEP/COOP headers are set
- Test in a supported browser (Chrome, Edge)

## Next Steps After Testing

1. Document any bugs found
2. Create GitHub issues for bugs
3. Update documentation with any clarifications
4. Consider additional features based on user feedback
5. Monitor performance in production

## Continuous Testing

Add these to your CI/CD pipeline:
- Database initialization test
- CRUD operations test
- Type checking
- Build verification for all platforms
```
