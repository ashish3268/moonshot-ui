import { useState } from 'react';
import {
  Box, Typography, List, ListItem, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Alert, CircularProgress, TextField, Select, FormControl, InputLabel,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import {
  useActivity,
  useUpdateSettlement,
  useDeleteSettlement,
  useUpdateExpense,
  useDeleteExpense,
} from '@/hooks/useActivity';
import { useGroupDetail } from '@/hooks/useGroups';
import { useFriends } from '@/hooks/useFriends';
import { groupByDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import { extractErrorMessage } from '@/utils/errors';
import { CATEGORIES } from '@/constants/categories';
import type { ActivityItem, ExpenseCategory } from '@/types/api';

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  if (type === 'expense_added') return <AddCircleIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />;
  if (type === 'expense_edited') return <EditIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />;
  return <CheckCircleIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} />;
}

interface AdjustState {
  item: ActivityItem;
  amount: string;
  note: string;
  description: string;
  date: string;
  category: string;
  participantAmounts: { userId: string; name: string; amount: string }[];
}

export default function ActivityPage() {
  const { data: items = [], isPending: isLoading } = useActivity();
  const updateSettlement = useUpdateSettlement();
  const deleteSettlement = useDeleteSettlement();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  // Menu anchor
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; item: ActivityItem } | null>(null);

  // Adjust dialog state
  const [adjustState, setAdjustState] = useState<AdjustState | null>(null);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const groupId = adjustState?.item.groupId ?? '';
  const { data: groupDetail } = useGroupDetail(groupId);
  const { data: friends = [] } = useFriends();

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<ActivityItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function canEdit(item: ActivityItem) {
    return !!item.settlementId || !!item.expenseId;
  }

  function openMenu(e: React.MouseEvent<HTMLButtonElement>, item: ActivityItem) {
    setMenuAnchor({ el: e.currentTarget, item });
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function openAdjust(item: ActivityItem) {
    closeMenu();
    setAdjustError(null);
    const participantAmounts = item.splits
      ? item.splits.map((s) => ({ userId: s.userId, name: s.name, amount: String(s.amount) }))
      : [];
    setAdjustState({
      item,
      amount: item.amount !== undefined ? String(item.amount) : '',
      note: '',
      description: item.description,
      date: new Date().toISOString().slice(0, 10),
      category: 'other',
      participantAmounts,
    });
  }

  function openDelete(item: ActivityItem) {
    closeMenu();
    setDeleteError(null);
    setDeleteTarget(item);
  }

  async function handleAdjust() {
    if (!adjustState) return;
    setAdjustError(null);
    const { item } = adjustState;
    const amount = parseFloat(adjustState.amount);
    try {
      if (item.settlementId) {
        await updateSettlement.mutateAsync({
          id: item.settlementId,
          ...(adjustState.amount && !isNaN(amount) ? { amount } : {}),
          ...(adjustState.note.trim() ? { note: adjustState.note.trim() } : {}),
        });
      } else if (item.expenseId) {
        const parsedParticipants = adjustState.participantAmounts
          .map((p) => ({ userId: p.userId, amount: parseFloat(p.amount) }))
          .filter((p) => !isNaN(p.amount) && p.amount > 0);
        await updateExpense.mutateAsync({
          id: item.expenseId,
          description: adjustState.description.trim() || undefined,
          ...(adjustState.amount && !isNaN(amount) ? { amount } : {}),
          date: adjustState.date || undefined,
          category: adjustState.category || undefined,
          ...(parsedParticipants.length > 0
            ? { participants: parsedParticipants, splitMode: 'exact' }
            : {}),
        });
      }
      setAdjustState(null);
    } catch (err) {
      setAdjustError(extractErrorMessage(err, 'Could not update. Please try again.'));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      if (deleteTarget.settlementId) {
        await deleteSettlement.mutateAsync(deleteTarget.settlementId);
      } else if (deleteTarget.expenseId) {
        await deleteExpense.mutateAsync(deleteTarget.expenseId);
      }
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(extractErrorMessage(err, 'Could not delete. Please try again.'));
    }
  }

  const isAdjustPending = updateSettlement.isPending || updateExpense.isPending;
  const isDeletePending = deleteSettlement.isPending || deleteExpense.isPending;
  const isSettlement = !!adjustState?.item.settlementId;

  const currentIds = new Set(adjustState?.participantAmounts.map((p) => p.userId) ?? []);
  const availablePeople: { userId: string; name: string }[] = adjustState?.item.groupId
    ? (groupDetail?.members ?? [])
        .map((m) => ({ userId: m.user.id, name: m.user.name }))
        .filter((p) => !currentIds.has(p.userId))
    : friends
        .filter((f) => f.status === 'active' && !currentIds.has(f.user.id))
        .map((f) => ({ userId: f.user.id, name: f.user.name }));

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
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Activity</Typography>

        {dateKeys.map((dateKey) => {
          const dayItems = grouped[dateKey] ?? [];
          return (
            <Box key={dateKey} sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                {dateKey}
              </Typography>
              <Box sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2, overflow: 'hidden' }}>
                <List disablePadding>
                  {dayItems.map((item, idx) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderBottom: idx < dayItems.length - 1 ? '1px solid' : 'none',
                        borderColor: 'custom.borderLight',
                        px: 2, py: 1.5, gap: 1.5,
                        alignItems: 'flex-start',
                        minHeight: 72,
                      }}
                    >
                      <Box sx={{ pt: 0.25 }}>
                        <ActivityIcon type={item.type} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.description}</Typography>
                        {item.splits && item.splits.length > 0 && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.paidByName ? `Paid by ${item.paidByName} · ` : ''}
                            {item.splits.map((s) => `${s.name} ${formatCurrency(s.amount)}`).join('  ')}
                          </Typography>
                        )}
                        {item.groupName && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.groupName}</Typography>
                        )}
                      </Box>
                      {item.amount !== undefined && (
                        <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          {formatCurrency(item.amount)}
                        </Typography>
                      )}
                      {canEdit(item) && (
                        <IconButton
                          size="small"
                          onClick={(e) => openMenu(e, item)}
                          sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' }, mt: -0.25 }}
                          aria-label="Edit activity"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          );
        })}
      </SectionPane>

      {/* Dropdown menu */}
      <Menu
        anchorEl={menuAnchor?.el}
        open={!!menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => menuAnchor && openAdjust(menuAnchor.item)}>Adjust</MenuItem>
        <MenuItem onClick={() => menuAnchor && openDelete(menuAnchor.item)} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Adjust dialog */}
      <Dialog open={!!adjustState} onClose={() => setAdjustState(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Adjust {isSettlement ? 'Settlement' : 'Expense'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {adjustError && <Alert severity="error">{adjustError}</Alert>}

          {!isSettlement && (
            <TextField
              label="Description"
              value={adjustState?.description ?? ''}
              onChange={(e) => setAdjustState((s) => s ? { ...s, description: e.target.value } : s)}
              fullWidth size="small"
            />
          )}

          <TextField
            label="Amount"
            type="number"
            value={adjustState?.amount ?? ''}
            onChange={(e) => setAdjustState((s) => s ? { ...s, amount: e.target.value } : s)}
            fullWidth size="small"
            inputProps={{ min: 0.01, step: 0.01 }}
          />

          {isSettlement && (
            <TextField
              label="Note (optional)"
              value={adjustState?.note ?? ''}
              onChange={(e) => setAdjustState((s) => s ? { ...s, note: e.target.value } : s)}
              fullWidth size="small"
            />
          )}

          {!isSettlement && (
            <>
              <TextField
                label="Date"
                type="date"
                value={adjustState?.date ?? ''}
                onChange={(e) => setAdjustState((s) => s ? { ...s, date: e.target.value } : s)}
                fullWidth size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={adjustState?.category ?? 'other'}
                  onChange={(e) => setAdjustState((s) => s ? { ...s, category: e.target.value } : s)}
                >
                  {(Object.keys(CATEGORIES) as ExpenseCategory[]).map((key) => (
                    <MenuItem key={key} value={key}>
                      {CATEGORIES[key].icon} {CATEGORIES[key].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {adjustState && adjustState.participantAmounts.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Split</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {adjustState.participantAmounts.map((p, idx) => (
                      <Box key={p.userId} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>{p.name}</Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={p.amount}
                          onChange={(e) =>
                            setAdjustState((s) => {
                              if (!s) return s;
                              const updated = s.participantAmounts.map((pa, i) =>
                                i === idx ? { ...pa, amount: e.target.value } : pa,
                              );
                              return { ...s, participantAmounts: updated };
                            })
                          }
                          sx={{ width: 110 }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Total split:{' '}
                    {formatCurrency(
                      adjustState.participantAmounts.reduce(
                        (sum, p) => sum + (parseFloat(p.amount) || 0),
                        0,
                      ),
                    )}
                  </Typography>
                </Box>
              )}

              {!isSettlement && availablePeople.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Add people</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {availablePeople.map((p) => (
                      <Box key={p.userId} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>{p.name}</Typography>
                        <IconButton
                          size="small"
                          aria-label={`Add ${p.name}`}
                          onClick={() =>
                            setAdjustState((s) =>
                              s ? { ...s, participantAmounts: [...s.participantAmounts, { userId: p.userId, name: p.name, amount: '' }] } : s
                            )
                          }
                          sx={{ color: 'primary.main' }}
                        >
                          <AddCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAdjustState(null)} color="inherit">Cancel</Button>
          <Button
            onClick={handleAdjust}
            variant="contained"
            disabled={isAdjustPending}
            startIcon={isAdjustPending ? <CircularProgress size={16} /> : undefined}
          >
            {isAdjustPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setDeleteError(null); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Activity</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {deleteError && <Alert severity="error">{deleteError}</Alert>}
          <Typography>
            Are you sure you want to delete &ldquo;{deleteTarget?.description}&rdquo;? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDeleteTarget(null); setDeleteError(null); }} color="inherit">Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={isDeletePending}
            startIcon={isDeletePending ? <CircularProgress size={16} /> : undefined}
          >
            {isDeletePending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageRoot>
  );
}
