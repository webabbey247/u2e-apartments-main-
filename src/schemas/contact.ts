import { z } from "zod";

export const CONTACT_REASONS = ["Inquiry", "Complaint", "Suggestion"] as const;

/**
 * ContactMessage input — single source of truth for the contact form
 * (react-hook-form resolver) and the future `POST /api/contact` route (Phase 3).
 */
export const contactMessageSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  reason: z.enum(CONTACT_REASONS, { error: "Select a reason" }),
  message: z.string().min(10, "Please add a little more detail").max(2000, "Message is too long"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
