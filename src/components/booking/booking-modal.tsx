"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  dateFields,
  detailsFields,
  termsFields,
  STEP_NAMES,
  nightsBetween,
  nextDayISO,
  formatNaira,
  type BookingForm,
} from "@/schemas/booking";
import type { UnitDetailFull, BookableRoom } from "@/lib/queries/rooms";
import { useBookableRooms } from "@/hooks/use-bookable-rooms";
import { useSiteConfig } from "@/components/providers/site-config-provider";
import { DateField } from "@/components/ui/date-field";
import { DialCodePicker } from "@/components/ui/dial-code-picker";
import { useDialCodes } from "@/hooks/use-dial-codes";
import { ReceiptUpload, type UploadedReceipt } from "@/components/booking/receipt-upload";
import { cn } from "@/lib/utils/cn";

// Shared field styling so every input matches.
const inputCls =
  "w-full box-border rounded-sm border border-brand/30 bg-paper px-3.5 py-3 font-lato text-[14px] text-ink outline-none transition-colors duration-300 ease-brand focus:border-brand";
const labelCls =
  "mb-2 block font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink/55";
const primaryBtn =
  "rounded-sm bg-brand px-6 py-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:shadow-[0_0_18px_rgba(200,30,42,0.5)] disabled:opacity-50";
const ghostBtn =
  "rounded-sm border border-brand/35 bg-transparent px-6 py-3 font-montserrat text-[12px] uppercase tracking-[0.15em] text-ink transition-colors duration-500 ease-brand hover:border-brand hover:text-brand";
const errCls = "mt-1.5 font-lato text-[12px] text-brand";

const todayISO = () => new Date().toISOString().slice(0, 10);

/** A bookable room enriched with availability + the guest's per-room choices. */
type RoomLine = BookableRoom & {
  unitsLeft: number;
  qty: number; // 0 = not booked, up to unitsLeft
  guests: number; // party in this room line
  addExtraBed: boolean;
  extraBeds: number;
};

// Small round stepper button used throughout the wizard.
function StepBtn({
  sign,
  onClick,
  disabled,
  label,
}: {
  sign: "−" | "+";
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border border-brand/40 bg-paper text-[16px] leading-none text-brand transition-colors duration-300 ease-brand hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
    >
      {sign}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-brand/10 py-2.5 last:border-b-0">
      <span className="shrink-0 font-montserrat text-[10.5px] uppercase tracking-[0.1em] text-ink/50">
        {label}
      </span>
      <span className="text-right font-lato text-[13px] text-ink">{value}</span>
    </div>
  );
}

/**
 * Booking wizard modal — a full-screen, 5-step flow:
 *   1 Availability → dates only; checks which room types are free
 *   2 Rooms        → a row per available type with quantity, guests, extra bed
 *   3 Details      → guest info + terms (the sticky summary replaces a Review step)
 *   4 Payment → 5 Confirmed
 * A single reservation can hold multiple room types (e.g. a 2BR + a 3BR). Room
 * pricing comes from the CRM; bank details from the CRM site config.
 */
