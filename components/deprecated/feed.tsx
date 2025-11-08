import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useNewsQuery } from "@/hooks/use-news-query";
import type { NewsArticle } from "@/types/news";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  View,
  Pressable,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function NewsCard({ article }: { article: NewsArticle }) {
  const handlePress = () => {
    if (article.link) {
      Linking.openURL(article.link);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Card className="mx-4 mb-4">
        {article.image_url && (
          <Image
            source={{ uri: article.image_url }}
            className="h-48 w-full rounded-t-lg"
            resizeMode="cover"
          />
        )}
        <CardContent className="p-4">
          <View className="mb-2 flex-row items-center">
            <Text className="text-xs font-semibold text-primary">
              {article.source_name}
            </Text>
            {article.pubDate && (
              <>
                <Text className="mx-2 text-xs text-muted-foreground">•</Text>
                <Text className="text-xs text-muted-foreground">
                  {new Date(article.pubDate).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>

          <CardTitle className="mb-2 text-base text-card-foreground">
            {article.title}
          </CardTitle>

          {article.description && (
            <CardDescription className="text-sm leading-5" numberOfLines={3}>
              {article.description}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
}

function LoadingFooter() {
  return (
    <View className="items-center py-4">
      <ActivityIndicator size="small" />
    </View>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-base text-muted-foreground">
        No se encontraron noticias. Desliza para actualizar.
      </Text>
    </View>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="mb-2 text-center text-base text-destructive">
        Error al cargar las noticias
      </Text>
      <Text className="text-center text-sm text-muted-foreground">
        {error.message}
      </Text>
    </View>
  );
}

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useNewsQuery();

  const articles = data?.pages.flatMap((page) => page.results) ?? [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <ErrorState error={error as Error} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="border-b border-border bg-card px-6 pb-2"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-3xl font-bold text-foreground">Noticias</Text>
      </View>

      {/* News List */}
      <FlashList
        data={articles}
        renderItem={({ item }: { item: NewsArticle }) => (
          <NewsCard article={item} />
        )}
        keyExtractor={(item: NewsArticle) => item.article_id}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <LoadingFooter /> : null}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}
