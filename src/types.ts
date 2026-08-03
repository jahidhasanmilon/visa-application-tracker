// Base statuses always available; admins can add further custom ones at runtime,
// so this is intentionally a plain string rather than a closed union.
export type StatusOption = string;
export type ReminderStatus = 'Not yet' | 'Urgent' | 'Done';

export interface Applicant {
  id: string;
  serialNo: string;
  name: string;
  email: string;
  status: StatusOption;
  created: string;      // ISO date string, e.g. "2026-07-05" — application created date
  submitted: string;    // ISO date string — application submitted date (waiting time is measured from here)
  notes: string;
  lastUpdated: string;  // ISO date string, set manually by admin — not derived from anything
  reminderMailSent: ReminderStatus; // "Application Reminder (30-Day)" — editable by admin and the applicant
  // Server-only bookkeeping written by the sendReminderEmails Cloud Function
  // (functions/src/index.ts) so it emails once per 30-day cycle, not every day.
  // Never set by the client — Firestore rules only allow admin/applicant to
  // touch reminderMailSent.
  reminderEmailSentAt?: string;
}

export interface EnrichedApplicant extends Applicant {
  waiting: number;
  remaining: number;
  urg: { label: string; color: string };
  reminderDaysLeft: number; // 30 - (days since lastUpdated); negative once overdue
  // Display-only: 'Not yet' becomes 'Urgent' once the window is up. Never
  // overrides 'Done', and never gets written back — reminderMailSent stays
  // whatever was explicitly chosen.
  effectiveReminderStatus: ReminderStatus;
}

export interface ApplicantFormData {
  serialNo: string;
  name: string;
  email: string;
  status: StatusOption;
  created: string;
  submitted: string;
  notes: string;
  lastUpdated: string;
  reminderMailSent: ReminderStatus;
}

export interface StatCounts {
  total: number;
  urgent: number;
  overdue: number;
  approved: number;
}

export interface PieDatum {
  name: StatusOption;
  value: number;
}
