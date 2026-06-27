import "server-only";
import { writeClient } from "@/lib/sanity/client";
import type { EmailResult, TemplateKey } from "./types";

interface LogEmailParams {
  result:         EmailResult;
  registrationId?: string;
}

export async function logEmail({ result, registrationId }: LogEmailParams): Promise<void> {
  if (!writeClient) return;
  try {
    await writeClient.create({
      _type:          "emailLog",
      recipient:      result.recipient,
      subject:        result.templateKey,
      templateKey:    result.templateKey,
      status:         result.status,
      provider:       "brevo",
      messageId:      result.messageId ?? null,
      error:          result.error ?? null,
      retryCount:     0,
      registrationId: registrationId ?? null,
      sentAt:         new Date().toISOString(),
    });
  } catch (err) {
    console.error("[email-logger] failed to write log", err);
  }
}

export async function getEmailLogs(limit = 100): Promise<EmailLogEntry[]> {
  if (!writeClient) return [];
  try {
    return await writeClient.fetch<EmailLogEntry[]>(
      `*[_type == "emailLog"] | order(sentAt desc)[0...${limit}]{
        _id, recipient, subject, templateKey, status, provider, messageId, error,
        retryCount, registrationId, sentAt
      }`,
    );
  } catch {
    return [];
  }
}

export interface EmailLogEntry {
  _id:             string;
  recipient:       string;
  subject:         string;
  templateKey:     TemplateKey;
  status:          string;
  provider:        string;
  messageId?:      string;
  error?:          string;
  retryCount:      number;
  registrationId?: string;
  sentAt:          string;
}
