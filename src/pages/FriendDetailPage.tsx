import { useState } from 'react';
import {
  Box, Button, Typography, List, ListItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, CircularProgress, Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageRoot, SectionPane, SectionTitle } from '@/components/styled';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserAvatar from '@/components/common/UserAvatar';
import BalanceBadge from '@/components/common/BalanceBadge';
import { useFriends, useSharedExpenses } from '@/hooks/useFriends';
import { useCreateSettlement } from '@/hooks/useSettlements';
import { formatCurrency } from '@/utils/currency';
import { extractErrorMessage } from '@/utils/errors';
import { formatDisplayDate } from '@/utils/dates';
import { CATEGORIES } from '@/constants/categories';
import type { ExpenseCategory } from '@/types/api';

const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

function todayISO() {
  return new Date().toISOString().split('T')[0] ?? '';
}

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: friends, isPending: friendsPending } = useFriends();
  const { data: sharedExpenses = [], isPending: expensesPending } = useSharedExpenses(id ?? '');
  const settle = useCreateSettlement(id ?? '');

  const [settleOpen, setSettleOpen] = useState(false);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleNote, setSettleNote] = useState('');
  const [settleError, setSettleError] = useState<string | null>(null);

  if (friendsPending || expensesPending) return <LoadingSpinner />;

  const friend = (friends ?? []).find((f) => f.id === id);

  if (!friend) {
    return (
      <EmptyState icon="❓" title="Friend not found" subtitle="This friend could not be found." />
    );
  }

  function openSettle() {
    setSettleAmount(Math.abs(friend!.netBalance).toFixed(2));
    setSettleNote('');
    setSettleError(null);
    setSettleOpen(true);
  }

  async function handleSettle() {
    const amount = parseFloat(settleAmount);
    if (!amount || amount <= 0) return;
    setSettleError(null);
    try {
      await settle.mutateAsync({
        toUserId: friend!.id,
        amount,
        date: todayISO(),
        note: settleNote || undefined,
      });
      setSettleOpen(false);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Settlement failed. Please try again.');
      setSettleError(msg);
    }
  }

  const balanceLabel =
    friend.netBalance > 0
      ? `${friend.user.name} owes you ${formatCurrency(friend.netBalance)}`
      : friend.netBalance < 0
        ? `You owe ${friend.user.name} ${formatCurrency(Math.abs(friend.netBalance))}`
        : 'All settled up';

  return (
    <PageRoot>
      <SectionPane>
        {/* Back */}
        <Box
          component="button"
          onClick={() => navigate('/friends')}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            border: 'none', background: 'none', cursor: 'pointer',
            color: 'text.secondary', p: 0, mb: 2,
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
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.3rem' }}>
              {friend.user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {friend.user.email}
            </Typography>
          </Box>
        </Box>

        {/* Balance + settle up */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BalanceBadge amount={friend.netBalance} />
          <Button
            variant="outlined"
            size="small"
            disabled={friend.netBalance === 0}
            onClick={openSettle}
          >
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
          <Box sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2, overflow: 'hidden' }}>
            <List disablePadding>
              {sharedExpenses.map((expense, idx) => {
                const category = CATEGORIES[expense.category as ExpenseCategory] ?? CATEGORIES.other;
                const paidByMe = expense.paidBy.id === DEV_USER_ID;
                const amountLabel = paidByMe
                  ? `they owe ${formatCurrency(expense.mySplitAmount)}`
                  : `you owe ${formatCurrency(expense.mySplitAmount)}`;

                return (
                  <ListItem
                    key={expense.id}
                    sx={{
                      borderBottom: idx < sharedExpenses.length - 1 ? '1px solid' : 'none',
                      borderColor: 'custom.borderLight',
                      px: 2, py: 1.5, gap: 1.5, minHeight: 64,
                    }}
                  >
                    <Typography sx={{ fontSize: '1.2rem' }}>{category.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{expense.description}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDisplayDate(expense.date)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: paidByMe ? 'custom.badgeGreenText' : 'custom.badgeRedText',
                        textAlign: 'right', whiteSpace: 'nowrap',
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

      {/* Settle Up modal */}
      <Dialog open={settleOpen} onClose={() => { setSettleOpen(false); setSettleError(null); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Settle Up</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {balanceLabel}
          </Typography>
          <TextField
            label="Amount"
            type="number"
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
            }}
          />
          {settleError && <Alert severity="error">{settleError}</Alert>}
          <TextField
            label="Note (optional)"
            value={settleNote}
            onChange={(e) => setSettleNote(e.target.value)}
            fullWidth
            size="small"
            placeholder="e.g. Venmo payment"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setSettleOpen(false); setSettleError(null); }} color="inherit">Cancel</Button>
          <Button
            onClick={handleSettle}
            variant="contained"
            disabled={!settleAmount || parseFloat(settleAmount) <= 0 || settle.isPending}
            startIcon={settle.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {settle.isPending ? 'Saving…' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageRoot>
  );
}
