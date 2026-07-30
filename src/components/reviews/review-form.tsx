"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/schemas/review";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { cn } from "@/lib/utils/cn";

// Field system shared with the booking modal — same border, radius, type scale,
// and focus behaviour, so the two guest-facing forms read as one.
const inputCls =
  "w-full box-border rounded-sm border border-brand/30 bg-paper px-3.5 py-3 font-lato text-[14px] text-ink outline-none transition-colors duration-300 ease-brand focus:border-brand";
const labelCls =
  "mb-2 block font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink/55";
const primaryBtn =
  "rounded-sm bg-brand px-6 py-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:shadow-[0_0_18px_rgba(200,30,42,0.5)] disabled:opacity-50";
const errCls = "mt-1.5 font-lato text-[12px] text-brand";
/** Read-only variant — these come from the reservation and can't be edited. */
const readOnlyCls = "cursor-not-allowed border-brand/15 bg-mist text-ink/70";

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
            "text-4xl leading-none transition-colors duration-200 ease-brand",
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
 * Guest review form. Reservation-level (the reservation is verified server-side
 * and may span multiple rooms). Name and email are read-only — they come from
 * the reservation, and the API re-derives the stored name from it rather than
 * trusting the posted value. The guest supplies only a rating and their words.
 * Submits PENDING for CRM moderation.
 */
export function ReviewForm({
  reservationNumber,
  guestName,
  email,
}: {
  reservationNumber: string;
  /** Booking name, shown read-only and used as the review's author. */
  guestName: string;
  /** Booking email, shown read-only for confirmation; never published. */
  email: string;
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
    defaultValues: { reservationNumber, guestName, rating: 0, body: "" },
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
      <div className="rounded-lg border border-brand/20 bg-paper p-8 md:p-10">
        <h3 className="font-cinzel text-2xl text-ink">Thank you for sharing.</h3>
        <p className="mt-3 font-lato text-base leading-relaxed text-ink/70">
          Your review has been received and will appear once our team has had a chance to
          look it over. We appreciate you taking the time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand/20 bg-paper p-8 md:p-10">
      <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
        Your Stay
      </p>
      <RevealHeading className="font-cinzel text-3xl leading-tight text-ink md:text-4xl">
        Share Your Experience
      </RevealHeading>
      <p className="mt-3 font-lato text-sm text-ink/60">
        Reservation <span className="font-semibold text-ink/80">{reservationNumber}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        {/* From the reservation — shown so the guest can confirm who's reviewing. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="review-name">
              Full Name
            </label>
            {/* Not registered: the value is fixed by the reservation and lives
                in form state via `defaultValues`, so rendering it plainly keeps
                it filled server-side instead of appearing after hydration. */}
            <input
              id="review-name"
              readOnly
              tabIndex={-1}
              value={guestName}
              aria-describedby="review-identity-note"
              className={cn(inputCls, readOnlyCls)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="review-email">
              Email Address
            </label>
            <input
              id="review-email"
              type="email"
              readOnly
              tabIndex={-1}
              value={email}
              aria-describedby="review-identity-note"
              className={cn(inputCls, readOnlyCls)}
            />
          </div>
        </div>
        <p id="review-identity-note" className="mt-2 font-lato text-[12px] text-ink/50">
          Taken from your reservation. Only your name is shown publicly.
        </p>
        {/* Only reachable if the reservation itself carries no name. */}
        {errors.guestName && <p className={errCls}>{errors.guestName.message}</p>}

        <div className="mt-6">
          <label className={labelCls}>Your Rating</label>
          <StarPicker
            value={rating}
            onChange={(n) => setValue("rating", n, { shouldValidate: true })}
          />
          {errors.rating && <p className={errCls}>{errors.rating.message}</p>}
        </div>

        <div className="mt-6">
          <label className={labelCls} htmlFor="review-body">
            Your Review
          </label>
          <textarea
            id="review-body"
            {...register("body")}
            rows={6}
            placeholder="Tell us about your stay…"
            className={cn(inputCls, "resize-none placeholder:text-ink/35")}
          />
          {errors.body && <p className={errCls}>{errors.body.message}</p>}
        </div>

        {serverError && <p className={cn(errCls, "mt-4")}>{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className={cn(primaryBtn, "mt-7")}>
          {isSubmitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
