"use client";

import { useQuery } from "@tanstack/react-query";
import { DIAL_CODES_FALLBACK, type DialCode } from "@/lib/dial-codes";

async function fetchDialCodes(): Promise<DialCode[]> {
  const res = await fetch("/api/dial-codes");
  if (!res.ok) throw new Error("Failed to load dial codes");
  const json = (await res.json()) as { codes: DialCode[] };
  return json.codes;
}

/**
 * Country dial codes from the BFF (`/api/dial-codes` → countriesnow, cached a
 * day). Seeded with the offline fallback so the picker is never empty.
 */
export function useDialCodes(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["dial-codes"],
    queryFn: fetchDialCodes,
    enabled: opts?.enabled ?? true,
    placeholderData: DIAL_CODES_FALLBACK,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
