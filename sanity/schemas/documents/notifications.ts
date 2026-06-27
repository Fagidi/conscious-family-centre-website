import { defineField, defineType } from "sanity";

export const emailLog = defineType({
  name: "emailLog",
  title: "Email Log",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "recipient",     title: "Recipient",      type: "string" }),
    defineField({ name: "subject",       title: "Subject",        type: "string" }),
    defineField({ name: "templateKey",   title: "Template",       type: "string" }),
    defineField({ name: "status",        title: "Status",         type: "string" }),
    defineField({ name: "provider",      title: "Provider",       type: "string" }),
    defineField({ name: "messageId",     title: "Message ID",     type: "string" }),
    defineField({ name: "error",         title: "Error",          type: "text" }),
    defineField({ name: "retryCount",    title: "Retry Count",    type: "number" }),
    defineField({ name: "registrationId",title: "Registration ID",type: "string" }),
    defineField({ name: "sentAt",        title: "Sent At",        type: "datetime" }),
  ],
  preview: {
    select: { title: "subject", subtitle: "recipient", status: "status" },
    prepare({ title, subtitle, status }: { title?: string; subtitle?: string; status?: string }) {
      return { title: title ?? "—", subtitle: `${subtitle ?? "—"} · ${status ?? "—"}` };
    },
  },
});

export const notificationDocuments = [emailLog];
