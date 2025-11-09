# Onboarding Flow - Quick Reference

## 🚀 Quick Start

The onboarding flow is now live! Here's everything you need to know in 2 minutes.

## For Users

### First Time Opening App

1. Onboarding appears automatically
2. Go through 5 steps explaining CheckMe
3. Tap "Continuar" to proceed or "Finalizar" to complete
4. Or tap X to skip anytime
5. After completion → Welcome screen → Login

### Want to See It Again?

1. Open app and login
2. Go to **Profile** tab
3. Tap **"Ver Tutorial"** button
4. Confirm the alert
5. You'll be signed out and onboarding will show

## For Developers

### Files to Know

```
app/
├── onboarding.tsx          # Main onboarding screen
├── _layout.tsx             # Routes onboarding
└── welcome.tsx             # Redirects first-time users

hooks/
└── use-onboarding.ts       # State management hook

assets/images/onboarding/
├── onboarding-1.png        # Step images
├── onboarding-2.png
├── onboarding-3.png
├── onboarding-4.png
└── onboarding-5.png
```

### Key Functions

```typescript
// Check completion status
const { isOnboardingComplete } = useOnboarding();

// Reset to show again
const { resetOnboarding } = useOnboarding();
await resetOnboarding();

// Mark as complete
const { completeOnboarding } = useOnboarding();
await completeOnboarding();
```

### Clear State for Testing

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.removeItem("@onboarding_completed");
```

## Flow Diagram

```
┌─────────────────────────────────────┐
│         First Launch                │
│                                     │
│  App Opens                          │
│      ↓                              │
│  Check AsyncStorage                 │
│      ↓                              │
│  No flag found                      │
│      ↓                              │
│  Show Onboarding (5 steps)          │
│      ↓                              │
│  User completes/skips               │
│      ↓                              │
│  Save flag to storage               │
│      ↓                              │
│  Redirect to Welcome                │
│      ↓                              │
│  User continues to Login            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Subsequent Launches            │
│                                     │
│  App Opens                          │
│      ↓                              │
│  Check AsyncStorage                 │
│      ↓                              │
│  Flag found ✓                       │
│      ↓                              │
│  Show Welcome directly              │
│      ↓                              │
│  User continues to Login            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Re-trigger Flow               │
│                                     │
│  User in Profile                    │
│      ↓                              │
│  Tap "Ver Tutorial"                 │
│      ↓                              │
│  Confirm alert                      │
│      ↓                              │
│  Remove flag from storage           │
│      ↓                              │
│  Sign out user                      │
│      ↓                              │
│  Show Onboarding again              │
└─────────────────────────────────────┘
```

## Onboarding Content

| Step  | Title                            | Image               |
| ----- | -------------------------------- | ------------------- |
| Intro | Bienvenido a CheckMe             | onboarding-1.png    |
| 1     | Las noticias pueden ser confusas | onboarding-2.png    |
| 2     | Vos sos parte de la solución     | onboarding-3.png    |
| 3     | Verificamos cada detalle         | onboarding-4.png    |
| 4     | Tu aporte suma                   | onboarding-5.png    |
| 5     | ¡Empecemos juntos!               | (uses step 5 image) |

## Common Tasks

### Change Step Text

Edit `app/onboarding.tsx`:

```typescript
const onboardingSteps = [
  {
    step: 1,
    title: "Your new title",
    subtitle: "Your new subtitle",
  },
  // ...
];
```

### Change Images

Replace files in `assets/images/onboarding/` (keep same names)

### Change Colors

Edit `colors` prop in `app/onboarding.tsx`:

```typescript
colors={{
  background: {
    primary: "#FFFFFF",
    accent: "#007AFF",  // Change this
  },
  // ...
}}
```

### Add Analytics

```typescript
const handleComplete = async () => {
  analytics.track("onboarding_completed"); // Add this
  // ... rest of code
};
```

## Testing Commands

```bash
# Clear app data (iOS Simulator)
xcrun simctl erase all

# Clear app data (Android Emulator)
adb shell pm clear com.your.package

# Restart with cleared cache
npx expo start -c

# Check AsyncStorage (in app)
import AsyncStorage from '@react-native-async-storage/async-storage';
const value = await AsyncStorage.getItem('@onboarding_completed');
console.log('Onboarding complete:', value);
```

## Troubleshooting

| Problem                | Solution                            |
| ---------------------- | ----------------------------------- |
| Onboarding not showing | Clear AsyncStorage key              |
| Showing every time     | Check onComplete is saving          |
| Images not loading     | Verify file paths and restart metro |
| Button not working     | Check useOnboarding is imported     |

## Quick Checklist

Testing the implementation:

- [ ] Clear app data
- [ ] Open app → Onboarding shows
- [ ] Complete all steps → Welcome shows
- [ ] Close and reopen → Onboarding doesn't show
- [ ] Login
- [ ] Go to profile
- [ ] Tap "Ver Tutorial"
- [ ] Confirm → Onboarding shows again
- [ ] Test skip (X button)

## Dependencies

```json
{
  "@blazejkustra/react-native-onboarding": "latest",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

## Key Points

✅ Shows once on first launch  
✅ Can be skipped anytime  
✅ Saved in AsyncStorage  
✅ Can re-trigger from profile  
✅ 5 steps with custom images  
✅ All Spanish content  
✅ Smooth animations (400ms)  
✅ Redirects to welcome after

## Support

- **Full Docs**: `docs/ONBOARDING_IMPLEMENTATION.md`
- **Summary**: `docs/ONBOARDING_SUMMARY.md`
- **This Guide**: `docs/ONBOARDING_QUICK_REFERENCE.md`

## Status

✅ **Complete** - Ready for testing and deployment

---

**Need help?** Check the full documentation or review the implementation files.
