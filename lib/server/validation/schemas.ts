import { z } from "zod";

export const contentIdSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(2_147_483_647);

export const mediaTypeSchema = z.enum(["movie", "tv", "anime"]);

export const detailMediaTypeSchema = z.enum(["movie", "tv"]);

export const pageSchema = z.coerce.number().int().min(1).max(500).default(1);

export const searchQuerySchema = z
  .string()
  .trim()
  .min(1, "Search query is required.")
  .max(200, "Search query is too long.");

const TMDB_APPEND_PARTS = [
  "videos",
  "credits",
  "recommendations",
  "external_ids",
] as const;

const TMDB_SORT_VALUES = [
  "popularity.asc",
  "popularity.desc",
  "vote_average.asc",
  "vote_average.desc",
  "primary_release_date.asc",
  "primary_release_date.desc",
  "first_air_date.asc",
  "first_air_date.desc",
] as const;

const dateFilterSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD.");

const genreListSchema = z
  .string()
  .regex(/^\d+(,\d+)*$/, "Genres must be comma-separated numeric IDs.")
  .max(120);

export const tmdbQuerySchema = z
  .object({
    page: pageSchema.optional(),
    query: searchQuerySchema.optional(),
    append_to_response: z
      .string()
      .max(120)
      .refine(
        (value) => {
          const parts = value.split(",").map((part) => part.trim());
          return (
            parts.length > 0 &&
            parts.every((part) =>
              TMDB_APPEND_PARTS.includes(
                part as (typeof TMDB_APPEND_PARTS)[number]
              )
            )
          );
        },
        { message: "append_to_response contains unsupported values." }
      )
      .optional(),
    sort_by: z.enum(TMDB_SORT_VALUES).optional(),
    with_genres: genreListSchema.optional(),
    with_original_language: z
      .string()
      .regex(/^[a-z]{2}$/)
      .optional(),
    "primary_release_date.gte": dateFilterSchema.optional(),
    "primary_release_date.lte": dateFilterSchema.optional(),
    "first_air_date.gte": dateFilterSchema.optional(),
    "first_air_date.lte": dateFilterSchema.optional(),
    include_adult: z.enum(["true", "false"]).optional(),
    language: z
      .string()
      .regex(/^[a-z]{2}(-[A-Z]{2})?$/)
      .optional(),
  })
  .strict();

export const watchmodeQuerySchema = z
  .object({
    search_value: searchQuerySchema.optional(),
    search_type: z.coerce.number().int().min(1).max(5).optional(),
    page: pageSchema.optional(),
    regions: z
      .string()
      .regex(/^[A-Z]{2}(,[A-Z]{2})*$/)
      .optional(),
  })
  .strict();

export const imdbIdSchema = z
  .string()
  .trim()
  .regex(/^tt\d{7,}$/, "Invalid IMDb ID format.");

export const omdbQuerySchema = z
  .object({
    i: imdbIdSchema.optional(),
    t: z.string().trim().min(1).max(200).optional(),
    y: z
      .string()
      .trim()
      .regex(/^\d{4}$/)
      .optional(),
    plot: z.enum(["short", "full"]).default("short"),
  })
  .strict()
  .refine((value) => Boolean(value.i) || Boolean(value.t), {
    message: "Either i (IMDb ID) or t (title) is required.",
  });

export const batchRatingItemSchema = z.object({
  id: contentIdSchema,
  mediaType: detailMediaTypeSchema,
  title: z.string().trim().min(1).max(300),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/)
    .optional(),
});

export const batchRatingsBodySchema = z.object({
  items: z.array(batchRatingItemSchema).max(24).default([]),
});

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function pickSearchParams(
  searchParams: URLSearchParams,
  allowedKeys: readonly string[]
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key of allowedKeys) {
    const value = searchParams.get(key);
    if (value !== null) {
      result[key] = value;
    }
  }

  return result;
}

export const TMDB_QUERY_KEYS = [
  "page",
  "query",
  "append_to_response",
  "sort_by",
  "with_genres",
  "with_original_language",
  "primary_release_date.gte",
  "primary_release_date.lte",
  "first_air_date.gte",
  "first_air_date.lte",
  "include_adult",
  "language",
] as const;

export const WATCHMODE_QUERY_KEYS = [
  "search_value",
  "search_type",
  "page",
  "regions",
] as const;

export const BLOCKED_UPSTREAM_QUERY_KEYS = new Set([
  "api_key",
  "apikey",
  "apiKey",
  "key",
  "token",
]);