import { defineField, defineType } from "sanity";

export const notificationSettings = defineType({
  name: "notificationSettings",
  title: "Notification Settings",
  type: "document",
  groups: [
    { name: "parent",  title: "Parent Notifications", default: true },
    { name: "admin",   title: "Admin Notifications" },
    { name: "subjects",title: "Email Subjects" },
  ],
  fields: [
    // ── Parent notifications ──────────────────────────────────────────────
    defineField({ name: "confirmationEmail",   title: "Registration Confirmation",    type: "boolean", group: "parent",   initialValue: true }),
    defineField({ name: "approvedEmail",       title: "Registration Approved",         type: "boolean", group: "parent",   initialValue: true }),
    defineField({ name: "rejectedEmail",       title: "Registration Rejected",         type: "boolean", group: "parent",   initialValue: true }),
    defineField({ name: "paymentReminderEmail",title: "Payment Reminder",              type: "boolean", group: "parent",   initialValue: true }),
    defineField({ name: "paymentReceivedEmail",title: "Payment Received",              type: "boolean", group: "parent",   initialValue: true }),
    defineField({ name: "campReminderEmail",   title: "Camp Reminder (7d / 3d / 1d)", type: "boolean", group: "parent",   initialValue: true }),
    defineField({ name: "completionEmail",     title: "Camp Completion Thank You",     type: "boolean", group: "parent",   initialValue: true }),

    // ── Admin notifications ───────────────────────────────────────────────
    defineField({ name: "adminNewRegistration",    title: "New Registration",              type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminPaymentProof",       title: "Payment Proof Uploaded",        type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminPaymentVerification",title: "Payment Requires Verification", type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminCancelled",          title: "Registration Cancelled",        type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminCapacityWarning",    title: "Camp Capacity Warning",         type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminCampFull",           title: "Camp Full",                     type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminSheetsSyncFailed",   title: "Google Sheets Sync Failed",     type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminEmailFailed",        title: "Email Delivery Failed",         type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "adminSystemErrors",       title: "System Errors",                 type: "boolean", group: "admin", initialValue: true }),

    // ── Custom subject lines ──────────────────────────────────────────────
    defineField({ name: "subjectConfirmation",   title: "Confirmation Subject",  type: "string", group: "subjects" }),
    defineField({ name: "subjectApproved",       title: "Approved Subject",      type: "string", group: "subjects" }),
    defineField({ name: "subjectRejected",       title: "Rejected Subject",      type: "string", group: "subjects" }),
    defineField({ name: "subjectPaymentReminder",title: "Payment Reminder Subject", type: "string", group: "subjects" }),
    defineField({ name: "subjectCampReminder",   title: "Camp Reminder Subject", type: "string", group: "subjects" }),
    defineField({ name: "subjectCompletion",     title: "Completion Subject",    type: "string", group: "subjects" }),
  ],
});
