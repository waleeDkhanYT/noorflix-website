"use client";

import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  className?: string;
  size?: "sm" | "md";
};

export function UserAvatar({ className, size = "md" }: UserAvatarProps) {
  const dimension = size === "sm" ? 36 : 40;

  return (
    <Tooltip title="Sign in coming soon">
      <button
        type="button"
        aria-label="User account"
        className={cn(
          "rounded-full transition-transform hover:scale-105 active:scale-95",
          className
        )}
      >
        <Avatar
          sx={{
            width: dimension,
            height: dimension,
            bgcolor: "transparent",
            border: "1px solid",
            borderColor: "var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          <User
            className={size === "sm" ? "size-4" : "size-[18px]"}
            strokeWidth={2}
          />
        </Avatar>
      </button>
    </Tooltip>
  );
}