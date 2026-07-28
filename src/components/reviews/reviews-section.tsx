import type { ReviewSummary } from "@/lib/queries/reviews";
import { RevealHeading } from "@/components/ui/reveal-heading";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`text-gold ${className}`} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-ink/15">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/**
 * Approved guest reviews for a room. Renders nothing when there are none, so a
 * room with no reviews yet simply omits the section.
 */
export function ReviewsSection({ summary }: { summary: ReviewSummary }) {
  if (summary.count === 0) return null;

  return (
    <section className="bg-paper px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
              Guest Reviews
            </p>
            <RevealHeading className="font-cinzel text-3xl leading-tight text-ink md:text-4xl">
              What Our Guests Say
            </RevealHeading>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-4xl text-ink">{summary.average.toFixed(1)}</span>
            <div className="flex flex-col">
              <Stars rating={Math.round(summary.average)} className="text-lg" />
              <span className="mt-0.5 font-lato text-sm text-ink/55">
                {summary.count} review{summary.count === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {summary.reviews.map((r) => (
            <article key={r.id} className="flex flex-col rounded-2xl bg-mist p-6">
              <Stars rating={r.rating} />
              <p className="mt-4 flex-1 font-lato text-[15px] leading-relaxed text-ink/80">
                “{r.body}”
              </p>
              <div className="mt-6 border-t border-ink/10 pt-4">
                <p className="font-cinzel text-base text-ink">{r.guestName}</p>
                <p className="mt-0.5 font-lato text-xs uppercase tracking-[0.15em] text-ink/45">
                  {formatDate(r.date)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
