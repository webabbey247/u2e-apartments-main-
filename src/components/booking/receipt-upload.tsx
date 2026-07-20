"use client";

import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils/cn";

/** Must mirror the `receipt` FileRouter config in api/uploadthing/core.ts. */
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"] as const;
export const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPT_ATTR = ACCEPTED_TYPES.join(",");

export type UploadedReceipt = { url: string; name: string; size: number; at: string };

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Client-side guard so oversized/wrong files never start an upload. */
function validate(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return "Only JPG, PNG or PDF files are accepted.";
  }
  if (file.size > MAX_BYTES) {
    return `That file is ${formatSize(file.size)}. Please upload a file up to 2MB.`;
  }
  return null;
}

function FileBadge({ name }: { name: string }) {
  const isPdf = name.toLowerCase().endsWith(".pdf");
  return (
    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md bg-brand/10 text-brand">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      <span className="mt-0.5 font-montserrat text-[7px] font-semibold uppercase tracking-[0.05em]">
        {isPdf ? "PDF" : "IMG"}
      </span>
    </div>
  );
}

/**
 * Payment receipt upload — dashed drop zone until a file is attached, then a
 * summary card with Replace / remove. Validates type and size on the client
 * before hitting UploadThing (which enforces the same limits server-side).
 */
export function ReceiptUpload({
  value,
  onChange,
  onUploadingChange,
}: {
  value: UploadedReceipt | null;
  onChange: (r: UploadedReceipt | null) => void;
  /** Lets the parent disable its submit button while a file is in flight. */
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<File | null>(null);

  const { startUpload, isUploading } = useUploadThing("receipt", {
    onClientUploadComplete: (res) => {
      const f = res?.[0];
      if (f) {
        onChange({
          url: f.serverData.url,
          name: f.serverData.name,
          size: pending?.size ?? 0,
          at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        });
        setError(null);
      }
      setPending(null);
      onUploadingChange?.(false);
    },
    onUploadError: () => {
      setError("Upload failed. Please try again.");
      setPending(null);
      onUploadingChange?.(false);
    },
  });

  const accept = (file?: File | null) => {
    if (!file) return;
    const problem = validate(file);
    if (problem) {
      setError(problem);
      setPending(null);
      return;
    }
    setError(null);
    setPending(file);
    onUploadingChange?.(true);
    void startUpload([file]);
  };

  // ── Uploaded ───────────────────────────────────────────────────────────
  if (value && !isUploading) {
    return (
      <div>
        <div className="flex items-center gap-3.5 rounded-md border border-brand/20 bg-paper px-4 py-3.5">
          <FileBadge name={value.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-lato text-[14px] font-semibold text-ink">{value.name}</p>
            <p className="mt-0.5 font-lato text-[12px] text-ink/55">
              {formatSize(value.size)} · Uploaded {value.at}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-lato text-[12px] text-brand">
              <span aria-hidden>✓</span> File ready for review
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-sm border border-brand/30 px-3.5 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink transition-colors duration-300 ease-brand hover:border-brand hover:text-brand"
            >
              Replace
            </button>
            <button
              type="button"
              aria-label="Remove receipt"
              onClick={() => {
                onChange(null);
                setError(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-ink/45 transition-colors duration-300 ease-brand hover:text-brand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => accept(e.target.files?.[0])}
        />
        {error && <p className="mt-1.5 font-lato text-[12px] text-brand">{error}</p>}
      </div>
    );
  }

  // ── Empty / uploading ──────────────────────────────────────────────────
  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex flex-col items-center rounded-md border border-dashed px-6 py-8 text-center transition-colors duration-300 ease-brand",
          dragging ? "border-brand bg-brand/5" : "border-brand/30 bg-mist/40",
        )}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-paper text-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </div>

        {isUploading ? (
          <>
            <p className="font-cinzel text-[15px] text-ink">Uploading…</p>
            <p className="mt-1 font-lato text-[12.5px] text-ink/55">
              {pending?.name ?? "Your receipt"}
            </p>
          </>
        ) : (
          <>
            <p className="font-cinzel text-[15px] font-semibold text-ink">
              Drop your payment receipt
            </p>
            <p className="mt-1 font-lato text-[12.5px] text-ink/55">
              JPG, PNG or PDF · up to 2MB
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 rounded-sm border border-brand/30 bg-paper px-5 py-2 font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink transition-colors duration-300 ease-brand hover:border-brand hover:text-brand"
            >
              Browse files
            </button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0])}
      />
      {error && <p className="mt-1.5 font-lato text-[12px] text-brand">{error}</p>}
    </div>
  );
}
