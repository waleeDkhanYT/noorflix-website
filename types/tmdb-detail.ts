import type { TMDBGenre, TMDBMedia } from "./tmdb";

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBVideosResponse {
  results: TMDBVideo[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBRecommendations {
  results: TMDBMedia[];
}

export interface TMDBExternalIds {
  imdb_id?: string | null;
}

export interface TMDBMovieDetailsFull {
  id: number;
  title: string;
  overview: string;
  tagline: string;
  status: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  budget: number;
  revenue: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: TMDBGenre[];
  imdb_id?: string;
  videos: TMDBVideosResponse;
  credits: TMDBCredits;
  recommendations: TMDBRecommendations;
  external_ids?: TMDBExternalIds;
}

export interface TMDBTVDetailsFull {
  id: number;
  name: string;
  overview: string;
  tagline: string;
  status: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language?: string;
  genres: TMDBGenre[];
  videos: TMDBVideosResponse;
  credits: TMDBCredits;
  recommendations: TMDBRecommendations;
  external_ids?: TMDBExternalIds;
}

export type DetailMediaType = "movie" | "tv";