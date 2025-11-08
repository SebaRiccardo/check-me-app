import "@/lib/polyfills";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tabs, useRouter } from "expo-router";
import {
  Newspaper,
  User,
  ShieldCheck,
  Users,
  UserRound,
  BotMessageSquare,
  Plus,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === "dark" ? "#3B9EF3" : "#1DA1F2",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#71767B" : "#536471",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
          borderTopColor: colorScheme === "dark" ? "#2F3336" : "#E7E9EA",
          borderTopWidth: 1,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Comunidad",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="verify"
        options={{
          title: "Verificar",
          tabBarIcon: ({ color, size }) => (
            <ShieldCheck color={color} size={size} />
          ),
        }}
      />

      {/* Center Button - Hidden from tab bar */}
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: () => (
            <Pressable
              onPress={() => router.push("/create-verification")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: -20,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor:
                    colorScheme === "dark" ? "#1DA1F2" : "#1DA1F2",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 8,
                }}
              >
                <Plus color="#FFFFFF" size={28} />
              </View>
            </Pressable>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <BotMessageSquare color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <UserRound color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
