import { STATUS_OPTIONS } from '../constants/status';
import type { ApplicantFormData, ReminderMailStatus, StatusOption } from '../types';

interface ApplicantModalProps {
  open: boolean;
  isEditing: boolean;
  form: ApplicantFormData;
  setForm: (f: ApplicantFormData) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ApplicantModal({ open, isEditing, form, setForm, onSave, onClose }: ApplicantModalProps) {
  if (!open) return null;

  return (
    <div className="app-modal-backdrop" onClick={onClose}>
      <div className="app-modal" onClick={e => e.stopPropagation()}>
        <h3>{isEditing ? 'Edit applicant' : 'Add applicant'}</h3>

        <div className="app-field">
          <label>Serial No</label>
          <input className="app-input" value={form.serialNo} onChange={e => setForm({ ...form, serialNo: e.target.value })} placeholder="e.g. AP/260/051125/000000525" />
        </div>

        <div className="app-field">
          <label>Name</label>
          <input className="app-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Applicant name" />
        </div>

        <div className="app-field">
          <label>Email</label>
          <input className="app-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
        </div>

        <div className="app-field">
          <label>Status</label>
          <select className="app-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as StatusOption })}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="app-field" style={{ flex: 1 }}>
            <label>Application created</label>
            <input className="app-input" type="date" value={form.created} onChange={e => setForm({ ...form, created: e.target.value })} />
          </div>
          <div className="app-field" style={{ flex: 1 }}>
            <label>Application submitted</label>
            <input className="app-input" type="date" value={form.submitted} onChange={e => setForm({ ...form, submitted: e.target.value })} />
          </div>
        </div>

        <div className="app-field">
          <label>Notes</label>
          <textarea className="app-textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Interview feedback, contact details, etc." />
        </div>

        <div className="app-field">
          <label>Reminder mail</label>
          <select className="app-select" value={form.reminderMailSent} onChange={e => setForm({ ...form, reminderMailSent: e.target.value as ReminderMailStatus })}>
            <option value="Not yet">Not yet</option>
            <option value="Sent">Sent</option>
          </select>
        </div>

        <div className="app-modal-actions">
          <button className="app-btn app-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="app-btn app-btn-primary" onClick={onSave}>{isEditing ? 'Save changes' : 'Add applicant'}</button>
        </div>
      </div>
    </div>
  );
}
