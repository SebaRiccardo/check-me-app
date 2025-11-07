import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import { Newspaper, User, ShieldCheck, Users } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#3B9EF3' : '#1DA1F2',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#71767B' : '#536471',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#2F3336' : '#E7E9EA',
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Noticias',
          tabBarIcon: ({ color, size }) => (
            <Newspaper color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="verify"
        options={{
          title: 'Verificar',
          tabBarIcon: ({ color, size }) => (
            <ShieldCheck color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
