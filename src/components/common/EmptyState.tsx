import { Typography } from '@mui/material';
import { EmptyStateBox } from '@/components/styled';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <EmptyStateBox>
      <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>{icon}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 280 }}>
          {subtitle}
        </Typography>
      )}
    </EmptyStateBox>
  );
}
