import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Applicant, ApplicantFormData } from '../types';
import { todayStr } from '../utils/dateHelpers';

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

export async function addApplicant(form: ApplicantFormData): Promise<void> {
  await addDoc(collection(db, APPLICANTS_COL), { ...form, lastUpdated: todayStr() });
}

export async function updateApplicant(id: string, form: ApplicantFormData): Promise<void> {
  await updateDoc(doc(db, APPLICANTS_COL, id), { ...form, lastUpdated: todayStr() });
}

export async function deleteApplicant(id: string): Promise<void> {
  await deleteDoc(doc(db, APPLICANTS_COL, id));
}
