import { Box, Typography, List, ListItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageRoot, SectionPane, SectionTitle } from '@/components/styled';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserAvatar from '@/components/common/UserAvatar';
import BalanceBadge from '@/components/common/BalanceBadge';
import { MOCK_GROUPS, MOCK_CURRENT_USER } from '@/mocks/data';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/utils/currency';
import { formatDisplayDate } from '@/utils/dates';
import { CATEGORIES } from '@/constants/categories';
import type { ExpenseCategory } from '@/types/api';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const group = MOCK_GROUPS.find((g) => g.id === id);
  const { data: expenses, isLoading } = useExpenses(id);

  if (!group) {
    return (
      <EmptyState icon="❓" title="Group not found" subtitle="This group could not be found." />
    );
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageRoot>
      <SectionPane>
        {/* Back */}
        <Box
          component="button"
          onClick={() => navigate('/groups')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'text.secondary',
            p: 0,
            mb: 2,
            '&:hover': { color: 'text.primary' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2">Back to groups</Typography>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{group.emoji}</Typography>
            <Typography sx={{ fontSize: '1.4rem', fontWeight: 700 }}>{group.name}</Typography>
          </Box>
          {/* Member avatars */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {group.members.map((member) => (
              <UserAvatar key={member.id} user={member} size={32} />
            ))}
          </Box>
        </Box>

        {/* Balances */}
        <Box sx={{ mb: 3 }}>
          <SectionTitle>Balances</SectionTitle>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'custom.borderLight',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <List disablePadding>
              {group.members.map((member, idx) => {
                const isMe = member.id === MOCK_CURRENT_USER.id;
                const memberExpenses = expenses.filter(
                  (e) =>
                    e.paidBy.id === member.id ||
                    e.splits.some((s) => s.userId === member.id)
                );
                const paid = memberExpenses
                  .filter((e) => e.paidBy.id === member.id)
                  .reduce((sum, e) => sum + e.amount, 0);
                const owed = memberExpenses
                  .filter((e) => e.paidBy.id !== member.id)
                  .reduce((sum, e) => {
                    const split = e.splits.find((s) => s.userId === member.id);
                    return sum + (split?.amount ?? 0);
                  }, 0);
                const net = paid - owed;

                return (
                  <ListItem
                    key={member.id}
                    sx={{
                      borderBottom: idx < group.members.length - 1 ? '1px solid' : 'none',
                      borderColor: 'custom.borderLight',
                      px: 2,
                      py: 1.5,
                      gap: 1.5,
                      minHeight: 64,
                    }}
                  >
                    <UserAvatar user={member} size={32} />
                    <Typography variant="body1" sx={{ flex: 1, fontWeight: isMe ? 700 : 600 }}>
                      {isMe ? 'You' : member.name}
                    </Typography>
                    <BalanceBadge amount={net} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>

        {/* Expenses */}
        <Box>
          <SectionTitle>Expenses</SectionTitle>
          {expenses.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No expenses yet.
            </Typography>
          ) : (
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'custom.borderLight',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <List disablePadding>
                {expenses.map((expense, idx) => {
                  const category =
                    CATEGORIES[expense.category as ExpenseCategory] ?? CATEGORIES.other;
                  return (
                    <ListItem
                      key={expense.id}
                      sx={{
                        borderBottom: idx < expenses.length - 1 ? '1px solid' : 'none',
                        borderColor: 'custom.borderLight',
                        px: 2,
                        py: 1.5,
                        gap: 1.5,
                        minHeight: 64,
                      }}
                    >
                      <Typography sx={{ fontSize: '1.2rem' }}>{category.icon}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {expense.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {formatDisplayDate(expense.date)} · paid by{' '}
                          {expense.paidBy.id === MOCK_CURRENT_USER.id ? 'you' : expense.paidBy.name}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {formatCurrency(expense.amount)}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </Box>
      </SectionPane>
    </PageRoot>
  );
}
