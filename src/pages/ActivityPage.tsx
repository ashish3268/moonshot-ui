import { Box, Typography, List, ListItem } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { useActivity } from '@/hooks/useActivity';
import { groupByDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import type { ActivityItem } from '@/types/api';

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  if (type === 'expense_added') {
    return <AddCircleIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />;
  }
  if (type === 'expense_edited') {
    return <EditIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />;
  }
  return <CheckCircleIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} />;
}

export default function ActivityPage() {
  const { data: items, isLoading } = useActivity();

  if (isLoading) return <LoadingSpinner />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No activity yet"
        subtitle="Activity will appear here when expenses are added or settled."
      />
    );
  }

  const grouped = groupByDate(items);
  const dateKeys = Object.keys(grouped);

  return (
    <PageRoot>
      <SectionPane>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
          Activity
        </Typography>

        {dateKeys.map((dateKey) => {
          const dayItems = grouped[dateKey] ?? [];
          return (
            <Box key={dateKey} sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                {dateKey}
              </Typography>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'custom.borderLight',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <List disablePadding>
                  {dayItems.map((item, idx) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderBottom: idx < dayItems.length - 1 ? '1px solid' : 'none',
                        borderColor: 'custom.borderLight',
                        px: 2,
                        py: 1.5,
                        gap: 1.5,
                        alignItems: 'flex-start',
                        minHeight: 72,
                      }}
                    >
                      <Box sx={{ pt: 0.25 }}>
                        <ActivityIcon type={item.type} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.description}
                        </Typography>
                        {item.groupName && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.groupName}
                          </Typography>
                        )}
                      </Box>
                      {item.amount !== undefined && (
                        <Typography
                          variant="body1"
                          sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
                        >
                          {formatCurrency(item.amount)}
                        </Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          );
        })}
      </SectionPane>
    </PageRoot>
  );
}
