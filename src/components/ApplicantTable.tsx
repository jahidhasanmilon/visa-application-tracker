import ApplicantRow from './ApplicantRow';
import type { EnrichedApplicant } from '../types';

interface ApplicantTableProps {
  applicants: EnrichedApplicant[];
  onEdit: (a: EnrichedApplicant) => void;
  onDelete: (id: string) => void;
  confirmDeleteId: string | null;
  onAskDelete: (id: string) => void;
  onCancelDelete: () => void;
}

export default function ApplicantTable({
  applicants, onEdit, onDelete, confirmDeleteId, onAskDelete, onCancelDelete,
}: ApplicantTableProps) {
  if (applicants.length === 0) {
    return <div className="vt-empty">No applicants match your filters.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="vt-table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Name</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Waiting</th>
            <th>Remaining</th>
            <th>Last Updated</th>
            <th>Reminder Mail</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(a => (
            <ApplicantRow
              key={a.id}
              applicant={a}
              onEdit={onEdit}
              onDelete={onDelete}
              confirmingDelete={confirmDeleteId === a.id}
              onAskDelete={onAskDelete}
              onCancelDelete={onCancelDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
