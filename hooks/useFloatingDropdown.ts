"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export type FloatingDropdownPosition = {
  top: number;
  left: number;
  width: number;
};

export function useFloatingDropdown(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  align: "start" | "end" = "start"
) {
  const [position, setPosition] = useState<FloatingDropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = rect.width;

    setPosition({
      top: rect.bottom + 8,
      left: align === "end" ? rect.right - width : rect.left,
      width,
    });
  }, [align, triggerRef]);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  return position;
}