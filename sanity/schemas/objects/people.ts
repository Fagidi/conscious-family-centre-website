import { defineField, defineType } from "sanity";

/**
 * Form-captured objects embedded in registration/enquiry documents.
 * These are written by server actions, not edited by hand, but having the
 * schema means Studio renders them readably for staff.
 */

export const childDetail = defineType({
  name: "childDetail",
  title: "Child",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "dateOfBirth", title: "Date of birth", type: "date" }),
    defineField({ name: "allergies", type: "text", rows: 2 }),
    defineField({ name: "medicalNotes", title: "Medical notes", type: "text", rows: 2 }),
    defineField({ name: "photoConsent", title: "Photo consent", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "dateOfBirth" } },
});

export const guardianDetail = defineType({
  name: "guardianDetail",
  title: "Guardian",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "emergencyName", title: "Emergency contact name", type: "string" }),
    defineField({ name: "emergencyPhone", title: "Emergency contact phone", type: "string" }),
    defineField({ name: "pickupAuthorization", title: "Pickup authorization", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "name", subtitle: "phone" } },
});

export const peopleObjects = [childDetail, guardianDetail];
