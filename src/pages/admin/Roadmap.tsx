import { useMemo, useState } from 'react';
import { Search, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useApplicants } from '../../hooks/useApplicants';
import { updateRoadmap } from '../../services/applicantsService';
import { DEFAULT_ROADMAP_LABELS } from '../../constants/roadmap';
import type { ChecklistItem, EnrichedApplicant } from '../../types';

export default function AdminRoadmap() {
  const { enriched, loading } = useApplicants();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = enriched.filter(a => {
    const q = search.trim().toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.serialNo.toLowerCase().includes(q);
  });

  const selected = enriched.find(a => a.id === selectedId) || null;

  if (loading) return <div className="app-loading-screen">Loading applicants…</div>;

  return (
    <>
      <PageHeader title="Road to Success" subtitle="Customize each applicant's progress stepper." />
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 300px) 1fr', gap: 20, alignItems: 'start' }}>
          <div className="app-card app-card-pad">
            <div className="app-input-wrap" style={{ marginBottom: 14 }}>
              <Search size={16} />
              <input placeholder="Search applicants…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 480, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div className="app-empty">No applicants match.</div>
              ) : filtered.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedId(a.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                    padding: '9px 10px', borderRadius: 8, border: 'none', textAlign: 'left', cursor: 'pointer',
                    background: selectedId === a.id ? 'var(--violet-soft)' : 'transparent',
                    color: selectedId === a.id ? 'var(--violet)' : 'var(--ink)',
                    font: 'inherit',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{a.name}</span>
                  <span className="app-mono" style={{ fontSize: 11, opacity: 0.7 }}>{a.serialNo}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="app-card app-card-pad">
            {!selected ? (
              <div className="app-empty">Select an applicant to edit their roadmap.</div>
            ) : (
              <RoadmapEditor applicant={selected} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function RoadmapEditor({ applicant }: { applicant: EnrichedApplicant }) {
  const steps = useMemo(() => (
    applicant.roadmap && applicant.roadmap.length > 0
      ? applicant.roadmap
      : DEFAULT_ROADMAP_LABELS.map(label => ({ id: crypto.randomUUID(), label, done: false }))
  ), [applicant.roadmap]);

  const [newLabel, setNewLabel] = useState('');
  const [saving, setSaving] = useState(false);

  async function save(next: ChecklistItem[]) {
    setSaving(true);
    try {
      await updateRoadmap(applicant.id, next);
    } finally {
      setSaving(false);
    }
  }

  function addStep() {
    const label = newLabel.trim();
    if (!label) return;
    save([...steps, { id: crypto.randomUUID(), label, done: false }]);
    setNewLabel('');
  }

  function toggleStep(id: string) {
    save(steps.map(s => s.id === id ? { ...s, done: !s.done } : s));
  }

  function removeStep(id: string) {
    save(steps.filter(s => s.id !== id));
  }

  function moveStep(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    save(next);
  }

  return (
    <div>
      <div className="app-card-head">
        <div>
          <div className="app-card-title">{applicant.name}</div>
          <div className="app-mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{applicant.serialNo}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {steps.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 10, padding: '8px 10px' }}>
            <span style={{ fontSize: 11.5, color: 'var(--muted-2)', width: 16, textAlign: 'center' }}>{i + 1}</span>
            <button
              type="button"
              className="app-badge"
              disabled={saving}
              onClick={() => toggleStep(step.id)}
              style={{
                border: 'none', cursor: 'pointer',
                background: step.done ? 'var(--success-soft)' : 'var(--neutral-soft)',
                color: step.done ? 'var(--success)' : 'var(--neutral)',
              }}
            >
              {step.done ? 'Done' : 'Not yet'}
            </button>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{step.label}</span>
            <button type="button" className="app-icon-btn" disabled={saving || i === 0} onClick={() => moveStep(i, -1)} aria-label="Move up">
              <ArrowUp size={14} />
            </button>
            <button type="button" className="app-icon-btn" disabled={saving || i === steps.length - 1} onClick={() => moveStep(i, 1)} aria-label="Move down">
              <ArrowDown size={14} />
            </button>
            <button type="button" className="app-icon-btn" disabled={saving} onClick={() => removeStep(step.id)} aria-label="Remove step">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="app-input"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStep(); } }}
          placeholder="New step name"
        />
        <button type="button" className="app-btn app-btn-ghost app-btn-sm" onClick={addStep} disabled={saving}>
          <Plus size={14} /> Add step
        </button>
      </div>
    </div>
  );
}
