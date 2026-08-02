import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp, limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Applicant, LogEntry, ApplicantFormData } from '../types';

const APPLICANTS_COL = 'applicants';
const LOG_COL = 'statusLog';

// --- Applicants -------------------------------------------------

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

function genSerial(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  return `AP/260/${dd}${mm}${yy}/${rand}`;
}

export async function addApplicant(form: ApplicantFormData): Promise<void> {
  const serialNo = genSerial();
  await addDoc(collection(db, APPLICANTS_COL), { ...form, serialNo });
  await addLogEntry({ name: form.name, update: 'Applicant added', notes: '' });
}

export async function updateApplicant(
  id: string,
  form: ApplicantFormData,
  previousStatus: string,
): Promise<void> {
  await updateDoc(doc(db, APPLICANTS_COL, id), { ...form });
  if (previousStatus !== form.status) {
    await addLogEntry({ name: form.name, update: `${previousStatus} → ${form.status}`, notes: form.notes });
  }
}

export async function deleteApplicant(id: string): Promise<void> {
  await deleteDoc(doc(db, APPLICANTS_COL, id));
}

// --- Status log ---------------------------------------------------

export function subscribeLog(onData: (log: LogEntry[]) => void): () => void {
  const q = query(collection(db, LOG_COL), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const log: LogEntry[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        date: data.date,
        name: data.name,
        update: data.update,
        notes: data.notes || '',
      };
    });
    onData(log);
  });
}

async function addLogEntry(entry: { name: string; update: string; notes: string }): Promise<void> {
  await addDoc(collection(db, LOG_COL), {
    ...entry,
    date: new Date().toISOString().slice(0, 10),
    createdAt: serverTimestamp(),
  });
}
