"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/schemas/review";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { cn } from "@/lib/utils/cn";

const inputBase =
  "w-full border-b border-ink/20 bg-transparent py-3 font-lato text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none transition-colors duration-300 ease-brand";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 font-lato text-xs text-brand">{msg}</p>;
}

/** Interactive 1–5 star picker. */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className={cn(
            "text-3xl leading-none transition-colors duration-200 ease-brand",
            n <= shown ? "text-gold" : "text-ink/20 hover:text-gold/60",
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/**
 * Guest review form. `reservationNumber` and `roomSlug`/`roomTitle` are fixed by
 * the route (the reservation is already verified server-side); the guest only
 * supplies name, rating, and their words. Submits PENDING for CRM moderation.
 */
export function ReviewForm({
  reservationNumber,
  roomSlug,
  roomTitle,
}: {
  reservationNumber: string;
  roomSlug: string;
  roomTitle: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { reservationNumber, roomSlug, roomTitle, guestName: "", rating: 0, body: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (data: ReviewInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setServerError(j.error || "Could not submit your review. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Could not submit your review. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-mist p-8 md:p-10">
        <h3 className="font-cinzel text-2xl text-ink">Thank you for sharing.</h3>
        <p className="mt-3 font-lato text-base leading-relaxed text-ink/70">
          Your review has been received and will appear once our team has had a chance to
          look it over. We appreciate you taking the time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-mist p-8 md:p-10">
      <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
        {roomTitle}
      </p>
      <RevealHeading className="font-cinzel text-3xl leading-tight text-ink md:text-4xl">
        Share Your Stay
      </RevealHeading>
      <p className="mt-3 font-lato text-sm text-ink/60">
        Reservation <span className="font-semibold text-ink/80">{reservationNumber}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-6">
        <div>
          <label className="mb-2 block font-montserrat text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Your rating
          </label>
          <StarPicker value={rating} onChange={(n) => setValue("rating", n, { shouldValidate: true })} />
          <FieldError msg={errors.rating?.message} />
        </div>

        <div>
          <input {...register("guestName")} placeholder="Your name" className={inputBase} />
          <FieldError msg={errors.guestName?.message} />
        </div>

        <div>
          <textarea
            {...register("body")}
            rows={5}
            placeholder="Tell us about your stay…"
            className={cn(inputBase, "resize-none")}
          />
          <FieldError msg={errors.body?.message} />
        </div>

        {serverError && <p className="font-lato text-sm text-brand">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 self-start rounded-full bg-brand px-8 py-4 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:bg-brand/90 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </div>
  );
}
