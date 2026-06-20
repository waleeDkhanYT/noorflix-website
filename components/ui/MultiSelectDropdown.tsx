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

export type MultiSelectOption<T extends string | number = number> = {
  value: T;
  label: string;
};

export type MultiSelectDropdownProps<T extends string | number = number> = {
  values: T[];
  onChange: (values: T[]) => void;
  options: MultiSelectOption<T>[];
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  errorLabel?: string;
  fullWidth?: boolean;
};

export function MultiSelectDropdown<T extends string | number = number>({
  values,
  onChange,
  options,
  label,
  placeholder = "Select options",
  emptyLabel = "No options",
  id: idProp,
  className,
  disabled = false,
  loading = false,
  loadingLabel = "Loading…",
  errorLabel,
  fullWidth = true,
}: MultiSelectDropdownProps<T>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const position = useFloatingDropdown(open, triggerRef, "start");

  const selectedLabels = useMemo(() => {
    const labelMap = new Map(options.map((option) => [option.value, option.label]));
    return values
      .map((value) => labelMap.get(value))
      .filter((value): value is string => Boolean(value));
  }, [options, values]);

  const triggerLabel = useMemo(() => {
    if (loading) return loadingLabel;
    if (errorLabel) return errorLabel;
    if (selectedLabels.length === 0) return placeholder;
    if (selectedLabels.length === 1) return selectedLabels[0];
    if (selectedLabels.length === 2) {
      return `${selectedLabels[0]}, ${selectedLabels[1]}`;
    }
    return `${selectedLabels.length} selected`;
  }, [errorLabel, loading, loadingLabel, placeholder, selectedLabels]);

  const close = useCallback(() => setOpen(false), []);

  const toggleValue = useCallback(
    (optionValue: T) => {
      const next = values.includes(optionValue)
        ? values.filter((value) => value !== optionValue)
        : [...values, optionValue];
      onChange(next);
    },
    [onChange, values]
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
  }, [close, open]);

  const isDisabled = disabled || loading || Boolean(errorLabel);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menu = (
    <AnimatePresence>
      {open && !loading && !errorLabel && (
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
            aria-multiselectable="true"
            aria-label={label ?? placeholder}
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-muted-foreground">
                {emptyLabel}
              </li>
            ) : (
              options.map((option) => {
                const isSelected = values.includes(option.value);

                return (
                  <li key={String(option.value)} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleValue(option.value)}
                      className={cn(
                        "flex w-full min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        "touch-manipulation",
                        isSelected
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-foreground hover:bg-accent dark:hover:bg-white/5"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/80 dark:border-white/15"
                        )}
                      >
                        {isSelected && (
                          <Check className="size-3" strokeWidth={3} />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative", fullWidth ? "w-full" : "w-auto", className)}
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
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (isDisabled) return;
          setOpen((current) => !current);
        }}
        className={cn(
          "group inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium",
          "border-border/70 bg-card/80 text-foreground shadow-[var(--shadow-soft)] backdrop-blur-md",
          "transition-all duration-200",
          "hover:border-primary/25 hover:bg-card",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
          open && "border-primary/30 ring-2 ring-primary/10 dark:border-primary/40",
          values.length > 0 && !loading && !errorLabel && "text-foreground"
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            values.length === 0 && !loading && !errorLabel && "text-muted-foreground"
          )}
        >
          {triggerLabel}
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