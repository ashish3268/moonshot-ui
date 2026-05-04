import { useState } from 'react';
import {
  Box, Typography, List, ListItem, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress,
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageRoot, SectionPane, SectionTitle } from '@/components/styled';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserAvatar from '@/components/common/UserAvatar';
import BalanceBadge from '@/components/common/BalanceBadge';
import { useGroupDetail, useAddGroupMember, useRemoveGroupMember, useUpdateGroup } from '@/hooks/useGroups';
import { extractErrorMessage } from '@/utils/errors';
import { formatCurrency } from '@/utils/currency';
import { formatDisplayDate } from '@/utils/dates';
import { CATEGORIES } from '@/constants/categories';
import type { ExpenseCategory } from '@/types/api';

const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: group, isPending: isLoading } = useGroupDetail(id ?? '');
  const addMember = useAddGroupMember(id ?? '');
  const removeMember = useRemoveGroupMember(id ?? '');
  const updateGroupMutation = useUpdateGroup(id ?? '');

  const [memberOpen, setMemberOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);

  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  function openEdit() {
    setEditName(group?.name ?? '');
    setEditEmoji(group?.emoji ?? '');
    setEditError(null);
    setEditOpen(true);
  }

  async function handleSaveEdit() {
    if (!editName.trim()) return;
    setEditError(null);
    try {
      await updateGroupMutation.mutateAsync({ name: editName.trim(), emoji: editEmoji.trim() || undefined });
      setEditOpen(false);
    } catch (err) {
      setEditError(extractErrorMessage(err, 'Could not update group. Please try again.'));
    }
  }

  function openAddMember() {
    setMemberEmail('');
    setMemberName('');
    setMemberError(null);
    setMemberOpen(true);
  }

  async function handleAddMember() {
    if (!memberEmail.trim()) return;
    setMemberError(null);
    try {
      await addMember.mutateAsync({ email: memberEmail.trim(), name: memberName.trim() || undefined });
      setMemberEmail('');
      setMemberName('');
      setMemberOpen(false);
    } catch (err) {
      setMemberError(extractErrorMessage(err, 'Could not add member. Check the email and try again.'));
    }
  }

  async function handleRemoveMember() {
    if (!removeTarget) return;
    setRemoveError(null);
    try {
      await removeMember.mutateAsync(removeTarget.id);
      setRemoveTarget(null);
    } catch (err) {
      setRemoveError(extractErrorMessage(err, 'Could not remove member. Please try again.'));
    }
  }

  if (isLoading) return <LoadingSpinner />;

  if (!group) {
    return (
      <EmptyState icon="❓" title="Group not found" subtitle="This group could not be found." />
    );
  }

  const expenses = group.expenses;

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
            <IconButton size="small" onClick={openEdit} sx={{ color: 'text.secondary', ml: -0.5 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          {/* Member avatars + add button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            {group.members.map((member) => (
              <UserAvatar key={member.user.id} user={member.user} size={32} />
            ))}
            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonAddIcon fontSize="small" />}
              onClick={openAddMember}
              sx={{ ml: 0.5, height: 32, fontSize: '0.75rem' }}
            >
              Add Member
            </Button>
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
                const isMe = member.user.id === DEV_USER_ID;
                return (
                  <ListItem
                    key={member.user.id}
                    sx={{
                      borderBottom: idx < group.members.length - 1 ? '1px solid' : 'none',
                      borderColor: 'custom.borderLight',
                      px: 2,
                      py: 1.5,
                      gap: 1.5,
                      minHeight: 64,
                    }}
                  >
                    <UserAvatar user={member.user} size={32} />
                    <Typography variant="body1" sx={{ flex: 1, fontWeight: isMe ? 700 : 600 }}>
                      {isMe ? 'You' : member.user.name}
                    </Typography>
                    <BalanceBadge amount={member.netBalance} />
                    {!isMe && (
                      <IconButton
                        size="small"
                        onClick={() => setRemoveTarget({ id: member.user.id, name: member.user.name })}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        aria-label={`Remove ${member.user.name}`}
                      >
                        <PersonRemoveIcon fontSize="small" />
                      </IconButton>
                    )}
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
                          {expense.paidBy.id === DEV_USER_ID ? 'you' : expense.paidBy.name}
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

      <Dialog open={memberOpen} onClose={() => setMemberOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {memberError && <Alert severity="error">{memberError}</Alert>}
          <TextField
            label="Email address"
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            fullWidth
            size="small"
            autoFocus
            placeholder="friend@example.com"
          />
          <TextField
            label="Name (optional)"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
            fullWidth
            size="small"
            placeholder="How should we call them?"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setMemberOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleAddMember}
            variant="contained"
            disabled={!memberEmail.trim() || addMember.isPending}
            startIcon={addMember.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {addMember.isPending ? 'Adding…' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!removeTarget}
        onClose={() => { setRemoveTarget(null); setRemoveError(null); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {removeError && <Alert severity="error">{removeError}</Alert>}
          <Typography>
            Are you sure you want to remove {removeTarget?.name} from this group?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setRemoveTarget(null); setRemoveError(null); }} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveMember}
            variant="contained"
            color="error"
            disabled={removeMember.isPending}
            startIcon={removeMember.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {removeMember.isPending ? 'Removing…' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Group</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {editError && <Alert severity="error">{editError}</Alert>}
          <TextField
            label="Emoji"
            value={editEmoji}
            onChange={(e) => setEditEmoji(e.target.value)}
            fullWidth
            size="small"
            inputProps={{ maxLength: 2 }}
            placeholder="🏠"
          />
          <TextField
            label="Group name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            fullWidth
            size="small"
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!editName.trim() || updateGroupMutation.isPending}
            startIcon={updateGroupMutation.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {updateGroupMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageRoot>
  );
}
