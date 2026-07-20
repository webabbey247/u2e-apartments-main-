"use client";

import { useRef, useState } from "react";
import { FAQ } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { cn } from "@/lib/utils/cn";

type FaqContent = {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<{ q: string; a: string }>;
};

/**
 * FAQ accordion — ports `faq_answer` (grid-rows height transition) + `faq_arrow`
 * (rotate on open). Single-open behaviour; answers animate smoothly via a
 * grid-template-rows 0fr→1fr transition (no fixed max-height guessing).
 * Reusable across pages via `content` (defaults to the home FAQ).
 */
export function Faq({ content = FAQ }: { content?: FaqContent }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {content.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {content.title}
          </RevealHeading>
        </div>

        <div className="divide-y divide-mist2 border-y border-mist2">
          {content.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <FaqRow
                key={item.q}
                q={item.q}
                a={item.a}
                isOpen={isOpen}
                onToggle={() => setOpen(isOpen ? null : i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqRow({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = useRef(`faq-${q.replace(/\W+/g, "-").toLowerCase()}`).current;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span
          className={cn(
            "font-cinzel text-lg transition-colors duration-300 ease-brand md:text-xl",
            isOpen ? "text-brand" : "text-ink",
          )}
        >
          {q}
        </span>
        <span
          aria-hidden
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition-all duration-500 ease-brand",
            isOpen ? "rotate-45 border-brand text-brand" : "border-ink/25 text-ink",
          )}
        >
          +
        </span>
      </button>
      <div
        id={contentId}
        className={cn(
          "grid transition-all duration-500 ease-brand",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-6 font-lato text-base leading-relaxed text-ink/70">{a}</p>
        </div>
      </div>
    </div>
  );
}
