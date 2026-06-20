export interface WatchmodeTitle {
  id: number;
  title: string;
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: "movie" | "tv";
  type: "movie" | "tv_series";
  plot_overview: string;
  poster: string;
  backdrop: string;
  genre_names: string[];
  user_rating: number;
  critic_score: number;
  us_rating: string;
  relevance_percentile: number;
}

export interface WatchmodeSource {
  source_id: number;
  name: string;
  type: string;
  region: string;
  web_url: string;
  ios_url: string;
  android_url: string;
  format: string;
  price: number | null;
  seasons: number;
  episodes: number;
}

export interface WatchmodeSearchResponse {
  titles: WatchmodeTitle[];
  page: number;
  total_pages: number;
  total_results: number;
}