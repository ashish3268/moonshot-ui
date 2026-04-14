import { Box, Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { FlexSpacer } from '@/components/styled';

const TopBarRoot = styled(Box)(({ theme }) => ({
  height: 56,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.custom.navBorder}`,
  backgroundColor: theme.palette.custom.navBg,
  flexShrink: 0,
}));

/** Map pathname prefix to a human-readable page title */
function usePageTitle(): string {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith('/dashboard')) return 'Dashboard';
  if (path.startsWith('/friends/')) return 'Friend Detail';
  if (path.startsWith('/friends')) return 'Friends';
  if (path.startsWith('/groups/')) return 'Group Detail';
  if (path.startsWith('/groups')) return 'Groups';
  if (path.startsWith('/expenses/')) return 'Expense Detail';
  if (path.startsWith('/activity')) return 'Activity';
  return 'Moonshot';
}

export default function TopBar() {
  const theme = useTheme();
  const title = usePageTitle();
  const setAddExpenseModalOpen = useUiStore((s) => s.setAddExpenseModalOpen);

  return (
    <TopBarRoot>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: theme.palette.custom.navText }}
      >
        {title}
      </Typography>

      <FlexSpacer />

      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setAddExpenseModalOpen(true)}
      >
        Add Expense
      </Button>
    </TopBarRoot>
  );
}
