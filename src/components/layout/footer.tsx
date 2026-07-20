"use client";

import Link from "next/link";
import { FOOTER } from "@/lib/content/home";
import { useSiteConfig } from "@/components/providers/site-config-provider";

/**
 * Global footer — CTA band on top, link columns with the default↔active hover
 * transition (ports `default_footer_link` / `active_footer_link`). Phone + the
 * "Follow" links come from the CRM site config.
 */
export function Footer() {
  const { phone, socials } = useSiteConfig();
  const followLinks = (
    [
      { label: "Instagram", href: socials.instagram },
      { label: "Facebook", href: socials.facebook },
      { label: "X", href: socials.x },
      { label: "TikTok", href: socials.tiktok },
    ] as const
  ).filter((s) => s.href);

  return (
    <footer className="bg-ink text-paper">
      {/* CTA band */}
      <div className="border-b border-paper/10 px-6 py-20 text-center md:px-10">
        <p className="font-montserrat text-xs uppercase tracking-[0.3em] text-gold">
        Ready to Feel at Home?
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl font-cinzel text-4xl leading-tight md:text-6xl">
Your Next Great Stay Starts Here        
</h2>
        <Link
          href="/accommodation"
          className="mt-9 inline-flex rounded-full bg-brand px-8 py-4 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:bg-brand/90"
        >
        Book Your Stay Today
        </Link>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-[1300px] gap-12 px-6 py-16 md:grid-cols-4 md:px-10">
        <div>
          <span className="font-cinzel text-2xl tracking-[0.2em]">U2E</span>
          <p className="mt-4 max-w-xs font-lato text-sm leading-relaxed text-paper/60">
Serviced apartments, dining, wellness, and event spaces — all at one address.          </p>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="mt-5 inline-block font-montserrat text-sm text-paper/70 transition-colors duration-300 ease-brand hover:text-paper"
          >
            {phone}
          </a>
        </div>

        {FOOTER.columns.map((col) => (
          <div key={col.heading}>
            <h3 className="font-montserrat text-xs uppercase tracking-[0.2em] text-paper/50">
              {col.heading}
            </h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-lato text-sm text-paper/70 transition-colors duration-300 ease-brand hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-montserrat text-xs uppercase tracking-[0.2em] text-paper/50">
            Follow
          </h3>
          <ul className="mt-5 space-y-3">
            {followLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-lato text-sm text-paper/70 transition-colors duration-300 ease-brand hover:text-paper"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-3 text-center md:flex-row">
          <p className="font-lato text-xs text-paper/50">
            © {new Date().getFullYear()} U2E Apartments. All rights reserved.
          </p>
          <div className="flex gap-6 font-lato text-xs text-paper/50">
            <Link href="/contact" className="transition-colors hover:text-paper">
              Contact
            </Link>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
