import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatCards from './components/StatCards';
import StatusChart from './components/StatusChart';
import Toolbar from './components/Toolbar';
import StatusLogPanel from './components/StatusLogPanel';
import ApplicantTable from './components/ApplicantTable';
import ApplicantModal from './components/ApplicantModal';
import LoginScreen from './components/LoginScreen';
import { STATUS_OPTIONS } from './constants/status';
import { todayStr, enrichApplicant } from './utils/dateHelpers';
import { subscribeApplicants, subscribeLog, addApplicant, updateApplicant, deleteApplicant } from './services/applicantsService';
import { signOut } from './services/authService';
import { useAuth } from './hooks/useAuth';
import { EMPTY_FORM } from './data/seedData';
import type { Applicant, LogEntry, ApplicantFormData, StatusOption, EnrichedApplicant } from './types';
import './styles/theme.css';

export default function App() {
  const { user, authLoading } = useAuth();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusOption | 'All'>('All');
  const [showLog, setShowLog] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [form, setForm] = useState<ApplicantFormData>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Subscribe to Firestore once signed in
  useEffect(() => {
    if (!user) {
      setApplicants([]);
      setLog([]);
      return;
    }
    setDataLoading(true);
    const unsubApplicants = subscribeApplicants((data) => {
      setApplicants(data);
      setDataLoading(false);
    });
    const unsubLog = subscribeLog(setLog);
    return () => {
      unsubApplicants();
      unsubLog();
    };
  }, [user]);

  const enriched: EnrichedApplicant[] = useMemo(() => {
    const t = todayStr();
    return applicants.map(a => enrichApplicant(a, t));
  }, [applicants]);

  const filtered = useMemo(() => {
    return enriched.filter(a => {
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q
        || a.name.toLowerCase().includes(q)
        || a.email.toLowerCase().includes(q)
        || a.serialNo.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [enriched, search, statusFilter]);

  const stats = useMemo(() => ({
    total: enriched.length,
    urgent: enriched.filter(a => a.remaining <= 30 && a.remaining > 0).length,
    overdue: enriched.filter(a => a.remaining <= 0).length,
    approved: enriched.filter(a => a.status === 'Approved').length,
  }), [enriched]);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    STATUS_OPTIONS.forEach(s => { counts[s] = 0; });
    enriched.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return STATUS_OPTIONS
      .map(s => ({ name: s, value: counts[s] }))
      .filter(d => d.value > 0);
  }, [enriched]);

  function openAdd() {
    setForm({ ...EMPTY_FORM, created: todayStr() });
    setEditingApplicant(null);
    setModalOpen(true);
  }

  function openEdit(a: EnrichedApplicant) {
    setForm({ name: a.name, email: a.email, status: a.status, created: a.created, submitted: a.submitted, notes: a.notes });
    setEditingApplicant(a);
    setModalOpen(true);
  }

  async function saveForm() {
    if (!form.name.trim()) return;
    if (editingApplicant) {
      await updateApplicant(editingApplicant.id, form, editingApplicant.status);
    } else {
      await addApplicant(form);
    }
    setModalOpen(false);
  }

  async function doDelete(id: string) {
    await deleteApplicant(id);
    setConfirmDeleteId(null);
  }

  if (authLoading) {
    return <div style={{ fontFamily: 'Inter, sans-serif', padding: 40, color: '#5B6472' }}>Loading…</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (dataLoading) {
    return <div style={{ fontFamily: 'Inter, sans-serif', padding: 40, color: '#5B6472' }}>Loading tracker…</div>;
  }

  return (
    <div className="vt-root">
      <Header userEmail={user.email} onSignOut={() => signOut()} />
      <StatCards stats={stats} />
      <StatusChart pieData={pieData} />

      <div className="vt-panel">
        <Toolbar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAdd={openAdd}
          showLog={showLog}
          setShowLog={setShowLog}
        />

        {showLog && <StatusLogPanel log={log} />}

        <ApplicantTable
          applicants={filtered}
          onEdit={openEdit}
          onDelete={doDelete}
          confirmDeleteId={confirmDeleteId}
          onAskDelete={setConfirmDeleteId}
          onCancelDelete={() => setConfirmDeleteId(null)}
        />
      </div>

      <ApplicantModal
        open={modalOpen}
        isEditing={!!editingApplicant}
        form={form}
        setForm={setForm}
        onSave={saveForm}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
