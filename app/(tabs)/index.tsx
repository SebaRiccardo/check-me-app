
import { StyleSheet } from 'react-native'


import SignOutButton from '@/components/sign-out-button'
import { useAuthContext } from '@/hooks/use-auth-context'
import { View } from 'lucide-react-native'

export default function HomeScreen() {
  const { profile } = useAuthContext()

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SignOutButton />
    </View>
  )
}

