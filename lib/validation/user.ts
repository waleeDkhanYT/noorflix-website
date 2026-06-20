import { z } from "zod";
import { contentIdSchema, mediaTypeSchema } from "@/lib/server/validation/schemas";

export const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email("Enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.");

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be 30 characters or fewer.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores."
  );

export const optionalUsernameSchema = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === "" || usernameSchema.safeParse(value).success, {
    message: "Username can only contain letters, numbers, and underscores.",
  })
  .transform((value) => (value === "" ? undefined : value));

export const signUpInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: optionalUsernameSchema.optional(),
});

export const signInInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const profileUsernameSchema = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === "" || usernameSchema.safeParse(value).success, {
    message: "Username can only contain letters, numbers, and underscores.",
  })
  .transform((value) => (value === "" ? null : value));

export const updateProfileInputSchema = z.object({
  username: profileUsernameSchema.optional(),
  avatar_url: z.string().url().max(500).nullable().optional(),
});

export const watchlistItemPayloadSchema = z.object({
  id: contentIdSchema,
  mediaType: mediaTypeSchema,
  title: z.string().trim().min(1).max(300),
  posterUrl: z.string().max(500).nullable().optional(),
  addedAt: z.number().int().positive().optional(),
});

export const syncWatchlistInputSchema = z
  .array(watchlistItemPayloadSchema)
  .max(500);

export const watchlistMutationSchema = z.object({
  contentId: contentIdSchema,
  mediaType: mediaTypeSchema,
});

export const watchlistSyncPreferenceSchema = z.boolean();

export const themePreferenceSchema = z.enum(["light", "dark", "system"]);

export const preferredLanguageSchema = z
  .string()
  .trim()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Language must be a valid locale code.");

export const favoriteGenresSchema = z
  .array(z.number().int().positive())
  .max(20);

export const updatePreferencesInputSchema = z
  .object({
    favoriteGenres: favoriteGenresSchema.optional(),
    preferredLanguage: preferredLanguageSchema.optional(),
    themePreference: themePreferenceSchema.optional(),
    watchlistSyncEnabled: watchlistSyncPreferenceSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one preference field is required.",
  });

export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type SignInInput = z.infer<typeof signInInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
export type WatchlistItemPayloadInput = z.infer<typeof watchlistItemPayloadSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesInputSchema>;