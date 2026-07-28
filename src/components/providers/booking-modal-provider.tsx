"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { UnitDetailFull } from "@/lib/queries/rooms";
import { BookingModal } from "@/components/booking/booking-modal";

type BookingModalContextValue = {
  /** Open the wizard. Pass a unit to pre-select it; omit for a room-select start. */
  openBooking: (unit?: UnitDetailFull) => void;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

/**
 * Hosts a single BookingModal instance so any client component (navbar, footer,
 * a room page) can open it. Opening with a unit pre-selects that room; opening
 * without one starts on an empty room select ("Book a Stay" from the chrome).
 */
export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<UnitDetailFull | undefined>(undefined);

  const openBooking = useCallback((u?: UnitDetailFull) => {
    setUnit(u);
    setOpen(true);
  }, []);
  const onClose = useCallback(() => setOpen(false), []);

  return (
    <BookingModalContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal unit={unit} open={open} onClose={onClose} />
    </BookingModalContext.Provider>
  );
}

export function useBookingModal(): BookingModalContextValue {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error("useBookingModal must be used within a BookingModalProvider");
  return ctx;
}
