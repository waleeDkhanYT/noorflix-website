"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAccountAction } from "@/app/actions/auth";
import { clearUserLocalData } from "@/lib/user-local-data";
import { clearAuth } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!open) return null;

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);

    try {
      const result = await deleteAccountAction();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      dispatch(clearAuth());
      clearUserLocalData();
      toast.success("Account deleted");
      onClose();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border/70 bg-card p-6 shadow-xl dark:border-white/10">
        <h2 id="delete-account-title" className="text-lg font-semibold">
          Delete account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This permanently deletes your account, watchlist, and preferences from
          our servers. This action cannot be undone.
        </p>

        <label className="mt-4 block text-sm font-medium" htmlFor="delete-confirm">
          Type <span className="font-mono text-foreground">DELETE</span> to confirm
        </label>
        <input
          id="delete-confirm"
          type="text"
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          className={cn(
            "mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm",
            "outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
            "dark:border-white/10 dark:bg-white/5"
          )}
          autoComplete="off"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white",
              "transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}