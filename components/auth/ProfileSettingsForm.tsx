"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatarAction } from "@/app/actions/avatar";
import { updateProfileAction } from "@/app/actions/auth";
import { getUserAvatarUrl, getUserDisplayName } from "@/lib/auth";
import { updateProfileInputSchema } from "@/lib/validation/user";
import {
  selectAuthProfile,
  selectAuthUser,
  setProfile,
} from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function ProfileSettingsForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectAuthProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(profile?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    getUserAvatarUrl(profile)
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUsername(profile?.username ?? "");
    setAvatarUrl(getUserAvatarUrl(profile));
  }, [profile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayName = getUserDisplayName(user, profile);
  const shownAvatarUrl = removeAvatar ? null : previewUrl ?? avatarUrl;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be 5 MB or smaller.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveAvatar(false);
  };

  const handleRemoveAvatar = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPendingFile(null);
    setPreviewUrl(null);
    setRemoveAvatar(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let nextAvatarUrl: string | null | undefined = undefined;

      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);

        const uploadResult = await uploadAvatarAction(formData);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        nextAvatarUrl = uploadResult.data.url;
      } else if (removeAvatar) {
        nextAvatarUrl = null;
      }

      const validated = updateProfileInputSchema.safeParse({
        username,
        ...(nextAvatarUrl !== undefined ? { avatar_url: nextAvatarUrl } : {}),
      });

      if (!validated.success) {
        throw new Error(
          validated.error.issues[0]?.message ?? "Invalid profile details."
        );
      }

      const profileResult = await updateProfileAction(validated.data);
      if (!profileResult.success) {
        throw new Error(profileResult.error);
      }

      dispatch(setProfile(profileResult.data));
      setAvatarUrl(profileResult.data.avatar_url);
      setPendingFile(null);
      setRemoveAvatar(false);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative">
          <Avatar
            src={shownAvatarUrl ?? undefined}
            alt={displayName}
            sx={{
              width: 96,
              height: 96,
              bgcolor: "var(--primary)",
              color: "var(--primary-foreground)",
              fontSize: 32,
              fontWeight: 600,
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            aria-label="Change avatar"
            className={cn(
              "absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full",
              "border border-border/80 bg-background text-foreground shadow-sm",
              "transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
              "dark:border-white/10 dark:bg-card dark:hover:bg-white/10"
            )}
          >
            <Camera className="size-4" strokeWidth={2} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-medium">Profile photo</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Upload a square image (JPEG, PNG, WebP, or GIF). Max 5 MB.
          </p>
          {(shownAvatarUrl || avatarUrl) && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-sm text-destructive transition-colors hover:text-destructive/80 disabled:opacity-60"
            >
              <Trash2 className="size-3.5" strokeWidth={2} />
              Remove photo
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="profile-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={user?.email ?? ""}
          disabled
          className={cn(
            "w-full rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground",
            "dark:border-white/10 dark:bg-white/5"
          )}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="profile-username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="profile-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={cn(
            "w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm",
            "outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
            "dark:border-white/10 dark:bg-white/5"
          )}
          placeholder="cinephile_42"
        />
        <p className="text-xs text-muted-foreground">
          3–30 characters. Letters, numbers, and underscores only.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground",
          "transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Save changes
      </button>
    </form>
  );
}