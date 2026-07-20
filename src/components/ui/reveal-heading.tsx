"use client";

import { createElement } from "react";
import { useSplitTextStagger } from "@/hooks/use-animations";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  children: React.ReactNode;
  className?: string;
  /** Animate on mount rather than on scroll into view. */
  onMount?: boolean;
};

/**
 * Heading with the template's line-by-line SplitText stagger
 * (`data-heading="stagger-heading"`). The hook hides + splits the text in a
 * layout effect (before paint, so no flash) and reveals it on scroll — without
 * any persistent hidden class, so the text can never get stuck invisible.
 */
export function RevealHeading({ as = "h2", children, className, onMount }: Props) {
  const ref = useSplitTextStagger<HTMLHeadingElement>({ trigger: !onMount });
  return createElement(as, { ref, className }, children);
}
