import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BalanceBadge from '@/components/common/BalanceBadge';
import { useDashboard } from '@/hooks/useDashboard';
import { useGroups } from '@/hooks/useGroups';
import { formatCurrency } from '@/utils/currency';
import { formatRelativeDate } from '@/utils/dates';

export default function DashboardPage() {
  const { data: summary, isPending: summaryLoading } = useDashboard();
  const { data: groups = [], isPending: groupsLoading } = useGroups();
  const navigate = useNavigate();

  if (summaryLoading || groupsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PageRoot>
      <SectionPane>
        {/* Summary cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              border: '1px solid',
              borderColor: 'custom.badgeGreenBorder',
              borderRadius: 2,
              bgcolor: 'custom.badgeGreen',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'custom.badgeGreenText', fontWeight: 600, letterSpacing: 0 }}>
              You are owed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'custom.badgeGreenText', mt: 0.5 }}>
              {formatCurrency(summary?.totalOwed ?? 0)}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              border: '1px solid',
              borderColor: 'custom.badgeRedBorder',
              borderRadius: 2,
              bgcolor: 'custom.badgeRed',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'custom.badgeRedText', fontWeight: 600, letterSpacing: 0 }}>
              You owe
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'custom.badgeRedText', mt: 0.5 }}>
              {formatCurrency(summary?.totalOwe ?? 0)}
            </Typography>
          </Paper>
        </Box>

        {/* Groups section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Groups
          </Typography>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2 }}>
            <List disablePadding>
              {groups.map((group, idx) => (
                <ListItem
                  key={group.id}
                  onClick={() => navigate(`/groups/${group.id}`)}
                  sx={{
                    cursor: 'pointer',
                    borderBottom: idx < groups.length - 1 ? '1px solid' : 'none',
                    borderColor: 'custom.borderLight',
                    '&:hover': { bgcolor: 'custom.hoverItem' },
                    px: 2,
                    py: 1.5,
                    minHeight: 72,
                  }}
                >
                  <Typography sx={{ fontSize: '1.2rem', mr: 1.5 }}>{group.emoji}</Typography>
                  <ListItemText
                    primary={group.name}
                    secondary={`${group.members.length} members`}
                    slotProps={{
                      primary: { variant: 'body1', sx: { fontWeight: 600 } },
                      secondary: { variant: 'body2', sx: { color: 'text.secondary' } },
                    }}
                  />
                  <BalanceBadge amount={group.netBalance} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Recent activity */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Recent Activity
          </Typography>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2 }}>
            <List disablePadding>
              {(summary?.recentActivity ?? []).slice(0, 5).map((item, idx, arr) => (
                <ListItem
                  key={item.id}
                  sx={{
                    borderBottom: idx < arr.length - 1 ? '1px solid' : 'none',
                    borderColor: 'custom.borderLight',
                    px: 2,
                    py: 1.5,
                    minHeight: 72,
                  }}
                >
                  <ListItemText
                    primary={item.description}
                    secondary={formatRelativeDate(item.createdAt)}
                    slotProps={{
                      primary: { variant: 'body1', sx: { fontWeight: 500 } },
                      secondary: { variant: 'body2', sx: { color: 'text.secondary' } },
                    }}
                  />
                  {item.amount !== undefined && (
                    <Typography variant="body1" sx={{ color: 'text.secondary', ml: 2, whiteSpace: 'nowrap' }}>
                      {formatCurrency(item.amount)}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </SectionPane>
    </PageRoot>
  );
}
