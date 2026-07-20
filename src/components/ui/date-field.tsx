"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseISO(s?: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function pretty(s: string): string {
  const d = parseISO(s);
  if (!d) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

/**
 * Custom date picker that never shows or allows past dates: days before `min`
 * are disabled and the calendar cannot navigate to a month before min's month.
 * Controlled via value/onChange so it plugs into react-hook-form.
 */
export function DateField({
  value,
  onChange,
  min,
  placeholder = "Select date",
  ariaLabel,
  className,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  placeholder?: string;
  ariaLabel?: string;
  /** Trigger button styling; defaults to the standard input look. */
  className?: string;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const selected = parseISO(value);
  const minDate = min ? parseISO(min) : null;

  const openPicker = () => {
    const base = selected ?? minDate ?? new Date();
    setView(monthStart(base));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cells = useMemo(() => {
    if (!view) return [];
    const first = monthStart(view);
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      out.push(new Date(view.getFullYear(), view.getMonth(), d));
    }
    return out;
  }, [view]);

  const canPrev =
    !!view &&
    (!minDate ||
      view.getFullYear() > minDate.getFullYear() ||
      (view.getFullYear() === minDate.getFullYear() && view.getMonth() > minDate.getMonth()));

  const disabled = (d: Date) => (minDate ? dayStart(d) < dayStart(minDate) : false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={cn(
          "flex cursor-pointer items-center justify-between text-left outline-none transition-colors duration-300 ease-brand",
          className ??
            "box-border w-full rounded-sm border bg-paper px-3.5 py-3 font-lato text-[14px]",
          invalid ? "border-brand" : "border-brand/30",
          value ? "text-ink" : "text-ink/40",
        )}
      >
        <span>{value ? pretty(value) : placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
          className="shrink-0 text-ink/50"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" />
        </svg>
      </button>

      {open && view && (
        <div className="absolute left-0 z-30 mt-2 w-[17rem] max-w-[calc(100vw-2.5rem)] rounded-md border border-brand/25 bg-paper p-3 shadow-[0_16px_40px_rgba(30,31,34,0.12)]">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors duration-300 ease-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-25"
            >
              ←
            </button>
            <span className="font-montserrat text-[12px] uppercase tracking-[0.15em] text-ink">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors duration-300 ease-brand hover:text-brand"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DOW.map((d) => (
              <div
                key={d}
                className="flex h-8 items-center justify-center font-montserrat text-[10px] uppercase text-ink/40"
              >
                {d}
              </div>
            ))}
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  disabled={disabled(d)}
                  onClick={() => {
                    onChange(toISO(d));
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-sm font-lato text-[13px] transition-colors duration-300 ease-brand",
                    selected && toISO(d) === toISO(selected)
                      ? "bg-brand text-paper"
                      : disabled(d)
                        ? "cursor-not-allowed text-ink/20"
                        : "cursor-pointer text-ink hover:bg-mist",
                  )}
                >
                  {d.getDate()}
                </button>
              ) : (
                <div key={i} className="h-8" />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
