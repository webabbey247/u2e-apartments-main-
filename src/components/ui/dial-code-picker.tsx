"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DialCode } from "@/lib/dial-codes";
import { cn } from "@/lib/utils/cn";

function Flag({ iso, className }: { iso: string; className?: string }) {
  // Plain <img>: tiny remote flag sprites, not worth next/image optimisation.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      width={20}
      height={15}
      loading="lazy"
      alt=""
      className={cn("h-[15px] w-[20px] shrink-0 rounded-[2px] object-cover", className)}
    />
  );
}

/**
 * Searchable dial-code picker with country flags. Designed to sit inside the
 * Contact Phone field's shared border (borderless trigger + right divider).
 */
export function DialCodePicker({
  value,
  onChange,
  codes,
  loading,
}: {
  value: string;
  onChange: (dialCode: string, iso: string) => void;
  codes: DialCode[];
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [iso, setIso] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Displayed country: the locally chosen iso, else the first match on value.
  const selected = useMemo(() => {
    if (iso) return codes.find((c) => c.iso === iso) ?? null;
    return codes.find((c) => c.dialCode === value) ?? null;
  }, [codes, iso, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return codes;
    return codes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso.toLowerCase().includes(q),
    );
  }, [codes, query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const pick = (c: DialCode) => {
    setIso(c.iso);
    onChange(c.dialCode, c.iso);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="Dial code"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-full items-center gap-1.5 border-r border-brand/20 px-3 py-3 font-lato text-[14px] text-ink outline-none"
      >
        {selected ? <Flag iso={selected.iso} /> : <span className="text-[13px]">🏳️</span>}
        <span>{value || (loading ? "…" : "+")}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
          className={cn(
            "text-ink/50 transition-transform duration-300 ease-brand",
            open && "rotate-180",
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[300px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-md border border-brand/25 bg-paper shadow-[0_16px_40px_rgba(30,31,34,0.12)]">
          <div className="border-b border-brand/10 p-2">
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered[0]) {
                  e.preventDefault();
                  pick(filtered[0]);
                }
              }}
              placeholder="Search country or code"
              className="w-full rounded-sm border border-brand/15 bg-mist px-3 py-2 font-lato text-[13px] text-ink outline-none placeholder:text-ink/40"
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto py-1">
            {loading ? (
              <div className="px-3 py-2 font-lato text-[13px] text-ink/50">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-2 font-lato text-[13px] text-ink/50">No matches</div>
            ) : (
              filtered.map((c) => {
                const active = selected?.iso === c.iso && selected?.dialCode === c.dialCode;
                return (
                  <button
                    key={c.iso + c.dialCode}
                    type="button"
                    onClick={() => pick(c)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left font-lato text-[13.5px] transition-colors duration-200 hover:bg-mist",
                      active && "bg-mist",
                    )}
                  >
                    <Flag iso={c.iso} />
                    <span className="flex-1 truncate text-ink">{c.name}</span>
                    <span className="text-ink/50">{c.dialCode}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
