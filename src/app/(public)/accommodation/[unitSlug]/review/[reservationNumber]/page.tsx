import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReviewForm } from "@/components/reviews/review-form";
import { getUnitBySlug } from "@/lib/queries/rooms";
import { checkReviewEligibility } from "@/lib/queries/reviews";

export const dynamic = "force-dynamic"; // reservation lookup is per-request

export const metadata: Metadata = {
  title: "Leave a Review — U2E Apartments",
  robots: { index: false }, // per-reservation page; keep out of the index
};

/** A calm full-page state for when the review link can't be used. */
function Notice({ title, body, unitSlug }: { title: string; body: string; unitSlug: string }) {
  return (
    <section className="bg-paper px-6 py-32 md:px-10">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-cinzel text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-4 font-lato text-base leading-relaxed text-ink/70">{body}</p>
        <Link
          href={`/accommodation/${unitSlug}`}
          className="mt-8 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-brand transition-colors duration-500 ease-brand hover:text-brand/80"
        >
          Back to the room →
        </Link>
      </div>
    </section>
  );
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ unitSlug: string; reservationNumber: string }>;
}) {
  const { unitSlug, reservationNumber } = await params;
  const unit = await getUnitBySlug(unitSlug);
  if (!unit) notFound();

  const eligibility = await checkReviewEligibility(reservationNumber);

  return (
    <>
      <Navbar />
      <main>
        {eligibility.ok ? (
          <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto max-w-2xl">
              <ReviewForm
                reservationNumber={reservationNumber}
                roomSlug={unit.slug}
                roomTitle={unit.name}
              />
            </div>
          </section>
        ) : eligibility.reason === "already_reviewed" ? (
          <Notice
            unitSlug={unitSlug}
            title="You've already reviewed this stay"
            body="Our records show a review has already been submitted for this reservation. Thank you — one review per stay keeps things fair for everyone."
          />
        ) : eligibility.reason === "not_available" ? (
          <Notice
            unitSlug={unitSlug}
            title="Reviews open after your stay"
            body="You'll be able to review this stay once it's complete. We'll email you an invitation with a link shortly after checkout — thank you for your patience."
          />
        ) : (
          <Notice
            unitSlug={unitSlug}
            title="We couldn't verify this reservation"
            body="Reviews are open to confirmed guests. Please check the reservation number in your confirmation email, or reach out to our team if you think this is a mistake."
          />
        )}
      </main>
      <Footer />
    </>
  );
}
