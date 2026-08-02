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
  'Applied':      { icon: FileText,     color: '#5B6472', bg: '#EEECE6' },
  'Submitted':    { icon: Send,         color: '#2F6F62', bg: '#E4EFEA' },
  'Under Review': { icon: Clock,        color: '#C9A227', bg: '#FBF3DC' },
  'Approved':     { icon: CheckCircle2, color: '#2F6F62', bg: '#DCEEE6' },
  'Rejected':     { icon: XCircle,      color: '#C1440E', bg: '#F7E4DB' },
};
