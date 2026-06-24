import { z } from "zod";

/**
 * Inquiry form schema — the single source of truth shared by the client form
 * (React Hook Form via zodResolver) and the `submitInquiry` server action, so
 * client and server validation can never drift.
 */
export const inquirySchema = z.object({
  parentName: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,}$/, "Please enter a valid phone number."),
  childAge: z.string().trim().max(60).optional().or(z.literal("")),
  programInterest: z.string().trim().min(1, "Please choose an option."),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)."),
  preferredContact: z.enum(["email", "phone", "whatsapp"], {
    errorMap: () => ({ message: "Please choose how we should reach you." }),
  }),
});

export type InquiryValues = z.infer<typeof inquirySchema>;
