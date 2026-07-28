import { z } from "zod";

/** Customer contact details — created/updated during the Guest Details step. */
export const customerSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(160),
  name: z.string().trim().min(1, "Enter your full name").max(160),
  phone: z.string().trim().min(1, "Enter your contact phone").max(40),
  dialCode: z.string().trim().min(1).max(8),
  company: z.string().trim().max(160).optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
