export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string | null;
  pubDate: string;
  source_id: string;
  source_name: string;
  source_url: string;
  source_icon: string | null;
  source_priority: number;
  country: string[];
  category: string[];
  language: string;
  image_url: string | null;
  creator: string[] | null;
  content: string | null;
  keywords: string[] | null;
  video_url: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage: string | null;
}
