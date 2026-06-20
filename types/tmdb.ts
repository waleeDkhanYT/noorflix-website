export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv" | "person";
  genre_ids?: number[];
  popularity: number;
  original_language: string;
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMedia {
  genres: TMDBGenre[];
  runtime: number;
  status: string;
  tagline: string;
  imdb_id?: string;
}

export interface TMDBTVDetails extends TMDBMedia {
  genres: TMDBGenre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
}