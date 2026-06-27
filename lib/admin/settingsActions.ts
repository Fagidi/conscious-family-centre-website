"use server";

import { writeClient } from "@/lib/sanity/client";
import { revalidatePath } from "next/cache";
import type { NotificationSettings, EmailBranding } from "@/lib/notifications/types";

async function upsertSingleton(type: string, data: Record<string, unknown>) {
  if (!writeClient) return { ok: false as const, error: "Write client not configured." };
  try {
    const existing = await writeClient.fetch<{ _id: string } | null>(`*[_type == "${type}"][0]{_id}`);
    if (existing?._id) {
      await writeClient.patch(existing._id).set(data).commit();
    } else {
      await writeClient.create({ _type: type, ...data });
    }
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function saveNotificationSettings(
  settings: NotificationSettings,
): Promise<{ ok: boolean; error?: string }> {
  const result = await upsertSingleton("notificationSettings", settings as unknown as Record<string, unknown>);
  if (result.ok) revalidatePath("/admin/settings/notifications");
  return result;
}

export async function saveEmailBranding(
  branding: EmailBranding,
): Promise<{ ok: boolean; error?: string }> {
  const result = await upsertSingleton("emailBranding", branding as unknown as Record<string, unknown>);
  if (result.ok) revalidatePath("/admin/settings/branding");
  return result;
}