export function BookingModal({
  unit,
  open,
  onClose,
}: {
  /** Pre-selected room (from a room page). Omit for a plain "Book a Stay" start. */
  unit?: UnitDetailFull;
  open: boolean;
  onClose: () => void;
}) {
  const { bankAccounts } = useSiteConfig();
  const dialCodes = useDialCodes({ enabled: open });
  const roomsQuery = useBookableRooms({ enabled: open });

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"card" | "transfer">("card");
  const [receipt, setReceipt] = useState<UploadedReceipt | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState<
    { kind: "error" | "ok"; text: string } | null
  >(null);
  // Rooms that have availability for the chosen dates, with the guest's choices.
  // Empty until step 1's availability check runs.
  const [lines, setLines] = useState<RoomLine[]>([]);
  // Every room's verdict for the step-1 list (available + sold-out).
  const [availResults, setAvailResults] = useState<
    { slug: string; name: string; category: string; priceValue: number; unitsLeft: number }[]
  >([]);
  const [availabilityDone, setAvailabilityDone] = useState(false);
  // Single = one room type only; Multiple = mix room types (e.g. a 2BR + a 3BR).
  const [bookingType, setBookingType] = useState<"single" | "multiple">("single");
  // Guest Details: email is checked first; a hit pre-fills name/company, and
  // reveals the name/company row. Continue then creates/updates the customer.
  const [customerChecked, setCustomerChecked] = useState(false);
  const [customerExists, setCustomerExists] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);

  const {
    register,
    trigger,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: {
      checkIn: "",
      checkOut: "",
      name: "",
      email: "",
      dialCode: "+234",
      phone: "",
      company: "",
      agreedToTerms: false,
    },
  });

  const values = watch();

  // Reset the wizard whenever it re-opens.
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setMethod("card");
    setReceipt(null);
    setUploadingReceipt(false);
    setSubmitting(false);
    setReference(null);
    setSubmitError(null);
    setAvailabilityMsg(null);
    setLines([]);
    setAvailResults([]);
    setAvailabilityDone(false);
    setBookingType("single");
    setCustomerChecked(false);
    setCustomerExists(false);
    setCustomerLoading(false);
    reset();
  }, [open, reset]);

  // Esc to close + scroll lock.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // A prior availability verdict is stale once the stay changes.
  useEffect(() => {
    setAvailabilityMsg(null);
    setAvailabilityDone(false);
    setLines([]);
    setAvailResults([]);
  }, [values.checkIn, values.checkOut]);

  // Editing the email invalidates a prior lookup — re-hide the name/company row.
  useEffect(() => {
    setCustomerChecked(false);
    setCustomerExists(false);
  }, [values.email]);

  const nights = nightsBetween(values.checkIn, values.checkOut);

  // The rooms actually being booked (quantity ≥ 1).
  const activeLines = useMemo(() => lines.filter((l) => l.qty > 0), [lines]);
  const totalRooms = activeLines.reduce((n, l) => n + l.qty, 0);
  const totalGuests = activeLines.reduce((n, l) => n + l.guests, 0);

  const total = useMemo(() => {
    // Display-only; the server recomputes authoritatively on create.
    const base = activeLines.reduce((s, l) => s + l.priceValue * l.qty, 0) * Math.max(nights, 1);
    const beds = activeLines.reduce(
      (s, l) => s + (l.addExtraBed ? l.extraBeds * l.extraBedPrice : 0),
      0,
    );
    return base + beds;
  }, [activeLines, nights]);

  // ── Per-line mutators (keep guests within each line's capacity) ──────────
  const capacityOf = (l: RoomLine) => Math.max(1, l.sleeps * Math.max(l.qty, 1));
  // Max extra beds = the room's DB max × the number of rooms booked.
  const maxBedsOf = (l: RoomLine) => Math.max(1, l.extraBedMax * Math.max(l.qty, 1));
  const patchLine = (slug: string, patch: Partial<RoomLine>) =>
    setLines((ls) => ls.map((l) => (l.slug === slug ? { ...l, ...patch } : l)));

  const setQty = (slug: string, qty: number) =>
    setLines((ls) =>
      ls.map((l) => {
        if (l.slug !== slug) {
          // Single booking → activating one room type clears the others.
          return bookingType === "single" && qty > 0 ? { ...l, qty: 0, guests: 0 } : l;
        }
        const nextQty = Math.max(0, Math.min(l.unitsLeft, qty));
        const cap = Math.max(1, l.sleeps * Math.max(nextQty, 1));
        // Entering the booking → at least 1 guest; leaving → 0.
        const guests = nextQty === 0 ? 0 : Math.min(Math.max(l.guests, 1), cap);
        // Extra beds capped at the room's DB max × rooms booked.
        const bedCap = Math.max(1, l.extraBedMax * Math.max(nextQty, 1));
        const extraBeds = Math.max(1, Math.min(l.extraBeds, bedCap));
        return { ...l, qty: nextQty, guests, extraBeds };
      }),
    );

  // Switching to single collapses the selection to a single room type.
  const changeBookingType = (t: "single" | "multiple") => {
    setBookingType(t);
    if (t === "single") {
      setLines((ls) => {
        const keep = ls.find((l) => l.qty > 0)?.slug;
        return ls.map((l) => (l.slug === keep ? l : { ...l, qty: 0, guests: 0 }));
      });
    }
  };
  const setGuests = (slug: string, guests: number) =>
    setLines((ls) =>
      ls.map((l) =>
        l.slug === slug ? { ...l, guests: Math.max(1, Math.min(capacityOf(l), guests)) } : l,
      ),
    );

  if (!open) return null;

  /**
   * Step 1 gate — check every bookable room for the chosen dates and keep the
   * ones with availability. Only those room types appear in step 2.
   */
  const runAvailability = async () => {
    setAvailabilityMsg(null);
    setSubmitting(true);
    try {
      const catalogue = roomsQuery.data ?? [];
      if (catalogue.length === 0) {
        setAvailabilityMsg({ kind: "error", text: "Rooms are still loading — please try again." });
        return false;
      }

      const results = await Promise.all(
        catalogue.map(async (room) => {
          const qs = new URLSearchParams({
            slug: room.slug,
            checkIn: values.checkIn,
            checkOut: values.checkOut,
          });
          const res = await fetch(`/api/availability?${qs}`);
          const data = await res.json();
          if (!res.ok) return null;
          return { room, unitsLeft: data.unitsLeft as number, available: data.available as boolean };
        }),
      );

      const checked = results.filter(
        (r): r is { room: BookableRoom; unitsLeft: number; available: boolean } => !!r,
      );
      // Keep every room's verdict for the step-1 list (success / sold-out).
      setAvailResults(
        checked.map(({ room, unitsLeft }) => ({
          slug: room.slug,
          name: room.name,
          category: room.category,
          priceValue: room.priceValue,
          unitsLeft: Math.max(0, unitsLeft),
        })),
      );

      const free = checked.filter((r) => r.available && r.unitsLeft > 0);

      if (free.length === 0) {
        setAvailabilityMsg({
          kind: "error",
          text: "Sorry — no rooms are available for those dates. Try different dates.",
        });
        setLines([]);
        setAvailabilityDone(false);
        return false;
      }

      // Seed lines: pre-select the room the guest came from (if free), else none.
      const next: RoomLine[] = free.map(({ room, unitsLeft }) => {
        const preselect = unit?.slug === room.slug;
        return {
          ...room,
          unitsLeft,
          qty: preselect ? 1 : 0,
          guests: preselect ? Math.min(2, room.sleeps) : 0,
          addExtraBed: false,
          extraBeds: 1,
        };
      });
      setLines(next);
      setAvailabilityDone(true);
      // No success banner — the available room types list below speaks for itself.
      setAvailabilityMsg(null);
      return true;
    } catch {
      setAvailabilityMsg({ kind: "error", text: "Could not check availability. Please try again." });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  /** Look the email up; pre-fill + reveal the name/company row. */
  const checkEmail = async (): Promise<void> => {
    const ok = await trigger(["email"]);
    if (!ok) return;
    const email = (values.email || "").trim();
    setCustomerLoading(true);
    try {
      const res = await fetch(`/api/customers?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.found) {
        setCustomerExists(true);
        setValue("name", data.customer.name ?? "", { shouldValidate: true });
        setValue("company", data.customer.company ?? "");
        if (data.customer.dialCode) setValue("dialCode", data.customer.dialCode);
        if (data.customer.phone) setValue("phone", data.customer.phone, { shouldValidate: true });
      } else {
        setCustomerExists(false);
      }
    } catch {
      setCustomerExists(false); // treat as a new guest on lookup failure
    } finally {
      setCustomerChecked(true);
      setCustomerLoading(false);
    }
  };

  /** Persist the customer — create (new) or update (returning). */
  const saveCustomer = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/customers", {
        method: customerExists ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          phone: values.phone,
          dialCode: values.dialCode,
          company: values.company || undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setSubmitError(j.error || "Could not save your details. Please try again.");
        return false;
      }
      return true;
    } catch {
      setSubmitError("Could not save your details. Please try again.");
      return false;
    }
  };

  const createReservation = async (): Promise<boolean> => {
    if (reference) return true; // already created — don't duplicate
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          bookingType,
          rooms: activeLines.map((l) => ({
            slug: l.slug,
            qty: l.qty,
            guests: l.guests,
            extraBed: l.addExtraBed,
            extraBeds: l.extraBeds,
          })),
          name: values.name,
          email: values.email,
          dialCode: values.dialCode,
          phone: values.phone,
          company: values.company || undefined,
          agreedToTerms: values.agreedToTerms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = data?.details
          ? (Object.values(data.details).flat() as string[])[0]
          : undefined;
        setSubmitError(detail ?? data?.error ?? "Could not create your booking. Please try again.");
        return false;
      }
      setReference(data.reservationNumber);
      return true;
    } catch {
      setSubmitError("Could not create your booking. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const next = async () => {
    if (step === 1) {
      const ok = await trigger([...dateFields]);
      if (!ok) return;
      if (!availabilityDone) {
        await runAvailability();
        return; // first press checks; second press advances
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (activeLines.length === 0) {
        setSubmitError("Please add at least one room to continue.");
        return;
      }
      setSubmitError(null);
      setStep(3);
      return;
    }
    if (step === 3) {
      // Contact first. If the email hasn't been looked up yet, do that — it
      // reveals (and pre-fills) the name/company row without advancing.
      const okContact = await trigger(["email", "dialCode", "phone"]);
      if (!okContact) return;
      if (!customerChecked) {
        await checkEmail();
        return;
      }
      const okRest = await trigger(["name", ...termsFields]);
      if (!okRest) return;

      setSubmitError(null);
      setSubmitting(true);
      const saved = await saveCustomer();
      setSubmitting(false);
      if (!saved) return;

      const created = await createReservation();
      if (!created) return;
      setStep(4);
      return;
    }
  };

  const pay = async () => {
    // TODO(Phase 6): Paystack checkout (card). Record the chosen payment method
    // + receipt; the booking stays PENDING until it's verified/confirmed.
    setSubmitting(true);
    try {
      if (reference) {
        await fetch(`/api/bookings/${encodeURIComponent(reference)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: method,
            ...(method === "transfer" && receipt
              ? { receiptUrl: receipt.url, receiptFileName: receipt.name }
              : {}),
          }),
        });
      }
    } catch {
      // Non-fatal: the reservation exists; payment can be reconciled later.
    } finally {
      setSubmitting(false);
      setStep(5);
    }
  };

  const roomsLabel =
    activeLines.length === 0
      ? "—"
      : activeLines.map((l) => (l.qty > 1 ? `${l.qty} × ${l.name}` : l.name)).join(", ");
  const summaryTitle =
    activeLines.length === 0
      ? "Your Stay"
      : activeLines.length === 1
        ? activeLines[0].name
        : `${totalRooms} rooms`;

  // Registered once so the Guest Details email field can add an onBlur lookup
  // without dropping react-hook-form's own onBlur (touched state).
  const emailField = register("email");

  const primaryLabel = submitting
    ? step === 1
      ? "Checking…"
      : "Please wait…"
    : step === 1
      ? availabilityDone
        ? "Continue"
        : "Check Availability"
      : "Continue";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book your stay"
      className="fixed inset-0 z-[300] overflow-y-auto bg-[url('/assets/accommodation-hero.jpg')] bg-cover bg-center"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-mist/90 backdrop-blur-sm" />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-10 md:px-10 md:py-14">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-paper transition-transform duration-500 ease-brand hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={cn("mb-9", step === 5 ? "text-center" : "text-left")}>
          <span className="font-montserrat text-[12px] uppercase tracking-[0.25em] text-brand">
            Reserve
          </span>
          <h2 className="mt-2 font-cinzel text-[30px] font-semibold text-ink">Book Your Stay</h2>
        </div>

        <div className={cn("grid gap-10", step !== 5 && "lg:grid-cols-[minmax(0,1fr)_360px]")}>
          {/* LEFT — wizard */}
          <div className={step === 5 ? "mx-auto w-full max-w-[560px]" : "min-w-0"}>
            <div className="rounded-md border border-brand/25 bg-paper p-6 sm:p-11">
              {/* STEP 1 — Room Availability */}
              {step === 1 && (
                <div>
                  <h3 className="mb-6 font-cinzel text-[22px] font-semibold text-ink">
                    Room Availability
                  </h3>
                  <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Check In</label>
                      <DateField
                        value={values.checkIn}
                        min={todayISO()}
                        ariaLabel="Check in"
                        placeholder="Select date"
                        invalid={!!errors.checkIn}
                        onChange={(v) => {
                          setValue("checkIn", v, { shouldValidate: true, shouldDirty: true });
                          if (values.checkOut && values.checkOut <= v) {
                            setValue("checkOut", "", { shouldValidate: false });
                          }
                        }}
                      />
                      {errors.checkIn && <p className={errCls}>{errors.checkIn.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Check Out</label>
                      <DateField
                        value={values.checkOut}
                        min={nextDayISO(values.checkIn || todayISO())}
                        ariaLabel="Check out"
                        placeholder="Select date"
                        invalid={!!errors.checkOut}
                        onChange={(v) =>
                          setValue("checkOut", v, { shouldValidate: true, shouldDirty: true })
                        }
                      />
                      {errors.checkOut && <p className={errCls}>{errors.checkOut.message}</p>}
                    </div>
                  </div>

                  {availabilityMsg && (
                    <div
                      role="status"
                      className={cn(
                        "mb-5 rounded-sm border px-4 py-3 font-lato text-[13.5px]",
                        availabilityMsg.kind === "ok"
                          ? "border-brand/25 bg-mist text-ink"
                          : "border-brand bg-brand/5 text-brand",
                      )}
                    >
                      {availabilityMsg.text}
                    </div>
                  )}

                  {/* Room verdicts, revealed after the check: available rooms get
                      a success fill, sold-out rooms a danger fill. */}
                  {availabilityDone && availResults.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {availResults.map((r) => {
                        const free = r.unitsLeft > 0;
                        return (
                          <li
                            key={r.slug}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-sm border px-4 py-3 transition-colors duration-300 ease-brand",
                              free
                                ? "border-success/30 bg-success/5"
                                : "border-brand/30 bg-brand/5 opacity-80",
                            )}
                          >
                            <div className="min-w-0">
                              <p className={cn("truncate font-lato text-[14px]", free ? "text-ink" : "text-ink/60")}>
                                {r.name}
                              </p>
                              <p className="font-lato text-[12px] text-ink/50">
                                {r.category} · {formatNaira(r.priceValue)} / night
                              </p>
                            </div>
                            <span
                              className={cn(
                                "inline-flex shrink-0 items-center gap-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.1em]",
                                free ? "text-success" : "text-brand",
                              )}
                            >
                              <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", free ? "bg-success" : "bg-brand")} />
                              {free ? `${r.unitsLeft} left` : "Sold out"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {/* STEP 2 — Dates & Room */}
              {step === 2 && (
                <div>
                  <h3 className="mb-2 font-cinzel text-[22px] font-semibold text-ink">Dates &amp; Room</h3>
                  <p className="mb-5 font-lato text-[13.5px] text-ink/60">
                    Set how many of each room, and the guests in each. Add a 0 to skip a room type.
                  </p>

                  {/* Booking type — one room type, or a mix. */}
                  <div className="mb-6">
                    <span className="mb-2 block font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink/55">
                      Booking type
                    </span>
                    <div className="inline-flex rounded-sm border border-brand/30 p-1">
                      {(["single", "multiple"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={bookingType === t}
                          onClick={() => changeBookingType(t)}
                          className={cn(
                            "rounded-[3px] px-4 py-2 font-montserrat text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ease-brand",
                            bookingType === t
                              ? "bg-brand font-semibold text-paper"
                              : "text-ink/70 hover:text-brand",
                          )}
                        >
                          {t === "single" ? "Single Booking" : "Multiple Booking"}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 font-lato text-[12px] text-ink/45">
                      {bookingType === "single"
                        ? "Book a single room type."
                        : "Combine room types in one reservation (e.g. a 2-bedroom and a 3-bedroom)."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {lines.map((l) => {
                      const on = l.qty > 0;
                      return (
                        <div
                          key={l.slug}
                          className={cn(
                            "rounded-md border p-4 transition-colors duration-300 ease-brand",
                            on ? "border-brand/35 bg-paper" : "border-brand/15 bg-mist/50",
                          )}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                            <div className="min-w-[140px]">
                              <p className="font-cinzel text-[16px] text-ink">{l.name}</p>
                              <p className="font-lato text-[12px] text-ink/50">
                                {formatNaira(l.priceValue)} / night · sleeps {l.sleeps}
                              </p>
                            </div>

                            {/* Rooms quantity */}
                            <div>
                              <span className="mb-1.5 block font-montserrat text-[10px] uppercase tracking-[0.1em] text-ink/50">
                                Rooms
                              </span>
                              <div className="flex items-center gap-3">
                                <StepBtn sign="−" label={`Fewer ${l.name}`} disabled={l.qty <= 0} onClick={() => setQty(l.slug, l.qty - 1)} />
                                <span className="min-w-4 text-center font-lato text-[15px] text-ink">{l.qty}</span>
                                <StepBtn sign="+" label={`More ${l.name}`} disabled={l.qty >= l.unitsLeft} onClick={() => setQty(l.slug, l.qty + 1)} />
                              </div>
                            </div>

                            {/* Guests — capped at the room's DB capacity (sleeps × rooms). */}
                            <div>
                              <span className="mb-1.5 block font-montserrat text-[10px] uppercase tracking-[0.1em] text-ink/50">
                                Guests <span className="text-ink/40">· up to {on ? capacityOf(l) : l.sleeps}</span>
                              </span>
                              <div className="flex items-center gap-3">
                                <StepBtn sign="−" label={`Fewer guests in ${l.name}`} disabled={!on || l.guests <= 1} onClick={() => setGuests(l.slug, l.guests - 1)} />
                                <span className="min-w-4 text-center font-lato text-[15px] text-ink">{on ? l.guests : 0}</span>
                                <StepBtn sign="+" label={`More guests in ${l.name}`} disabled={!on || l.guests >= capacityOf(l)} onClick={() => setGuests(l.slug, l.guests + 1)} />
                              </div>
                              {on && l.guests >= capacityOf(l) && (
                                <p className="mt-1.5 font-lato text-[11px] text-ink/45">Max for {l.qty} room{l.qty === 1 ? "" : "s"}</p>
                              )}
                            </div>

                            {/* Extra bed */}
                            {l.extraBed && (
                              <div>
                                <span className="mb-1.5 block font-montserrat text-[10px] uppercase tracking-[0.1em] text-ink/50">
                                  Extra bed <span className="text-ink/40">({formatNaira(l.extraBedPrice)}{on && l.addExtraBed ? ` · up to ${maxBedsOf(l)}` : ""})</span>
                                </span>
                                <div className="flex items-center gap-2.5">
                                  {([false, true] as const).map((choice) => (
                                    <button
                                      key={String(choice)}
                                      type="button"
                                      disabled={!on}
                                      aria-pressed={l.addExtraBed === choice}
                                      onClick={() => patchLine(l.slug, { addExtraBed: choice })}
                                      className={cn(
                                        "cursor-pointer rounded-sm border border-brand/35 px-[14px] py-2 font-montserrat text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ease-brand disabled:opacity-40",
                                        l.addExtraBed === choice
                                          ? "bg-brand font-semibold text-paper"
                                          : "bg-transparent text-ink hover:border-brand hover:text-brand",
                                      )}
                                    >
                                      {choice ? "Yes" : "No"}
                                    </button>
                                  ))}
                                  {on && l.addExtraBed && (
                                    <div className="ml-1 flex items-center gap-2.5">
                                      <StepBtn sign="−" label="Fewer extra beds" disabled={l.extraBeds <= 1} onClick={() => patchLine(l.slug, { extraBeds: Math.max(1, l.extraBeds - 1) })} />
                                      <span className="min-w-4 text-center font-lato text-[14px] text-ink">{l.extraBeds}</span>
                                      <StepBtn sign="+" label="More extra beds" disabled={l.extraBeds >= maxBedsOf(l)} onClick={() => patchLine(l.slug, { extraBeds: Math.min(maxBedsOf(l), l.extraBeds + 1) })} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {submitError && <p className={cn(errCls, "mt-4")}>{submitError}</p>}
                </div>
              )}

              {/* STEP 3 — Guest Details */}
              {step === 3 && (
                <div>
                  <h3 className="mb-6 font-cinzel text-[22px] font-semibold text-ink">Guest Details</h3>

                  {/* Contact first — the email is looked up to recognise you. */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Contact Email</label>
                      <input
                        type="email"
                        {...emailField}
                        onBlur={(e) => {
                          emailField.onBlur(e);
                          void checkEmail();
                        }}
                        className={inputCls}
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className={errCls}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Contact Phone</label>
                      <div
                        className={cn(
                          "flex items-stretch rounded-sm border bg-paper transition-colors duration-300 ease-brand focus-within:border-brand",
                          errors.phone || errors.dialCode ? "border-brand" : "border-brand/30",
                        )}
                      >
                        <DialCodePicker
                          value={values.dialCode}
                          codes={dialCodes.data ?? []}
                          loading={dialCodes.isLoading}
                          onChange={(code: string) =>
                            setValue("dialCode", code, { shouldValidate: true, shouldDirty: true })
                          }
                        />
                        <input
                          {...register("phone")}
                          placeholder="801 234 5678"
                          className="w-full min-w-0 bg-transparent px-3.5 py-3 font-lato text-[14px] text-ink outline-none"
                        />
                      </div>
                      {(errors.dialCode || errors.phone) && (
                        <p className={errCls}>{errors.phone?.message ?? errors.dialCode?.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Lookup status */}
                  {customerLoading && (
                    <p className="mt-3 font-lato text-[13px] text-ink/60">Checking your email…</p>
                  )}
                  {customerChecked && !customerLoading && (
                    <p className="mt-3 font-lato text-[13px] text-ink/70">
                      {customerExists
                        ? "Welcome back — we found your details. Update anything that's changed."
                        : "New here? Tell us your name to continue."}
                    </p>
                  )}

                  {/* Name + company — revealed once the email has been checked. */}
                  {customerChecked && (
                    <>
                      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>Full Name</label>
                          <input {...register("name")} className={inputCls} placeholder="Ada Obi" />
                          {errors.name && <p className={errCls}>{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className={labelCls}>Company / Delegation · optional</label>
                          <input {...register("company")} className={inputCls} />
                        </div>
                      </div>

                      <label className="mt-6 flex items-start gap-2.5 font-lato text-[13.5px] text-ink">
                        <input type="checkbox" {...register("agreedToTerms")} className="mt-1 h-4 w-4 accent-[#C81E2A]" />
                        I agree to the Terms of Use and Privacy Policy.
                      </label>
                      {errors.agreedToTerms && <p className={errCls}>{errors.agreedToTerms.message}</p>}
                    </>
                  )}

                  {submitError && (
                    <div role="alert" className="mt-4 rounded-sm border border-brand bg-brand/5 px-4 py-3 font-lato text-[13px] text-brand">
                      {submitError}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 — Payment */}
              {step === 4 && (
                <div>
                  <h3 className="mb-5 font-cinzel text-[22px] font-semibold text-ink">Payment</h3>
                  <div className="mb-6 flex flex-wrap gap-3">
                    {(["card", "transfer"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={cn(
                          "rounded-sm border px-5 py-2.5 font-montserrat text-[11.5px] uppercase tracking-[0.12em] transition-colors duration-500 ease-brand",
                          method === m
                            ? "border-brand bg-brand text-paper"
                            : "border-brand/30 text-ink/70 hover:border-brand hover:text-brand",
                        )}
                      >
                        {m === "card" ? "Pay by Card" : "Bank Transfer"}
                      </button>
                    ))}
                  </div>

                  {method === "card" ? (
                    <p className="font-lato text-[14px] leading-relaxed text-ink/70">
                      You&apos;ll be redirected to Paystack to complete a secure card payment of{" "}
                      <span className="font-semibold text-ink">{formatNaira(total)}</span>.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <p className="font-lato text-[14px] leading-relaxed text-ink/70">
                        Transfer <span className="font-semibold text-ink">{formatNaira(total)}</span> to the
                        account below, then upload your receipt. Quote your booking reference
                        {reference ? <span className="font-semibold text-ink"> {reference}</span> : null}.
                      </p>
                      {bankAccounts.length > 0 ? (
                        bankAccounts.map((b) => (
                          <div key={b.accountNumber} className="rounded-sm border border-brand/20 bg-mist px-4 py-3.5">
                            <SummaryRow label="Bank" value={b.bankName} />
                            <SummaryRow label="Account name" value={b.accountName} />
                            <SummaryRow label="Account number" value={b.accountNumber} />
                          </div>
                        ))
                      ) : (
                        <p className="font-lato text-[13px] text-ink/50">
                          Bank details will be sent to your email.
                        </p>
                      )}
                      <div>
                        <label className={labelCls}>Upload receipt</label>
                        <ReceiptUpload value={receipt} onChange={setReceipt} onUploadingChange={setUploadingReceipt} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6 — Confirmed */}
              {step === 5 && (
                <div className="text-center">
                  <h3 className="mb-3 font-cinzel text-[24px] font-semibold text-ink">
                    {method === "card" ? "Booking Confirmed" : "Awaiting Confirmation"}
                  </h3>
                  <p className="mx-auto max-w-md font-lato text-[14.5px] leading-relaxed text-ink/70">
                    {method === "card"
                      ? "Thank you — your reservation is confirmed. A confirmation email is on its way."
                      : "Thanks — we’ve received your details. Your booking is confirmed once we verify your transfer."}
                  </p>
                  {reference && (
                    <p className="mt-5 font-montserrat text-[12px] uppercase tracking-[0.15em] text-ink/60">
                      Reference <span className="text-brand">{reference}</span>
                    </p>
                  )}
                  <button type="button" onClick={onClose} className={cn(primaryBtn, "mt-8")}>
                    Done
                  </button>
                </div>
              )}

              {/* Footer nav */}
              {step < 5 && (
                <div className="mt-9 flex items-center justify-between gap-4 border-t border-brand/15 pt-6">
                  <button
                    type="button"
                    onClick={() => (step === 1 ? onClose() : setStep((s) => s - 1))}
                    className={ghostBtn}
                  >
                    {step === 1 ? "Cancel" : "Back"}
                  </button>
                  <button
                    type="button"
                    disabled={submitting || uploadingReceipt}
                    onClick={step === 4 ? pay : next}
                    className={primaryBtn}
                  >
                    {step === 4
                      ? submitting
                        ? "Please wait…"
                        : method === "card"
                          ? "Pay Now"
                          : "Submit Booking"
                      : primaryLabel}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — sticky summary */}
          {step !== 5 && (
            <aside className="h-fit lg:sticky lg:top-12">
              <div className="rounded-lg border border-brand/20 bg-paper p-7 shadow-[0_12px_40px_rgba(30,31,34,0.07)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-mist px-3 py-1 font-montserrat text-[10px] uppercase tracking-[0.12em] text-ink/60">
                    Step {step} of {STEP_NAMES.length - 1} · {STEP_NAMES[step - 1]}
                  </span>
                  {reference && (
                    <span className="font-montserrat text-[11px] text-ink/45">{reference}</span>
                  )}
                </div>

                <h3 className="font-cinzel text-[21px] font-semibold text-ink">{summaryTitle}</h3>
                <p className="mb-6 mt-1 font-lato text-[12.5px] text-ink/55">
                  U2E Apartments{activeLines.length === 1 ? ` · ${activeLines[0].category}` : ""}
                </p>

                <div className="border-t border-brand/10">
                  {activeLines.length > 0 && <SummaryRow label="Rooms" value={roomsLabel} />}
                  <SummaryRow
                    label="Dates"
                    value={values.checkIn && values.checkOut ? `${values.checkIn} → ${values.checkOut}` : "—"}
                  />
                  <SummaryRow label="Nights" value={String(nights || "—")} />
                  <SummaryRow label="Guests" value={String(totalGuests || "—")} />
                  <SummaryRow label="Guest" value={values.name || "—"} />
                  <SummaryRow label="Email" value={values.email || "—"} />
                  <SummaryRow
                    label="Phone"
                    value={values.phone ? `${values.dialCode} ${values.phone}` : "—"}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between rounded-md bg-mist px-4 py-3.5">
                  <span className="font-montserrat text-[10.5px] uppercase tracking-[0.12em] text-ink/60">
                    Total
                  </span>
                  <span className="font-cinzel text-[20px] font-semibold text-brand">
                    {formatNaira(total)}
                  </span>
                </div>

                <p className="mt-4 font-lato text-[11.5px] leading-relaxed text-ink/45">
                  Your reservation is confirmed once payment is received. Rates and availability are
                  subject to change.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
