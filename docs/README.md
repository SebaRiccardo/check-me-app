# Check Me App

A modern React Native app built with Expo, Supabase, and TanStack Query featuring authentication, news feed, and user profiles.

## 🚀 Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Backend**: Supabase (Auth, Database)
- **Data Fetching**: TanStack Query with AsyncStorage persistence
- **UI Library**: Custom components with NativeWind (Tailwind CSS)
- **Navigation**: Expo Router (file-based routing)
- **Icons**: Lucide React Native

## 📱 Features

- **Authentication**: Email/password sign-in and sign-up with Supabase Auth
- **News Feed**: Real-time news from Newsdata.io API with infinite scroll and pull-to-refresh
- **Profile**: User profile with avatar, email, and sign-out functionality
- **Offline Support**: TanStack Query with AsyncStorage for caching and offline access
- **Dark Mode**: Full dark mode support with theme switcher

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Expo CLI
- Supabase account

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Supabase**
   - Create a new project at [Supabase](https://supabase.com)
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key to `.env`

3. **Run the development server**
   ```bash
   pnpm dev
   ```

This will start the Expo Dev Server. Open the app in:

- **iOS**: press `i` to launch in the iOS simulator _(Mac only)_
- **Android**: press `a` to launch in the Android emulator
- **Web**: press `w` to run in a browser

You can also scan the QR code using the [Expo Go](https://expo.dev/go) app on your device.

## 📂 Project Structure

```
check-me-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── feed.tsx       # News feed screen
│   │   ├── profile.tsx    # Profile screen
│   │   └── _layout.tsx    # Tab layout
│   ├── _layout.tsx        # Root layout
│   ├── login.tsx          # Authentication screen
│   └── index.tsx          # Entry point
├── components/            # Reusable components
│   └── ui/               # UI primitives
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configs
├── providers/           # React context providers
├── types/              # TypeScript type definitions
└── global.css         # Global styles and theme variables
```

## 🔐 Authentication Flow

1. User opens app → Redirected to login screen if not authenticated
2. User signs in/up with email and password
3. Supabase handles authentication and session management
4. On success → Redirected to feed screen
5. Auth state persisted via SecureStore (mobile) or localStorage (web)

## Adding components

You can add more reusable components using the CLI:

```bash
npx react-native-reusables/cli@latest add [...components]
```

> e.g. `npx react-native-reusables/cli@latest add input textarea`

If you don't specify any component names, you'll be prompted to select which components to add interactively. Use the `--all` flag to install all available components at once.

## Project Features

- ⚛️ Built with [Expo Router](https://expo.dev/router)
- 🎨 Styled with [Tailwind CSS](https://tailwindcss.com/) via [Nativewind](https://www.nativewind.dev/)
- 📦 UI powered by [React Native Reusables](https://github.com/founded-labs/react-native-reusables)
- 🔐 Authentication with [Supabase](https://supabase.com)
- 📊 Data fetching with [TanStack Query](https://tanstack.com/query)
- 🚀 New Architecture enabled
- 🔥 Edge to Edge enabled
- 📱 Runs on iOS, Android, and Web

## Learn More

To dive deeper into the technologies used:

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Nativewind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)

## Deploy with EAS

The easiest way to deploy your app is with [Expo Application Services (EAS)](https://expo.dev/eas).

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Updates](https://docs.expo.dev/eas-update/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

---

If you enjoy using React Native Reusables, please consider giving it a ⭐ on [GitHub](https://github.com/founded-labs/react-native-reusables). Your support means a lot!
