import { useInfiniteQuery } from "@tanstack/react-query";
import type { NewsResponse } from "@/types/news";

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWSDATAIO_API_KEY!;
const NEWS_API_URL = "https://newsdata.io/api/1/latest";
console.log(process.env.EXPO_PUBLIC_NEWSDATAIO_API_KEY);
async function fetchNews(pageParam?: string): Promise<NewsResponse> {
  const url = new URL(NEWS_API_URL);
  url.searchParams.append("apikey", NEWS_API_KEY);
  url.searchParams.append("country", "ar");
  url.searchParams.append("language", "es");

  if (pageParam) {
    url.searchParams.append("page", pageParam);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
}

export function useNewsQuery() {
  return useInfiniteQuery({
    queryKey: ["news"],
    queryFn: ({ pageParam }) => fetchNews(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
