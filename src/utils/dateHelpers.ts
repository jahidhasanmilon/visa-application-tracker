import { TARGET_DAYS } from '../constants/status';
import type { Applicant, EnrichedApplicant } from '../types';

export function daysBetween(a: string, b: string): number {
  const A = new Date(a + 'T00:00:00');
  const B = new Date(b + 'T00:00:00');
  return Math.round((B.getTime() - A.getTime()) / 86400000);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(d?: string): string {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function urgency(remaining: number): { label: string; color: string } {
  if (remaining <= 0) return { label: 'Overdue', color: '#C1440E' };
  if (remaining <= 30) return { label: 'Urgent', color: '#C1440E' };
  if (remaining <= 90) return { label: 'Soon', color: '#C9A227' };
  return { label: 'On track', color: '#2F6F62' };
}

// Enrich a raw applicant record with computed fields (waiting/remaining days, urgency)
export function enrichApplicant(a: Applicant, today: string = todayStr()): EnrichedApplicant {
  const waiting = daysBetween(a.created, today);
  const remaining = TARGET_DAYS - waiting;
  return { ...a, waiting, remaining, urg: urgency(remaining) };
}
