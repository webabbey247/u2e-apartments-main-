import { z } from "zod";

/**
 * EventEnquiry input — single source of truth for the Meetings & Events
 * enquiry form (react-hook-form resolver) and the future
 * `POST /api/meetings-events` route (Phase 3).
 */
export const eventEnquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
  eventType: z.string().min(1, "Select an event type"),
  eventDate: z.string().optional(),
  guests: z
    .number({ error: "Enter the number of guests" })
    .int()
    .min(1, "At least 1 guest")
    .max(2000, "That's a lot of guests — contact us directly"),
  message: z.string().max(1000, "Message is too long").optional(),
});

export type EventEnquiryInput = z.infer<typeof eventEnquirySchema>;
