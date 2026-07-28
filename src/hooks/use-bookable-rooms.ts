"use client";

import { useQuery } from "@tanstack/react-query";
import type { BookableRoom } from "@/lib/queries/rooms";

/**
 * Active rooms for the booking modal's room select. Only fetched while the
 * modal is open (`enabled`); cached for the session.
 */
export function useBookableRooms({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ["bookable-rooms"],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<BookableRoom[]> => {
      const res = await fetch("/api/rooms");
      if (!res.ok) return [];
      const data = await res.json();
      return (data.rooms ?? []) as BookableRoom[];
    },
  });
}
