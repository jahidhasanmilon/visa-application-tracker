import { FileText, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StatusOption } from '../types';

export const STATUS_OPTIONS: StatusOption[] = ['Applied', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

// Total expected processing window in days (used to compute "remaining time")
export const TARGET_DAYS = 365;

interface StatusMeta {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const STATUS_META: Record<StatusOption, StatusMeta> = {
  'Applied':      { icon: FileText,     color: '#8B899E', bg: '#ECEBF2' },
  'Submitted':    { icon: Send,         color: '#3E7BFA', bg: '#E4ECFE' },
  'Under Review': { icon: Clock,        color: '#F5A524', bg: '#FDF0DA' },
  'Approved':     { icon: CheckCircle2, color: '#12B76A', bg: '#DFF7EB' },
  'Rejected':     { icon: XCircle,      color: '#F04438', bg: '#FCE7E5' },
};
