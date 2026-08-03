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
}

export interface EnrichedApplicant extends Applicant {
  waiting: number;
  remaining: number;
  urg: { label: string; color: string };
  reminderDaysLeft: number; // 30 - (days since lastUpdated); negative once overdue
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
