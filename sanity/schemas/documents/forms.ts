import { defineField, defineType } from "sanity";

/**
 * Submission documents. Created by server actions (lib/actions/*) and the
 * payment webhook; staff manage status from Studio. Identifying fields are
 * read-only so records aren't accidentally edited.
 */

export const campRegistration = defineType({
  name: "campRegistration",
  title: "Camp registration",
  type: "document",
  fields: [
    defineField({ name: "reference", type: "string", readOnly: true }),
    defineField({ name: "camp", type: "reference", to: [{ type: "campSession" }], readOnly: true }),
    defineField({ name: "sessionKeys", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "children", type: "array", of: [{ type: "childDetail" }], readOnly: true }),
    defineField({ name: "guardian", type: "guardianDetail", readOnly: true }),
    defineField({ name: "amountNGN", title: "Amount (₦)", type: "number", readOnly: true }),
    defineField({ name: "gateway", type: "string", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["pending", "paid", "waitlist", "cancelled"], layout: "radio" },
      initialValue: "pending",
    }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
    defineField({ name: "paidAt", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { guardian: "guardian.name", camp: "camp.title", status: "status" },
    prepare: ({ guardian, camp, status }) => ({ title: `${guardian ?? "—"} → ${camp ?? "camp"}`, subtitle: status }),
  },
});

export const admissionEnquiry = defineType({
  name: "admissionEnquiry",
  title: "Admission enquiry",
  type: "document",
  fields: [
    defineField({ name: "childName", type: "string", readOnly: true }),
    defineField({ name: "childAge", type: "string", readOnly: true }),
    defineField({ name: "programInterest", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "preferredStart", type: "string", readOnly: true }),
    defineField({ name: "guardian", type: "guardianDetail", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["new", "contacted", "enrolled", "closed"], layout: "radio" },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "childName", subtitle: "status" } },
});

export const tourBooking = defineType({
  name: "tourBooking",
  title: "Tour booking",
  type: "document",
  fields: [
    defineField({ name: "guardian", type: "guardianDetail", readOnly: true }),
    defineField({ name: "preferredDates", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "partySize", type: "number", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["new", "confirmed", "completed", "cancelled"], layout: "radio" },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "guardian.name", subtitle: "status" } },
});

export const contactMessage = defineType({
  name: "contactMessage",
  title: "Contact message",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "phone", type: "string", readOnly: true }),
    defineField({ name: "subject", type: "string", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "name", subtitle: "subject" } },
});

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "parentName", title: "Parent name", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "phone", type: "string", readOnly: true }),
    defineField({ name: "childAge", title: "Child age", type: "string", readOnly: true }),
    defineField({ name: "programInterest", title: "Program interest", type: "string", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({ name: "preferredContact", title: "Preferred contact method", type: "string", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["new", "contacted", "enrolled", "closed"], layout: "radio" },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "parentName", subtitle: "status", program: "programInterest" },
    prepare: ({ title, subtitle, program }) => ({ title: title ?? "—", subtitle: `${program ?? ""} · ${subtitle ?? "new"}` }),
  },
});

export const futureMakersRegistration = defineType({
  name: "futureMakersRegistration",
  title: "Future Makers registration",
  type: "document",
  groups: [
    { name: "status", title: "Status", default: true },
    { name: "details", title: "Submission" },
  ],
  fields: [
    // Admin-editable status fields.
    defineField({
      name: "status",
      type: "string",
      group: "status",
      options: {
        list: [
          { value: "pending-review", title: "Pending Review" },
          { value: "payment-received", title: "Payment Received" },
          { value: "confirmed", title: "Confirmed" },
          { value: "waitlisted", title: "Waitlisted" },
          { value: "cancelled", title: "Cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "pending-review",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment status",
      type: "string",
      group: "status",
      options: {
        list: [
          { value: "awaiting-review", title: "Awaiting Review" },
          { value: "deposit-paid", title: "Deposit Paid" },
          { value: "fully-paid", title: "Fully Paid" },
          { value: "payment-issue", title: "Payment Issue" },
        ],
        layout: "radio",
      },
      initialValue: "awaiting-review",
    }),
    defineField({ name: "adminNotes", title: "Admin notes", type: "text", group: "status" }),
    defineField({ name: "paymentProofFile", title: "Proof of payment", type: "file", group: "status", readOnly: true }),

    // Read-only submission record.
    defineField({ name: "registrationId", title: "Registration ID", type: "string", group: "details", readOnly: true }),
    defineField({ name: "submissionDate", type: "datetime", group: "details", readOnly: true }),
    defineField({ name: "estimatedFee", title: "Estimated fee (₦)", type: "number", group: "details", readOnly: true }),
    defineField({ name: "email", type: "string", group: "details", readOnly: true }),
    defineField({ name: "parentFullName", title: "Parent full name", type: "string", group: "details", readOnly: true }),
    defineField({ name: "parentPhone", title: "Parent phone", type: "string", group: "details", readOnly: true }),
    defineField({ name: "cfcAttendanceHistory", title: "Attendance history", type: "string", group: "details", readOnly: true }),
    defineField({ name: "childrenFullNames", title: "Children full names", type: "string", group: "details", readOnly: true }),
    defineField({ name: "childrenAges", title: "Children ages", type: "string", group: "details", readOnly: true }),
    defineField({ name: "childOneGender", title: "Child 1 gender", type: "string", group: "details", readOnly: true }),
    defineField({ name: "childTwoGender", title: "Child 2 gender", type: "string", group: "details", readOnly: true }),
    defineField({ name: "tshirtSize", title: "T-shirt size", type: "string", group: "details", readOnly: true }),
    defineField({ name: "nannyName", title: "Nanny name", type: "string", group: "details", readOnly: true }),
    defineField({ name: "nannyPhone", title: "Nanny phone", type: "string", group: "details", readOnly: true }),
    defineField({ name: "selectedMonths", title: "Selected months", type: "string", group: "details", readOnly: true }),
    defineField({ name: "selectedWeeks", title: "Selected weeks", type: "string", group: "details", readOnly: true }),
    defineField({ name: "selectedWeeksOther", title: "Selected weeks (other)", type: "string", group: "details", readOnly: true }),
    defineField({ name: "paymentOption", title: "Payment option", type: "string", group: "details", readOnly: true }),
    defineField({ name: "emergencyContact", title: "Emergency contact", type: "string", group: "details", readOnly: true }),
    defineField({ name: "electronicSignature", title: "Electronic signature", type: "string", group: "details", readOnly: true }),
    defineField({ name: "policyAgreement", title: "Policy agreed", type: "boolean", group: "details", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "submissionDate", direction: "desc" }] }],
  preview: {
    select: { title: "parentFullName", id: "registrationId", status: "status", payment: "paymentStatus" },
    prepare: ({ title, id, status, payment }) => ({
      title: `${title ?? "—"} · ${id ?? ""}`,
      subtitle: `${status ?? "pending-review"} · ${payment ?? "awaiting-review"}`,
    }),
  },
});

export const subscriber = defineType({
  name: "subscriber",
  title: "Newsletter subscriber",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
  ],
  preview: { select: { title: "email" } },
});

export const formDocuments = [
  campRegistration,
  futureMakersRegistration,
  admissionEnquiry,
  tourBooking,
  contactMessage,
  inquiry,
  subscriber,
];
