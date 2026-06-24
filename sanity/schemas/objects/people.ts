import { defineField, defineType } from "sanity";

export const childDetail = defineType({
  name: "childDetail",
  title: "Child",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Child's Name", type: "string" }),
    defineField({ name: "dateOfBirth", title: "Date of Birth", type: "date" }),
    defineField({ name: "allergies", title: "Allergies", type: "text", rows: 2 }),
    defineField({ name: "medicalNotes", title: "Medical Notes", type: "text", rows: 2 }),
    defineField({ name: "photoConsent", title: "Photo Permission", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "dateOfBirth" } },
});

export const guardianDetail = defineType({
  name: "guardianDetail",
  title: "Parent / Guardian",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string" }),
    defineField({ name: "phone", title: "Phone Number", type: "string" }),
    defineField({ name: "email", title: "Email Address", type: "string" }),
    defineField({ name: "emergencyName", title: "Emergency Contact Name", type: "string" }),
    defineField({ name: "emergencyPhone", title: "Emergency Contact Phone", type: "string" }),
    defineField({ name: "pickupAuthorization", title: "Pickup Authorization", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "name", subtitle: "phone" } },
});

export const peopleObjects = [childDetail, guardianDetail];
