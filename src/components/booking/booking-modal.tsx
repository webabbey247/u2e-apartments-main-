"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  step1Fields,
  step2Fields,
  step3Fields,
  STEP_NAMES,
  nightsBetween,
  nextDayISO,
  formatNaira,
  type BookingForm,
} from "@/schemas/booking";
import type { UnitDetailFull } from "@/lib/queries/rooms";
import { useSiteConfig } from "@/components/providers/site-config-provider";
import { DateField } from "@/components/ui/date-field";
import { DialCodePicker } from "@/components/ui/dial-code-picker";
import { useDialCodes } from "@/hooks/use-dial-codes";
import { ReceiptUpload, type UploadedReceipt } from "@/components/booking/receipt-upload";
import { cn } from "@/lib/utils/cn";

// Shared field styling so every input matches.
const inputCls =
  "w-full box-border rounded-sm border border-brand/30 bg-paper px-3.5 py-3 font-lato text-[14px] text-ink outline-none transition-colors duration-300 ease-brand focus:border-brand";
const readonlyCls =
  "w-full box-border rounded-sm border border-brand/25 bg-mist px-3.5 py-3 font-lato text-[14px] text-ink/65 outline-none";
const labelCls =
  "mb-2 block font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink/55";
const primaryBtn =
  "rounded-sm bg-brand px-6 py-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-brand hover:shadow-[0_0_18px_rgba(200,30,42,0.5)] disabled:opacity-50";
const ghostBtn =
  "rounded-sm border border-brand/35 bg-transparent px-6 py-3 font-montserrat text-[12px] uppercase tracking-[0.15em] text-ink transition-colors duration-500 ease-brand hover:border-brand hover:text-brand";
const errCls = "mt-1.5 font-lato text-[12px] text-brand";

const todayISO = () => new Date().toISOString().slice(0, 10);

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
 * Booking wizard modal — ports the event site's `BookingModal`: a full-screen,
 * 5-step flow (Dates → Details → Review → Payment → Confirmed) with a sticky
 * reservation summary. Zod + react-hook-form validate per step. Room/pricing
 * come from the CRM unit; bank details from the CRM site config.
 */
