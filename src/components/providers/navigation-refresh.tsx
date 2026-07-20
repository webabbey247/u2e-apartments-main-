"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { registerGsap, ScrollTrigger } from "@/lib/animation/gsap";
import { useLenis } from "@/components/providers/lenis-provider";

/**
 * On client-side navigation the new route's scroll-reveal triggers are created
 * against stale measurements (the previous page's layout / scroll position), so
 * some never fire and their content stays hidden until a hard refresh. This
 * resets scroll to the top and recomputes every ScrollTrigger once the new
 * route has painted, so reveals fire correctly on soft navigation too.
 */
export function NavigationRefresh() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();

    // Start the new page at the top so above-the-fold reveals measure cleanly.
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    // Recompute after the new route's effects have run and the browser has
    // painted (double rAF), so all freshly-mounted triggers exist first.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname, lenis]);

  return null;
}
