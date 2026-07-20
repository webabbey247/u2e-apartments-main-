"use client";

import { CONTACT_MAP_EMBED } from "@/lib/content/contact";
import { useMoveY } from "@/hooks/use-animations";
import { useSiteConfig } from "@/components/providers/site-config-provider";

/**
 * Contact map — a responsive, lazy-loaded Google Maps embed (from the CRM
 * `mapUrl`) framed to the design, revealing with `move-y`.
 */
export function ContactMap() {
  const ref = useMoveY<HTMLDivElement>();
  const { mapUrl, address } = useSiteConfig();

  return (
    <section className="bg-mist">
      <div ref={ref} className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <iframe
          title={`Map to U2E Apartments — ${address}`}
          src={mapUrl || CONTACT_MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.3] transition-all duration-700 ease-brand hover:grayscale-0"
        />
      </div>
    </section>
  );
}
