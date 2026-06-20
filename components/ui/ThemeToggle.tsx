"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "size-10 rounded-xl bg-muted/50 animate-pulse",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className={cn(
          "!rounded-xl !text-foreground transition-colors",
          "hover:!bg-accent/60 dark:hover:!bg-white/10",
          className
        )}
        size="small"
      >
        {isDark ? (
          <Sun className="size-[18px]" strokeWidth={2} />
        ) : (
          <Moon className="size-[18px]" strokeWidth={2} />
        )}
      </IconButton>
    </Tooltip>
  );
}