import { z } from "zod";

/**
 * Future Makers registration schema — the single source of truth shared by the
 * multi-step form (React Hook Form) and the `submitRegistration` server action.
 * Conditional rules (nanny required for under-4s, "Other" weeks needs a value,
 * policy must be agreed) live in a superRefine so both layers enforce them.
 */

const under4 = ["0-18m", "18m-2", "2-3", "3-4"] as const;

export const registrationSchema = z
  .object({
    // Step 1 — parent
    email: z.string().trim().email("Please enter a valid email address."),
    parentFullName: z.string().trim().min(2, "Please enter your full name."),
    parentPhone: z.string().trim().regex(/^[+]?[\d\s-]{7,}$/, "Please enter a valid phone number."),
    cfcAttendanceHistory: z.enum(["yes", "other-events", "no"], {
      errorMap: () => ({ message: "Please select an option." }),
    }),

    // Step 2 — child
    childrenFullNames: z.string().trim().min(2, "Please enter your child's full name."),
    childrenAges: z.enum(["0-18m", "18m-2", "2-3", "3-4", "4-6", "6-8", "8-10", "10+"], {
      errorMap: () => ({ message: "Please select an age." }),
    }),
    childOneGender: z.enum(["male", "female"], { errorMap: () => ({ message: "Please select a gender." }) }),
    // nullish: an unselected radio yields null (not undefined) via RHF/draft restore.
    childTwoGender: z.enum(["male", "female"]).nullish(),
    tshirtSize: z.string().trim().min(1, "Please select a T-shirt size."),

    // Step 3 — nanny (conditional)
    nannyName: z.string().trim().optional().or(z.literal("")),
    nannyPhone: z.string().trim().optional().or(z.literal("")),

    // Step 4 — programme
    selectedMonths: z.enum(["july-august", "july", "august"], {
      errorMap: () => ({ message: "Please select month(s)." }),
    }),
    selectedWeeks: z.enum(["2", "4", "6", "8", "other"], {
      errorMap: () => ({ message: "Please select a duration." }),
    }),
    selectedWeeksOther: z.string().trim().optional().or(z.literal("")),
    paymentOption: z.enum(["full", "deposit"], { errorMap: () => ({ message: "Please choose a payment option." }) }),

    // Step 5 — emergency
    emergencyContact: z.string().trim().min(5, "Please provide a contact name and phone number."),

    // Step 6 — policies
    electronicSignature: z.string().trim().min(2, "Please type your full name as your signature."),
    policyAgreement: z.literal(true, { errorMap: () => ({ message: "You must agree to continue." }) }),
  })
  .superRefine((v, ctx) => {
    if (under4.includes(v.childrenAges as (typeof under4)[number])) {
      if (!v.nannyName) ctx.addIssue({ path: ["nannyName"], code: "custom", message: "Nanny's name is required for children under 4." });
      if (!v.nannyPhone) ctx.addIssue({ path: ["nannyPhone"], code: "custom", message: "Nanny's phone is required for children under 4." });
    }
    if (v.selectedWeeks === "other" && !v.selectedWeeksOther) {
      ctx.addIssue({ path: ["selectedWeeksOther"], code: "custom", message: "Please tell us how many weeks." });
    }
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;

/** Fields validated at each step (drives per-step "Next" validation). */
export const STEP_FIELDS: (keyof RegistrationValues)[][] = [
  ["email", "parentFullName", "parentPhone", "cfcAttendanceHistory"], // 1 parent
  ["childrenFullNames", "childrenAges", "childOneGender", "tshirtSize"], // 2 child
  ["nannyName", "nannyPhone"], // 3 nanny (conditional)
  ["selectedMonths", "selectedWeeks", "selectedWeeksOther", "paymentOption"], // 4 programme
  ["emergencyContact"], // 5 emergency
  ["electronicSignature", "policyAgreement"], // 6 policies
];
