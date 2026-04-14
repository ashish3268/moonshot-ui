import { Box, Button, Typography, List, ListItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageRoot, SectionPane, SectionTitle } from '@/components/styled';
import EmptyState from '@/components/common/EmptyState';
import UserAvatar from '@/components/common/UserAvatar';
import BalanceBadge from '@/components/common/BalanceBadge';
import { MOCK_FRIENDS, MOCK_EXPENSES, MOCK_CURRENT_USER } from '@/mocks/data';
import { formatCurrency } from '@/utils/currency';
import { formatDisplayDate } from '@/utils/dates';
import { CATEGORIES } from '@/constants/categories';
import type { ExpenseCategory } from '@/types/api';

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const friend = MOCK_FRIENDS.find((f) => f.id === id);

  if (!friend) {
    return (
      <EmptyState icon="❓" title="Friend not found" subtitle="This friend could not be found." />
    );
  }

  const sharedExpenses = MOCK_EXPENSES.filter(
    (e) =>
      (e.paidBy.id === friend.id && e.splits.some((s) => s.userId === MOCK_CURRENT_USER.id)) ||
      (e.paidBy.id === MOCK_CURRENT_USER.id && e.splits.some((s) => s.userId === friend.id))
  );

  return (
    <PageRoot>
      <SectionPane>
        {/* Back */}
        <Box
          component="button"
          onClick={() => navigate('/friends')}
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
          <Typography variant="body2">Back to friends</Typography>
        </Box>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <UserAvatar user={friend.user} size={56} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.3rem' }}>{friend.user.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {friend.user.email}
            </Typography>
          </Box>
        </Box>

        {/* Balance + settle up */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BalanceBadge amount={friend.netBalance} />
          <Button variant="outlined" size="small" onClick={() => alert('Coming soon')}>
            Settle Up
          </Button>
        </Box>

        {/* Shared expenses */}
        <SectionTitle>Shared Expenses</SectionTitle>
        {sharedExpenses.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No shared expenses yet.
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
              {sharedExpenses.map((expense, idx) => {
                const category = CATEGORIES[expense.category as ExpenseCategory] ?? CATEGORIES.other;
                const paidByMe = expense.paidBy.id === MOCK_CURRENT_USER.id;
                const mySplitAmount =
                  expense.splits.find((s) => s.userId === MOCK_CURRENT_USER.id)?.amount ?? 0;
                const friendSplitAmount =
                  expense.splits.find((s) => s.userId === friend.id)?.amount ?? 0;

                const amountLabel = paidByMe
                  ? `they owe ${formatCurrency(friendSplitAmount)}`
                  : `you owe ${formatCurrency(mySplitAmount)}`;

                return (
                  <ListItem
                    key={expense.id}
                    sx={{
                      borderBottom: idx < sharedExpenses.length - 1 ? '1px solid' : 'none',
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
                        {formatDisplayDate(expense.date)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: paidByMe ? 'custom.badgeGreenText' : 'custom.badgeRedText',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {amountLabel}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </SectionPane>
    </PageRoot>
  );
}
