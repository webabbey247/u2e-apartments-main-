"use client";

import Link from "next/link";
import { CONTACT_DETAILS } from "@/lib/content/contact";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { useMoveY } from "@/hooks/use-animations";
import { useSiteConfig } from "@/components/providers/site-config-provider";

function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const ref = useMoveY<HTMLDivElement>();
  return (
    <div ref={ref} className="border-t border-mist2 pt-5">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-brand">{label}</p>
      {href ? (
        <Link
          href={href}
          className="mt-1 inline-block font-lato text-lg text-ink transition-colors duration-300 ease-brand hover:text-brand"
        >
          {value}
        </Link>
      ) : (
        <p className="mt-1 font-lato text-lg text-ink">{value}</p>
      )}
    </div>
  );
}

/**
 * Contact split — left column of contact details + social links; right column
 * is the form. Details reveal with `move-y`; social links slide their accent
 * underline on hover (`ease-brand`).
 */
export function ContactSplit() {
  const { phone, email, address, mapUrl, socials } = useSiteConfig();

  const details = [
    { label: "Visit", value: address },
    { label: "Call", value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Front Desk", value: "Open 24 hours, every day" },
  ].filter((d) => d.value);

  const socialLinks = (
    [
      { label: "Instagram", href: socials.instagram },
      { label: "Facebook", href: socials.facebook },
      { label: "X", href: socials.x },
      { label: "TikTok", href: socials.tiktok },
    ] as const
  ).filter((s) => s.href);

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left — details */}
        <div>
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            Reach Us
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            Let's Talk
          </RevealHeading>
          <p className="mt-5 max-w-md font-lato text-base leading-relaxed text-ink/70">
            {CONTACT_DETAILS.intro}
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {details.map((item) => (
              <DetailRow key={item.label} {...item} />
            ))}
          </div>

          {mapUrl && (
            <Link
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-500 ease-brand hover:text-brand"
            >
              {CONTACT_DETAILS.mapLabel}
              <span aria-hidden className="transition-transform duration-500 ease-brand group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}

          {/* Socials */}
          <div className="mt-12">
            <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Follow
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative font-cinzel text-xl text-ink transition-colors duration-500 ease-brand hover:text-brand"
                >
                  {s.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-500 ease-brand group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <ContactForm />
      </div>
    </section>
  );
}
