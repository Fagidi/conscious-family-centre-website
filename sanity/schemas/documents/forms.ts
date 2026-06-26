import { defineField, defineType } from "sanity";

export const campRegistration = defineType({
  name: "campRegistration",
  title: "Camp Registration",
  type: "document",
  fields: [
    defineField({ name: "reference", title: "Booking Reference", type: "string", readOnly: true }),
    defineField({ name: "camp", title: "Camp Session", type: "reference", to: [{ type: "campSession" }], readOnly: true }),
    defineField({ name: "sessionKeys", title: "Sessions Booked", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "children", title: "Children", type: "array", of: [{ type: "childDetail" }], readOnly: true }),
    defineField({ name: "guardian", title: "Parent / Guardian", type: "guardianDetail", readOnly: true }),
    defineField({ name: "amountNGN", title: "Amount (₦)", type: "number", readOnly: true }),
    defineField({ name: "gateway", title: "Payment Method", type: "string", readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Waitlist", value: "waitlist" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({ name: "createdAt", title: "Submitted", type: "datetime", readOnly: true }),
    defineField({ name: "paidAt", title: "Paid On", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest first", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { guardian: "guardian.name", camp: "camp.title", status: "status" },
    prepare: ({ guardian, camp, status }) => ({ title: `${guardian ?? "—"} → ${camp ?? "camp"}`, subtitle: status }),
  },
});

export const admissionEnquiry = defineType({
  name: "admissionEnquiry",
  title: "Admission Enquiry",
  type: "document",
  fields: [
    defineField({ name: "childName", title: "Child's Name", type: "string", readOnly: true }),
    defineField({ name: "childAge", title: "Child's Age", type: "string", readOnly: true }),
    defineField({ name: "programInterest", title: "Programs Interested In", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "preferredStart", title: "Preferred Start Date", type: "string", readOnly: true }),
    defineField({ name: "guardian", title: "Parent / Guardian", type: "guardianDetail", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Enrolled", value: "enrolled" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", title: "Submitted", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest first", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "childName", subtitle: "status" } },
});

export const tourBooking = defineType({
  name: "tourBooking",
  title: "Tour Booking",
  type: "document",
  fields: [
    defineField({ name: "guardian", title: "Parent / Guardian", type: "guardianDetail", readOnly: true }),
    defineField({ name: "preferredDates", title: "Preferred Dates", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "partySize", title: "Number of Visitors", type: "number", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", title: "Submitted", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest first", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "guardian.name", subtitle: "status" } },
});

export const contactMessage = defineType({
  name: "contactMessage",
  title: "Contact Message",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "subject", title: "Subject", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "createdAt", title: "Submitted", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest first", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "name", subtitle: "subject" } },
});

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "parentName", title: "Parent Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "childAge", title: "Child's Age", type: "string", readOnly: true }),
    defineField({ name: "programInterest", title: "Program Interest", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "preferredContact", title: "Preferred Contact Method", type: "string", readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Enrolled", value: "enrolled" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", title: "Submitted", type: "datetime", readOnly: true }),
  ],
  orderings: [{ name: "newest", title: "Newest first", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "parentName", subtitle: "status", program: "programInterest" },
    prepare: ({ title, subtitle, program }) => ({ title: title ?? "—", subtitle: `${program ?? ""} · ${subtitle ?? "new"}` }),
  },
});

export const futureMakersRegistration = defineType({
  name: "futureMakersRegistration",
  title: "Camp Registration",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "parent", title: "Parent" },
    { name: "child", title: "Child" },
    { name: "programme", title: "Programme" },
    { name: "admin", title: "Admin Notes" },
  ],
  fields: [
    // ── Overview ──────────────────────────────────────────────────
    defineField({
      name: "status",
      title: "Registration Status",
      type: "string",
      group: "overview",
      options: {
        list: [
          { value: "pending-payment",       title: "Pending Payment" },
          { value: "awaiting-verification", title: "Awaiting Verification" },
          { value: "confirmed",             title: "Confirmed" },
          { value: "checked-in",            title: "Checked In" },
          { value: "completed",             title: "Completed" },
          { value: "cancelled",             title: "Cancelled" },
          { value: "waitlist",              title: "Waitlist" },
        ],
        layout: "radio",
      },
      initialValue: "awaiting-verification",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      group: "overview",
      options: {
        list: [
          { value: "awaiting-review", title: "Awaiting Review" },
          { value: "deposit-paid",    title: "Deposit Paid" },
          { value: "fully-paid",      title: "Fully Paid" },
          { value: "payment-issue",   title: "Payment Issue" },
          { value: "refunded",        title: "Refunded" },
        ],
        layout: "radio",
      },
      initialValue: "awaiting-review",
    }),
    defineField({ name: "paymentProofFile", title: "Proof of Payment", type: "file", group: "overview", readOnly: true }),
    defineField({ name: "estimatedFee", title: "Estimated Fee (₦)", type: "number", group: "overview", readOnly: true }),
    defineField({
      name: "timeline",
      title: "Activity Timeline",
      description: "Automatically recorded events",
      type: "array",
      of: [{ type: "timelineEvent" }],
      group: "overview",
      readOnly: true,
    }),
    defineField({ name: "googleSheetsSynced",   title: "Synced to Google Sheets", type: "boolean",  group: "overview", readOnly: true }),
    defineField({ name: "googleSheetsSyncedAt", title: "Sheets Sync Time",        type: "datetime", group: "overview", readOnly: true }),
    defineField({ name: "googleSheetsError",    title: "Sheets Sync Error",       type: "string",   group: "overview", readOnly: true }),

    // ── Parent ────────────────────────────────────────────────────
    defineField({ name: "registrationId",      title: "Registration ID",       type: "string",   group: "parent", readOnly: true }),
    defineField({ name: "submissionDate",      title: "Submitted On",          type: "datetime", group: "parent", readOnly: true }),
    defineField({ name: "parentFullName",      title: "Parent Name",           type: "string",   group: "parent", readOnly: true }),
    defineField({ name: "email",               title: "Email",                 type: "string",   group: "parent", readOnly: true }),
    defineField({ name: "parentPhone",         title: "Parent Phone",          type: "string",   group: "parent", readOnly: true }),
    defineField({ name: "cfcAttendanceHistory", title: "Previous Attendance",  type: "string",   group: "parent", readOnly: true }),

    // ── Child ─────────────────────────────────────────────────────
    defineField({ name: "childrenFullNames", title: "Children's Names",   type: "string", group: "child", readOnly: true }),
    defineField({ name: "childrenAges",      title: "Age Group",          type: "string", group: "child", readOnly: true }),
    defineField({ name: "childOneGender",    title: "Child 1 Gender",     type: "string", group: "child", readOnly: true }),
    defineField({ name: "childTwoGender",    title: "Child 2 Gender",     type: "string", group: "child", readOnly: true }),
    defineField({ name: "tshirtSizes",       title: "T-shirt Size(s)",    type: "string", group: "child", readOnly: true }),
    defineField({ name: "nannyName",         title: "Nanny Name",         type: "string", group: "child", readOnly: true }),
    defineField({ name: "nannyPhone",        title: "Nanny Phone",        type: "string", group: "child", readOnly: true }),
    defineField({ name: "emergencyContact",  title: "Emergency Contact",  type: "string", group: "child", readOnly: true }),

    // ── Programme ─────────────────────────────────────────────────
    defineField({ name: "selectedMonths",     title: "Month(s)",                type: "string", group: "programme", readOnly: true }),
    defineField({ name: "selectedWeeks",      title: "Duration",                type: "string", group: "programme", readOnly: true }),
    defineField({ name: "selectedWeeksOther", title: "Duration (custom)",       type: "string", group: "programme", readOnly: true }),
    defineField({ name: "paymentOption",      title: "Payment Option",          type: "string", group: "programme", readOnly: true }),

    // ── Admin ─────────────────────────────────────────────────────
    defineField({ name: "adminNotes",         title: "Staff Notes",             type: "text",    group: "admin" }),
    defineField({ name: "electronicSignature", title: "Electronic Signature",   type: "string",  group: "admin", readOnly: true }),
    defineField({ name: "policyAgreement",    title: "Policy Agreed",           type: "boolean", group: "admin", readOnly: true }),
  ],
  orderings: [
    { name: "newest",         title: "Newest first",    by: [{ field: "submissionDate", direction: "desc" }] },
    { name: "oldest",         title: "Oldest first",    by: [{ field: "submissionDate", direction: "asc" }] },
    { name: "registrationId", title: "Registration ID", by: [{ field: "registrationId", direction: "asc" }] },
  ],
  preview: {
    select: {
      id: "registrationId",
      parent: "parentFullName",
      child: "childrenFullNames",
      status: "status",
      payment: "paymentStatus",
    },
    prepare: ({ id, parent, child, status, payment }: { id?: string; parent?: string; child?: string; status?: string; payment?: string }) => ({
      title: `${id ?? "—"}  ·  ${parent ?? "Unknown"}`,
      subtitle: `${child ?? ""}  ·  ${status ?? "awaiting-verification"}  ·  ${payment ?? "awaiting-review"}`,
    }),
  },
});

export const campSettings = defineType({
  name: "campSettings",
  title: "Camp Settings",
  type: "document",
  fields: [
    defineField({
      name: "programmeYear",
      title: "Programme Year",
      type: "string",
      initialValue: "2026",
      description: "e.g. 2026",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "capacity",
      title: "Total Capacity",
      type: "number",
      initialValue: 50,
      description: "Maximum number of children that can be registered for the camp",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "acceptingRegistrations",
      title: "Accepting Registrations",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to temporarily pause new registrations",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Private staff notes about this camp season",
    }),
  ],
  preview: { prepare: () => ({ title: "Camp Settings — Future Makers 2026" }) },
});

export const subscriber = defineType({
  name: "subscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email Address", type: "string", readOnly: true }),
    defineField({ name: "createdAt", title: "Subscribed On", type: "datetime", readOnly: true }),
  ],
  preview: { select: { title: "email" } },
});

export const formDocuments = [
  campSettings,
  campRegistration,
  futureMakersRegistration,
  admissionEnquiry,
  tourBooking,
  contactMessage,
  inquiry,
  subscriber,
];
