import '../../../styles/Dashboard/StatusBadge.css';

interface StatusBadgeProps {
    label: string;
    variant: 'off' | 'sick' | 'home' | 'leave' | 'office';
}

export const StatusBadge = ({ label, variant }: StatusBadgeProps) => {
    return (
        <span className={`status-badge ${variant}`}>
      {label}
    </span>
    );
};