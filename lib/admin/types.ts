export type RegistrationStatus =
  | "pending-payment"
  | "awaiting-verification"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled"
  | "waitlist";

export type PaymentStatus =
  | "awaiting-review"
  | "deposit-paid"
  | "fully-paid"
  | "payment-issue"
  | "refunded";

export interface TimelineEvent {
  title: string;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Registration {
  _id: string;
  registrationId: string;
  parentFullName: string;
  email: string;
  parentPhone: string;
  childrenFullNames: string;
  childrenAges: string;
  childOneGender?: string;
  childTwoGender?: string;
  tshirtSizes?: string;
  nannyName?: string;
  nannyPhone?: string;
  emergencyContact?: string;
  selectedMonths?: string;
  selectedWeeks?: string;
  selectedWeeksOther?: string;
  paymentOption?: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  estimatedFee?: number;
  submissionDate: string;
  cfcAttendanceHistory?: string;
  adminNotes?: string;
  electronicSignature?: string;
  policyAgreement?: boolean;
  googleSheetsSynced?: boolean;
  googleSheetsSyncedAt?: string;
  googleSheetsError?: string;
  paymentProofUrl?: string;
  timeline?: TimelineEvent[];
}

export interface RegistrationStats {
  total: number;
  pendingPayment: number;
  awaitingVerification: number;
  confirmed: number;
  checkedIn: number;
  completed: number;
  cancelled: number;
  waitlist: number;
  awaitingPaymentReview: number;
  capacity: number;
}
