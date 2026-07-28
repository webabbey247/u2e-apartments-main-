import { z } from "zod";

/** Guest review submission — validated at the API boundary and on the client. */
export const reviewSchema = z.object({
  reservationNumber: z.string().trim().min(1, "Reservation number is required").max(60),
  roomSlug: z.string().trim().min(1).max(120),
  // No .default() here: a Zod default makes the input/output types diverge,
  // which breaks react-hook-form's Resolver generics. The form always sends it.
  roomTitle: z.string().trim().max(160),
  guestName: z.string().trim().min(1, "Please enter your name").max(120),
  rating: z.number().int().min(1, "Pick a rating").max(5),
  body: z.string().trim().min(1, "Please write a few words").max(4000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
