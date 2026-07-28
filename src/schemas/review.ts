import { z } from "zod";

/** Guest review submission. Reservation-level — the room(s) reviewed are derived
 * server-side from the reservation, not sent by the client. */
export const reviewSchema = z.object({
  reservationNumber: z.string().trim().min(1, "Reservation number is required").max(60),
  guestName: z.string().trim().min(1, "Please enter your name").max(120),
  rating: z.number().int().min(1, "Pick a rating").max(5),
  body: z.string().trim().min(1, "Please write a few words").max(4000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
