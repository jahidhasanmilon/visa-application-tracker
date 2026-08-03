import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

initializeApp();

// Keep this list in sync with ADMIN_EMAILS in src/constants/roles.ts.
const ADMIN_EMAILS = ['jahidhasanmilon999@gmail.com'];

// Must match TARGET_DAYS-style logic in src/constants/status.ts (REMINDER_WINDOW_DAYS)
// and src/utils/dateHelpers.ts (enrichApplicant) — the 30-day countdown is measured
// from the applicant's lastUpdated date.
const REMINDER_WINDOW_DAYS = 30;

const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

function daysBetween(a: string, b: string): number {
  const A = new Date(`${a}T00:00:00`);
  const B = new Date(`${b}T00:00:00`);
  return Math.round((B.getTime() - A.getTime()) / 86400000);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface ApplicantDoc {
  name?: string;
  serialNo?: string;
  email?: string;
  status?: string;
  lastUpdated?: string;
  reminderMailSent?: 'Not yet' | 'Urgent' | 'Done';
  reminderEmailSentAt?: string;
}

async function runReminderSweep(): Promise<{ sent: number; checked: number }> {
  const db = getFirestore();
  const today = todayStr();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER.value(), pass: GMAIL_APP_PASSWORD.value() },
  });

  const snapshot = await db.collection('applicants').get();
  let sent = 0;

  for (const doc of snapshot.docs) {
    const a = doc.data() as ApplicantDoc;
    if (!a.lastUpdated || a.reminderMailSent !== 'Not yet') continue;

    const reminderDaysLeft = REMINDER_WINDOW_DAYS - daysBetween(a.lastUpdated, today);
    if (reminderDaysLeft > 0) continue;

    // Already emailed for this cycle? (lastUpdated hasn't changed since the last send)
    if (a.reminderEmailSentAt && a.reminderEmailSentAt >= a.lastUpdated) continue;

    const recipients = [...ADMIN_EMAILS];
    if (a.email) recipients.push(a.email);

    const daysOverdue = Math.abs(reminderDaysLeft);
    const subject = `Application Reminder (30-Day): ${a.name ?? 'Applicant'} — ${a.serialNo ?? ''}`;
    const html = `
      <p>The 30-day follow-up window has passed for this application.</p>
      <ul>
        <li><b>Name:</b> ${a.name ?? '—'}</li>
        <li><b>Serial No:</b> ${a.serialNo ?? '—'}</li>
        <li><b>Status:</b> ${a.status ?? '—'}</li>
        <li><b>Last updated:</b> ${a.lastUpdated}</li>
        <li><b>Days ${reminderDaysLeft === 0 ? 'since due' : 'overdue'}:</b> ${daysOverdue}</li>
      </ul>
      <p>Please review and follow up.</p>
    `;

    try {
      await transporter.sendMail({
        from: `VisaTrack <${GMAIL_USER.value()}>`,
        to: recipients.join(', '),
        subject,
        html,
      });
      await doc.ref.update({ reminderEmailSentAt: today });
      sent++;
    } catch (err) {
      logger.error(`Failed to send reminder email for ${doc.id}`, err);
    }
  }

  logger.info(`Reminder sweep complete: ${sent} email(s) sent.`);
  return { sent, checked: snapshot.size };
}

export const sendReminderEmails = onSchedule(
  {
    schedule: '0 9 * * *',
    timeZone: 'Asia/Dhaka',
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD],
  },
  async () => {
    await runReminderSweep();
  },
);
