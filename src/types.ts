export type StatusOption = 'Applied' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
export type ReminderMailStatus = 'Not yet' | 'Sent';

export interface Applicant {
  id: string;
  serialNo: string;
  name: string;
  email: string;
  status: StatusOption;
  created: string;      // ISO date string, e.g. "2026-07-05"
  submitted: string;    // ISO date string
  notes: string;
  lastUpdated: string;  // ISO date string, set automatically on every save
  reminderMailSent: ReminderMailStatus;
}

export interface EnrichedApplicant extends Applicant {
  waiting: number;
  remaining: number;
  urg: { label: string; color: string };
}

export interface ApplicantFormData {
  serialNo: string;
  name: string;
  email: string;
  status: StatusOption;
  created: string;
  submitted: string;
  notes: string;
  reminderMailSent: ReminderMailStatus;
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
