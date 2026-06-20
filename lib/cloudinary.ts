import "server-only";

import { createHash } from "node:crypto";
import {
  getCloudinaryApiKey,
  getCloudinaryApiSecret,
  getCloudinaryCloudName,
} from "@/lib/env";

const ALLOWED_AVATAR_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export function isAllowedCloudinaryAvatarUrl(url: string | null): boolean {
  if (url === null) return true;

  const cloudName = getCloudinaryCloudName();
  if (!cloudName) return false;

  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_AVATAR_MIME_TYPES.has(file.type)) {
    return "Avatar must be a JPEG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return "Avatar must be 5 MB or smaller.";
  }

  return null;
}

function createCloudinarySignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${signatureBase}${apiSecret}`)
    .digest("hex");
}

export async function uploadAvatarToCloudinary(
  file: File,
  userId: string
): Promise<{ url: string } | { error: string }> {
  const cloudName = getCloudinaryCloudName();
  const apiKey = getCloudinaryApiKey();
  const apiSecret = getCloudinaryApiSecret();

  if (!cloudName || !apiKey || !apiSecret) {
    return { error: "Avatar uploads are not configured." };
  }

  const validationError = validateAvatarFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const timestamp = Math.round(Date.now() / 1000).toString();
  const signedParams = {
    folder: "noorflix/avatars",
    invalidate: "true",
    overwrite: "true",
    public_id: userId,
    timestamp,
  };
  const signature = createCloudinarySignature(signedParams, apiSecret);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", signedParams.folder);
  formData.append("public_id", signedParams.public_id);
  formData.append("overwrite", signedParams.overwrite);
  formData.append("invalidate", signedParams.invalidate);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !payload.secure_url) {
    return {
      error: payload.error?.message ?? "Failed to upload avatar.",
    };
  }

  return { url: payload.secure_url };
}