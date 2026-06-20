"use server";

import { uploadAvatarToCloudinary } from "@/lib/cloudinary";
import { createClient } from "@/lib/supabase/server";
import { actionError, actionSuccess, type ActionResult } from "@/types/actions";

export async function uploadAvatarAction(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return actionError("Please choose an image to upload.");
  }

  const result = await uploadAvatarToCloudinary(file, user.id);
  if ("error" in result) {
    return actionError(result.error);
  }

  return actionSuccess({ url: result.url });
}