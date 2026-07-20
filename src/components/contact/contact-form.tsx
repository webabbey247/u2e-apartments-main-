"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactMessageSchema,
  CONTACT_REASONS,
  type ContactMessageInput,
} from "@/schemas/contact";
import { CONTACT_FORM } from "@/lib/content/contact";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { cn } from "@/lib/utils/cn";

const inputBase =
  "w-full border-b border-ink/20 bg-transparent py-3 font-lato text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none transition-colors duration-300 ease-brand";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 font-lato text-xs text-brand">{msg}</p>;
}

/**
 * Contact form (ContactMessage lead capture). Zod-validated via react-hook-form.
 * Submit resolves client-side to a thank-you state (endpoint `POST /api/contact`
 * is wired in Phase 3).
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
  });

  const onSubmit = async (_data: ContactMessageInput) => {
    // TODO(Phase 3): POST to /api/contact (ContactMessage).
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  };

  return (
    <div className="rounded-2xl bg-mist p-8 md:p-10">
      <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
        {CONTACT_FORM.eyebrow}
      </p>
      <RevealHeading className="font-cinzel text-3xl leading-tight text-ink md:text-4xl">
        {CONTACT_FORM.title}
      </RevealHeading>

      {submitted ? (
        <div className="mt-8">
          <h3 className="font-cinzel text-2xl text-ink">Thank you.</h3>
          <p className="mt-3 font-lato text-base leading-relaxed text-ink/70">
            Your message has been received — we'll be in touch within one business day.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-6">
          <div>
            <input {...register("name")} placeholder="Your name" className={inputBase} />
            <FieldError msg={errors.name?.message} />
          </div>
          <div>
            <input {...register("email")} type="email" placeholder="Email" className={inputBase} />
            <FieldError msg={errors.email?.message} />
          </div>
          <div>
            <select
              {...register("reason")}
              defaultValue=""
              className={cn(inputBase, "appearance-none")}
            >
              <option value="" disabled>
                Reason for contact
              </option>
              {CONTACT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <FieldError msg={errors.reason?.message} />
          </div>
          <div>
            <textarea
              {...register("message")}
              rows={4}
              placeholder="How can we help?"
              className={cn(inputBase, "resize-none")}
            />
            <FieldError msg={errors.message?.message} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 self-start rounded-full bg-brand px-8 py-4 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:bg-brand/90 disabled:opacity-60"
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
