"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENQUIRY } from "@/lib/content/meetings";
import { eventEnquirySchema, type EventEnquiryInput } from "@/schemas/enquiry";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { cn } from "@/lib/utils/cn";

const inputBase =
  "w-full border-b border-paper/25 bg-transparent py-3 font-lato text-paper placeholder:text-paper/40 focus:border-brand focus:outline-none transition-colors duration-300 ease-brand";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 font-lato text-xs text-brand">{msg}</p>;
}

/**
 * Meetings & Events enquiry form (EventEnquiry lead capture). Zod-validated via
 * react-hook-form. Submit currently resolves client-side to a thank-you state
 * (endpoint `POST /api/meetings-events` is wired in Phase 3).
 */
export function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventEnquiryInput>({
    resolver: zodResolver(eventEnquirySchema),
    defaultValues: { guests: 1 },
  });

  const onSubmit = async (_data: EventEnquiryInput) => {
    // TODO(Phase 3): POST to /api/meetings-events (EventEnquiry).
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  };

  return (
    <section id="enquiry" className="scroll-mt-24 bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="max-w-sm">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {ENQUIRY.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-paper md:text-5xl">
            {ENQUIRY.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-paper/70">
            {ENQUIRY.body}
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-start justify-center">
            <h3 className="font-cinzel text-3xl text-paper">Thank you.</h3>
            <p className="mt-3 max-w-md font-lato text-base leading-relaxed text-paper/75">
              Your enquiry has been received — our events team will be in touch shortly with a tailored proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <input {...register("fullName")} placeholder="Full name" className={inputBase} />
                <FieldError msg={errors.fullName?.message} />
              </div>
              <div>
                <input {...register("email")} type="email" placeholder="Email" className={inputBase} />
                <FieldError msg={errors.email?.message} />
              </div>
              <div>
                <input {...register("phone")} placeholder="Phone" className={inputBase} />
                <FieldError msg={errors.phone?.message} />
              </div>
              <div>
                <select
                  {...register("eventType")}
                  defaultValue=""
                  className={cn(inputBase, "appearance-none [&>option]:text-ink")}
                >
                  <option value="" disabled>
                    Event type
                  </option>
                  {ENQUIRY.eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.eventType?.message} />
              </div>
              <div>
                <input {...register("eventDate")} type="date" className={cn(inputBase, "[color-scheme:dark]")} />
                <FieldError msg={errors.eventDate?.message} />
              </div>
              <div>
                <input
                  {...register("guests", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  placeholder="Guests"
                  className={inputBase}
                />
                <FieldError msg={errors.guests?.message} />
              </div>
            </div>

            <div>
              <textarea
                {...register("message")}
                rows={3}
                placeholder="Tell us about your event"
                className={cn(inputBase, "resize-none")}
              />
              <FieldError msg={errors.message?.message} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 self-start rounded-full bg-brand px-8 py-4 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:bg-brand/90 disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
