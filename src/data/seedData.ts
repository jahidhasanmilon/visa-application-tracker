import type { Applicant, LogEntry, ApplicantFormData } from '../types';

export const SEED_APPLICANTS: Applicant[] = [
  { id: 'AP/260/051125/000000525', serialNo: 'AP/260/051125/000000525', name: 'Jahid', email: '', status: 'Applied', created: '2025-11-05', submitted: '2025-11-08', notes: '' },
  { id: 'AP/260/101125/000000534', serialNo: 'AP/260/101125/000000534', name: 'Ritu', email: 'ritukabir52@gmail.com', status: 'Applied', created: '2025-11-10', submitted: '2025-11-14', notes: '' },
  { id: 'AP/260/151024/000000070', serialNo: 'AP/260/151024/000000070', name: 'Raihan', email: 'ahmmedraihan@gmail.com', status: 'Applied', created: '2024-10-15', submitted: '2025-11-14', notes: '' },
  { id: 'AP/260/111125/000000535', serialNo: 'AP/260/111125/000000535', name: 'Arman', email: 'hasnatarman2511@gmail.com', status: 'Applied', created: '2025-11-11', submitted: '2025-11-25', notes: '' },
  { id: 'AP/260/130126/000000685', serialNo: 'AP/260/130126/000000685', name: 'Rifat', email: 'isfatuzzamanrifat341@gmail.com', status: 'Applied', created: '2026-01-13', submitted: '2026-01-29', notes: '' },
  { id: 'AP/260/120426/000002139', serialNo: 'AP/260/120426/000002139', name: 'Shaker', email: 'mshakercu@gmail.com', status: 'Applied', created: '2026-04-12', submitted: '2026-04-26', notes: '' },
  { id: 'AP/260/020526/000002922', serialNo: 'AP/260/020526/000002922', name: 'Sp', email: 'sobnommostafa@gmail.com', status: 'Applied', created: '2026-05-02', submitted: '2026-05-03', notes: '' },
  { id: 'AP/260/020526/000002923', serialNo: 'AP/260/020526/000002923', name: 'Tuhin ST', email: 'msrtuhin439@gmail.com', status: 'Applied', created: '2026-05-02', submitted: '2026-05-03', notes: '' },
  { id: 'AP/260/050526/000003003', serialNo: 'AP/260/050526/000003003', name: 'Jebb', email: 'iub.jahid@gmail.com', status: 'Applied', created: '2026-05-05', submitted: '2026-05-05', notes: '' },
  { id: 'AP/260/170626/000004717', serialNo: 'AP/260/170626/000004717', name: 'Ali', email: 'tamannaali291@gmail.com', status: 'Applied', created: '2026-06-17', submitted: '2026-06-19', notes: '' },
  { id: 'AP/260/230626/000005056', serialNo: 'AP/260/230626/000005056', name: 'Tuhin OP', email: 'msrtuhin439@gmail.com', status: 'Applied', created: '2026-06-23', submitted: '2026-06-25', notes: '' },
  { id: 'AP/260/270626/000005223', serialNo: 'AP/260/270626/000005223', name: 'Rahul', email: 'devrahul232001@gmail.com', status: 'Applied', created: '2026-06-27', submitted: '2026-07-05', notes: '' },
];

export const SEED_LOG: LogEntry[] = [
  { date: '2026-07-04', name: 'Raihan', update: 'Update recorded', notes: '' },
  { date: '2026-07-05', name: 'Arman', update: 'Update recorded', notes: '' },
  { date: '2026-07-05', name: 'Rahul', update: 'Update recorded', notes: '' },
];

export const EMPTY_FORM: ApplicantFormData = {
  name: '', email: '', status: 'Applied', created: '', submitted: '', notes: '',
};
