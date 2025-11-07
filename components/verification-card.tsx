import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Verification } from '@/types/verification';
import { Calendar, User } from 'lucide-react-native';
import { Image, View } from 'react-native';

type VerificationCardProps = {
  verification: Verification;
};

export function VerificationCard({ verification }: VerificationCardProps) {
  const formattedDate = new Date(verification.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="mx-4 mb-4">
      {verification.image_url && (
        <Image
          source={{ uri: verification.image_url }}
          style={{ width: '100%', height: 192 }}
          resizeMode="cover"
        />
      )}
      <CardContent className="p-4">
        {/* Category Badge */}
        <View className="flex-row items-center mb-2">
          <View className="bg-primary/10 rounded-full px-3 py-1">
            <Text className="text-xs font-semibold text-primary">
              {verification.category}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-lg font-bold text-card-foreground mb-2">
          {verification.title}
        </Text>

        {/* Description */}
        <Text className="text-sm text-muted-foreground mb-3 leading-5" numberOfLines={3}>
          {verification.description}
        </Text>

        {/* Footer Info */}
        <View className="flex-row items-center justify-between pt-3 border-t border-border">
          <View className="flex-row items-center">
            <Icon as={User} size={14} className="text-muted-foreground mr-1" />
            <Text className="text-xs text-muted-foreground">
              Verificado por la comunidad
            </Text>
          </View>
          <View className="flex-row items-center">
            <Icon as={Calendar} size={14} className="text-muted-foreground mr-1" />
            <Text className="text-xs text-muted-foreground">{formattedDate}</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
