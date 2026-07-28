import type { ReservationSummary } from "@/lib/queries/reviews";
import { formatNaira } from "@/schemas/booking";

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
 * The stay a guest is being asked to review, shown beside the review form.
 * Mirrors the booking modal's sticky summary so the details read the same way
 * they did at checkout — read-only here, since the stay is already complete.
 */
export function ReservationSummaryCard({ reservation }: { reservation: ReservationSummary }) {
  const r = reservation;
  return (
    <aside className="h-fit lg:sticky lg:top-28">
      <div className="rounded-lg border border-brand/20 bg-paper p-7 shadow-[0_12px_40px_rgba(30,31,34,0.07)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-mist px-3 py-1 font-montserrat text-[10px] uppercase tracking-[0.12em] text-ink/60">
            Completed stay
          </span>
          <span className="font-montserrat text-[11px] text-ink/45">{r.reservationNumber}</span>
        </div>

        <h3 className="font-cinzel text-[21px] font-semibold text-ink">{r.title}</h3>
        <p className="mb-6 mt-1 font-lato text-[12.5px] text-ink/55">
          U2E Apartments{r.category ? ` · ${r.category}` : ""}
        </p>

        <div className="border-t border-brand/10">
          <SummaryRow label="Rooms" value={r.roomsLabel} />
          <SummaryRow label="Dates" value={`${r.checkIn} → ${r.checkOut}`} />
          <SummaryRow label="Nights" value={String(r.nights || "—")} />
          <SummaryRow label="Guests" value={String(r.guests || "—")} />
          <SummaryRow label="Guest" value={r.guestName || "—"} />
          <SummaryRow label="Email" value={r.email || "—"} />
          <SummaryRow label="Phone" value={r.phone || "—"} />
        </div>

        <div className="mt-5 flex items-center justify-between rounded-md bg-mist px-4 py-3.5">
          <span className="font-montserrat text-[10.5px] uppercase tracking-[0.12em] text-ink/60">
            Total
          </span>
          <span className="font-cinzel text-[20px] font-semibold text-brand">
            {formatNaira(r.amount)}
          </span>
        </div>

        <p className="mt-4 font-lato text-[11.5px] leading-relaxed text-ink/45">
          Reviews are published once our team has looked them over. Only the name and words you
          write below are ever shown publicly.
        </p>
      </div>
    </aside>
  );
}
