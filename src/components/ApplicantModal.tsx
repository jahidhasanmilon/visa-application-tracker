import { useState } from 'react';
import { X as XIcon } from 'lucide-react';
import { REMINDER_OPTIONS } from '../constants/status';
import type { ApplicantFormData, ChecklistItem, ReminderStatus, StatusOption } from '../types';

const ADD_NEW_VALUE = '__add_new__';

interface ApplicantModalProps {
  open: boolean;
  isEditing: boolean;
  form: ApplicantFormData;
  setForm: (f: ApplicantFormData) => void;
  onSave: () => void;
  onClose: () => void;
  statusOptions: string[];
  onAddStatus: (name: string) => Promise<void>;
}

export default function ApplicantModal({
  open, isEditing, form, setForm, onSave, onClose, statusOptions, onAddStatus,
}: ApplicantModalProps) {
  const [addingStatus, setAddingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newChecklistLabel, setNewChecklistLabel] = useState('');

  if (!open) return null;

  function addChecklistItem() {
    const label = newChecklistLabel.trim();
    if (!label) return;
    const item: ChecklistItem = { id: crypto.randomUUID(), label, done: false };
    setForm({ ...form, checklist: [...form.checklist, item] });
    setNewChecklistLabel('');
  }

  function toggleChecklistItem(id: string) {
    setForm({ ...form, checklist: form.checklist.map(i => i.id === id ? { ...i, done: !i.done } : i) });
  }

  function removeChecklistItem(id: string) {
    setForm({ ...form, checklist: form.checklist.filter(i => i.id !== id) });
  }

  function handleStatusChange(value: string) {
    if (value === ADD_NEW_VALUE) {
      setAddingStatus(true);
      return;
    }
    setForm({ ...form, status: value as StatusOption });
  }

  async function confirmNewStatus() {
    const name = newStatus.trim();
    if (!name) return;
    if (!statusOptions.includes(name)) await onAddStatus(name);
    setForm({ ...form, status: name as StatusOption });
    setNewStatus('');
    setAddingStatus(false);
  }

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
          {addingStatus ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="app-input"
                autoFocus
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); confirmNewStatus(); } }}
                placeholder="New status name"
              />
              <button type="button" className="app-btn app-btn-ghost app-btn-sm" onClick={confirmNewStatus}>Add</button>
              <button type="button" className="app-btn app-btn-ghost app-btn-sm" onClick={() => { setAddingStatus(false); setNewStatus(''); }}>Cancel</button>
            </div>
          ) : (
            <select className="app-select" value={form.status} onChange={e => handleStatusChange(e.target.value)}>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              <option value={ADD_NEW_VALUE}>+ Add new status…</option>
            </select>
          )}
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
          <label>Last updated</label>
          <input className="app-input" type="date" value={form.lastUpdated} onChange={e => setForm({ ...form, lastUpdated: e.target.value })} />
        </div>

        <div className="app-field">
          <label>Notes</label>
          <textarea className="app-textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Interview feedback, contact details, etc." />
        </div>

        <div className="app-field">
          <label>Application Reminder (30-Day)</label>
          <select className="app-select" value={form.reminderMailSent} onChange={e => setForm({ ...form, reminderMailSent: e.target.value as ReminderStatus })}>
            {REMINDER_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="app-field">
          <label>Checklist</label>
          {form.checklist.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {form.checklist.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px' }}>
                  <button
                    type="button"
                    className="app-badge"
                    onClick={() => toggleChecklistItem(item.id)}
                    style={{
                      border: 'none', cursor: 'pointer',
                      background: item.done ? 'var(--success-soft)' : 'var(--neutral-soft)',
                      color: item.done ? 'var(--success)' : 'var(--neutral)',
                    }}
                  >
                    {item.done ? 'Done' : 'Not yet'}
                  </button>
                  <span style={{ flex: 1, fontSize: 13.5, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--muted)' : 'var(--ink)' }}>
                    {item.label}
                  </span>
                  <button type="button" className="app-icon-btn" onClick={() => removeChecklistItem(item.id)} aria-label="Remove item">
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="app-input"
              value={newChecklistLabel}
              onChange={e => setNewChecklistLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChecklistItem(); } }}
              placeholder="New checklist item"
            />
            <button type="button" className="app-btn app-btn-ghost app-btn-sm" onClick={addChecklistItem}>Add</button>
          </div>
        </div>

        <div className="app-modal-actions">
          <button className="app-btn app-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="app-btn app-btn-primary" onClick={onSave}>{isEditing ? 'Save changes' : 'Add applicant'}</button>
        </div>
      </div>
    </div>
  );
}
