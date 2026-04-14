import { Box, useTheme } from '@mui/material';
import { formatCurrency } from '@/utils/currency';

interface BalanceBadgeProps {
  amount: number;
}

export default function BalanceBadge({ amount }: BalanceBadgeProps) {
  const theme = useTheme();

  let bg: string;
  let color: string;
  let border: string;
  let label: string;

  if (amount > 0) {
    bg = theme.palette.custom.badgeGreen;
    color = theme.palette.custom.badgeGreenText;
    border = theme.palette.custom.badgeGreenBorder;
    label = `owed ${formatCurrency(amount)}`;
  } else if (amount < 0) {
    bg = theme.palette.custom.badgeRed;
    color = theme.palette.custom.badgeRedText;
    border = theme.palette.custom.badgeRedBorder;
    label = `owe ${formatCurrency(Math.abs(amount))}`;
  } else {
    bg = theme.palette.grey[100];
    color = theme.palette.text.secondary;
    border = theme.palette.grey[300];
    label = 'settled';
  }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        border: `1px solid ${border}`,
        backgroundColor: bg,
        color,
        fontSize: '1rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {label}
    </Box>
  );
}
