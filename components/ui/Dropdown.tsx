"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useFloatingDropdown } from "@/hooks/useFloatingDropdown";
import { cn } from "@/lib/utils";

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
};

export type DropdownProps<T extends string = string> = {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  align?: "start" | "end";
  fullWidth?: boolean;
};

export function Dropdown<T extends string = string>({
  value,
  onChange,
  options,
  label,
  placeholder = "Select…",
  id: idProp,
  className,
  triggerClassName,
  disabled = false,
  align = "start",
  fullWidth = true,
}: DropdownProps<T>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const position = useFloatingDropdown(open, triggerRef, align);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const close = useCallback(() => {
    setOpen(false);
    setHighlightIndex(-1);
  }, []);

  const selectOption = useCallback(
    (optionValue: T) => {
      onChange(optionValue);
      close();
    },
    [close, onChange]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((current) =>
          current < options.length - 1 ? current + 1 : 0
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((current) =>
          current > 0 ? current - 1 : options.length - 1
        );
        return;
      }

      if (event.key === "Enter" && highlightIndex >= 0) {
        event.preventDefault();
        selectOption(options[highlightIndex].value);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, highlightIndex, open, options, selectOption]);

  useEffect(() => {
    if (open) {
      const selectedIndex = options.findIndex((option) => option.value === value);
      setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, options, value]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
          }}
          className={cn(
            "fixed z-[120] overflow-hidden rounded-xl",
            "glass-panel shadow-[var(--shadow-soft)]",
            "dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
          )}
        >
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label ?? placeholder}
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightIndex;

              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => selectOption(option.value)}
                    className={cn(
                      "flex w-full min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      "touch-manipulation",
                      isSelected
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground",
                      isHighlighted &&
                        !isSelected &&
                        "bg-accent dark:bg-white/5",
                      !isSelected &&
                        !isHighlighted &&
                        "hover:bg-accent dark:hover:bg-white/5"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.description && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <Check
                        className="size-4 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        fullWidth ? "w-full" : "w-auto",
        className
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-medium text-muted-foreground"
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
        }}
        className={cn(
          "group inline-flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium",
          "border-border/70 bg-card/80 text-foreground shadow-[var(--shadow-soft)] backdrop-blur-md",
          "transition-all duration-200",
          "hover:border-primary/25 hover:bg-card",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
          fullWidth && "w-full",
          open && "border-primary/30 ring-2 ring-primary/10 dark:border-primary/40",
          triggerClassName
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !selectedOption && "text-muted-foreground"
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
        >
          <ChevronDown className="size-4" strokeWidth={2} />
        </motion.span>
      </button>

      {mounted && createPortal(menu, document.body)}
    </div>
  );
}