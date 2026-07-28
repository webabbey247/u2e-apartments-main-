import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReservationSummaryCard } from "@/components/reviews/reservation-summary-card";
import { checkReviewEligibility } from "@/lib/queries/reviews";
import { RevealHeading } from "@/components/ui/reveal-heading";

export const dynamic = "force-dynamic"; // reservation lookup is per-request

export const metadata: Metadata = {
  title: "Leave a Review — U2E Apartments",
  robots: { index: false }, // per-reservation page; keep out of the index
};

/** A calm full-page state for when the review link can't be used. */
function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-paper px-6 py-32 md:px-10">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-cinzel text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-4 font-lato text-base leading-relaxed text-ink/70">{body}</p>
        <Link
          href="/accommodation"
          className="mt-8 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-brand transition-colors duration-500 ease-brand hover:text-brand/80"
        >
          Browse accommodation →
        </Link>
      </div>
    </section>
  );
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ reservationNumber: string }>;
}) {
  const { reservationNumber } = await params;
  const eligibility = await checkReviewEligibility(reservationNumber);

  return (
    <>
      <Navbar />
      <main>
         <div className="bg-ink px-6 pb-14 pt-36 text-center text-paper md:pb-16 md:pt-44">
        <div
          className="mb-6 flex items-center justify-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] text-paper/60"
        >
          <Link href="/" className="transition-colors duration-300 ease-brand hover:text-paper">
            Home
          </Link>
          <span>/</span>
          <Link href="/accommodation" className="transition-colors duration-300 ease-brand hover:text-paper">
            Accommodation
          </Link>
          <span>/</span>
          <span className="text-brand">Reviews</span>
        </div>
        <RevealHeading
          as="h1"
          onMount
          className="mx-auto max-w-3xl font-cinzel text-4xl leading-tight text-paper md:text-6xl"
        >
         share your Experience
        </RevealHeading>
      </div>
        {eligibility.ok ? (
          <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-14">
              <ReviewForm reservationNumber={reservationNumber} />
              <ReservationSummaryCard reservation={eligibility.reservation} />
            </div>
          </section>
        ) : eligibility.reason === "already_reviewed" ? (
          <Notice
            title="You've already reviewed this stay"
            body="Our records show a review has already been submitted for this reservation. Thank you — one review per stay keeps things fair for everyone."
          />
        ) : eligibility.reason === "not_available" ? (
          <Notice
            title="Reviews open after your stay"
            body="You'll be able to review this stay once it's complete. We'll email you an invitation with a link shortly after checkout — thank you for your patience."
          />
        ) : (
          <Notice
            title="We couldn't verify this reservation"
            body="Reviews are open to confirmed guests. Please check the reservation number in your confirmation email, or reach out to our team if you think this is a mistake."
          />
        )}
      </main>
      <Footer />
    </>
  );
}
