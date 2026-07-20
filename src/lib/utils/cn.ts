/**
 * Minimal className joiner — filters falsy values.
 * (No clsx/tailwind-merge dependency; conditional strings are enough here.)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
