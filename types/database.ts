export type MediaType = "movie" | "tv" | "anime";
export type ThemePreference = "light" | "dark" | "system";

export const DB_TABLES = {
  profiles: "profiles",
  userPreferences: "user_preferences",
  watchlists: "watchlists",
} as const;

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserPreferences = {
  user_id: string;
  favorite_genres: number[];
  preferred_language: string;
  theme_preference: ThemePreference;
  watchlist_sync_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type WatchlistRow = {
  id: string;
  user_id: string;
  content_id: string;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
  added_at: string;
};

export type WatchlistInsert = Pick<
  WatchlistRow,
  "content_id" | "media_type" | "title" | "poster_path"
> &
  Partial<Pick<WatchlistRow, "added_at">>;

export type ProfileUpdate = Partial<
  Pick<Profile, "username" | "avatar_url">
>;

export type UserPreferencesUpdate = Partial<
  Pick<
    UserPreferences,
    | "favorite_genres"
    | "preferred_language"
    | "theme_preference"
    | "watchlist_sync_enabled"
  >
>;

export type WatchlistUpdate = Partial<WatchlistInsert>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Pick<Profile, "id"> & Partial<Pick<Profile, "username" | "avatar_url">>;
        Update: ProfileUpdate;
        Relationships: [];
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Pick<UserPreferences, "user_id"> &
          Partial<
            Pick<
              UserPreferences,
              | "favorite_genres"
              | "preferred_language"
              | "theme_preference"
              | "watchlist_sync_enabled"
            >
          >;
        Update: UserPreferencesUpdate;
        Relationships: [];
      };
      watchlists: {
        Row: WatchlistRow;
        Insert: WatchlistInsert & { user_id: string };
        Update: WatchlistUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};