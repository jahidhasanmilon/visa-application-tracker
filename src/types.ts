export type StatusOption = 'Applied' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export interface Applicant {
  id: string;
  serialNo: string;
  name: string;
  email: string;
  status: StatusOption;
  created: string;   // ISO date string, e.g. "2026-07-05"
  submitted: string; // ISO date string
  notes: string;
}

export interface EnrichedApplicant extends Applicant {
  waiting: number;
  remaining: number;
  urg: { label: string; color: string };
}

export interface LogEntry {
  date: string;
  name: string;
  update: string;
  notes: string;
}

export interface ApplicantFormData {
  name: string;
  email: string;
  status: StatusOption;
  created: string;
  submitted: string;
  notes: string;
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
