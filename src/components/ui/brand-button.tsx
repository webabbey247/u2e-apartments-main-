import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
};

/**
 * Pill CTA matching the brand system — `bg-brand` + `ease-brand` transition,
 * used for "Book a Stay" and section CTAs.
 */
export function BrandButton({ href, children, variant = "solid", className }: Props) {
  const base =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-montserrat text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-500 ease-brand";
  const variants = {
    solid: "bg-brand text-paper hover:bg-brand/90 hover:gap-3",
    outline:
      "border border-ink/20 text-ink hover:border-brand hover:text-brand hover:gap-3",
    ghost: "text-ink hover:text-brand hover:gap-3",
  } as const;

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      <span aria-hidden className="transition-transform duration-500 ease-brand group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
