import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import { useUiStore } from '@/store/uiStore';
import { MOCK_GROUPS } from '@/mocks/data';
import { CATEGORIES } from '@/constants/categories';
import type { ExpenseCategory } from '@/constants/categories';
import { formatCurrency } from '@/utils/currency';

const CATEGORY_KEYS = Object.keys(CATEGORIES) as ExpenseCategory[];

function todayISO(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

export default function AddExpenseModal() {
  const open = useUiStore((s) => s.addExpenseModalOpen);
  const setOpen = useUiStore((s) => s.setAddExpenseModalOpen);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [groupId, setGroupId] = useState('');

  function handleClose() {
    setOpen(false);
  }

  function handleSave() {
    setOpen(false);
    alert('Expense saved! (mock)');
  }

  const selectedGroup = MOCK_GROUPS.find((g) => g.id === groupId);
  const memberCount = selectedGroup ? selectedGroup.members.length : 1;
  const parsedAmount = parseFloat(amount) || 0;
  const perPerson = memberCount > 0 ? parsedAmount / memberCount : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Add Expense</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          size="small"
          placeholder="e.g. Dinner at Nobu"
        />

        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
        />

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {CATEGORY_KEYS.map((key) => (
              <MenuItem key={key} value={key}>
                {CATEGORIES[key].icon} {CATEGORIES[key].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Group</InputLabel>
          <Select
            value={groupId}
            label="Group"
            onChange={(e) => setGroupId(e.target.value)}
          >
            <MenuItem value="">No group</MenuItem>
            {MOCK_GROUPS.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.emoji} {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Paid by</InputLabel>
          <Select value="you" label="Paid by">
            <MenuItem value="you">You</MenuItem>
          </Select>
        </FormControl>

        {/* Split preview */}
        {parsedAmount > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'custom.formBg',
              border: '1px solid',
              borderColor: 'custom.borderLight',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Split equally
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {memberCount} {memberCount === 1 ? 'person' : 'people'} ·{' '}
              {formatCurrency(perPerson)} each
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!description || !amount}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
