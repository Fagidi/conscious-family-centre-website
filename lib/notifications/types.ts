export type TemplateKey =
  | "confirmation"
  | "approved"
  | "rejected"
  | "payment-reminder"
  | "payment-received"
  | "camp-reminder"
  | "completion"
  | "admin-alert";

export type AdminAlertType =
  | "new-registration"
  | "payment-proof"
  | "payment-verified"
  | "registration-cancelled"
  | "capacity-warning"
  | "camp-full"
  | "sheets-sync-failed"
  | "email-failed"
  | "system-error";

export type NotificationChannel = "email" | "sms" | "whatsapp" | "push";

export type EmailStatus = "sent" | "failed" | "no-provider" | "disabled";

export interface EmailResult {
  ok: boolean;
  status: EmailStatus;
  messageId?: string;
  error?: string;
  templateKey: TemplateKey;
  recipient: string;
}

export interface EmailBranding {
  senderName:       string;
  senderEmail:      string;
  replyTo:          string;
  schoolAddress:    string;
  phone:            string;
  website:          string;
  facebook?:        string;
  instagram?:       string;
  footerCopyright:  string;
  footerDisclaimer: string;
  accentColor:      string;
}

export interface NotificationSettings {
  // Parent
  confirmationEmail:    boolean;
  approvedEmail:        boolean;
  rejectedEmail:        boolean;
  paymentReminderEmail: boolean;
  paymentReceivedEmail: boolean;
  campReminderEmail:    boolean;
  completionEmail:      boolean;
  // Admin
  adminNewRegistration:     boolean;
  adminPaymentProof:        boolean;
  adminPaymentVerification: boolean;
  adminCancelled:           boolean;
  adminCapacityWarning:     boolean;
  adminCampFull:            boolean;
  adminSheetsSyncFailed:    boolean;
  adminEmailFailed:         boolean;
  adminSystemErrors:        boolean;
  // Custom subjects
  subjectConfirmation?:    string;
  subjectApproved?:        string;
  subjectRejected?:        string;
  subjectPaymentReminder?: string;
  subjectCampReminder?:    string;
  subjectCompletion?:      string;
}

export interface SendEmailParams {
  to:       string;
  subject:  string;
  html:     string;
  from?:    string;
  replyTo?: string;
}
