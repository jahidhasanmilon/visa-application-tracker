import { STATUS_OPTIONS } from '../constants/status';
import type { ApplicantFormData, StatusOption } from '../types';

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
    <div className="vt-modal-backdrop" onClick={onClose}>
      <div className="vt-modal" onClick={e => e.stopPropagation()}>
        <h3>{isEditing ? 'Edit applicant' : 'Add applicant'}</h3>

        <div className="vt-field">
          <label>Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Applicant name" />
        </div>

        <div className="vt-field">
          <label>Email</label>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
        </div>

        <div className="vt-field">
          <label>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as StatusOption })}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="vt-field" style={{ flex: 1 }}>
            <label>Application created</label>
            <input type="date" value={form.created} onChange={e => setForm({ ...form, created: e.target.value })} />
          </div>
          <div className="vt-field" style={{ flex: 1 }}>
            <label>Application submitted</label>
            <input type="date" value={form.submitted} onChange={e => setForm({ ...form, submitted: e.target.value })} />
          </div>
        </div>

        <div className="vt-field">
          <label>Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Interview feedback, contact details, etc." />
        </div>

        <div className="vt-modal-actions">
          <button className="vt-btn vt-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="vt-btn" onClick={onSave}>{isEditing ? 'Save changes' : 'Add applicant'}</button>
        </div>
      </div>
    </div>
  );
}
