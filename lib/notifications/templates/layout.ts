import type { EmailBranding } from "../types";

export function emailLayout(content: string, branding: EmailBranding): string {
  const accent = branding.accentColor ?? "#2F5D45";
  const socialLinks = [
    branding.facebook  ? `<a href="${branding.facebook}"  style="color:#6b7280;text-decoration:none;margin:0 6px">Facebook</a>`  : "",
    branding.instagram ? `<a href="${branding.instagram}" style="color:#6b7280;text-decoration:none;margin:0 6px">Instagram</a>` : "",
  ].filter(Boolean).join("&nbsp;·&nbsp;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Conscious Family Centre</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="padding:32px 16px">
<table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%">
  <!-- Header -->
  <tr>
    <td style="background:${accent};padding:28px 32px;border-radius:12px 12px 0 0;text-align:center">
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px">${branding.senderName}</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px">${branding.schoolAddress}</p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="background:#ffffff;padding:36px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      ${content}
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f3f4f6;padding:20px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;text-align:center">
      ${socialLinks ? `<p style="margin:0 0 8px;font-size:12px">${socialLinks}</p>` : ""}
      ${branding.phone ? `<p style="margin:0 0 4px;font-size:12px;color:#6b7280">${branding.phone}</p>` : ""}
      <p style="margin:0 0 4px;font-size:11px;color:#9ca3af">${branding.footerCopyright}</p>
      ${branding.footerDisclaimer ? `<p style="margin:4px 0 0;font-size:10px;color:#d1d5db">${branding.footerDisclaimer}</p>` : ""}
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function h1(text: string, accent = "#2F5D45"): string {
  return `<h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:${accent};line-height:1.3">${text}</h1>`;
}

export function p(text: string, muted = false): string {
  return `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${muted ? "#6b7280" : "#374151"}">${text}</p>`;
}

export function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 12px;background:#f9fafb;border-bottom:1px solid #f0f0f0;font-size:13px;color:#6b7280;width:160px">${label}</td>
    <td style="padding:8px 12px;background:#f9fafb;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111827;font-weight:500">${value}</td>
  </tr>`;
}

export function infoTable(rows: [string, string][]): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 20px">
    ${rows.map(([l, v]) => infoRow(l, v)).join("")}
  </table>`;
}

export function button(text: string, href: string, accent = "#2F5D45"): string {
  return `<p style="margin:20px 0 0;text-align:center">
    <a href="${href}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px">${text}</a>
  </p>`;
}

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>`;
}
