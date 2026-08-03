import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Applicant, ApplicantFormData, ReminderStatus } from '../types';

const APPLICANTS_COL = 'applicants';

export function subscribeApplicants(onData: (applicants: Applicant[]) => void): () => void {
  const q = query(collection(db, APPLICANTS_COL), orderBy('created', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const applicants: Applicant[] = snapshot.docs.map((d) => {
      const data = d.data() as Omit<Applicant, 'id'>;
      return { ...data, id: d.id };
    });
    onData(applicants);
  });
}

// Applicant-portal view: only the records whose email matches the signed-in account.
export function subscribeMyApplicants(email: string, onData: (applicants: Applicant[]) => void): () => void {
  const q = query(collection(db, APPLICANTS_COL), where('email', '==', email));
  return onSnapshot(q, (snapshot) => {
    const applicants: Applicant[] = snapshot.docs.map((d) => {
      const data = d.data() as Omit<Applicant, 'id'>;
      return { ...data, id: d.id };
    });
    onData(applicants);
  });
}

// lastUpdated is a plain field on the form now — admin sets it to whatever
// date they intend, it is never overwritten automatically on save.
export async function addApplicant(form: ApplicantFormData): Promise<void> {
  await addDoc(collection(db, APPLICANTS_COL), { ...form });
}

export async function updateApplicant(id: string, form: ApplicantFormData): Promise<void> {
  await updateDoc(doc(db, APPLICANTS_COL, id), { ...form });
}

export async function deleteApplicant(id: string): Promise<void> {
  await deleteDoc(doc(db, APPLICANTS_COL, id));
}

// Narrow update usable by an applicant on their own record (see firestore.rules) —
// only this single field, so the "Application Reminder (30-Day)" status can be
// changed by both admin and the applicant themselves.
export async function updateReminderStatus(id: string, reminderMailSent: ReminderStatus): Promise<void> {
  await updateDoc(doc(db, APPLICANTS_COL, id), { reminderMailSent });
}
