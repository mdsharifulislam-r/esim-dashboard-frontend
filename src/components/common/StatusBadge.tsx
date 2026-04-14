interface StatusBadgeProps {
  status: string;
}

const labelMap: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  open: 'Open',
  resolved: 'Resolved',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  true: 'Active',
  false: 'Inactive',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = String(status).toLowerCase();
  return (
    <span className={`status-badge ${key}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
        }}
      />
      {labelMap[key] || status}
    </span>
  );
}