export function BookingModal({
  unit,
  open,
  onClose,
}: {
  unit: UnitDetailFull;
  open: boolean;
  onClose: () => void;
}) {
  const { bankAccounts } = useSiteConfig();
  // Only fetch the country list while the modal is actually open.
  const dialCodes = useDialCodes({ enabled: open });
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"card" | "transfer">("card");
  // Receipt goes straight to UploadThing; we keep the returned URL to persist
  // onto the booking when the BFF route lands (Phase 5/6).
  const [receipt, setReceipt] = useState<UploadedReceipt | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState<
    { kind: "error" | "ok"; text: string } | null
  >(null);

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
      guests: 1,
      extraBed: false,
      extraBeds: 1,
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
    setReference(null);
    setAvailabilityMsg(null);
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

  // A prior verdict is stale once the stay or party size changes.
  useEffect(() => {
    setAvailabilityMsg(null);
  }, [values.checkIn, values.checkOut, values.guests]);

  // Derived from the verdict, so it clears automatically whenever the stay or
  // party size changes (the effect above resets the message).
  const availabilityConfirmed = availabilityMsg?.kind === "ok";

  // Party size is capped at the unit's real capacity from the CRM.
  const maxGuests = unit.sleeps || 12;
  const guests = Number(values.guests) || 1;
  const extraBed = !!values.extraBed;
  const extraBeds = Number(values.extraBeds) || 1;

  const nights = nightsBetween(values.checkIn, values.checkOut);
  const total = useMemo(() => {
    // NOTE: display-only. A server-authoritative quote lands with the pricing
    // engine (`POST /api/pricing/quote`) — the client must never set the charge.
    const base = unit.priceValue * Math.max(nights, 1);
    const beds = values.extraBed ? (values.extraBeds || 1) * unit.extraBedPrice : 0;
    return base + beds;
  }, [unit.priceValue, unit.extraBedPrice, nights, values.extraBed, values.extraBeds]);

  if (!open) return null;

  /** Step 1 gate — confirm the unit is free for the dates and fits the party. */
  const checkAvailability = async () => {
    setAvailabilityMsg(null);
    setSubmitting(true);
    try {
      const qs = new URLSearchParams({
        slug: unit.slug,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: String(values.guests),
      });
      const res = await fetch(`/api/availability?${qs}`);
      const data = await res.json();

      if (!res.ok) {
        // Prefer the specific field message over the generic "Invalid request".
        const detail = data?.details
          ? (Object.values(data.details).flat() as string[])[0]
          : undefined;
        setAvailabilityMsg({
          kind: "error",
          text: detail ?? data?.error ?? "Could not check availability. Please try again.",
        });
        return false;
      }
      if (!data.capacityOk) {
        setAvailabilityMsg({
          kind: "error",
          text: `This unit sleeps up to ${data.maxGuests} guest${data.maxGuests === 1 ? "" : "s"}. Please reduce your party size or choose a larger unit.`,
        });
        return false;
      }
      if (!data.available) {
        setAvailabilityMsg({
          kind: "error",
          text: "Sorry — this unit is fully booked for those dates. Try different dates.",
        });
        return false;
      }
      setAvailabilityMsg({
        kind: "ok",
        text: `${data.unitsLeft} of ${data.unitsTotal} unit${data.unitsTotal === 1 ? "" : "s"} available for your ${data.nights} night${data.nights === 1 ? "" : "s"}.`,
      });
      return true;
    } catch {
      setAvailabilityMsg({
        kind: "error",
        text: "Could not check availability. Please try again.",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const next = async () => {
    const fields =
      step === 1 ? step1Fields : step === 2 ? step2Fields : step3Fields;
    const ok = await trigger([...fields]);
    if (!ok) return;
    if (step === 1 && !availabilityConfirmed) {
      // First press checks and reports the result — it never advances. The
      // guest reviews the verdict, then presses Continue.
      await checkAvailability();
      return;
    }
    if (step === 3) {
      // TODO(Phase 5): POST /api/bookings → returns a BKG-XXXXXX reference.
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      setReference(`BKG-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitting(false);
    }
    setStep((s) => Math.min(s + 1, 5));
  };

  const pay = async () => {
    // TODO(Phase 6): Paystack checkout (card) / verify receipt (transfer).
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setStep(5);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book your stay"
      className="fixed inset-0 z-[300] overflow-y-auto bg-[url('/assets/accommodation-hero.jpg')] bg-cover bg-center"
    >
      {/* Scrim — keeps the ink/brand copy legible over the photo. */}
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
          <h2 className="mt-2 font-cinzel text-[30px] font-semibold text-ink">
            Book Your Stay
          </h2>
        </div>

        <div className={cn("grid gap-10", step !== 5 && "lg:grid-cols-[minmax(0,1fr)_360px]")}>
          {/* LEFT — wizard */}
          <div className={step === 5 ? "mx-auto w-full max-w-[560px]" : "min-w-0"}>
            <div className="rounded-md border border-brand/25 bg-paper p-6 sm:p-11">
              {/* STEP 1 — Dates & Room */}
              {step === 1 && (
                <div>
                  <h3 className="mb-6 font-cinzel text-[22px] font-semibold text-ink">
                    Dates &amp; Room
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
                          // Keep the range valid — clear a check-out that's now earlier.
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
                        // At least one night — the check-in day itself is not selectable.
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

                  <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Guests</label>
                      <div className="flex items-center justify-between rounded-sm border border-brand/30 bg-paper px-3.5 py-2">
                        <button
                          type="button"
                          aria-label="Decrease guests"
                          disabled={guests <= 1}
                          onClick={() =>
                            setValue("guests", Math.max(1, guests - 1), { shouldValidate: true })
                          }
                          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border border-brand/40 bg-paper text-[16px] leading-none text-brand transition-colors duration-300 ease-brand hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="font-lato text-[15px] text-ink">{guests}</span>
                        <button
                          type="button"
                          aria-label="Increase guests"
                          disabled={guests >= maxGuests}
                          onClick={() =>
                            setValue("guests", Math.min(maxGuests, guests + 1), {
                              shouldValidate: true,
                            })
                          }
                          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border border-brand/40 bg-paper text-[16px] leading-none text-brand transition-colors duration-300 ease-brand hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-1.5 font-lato text-[12px] text-ink/45">
                        Guest up to {maxGuests}
                      </p>
                      {errors.guests && <p className={errCls}>{errors.guests.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Room</label>
                      <input readOnly value={unit.name} className={readonlyCls} />
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

                  {unit.extraBed && (
                    <div className="mb-2 border-t border-brand/20 pt-6">
                      <span className="mb-4 block font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink/55">
                        Special Request
                      </span>
                      <div className="mb-[18px] flex items-center justify-between gap-4">
                        <div className="flex flex-col items-start justify-start">
                       <span className="font-lato text-[14.5px] text-ink">
                          Add an extra bed?{" "}
                          <span className="text-ink/50">
                            ({formatNaira(unit.extraBedPrice)} each)
                          </span>
                        </span>
                           {extraBed && (
                        <div className="flex items-center justify-between rounded-sm bg-paper py-3">
                          {/* <span className="font-lato text-[13.5px] text-ink/75">
                            Number of extra beds
                          </span> */}
                          <div className="flex items-center gap-3.5">
                            <button
                              type="button"
                              aria-label="Decrease extra beds"
                              disabled={extraBeds <= 1}
                              onClick={() => setValue("extraBeds", Math.max(1, extraBeds - 1))}
                              className="h-[30px] w-[30px] cursor-pointer rounded-full border border-brand/40 text-[16px] leading-none text-brand transition-colors duration-300 ease-brand hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>
                            <span className="min-w-4 text-center font-lato text-[15px] text-ink">
                              {extraBeds}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase extra beds"
                              disabled={extraBeds >= 4}
                              onClick={() => setValue("extraBeds", Math.min(4, extraBeds + 1))}
                              className="h-[30px] w-[30px] cursor-pointer rounded-full border border-brand/40 text-[16px] leading-none text-brand transition-colors duration-300 ease-brand hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                        </div>

                        <div className="flex gap-2.5">
                          {([false, true] as const).map((choice) => (
                            <button
                              key={String(choice)}
                              type="button"
                              aria-pressed={extraBed === choice}
                              onClick={() => setValue("extraBed", choice)}
                              className={cn(
                                "cursor-pointer rounded-sm border border-brand/35 px-[18px] py-2 font-montserrat text-[11.5px] uppercase tracking-[0.1em] transition-colors duration-300 ease-brand",
                                extraBed === choice
                                  ? "bg-brand font-semibold text-paper"
                                  : "bg-transparent text-ink hover:border-brand hover:text-brand",
                              )}
                            >
                              {choice ? "Yes" : "No"}
                            </button>
                          ))}
                        </div>


                      
                      </div>
                     
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 — Guest Details */}
              {step === 2 && (
                <div>
                  <h3 className="mb-6 font-cinzel text-[22px] font-semibold text-ink">
                    Guest Details
                  </h3>
                  <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Contact Email</label>
                      <input type="email" {...register("email")} className={inputCls} placeholder="you@example.com" />
                      {errors.email && <p className={errCls}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Contact Phone</label>
                      {/* Picker + number share one border, divided internally. */}
                      <div
                        className={cn(
                          // No `overflow-hidden` here — it would clip the dial-code dropdown.
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
                </div>
              )}

              {/* STEP 3 — Review & Confirm */}
              {step === 3 && (
                <div>
                  <h3 className="mb-3 font-cinzel text-[22px] font-semibold text-ink">
                    Review &amp; Confirm
                  </h3>
                  <p className="mb-6 font-lato text-[14px] leading-relaxed text-ink/65">
                    Please check your details before continuing to payment.
                  </p>
                  <div className="border-t border-brand/10">
                    <SummaryRow label="Room" value={unit.name} />
                    <SummaryRow label="Dates" value={values.checkIn && values.checkOut ? `${values.checkIn} → ${values.checkOut}` : "—"} />
                    <SummaryRow label="Nights" value={String(nights || "—")} />
                    <SummaryRow label="Guests" value={String(values.guests)} />
                    <SummaryRow label="Guest" value={values.name || "—"} />
                    <SummaryRow label="Email" value={values.email || "—"} />
                    <SummaryRow label="Phone" value={values.phone ? `${values.dialCode} ${values.phone}` : "—"} />
                  </div>
                  <label className="mt-6 flex items-start gap-2.5 font-lato text-[13.5px] text-ink">
                    <input type="checkbox" {...register("agreedToTerms")} className="mt-1 h-4 w-4 accent-[#C81E2A]" />
                    I agree to the Terms of Use and Privacy Policy.
                  </label>
                  {errors.agreedToTerms && <p className={errCls}>{errors.agreedToTerms.message}</p>}
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
                        <ReceiptUpload
                          value={receipt}
                          onChange={setReceipt}
                          onUploadingChange={setUploadingReceipt}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 — Confirmed */}
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
                    {submitting
                      ? step === 1
                        ? "Checking…"
                        : "Please wait…"
                      : step === 1
                        ? availabilityConfirmed
                          ? "Continue"
                          : "Check Availability"
                        : step === 4
                          ? method === "card"
                            ? "Pay Now"
                            : "Submit Booking"
                          : "Continue"}
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

                <h3 className="font-cinzel text-[21px] font-semibold text-ink">{unit.name}</h3>
                <p className="mb-6 mt-1 font-lato text-[12.5px] text-ink/55">
                  U2E Apartments · {unit.category}
                </p>

                <div className="border-t border-brand/10">
                  <SummaryRow
                    label="Dates"
                    value={values.checkIn && values.checkOut ? `${values.checkIn} → ${values.checkOut}` : "—"}
                  />
                  <SummaryRow label="Nights" value={String(nights || "—")} />
                  <SummaryRow label="Guests" value={String(values.guests)} />
                  <SummaryRow
                    label="Extra bed"
                    value={values.extraBed ? `${values.extraBeds || 1} × ${formatNaira(unit.extraBedPrice)}` : "—"}
                  />
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
