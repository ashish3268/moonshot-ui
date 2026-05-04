import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Select, MenuItem, FormControl, InputLabel,
  InputAdornment, Box, Typography, CircularProgress, Divider,
  ToggleButton, ToggleButtonGroup, Checkbox, Alert,
} from '@mui/material';
import { useUiStore } from '@/store/uiStore';
import { useGroups } from '@/hooks/useGroups';
import { useFriends } from '@/hooks/useFriends';
import { useCreateExpense } from '@/hooks/useExpenses';
import { CATEGORIES } from '@/constants/categories';
import { formatCurrency } from '@/utils/currency';
import type { ExpenseCategory } from '@/constants/categories';
import type { User } from '@/types/api';

const CATEGORY_KEYS = Object.keys(CATEGORIES) as ExpenseCategory[];
const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

type SplitMode = 'equal' | 'shares' | 'percent' | 'exact';

interface ParticipantRow {
  userId: string;
  name: string;
  included: boolean;
  value: string; // shares count | percent | exact dollar amount (unused for equal)
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

function makeRows(members: User[]): ParticipantRow[] {
  return members.map((m) => ({
    userId: m.id,
    name: m.id === DEV_USER_ID ? 'You' : m.name,
    included: true,
    value: '',
  }));
}

function defaultValue(mode: SplitMode, totalIncluded: number): string {
  if (mode === 'shares') return '1';
  if (mode === 'percent') return totalIncluded > 0 ? String(+(100 / totalIncluded).toFixed(2)) : '';
  return '';
}

export default function AddExpenseModal() {
  const open = useUiStore((s) => s.addExpenseModalOpen);
  const setOpen = useUiStore((s) => s.setAddExpenseModalOpen);
  const { data: groups = [] } = useGroups();
  const { data: friends = [] } = useFriends();
  const createExpense = useCreateExpense();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [groupId, setGroupId] = useState('');
  const [paidById, setPaidById] = useState(DEV_USER_ID);
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  const [rows, setRows] = useState<ParticipantRow[]>([]);
  const [friendSplitIds, setFriendSplitIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  const selectedGroup = groups.find((g) => g.id === groupId);

  // Reset rows when group changes
  useEffect(() => {
    if (!selectedGroup) {
      setRows([]);
      setPaidById(DEV_USER_ID);
      setSplitMode('equal');
    } else {
      const fresh = makeRows(selectedGroup.members);
      setRows(fresh);
      setPaidById(DEV_USER_ID);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  // When split mode changes, seed default values for included members
  useEffect(() => {
    if (!selectedGroup) return;
    setRows((prev) => {
      const includedCount = prev.filter((r) => r.included).length;
      return prev.map((r) => ({
        ...r,
        value: r.included ? defaultValue(splitMode, includedCount) : '',
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitMode]);

  function handleClose() {
    setOpen(false);
    setDescription('');
    setAmount('');
    setDate(todayISO());
    setCategory('other');
    setGroupId('');
    setPaidById(DEV_USER_ID);
    setSplitMode('equal');
    setRows([]);
    setFriendSplitIds([]);
    setSaveError(null);
  }

  function updateRow(userId: string, patch: Partial<ParticipantRow>) {
    setRows((prev) => prev.map((r) => (r.userId === userId ? { ...r, ...patch } : r)));
  }

  function toggleIncluded(userId: string) {
    setRows((prev) => {
      const next = prev.map((r) =>
        r.userId === userId ? { ...r, included: !r.included, value: !r.included ? defaultValue(splitMode, prev.filter((x) => x.included).length + 1) : '' } : r,
      );
      // Rebalance percent mode so included members share 100%
      if (splitMode === 'percent') {
        const includedCount = next.filter((r) => r.included).length;
        return next.map((r) => ({
          ...r,
          value: r.included ? String(+(100 / includedCount).toFixed(2)) : '',
        }));
      }
      return next;
    });
  }

  function toggleFriend(userId: string) {
    setFriendSplitIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  }

  // ─── Split computation ────────────────────────────────────────────────────
  const total = parseFloat(amount) || 0;
  const includedRows = rows.filter((r) => r.included);

  function computeSplit(): { userId: string; name: string; amount: number }[] {
    if (!total) return [];

    if (!selectedGroup) {
      const splitWith = [DEV_USER_ID, ...friendSplitIds];
      const each = total / splitWith.length;
      return splitWith.map((id) => {
        const friend = friends.find((f) => f.user.id === id);
        return { userId: id, name: id === DEV_USER_ID ? 'You' : (friend?.user.name ?? id), amount: each };
      });
    }

    switch (splitMode) {
      case 'equal': {
        const each = includedRows.length > 0 ? total / includedRows.length : 0;
        return includedRows.map((r) => ({ userId: r.userId, name: r.name, amount: each }));
      }
      case 'shares': {
        const totalShares = includedRows.reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
        return includedRows.map((r) => ({
          userId: r.userId, name: r.name,
          amount: totalShares > 0 ? (parseFloat(r.value) || 0) / totalShares * total : 0,
        }));
      }
      case 'percent':
        return includedRows.map((r) => ({
          userId: r.userId, name: r.name,
          amount: (parseFloat(r.value) || 0) / 100 * total,
        }));
      case 'exact':
        return includedRows.map((r) => ({
          userId: r.userId, name: r.name,
          amount: parseFloat(r.value) || 0,
        }));
    }
  }

  function validationError(): string | null {
    if (!total || !selectedGroup) return null;
    if (includedRows.length === 0) return 'Select at least one person.';
    switch (splitMode) {
      case 'equal': return null;
      case 'shares':
        return includedRows.every((r) => parseFloat(r.value) > 0) ? null : 'All shares must be greater than 0.';
      case 'percent': {
        const sum = includedRows.reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
        return Math.abs(sum - 100) < 0.5 ? null : `Percentages sum to ${sum.toFixed(1)}%, must equal 100%.`;
      }
      case 'exact': {
        const sum = includedRows.reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
        return Math.abs(sum - total) < 0.01 ? null : `Amounts sum to ${formatCurrency(sum)}, must equal ${formatCurrency(total)}.`;
      }
    }
  }

  const splitPreview = computeSplit();
  const validErr = validationError();
  const canSave =
    !!description.trim() && total > 0 && !validErr && !createExpense.isPending &&
    (!selectedGroup || includedRows.length > 0);

  async function handleSave() {
    if (!canSave) return;
    setSaveError(null);

    const participants: { userId: string; value?: number }[] = selectedGroup
      ? splitMode === 'equal'
        ? includedRows.map((r) => ({ userId: r.userId }))
        : splitMode === 'shares'
          ? includedRows.map((r) => ({ userId: r.userId, value: parseFloat(r.value) || 1 }))
          : splitMode === 'percent'
            ? includedRows.map((r) => ({ userId: r.userId, value: parseFloat(r.value) || 0 }))
            : includedRows.map((r) => ({ userId: r.userId, value: parseFloat(r.value) || 0 }))
      : [DEV_USER_ID, ...friendSplitIds].map((id) => ({ userId: id }));

    try {
      await createExpense.mutateAsync({
        description: description.trim(),
        amount: total,
        date,
        category,
        paidById,
        groupId: groupId || undefined,
        splitMode,
        participants,
      });
      handleClose();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setSaveError(detail ?? 'Could not save expense. Please try again.');
    }
  }

  const activeFriends = friends.filter((f) => f.status === 'active');

  // Input adornment per split mode
  const inputProps = (mode: SplitMode) => {
    if (mode === 'percent') return { endAdornment: <InputAdornment position="end">%</InputAdornment> };
    if (mode === 'exact') return { startAdornment: <InputAdornment position="start">$</InputAdornment> };
    return {};
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Add Expense</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

        {saveError && <Alert severity="error">{saveError}</Alert>}

        {/* ── Core fields ── */}
        <TextField
          label="Description" value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth size="small" placeholder="e.g. Dinner at Nobu"
        />
        <TextField
          label="Amount" type="number" value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth size="small"
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Date" type="date" value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth size="small"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
              {CATEGORY_KEYS.map((key) => (
                <MenuItem key={key} value={key}>{CATEGORIES[key].icon} {CATEGORIES[key].label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* ── Group selector ── */}
        <FormControl fullWidth size="small">
          <InputLabel>Group (optional)</InputLabel>
          <Select value={groupId} label="Group (optional)" onChange={(e) => setGroupId(e.target.value)}>
            <MenuItem value="">No group</MenuItem>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.emoji} {g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ── Group expense section ── */}
        {selectedGroup && (
          <>
            {/* Paid by */}
            <FormControl fullWidth size="small">
              <InputLabel>Paid by</InputLabel>
              <Select value={paidById} label="Paid by" onChange={(e) => setPaidById(e.target.value)}>
                {selectedGroup.members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.id === DEV_USER_ID ? 'You' : m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Split mode */}
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                Split by
              </Typography>
              <ToggleButtonGroup
                value={splitMode} exclusive
                onChange={(_, v) => v && setSplitMode(v as SplitMode)}
                size="small" fullWidth
              >
                <ToggleButton value="equal">Equal</ToggleButton>
                <ToggleButton value="shares">Shares</ToggleButton>
                <ToggleButton value="percent">Percent</ToggleButton>
                <ToggleButton value="exact">Custom $</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Member selection + value inputs */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'custom.borderLight',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {rows.map((row, idx) => (
                <Box
                  key={row.userId}
                  onClick={() => toggleIncluded(row.userId)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    borderBottom: idx < rows.length - 1 ? '1px solid' : 'none',
                    borderColor: 'custom.borderLight',
                    bgcolor: row.included ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'custom.hoverItem' },
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={row.included}
                    onChange={() => toggleIncluded(row.userId)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ p: 0 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, fontWeight: 600, color: row.included ? 'text.primary' : 'text.disabled' }}
                  >
                    {row.name}
                  </Typography>

                  {/* Value input for non-equal modes, only when included */}
                  {splitMode !== 'equal' && row.included && (
                    <TextField
                      size="small"
                      type="number"
                      value={row.value}
                      onChange={(e) => updateRow(row.userId, { value: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ width: 100 }}
                      slotProps={{ input: inputProps(splitMode) }}
                      inputProps={{ min: 0, step: splitMode === 'exact' ? 0.01 : 0.01 }}
                    />
                  )}

                  {/* Computed amount */}
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', width: 72, textAlign: 'right', flexShrink: 0 }}
                  >
                    {row.included && total > 0
                      ? (() => {
                          const entry = splitPreview.find((s) => s.userId === row.userId);
                          return entry ? formatCurrency(entry.amount) : '—';
                        })()
                      : <span style={{ color: 'inherit', opacity: 0.4 }}>—</span>
                    }
                  </Typography>
                </Box>
              ))}
            </Box>

            {validErr && total > 0 && (
              <Alert severity="warning" sx={{ py: 0.5 }}>{validErr}</Alert>
            )}
          </>
        )}

        {/* ── Non-group: split with friends ── */}
        {!selectedGroup && activeFriends.length > 0 && (
          <>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: -0.5 }}>
              Split with
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'custom.borderLight',
                borderRadius: 2,
                overflow: 'hidden',
                mt: -1,
              }}
            >
              {activeFriends.map((f, idx) => (
                <Box
                  key={f.id}
                  onClick={() => toggleFriend(f.user.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    borderBottom: idx < activeFriends.length - 1 ? '1px solid' : 'none',
                    borderColor: 'custom.borderLight',
                    '&:hover': { bgcolor: 'custom.hoverItem' },
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={friendSplitIds.includes(f.user.id)}
                    onChange={() => toggleFriend(f.user.id)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ p: 0 }}
                  />
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>{f.user.name}</Typography>
                  {total > 0 && friendSplitIds.includes(f.user.id) && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {formatCurrency(total / (friendSplitIds.length + 1))}
                    </Typography>
                  )}
                </Box>
              ))}
              {/* Always show "You" at the bottom */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  px: 2, py: 1,
                  borderTop: '1px solid', borderColor: 'custom.borderLight',
                  bgcolor: 'action.hover',
                }}
              >
                <Box sx={{ width: 24 }} />
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 700 }}>You</Typography>
                {total > 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatCurrency(total / (friendSplitIds.length + 1))}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )}

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button
          onClick={() => { handleSave().catch(() => {}); }}
          variant="contained"
          disabled={!canSave}
          startIcon={createExpense.isPending ? <CircularProgress size={16} /> : undefined}
        >
          {createExpense.isPending ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
