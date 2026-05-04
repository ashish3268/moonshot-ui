import { useState } from 'react';
import {
  Box, Button, Typography, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import BalanceBadge from '@/components/common/BalanceBadge';
import UserAvatar from '@/components/common/UserAvatar';
import { useFriends, useInviteFriend, useNonFriendUsers } from '@/hooks/useFriends';
import { extractErrorMessage } from '@/utils/errors';
import type { Friend } from '@/types/api';

export default function FriendsPage() {
  const { data: friends = [], isPending: isLoading } = useFriends();
  const { data: nonFriends = [] } = useNonFriendUsers();
  const navigate = useNavigate();
  const invite = useInviteFriend();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setSearch('');
    setNewName('');
    setError(null);
    setOpen(true);
  }

  async function handleInviteExisting(email: string) {
    setError(null);
    try {
      await invite.mutateAsync({ email });
      setOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not add friend. Please try again.'));
    }
  }

  async function handleInviteNew() {
    if (!search.trim()) return;
    setError(null);
    try {
      await invite.mutateAsync({ email: search.trim(), name: newName.trim() || undefined });
      setOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not add friend. Please try again.'));
    }
  }

  const filteredNonFriends = nonFriends.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(search.trim());
  const emailNotInList = isEmail && !nonFriends.some((u) => u.email === search.trim());

  if (isLoading) return <LoadingSpinner />;

  const owing = friends.filter((f) => f.netBalance < 0);
  const owed = friends.filter((f) => f.netBalance > 0);
  const settled = friends.filter((f) => f.netBalance === 0);

  function renderFriendRow(friend: Friend) {
    return (
      <ListItem
        key={friend.id}
        onClick={() => navigate(`/friends/${friend.id}`)}
        sx={{
          cursor: 'pointer',
          borderBottom: '1px solid',
          borderColor: 'custom.borderLight',
          '&:hover': { bgcolor: 'custom.hoverItem' },
          px: 2,
          py: 1.5,
          gap: 1.5,
          minHeight: 72,
        }}
      >
        <UserAvatar user={friend.user} size={36} />
        <ListItemText
          primary={friend.user.name}
          secondary={friend.user.email}
          slotProps={{
            primary: { variant: 'body1', sx: { fontWeight: 600 } },
            secondary: { variant: 'body2', sx: { color: 'text.secondary' } },
          }}
        />
        <BalanceBadge amount={friend.netBalance} />
        <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: '1.1rem', ml: 0.5 }} />
      </ListItem>
    );
  }

  if (friends.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No friends yet"
        subtitle="Add friends to start splitting expenses together."
      />
    );
  }

  return (
    <PageRoot>
      <SectionPane>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
            Friends
          </Typography>
          <Button variant="contained" size="small" onClick={openDialog}>
            + Add Friend
          </Button>
        </Box>

        {/* You owe */}
        {owing.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'custom.badgeRedText', mb: 1 }}>
              You owe
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2, overflow: 'hidden' }}>
              <List disablePadding>{owing.map(renderFriendRow)}</List>
            </Box>
          </Box>
        )}

        {/* Owed to you */}
        {owed.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'custom.badgeGreenText', mb: 1 }}>
              Owed to you
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2, overflow: 'hidden' }}>
              <List disablePadding>{owed.map(renderFriendRow)}</List>
            </Box>
          </Box>
        )}

        {/* Settled up */}
        {settled.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Settled up
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'custom.borderLight', borderRadius: 2, overflow: 'hidden' }}>
              <List disablePadding>{settled.map(renderFriendRow)}</List>
            </Box>
          </Box>
        )}
      </SectionPane>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Friend</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {error && <Alert severity="error" sx={{ mx: 3, mt: 1 }}>{error}</Alert>}

          <Box sx={{ px: 3, pt: error ? 1.5 : 2, pb: 1 }}>
            <TextField
              placeholder="Search by name or enter email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (isEmail)) handleInvite(search.trim());
              }}
              fullWidth
              size="small"
              autoFocus
            />
          </Box>

          {filteredNonFriends.length > 0 && !emailNotInList && (
            <List disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
              {filteredNonFriends.map((u) => (
                <ListItem
                  key={u.id}
                  sx={{
                    px: 3, py: 1, gap: 1.5, cursor: 'pointer',
                    '&:hover': { bgcolor: 'custom.hoverItem' },
                  }}
                  onClick={() => handleInviteExisting(u.email)}
                >
                  <UserAvatar user={u} size={32} />
                  <ListItemText
                    primary={u.name}
                    secondary={u.email}
                    slotProps={{
                      primary: { variant: 'body2', sx: { fontWeight: 600 } },
                      secondary: { variant: 'caption' },
                    }}
                  />
                  <PersonAddIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                </ListItem>
              ))}
            </List>
          )}

          {emailNotInList && (
            <Box sx={{ px: 3, pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Divider sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>New user</Typography>
              </Divider>
              <TextField
                label="Email address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                size="small"
                type="email"
              />
              <TextField
                label="Name (optional)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInviteNew()}
                fullWidth
                size="small"
                placeholder="How should we call them?"
                autoFocus
              />
            </Box>
          )}

          {filteredNonFriends.length === 0 && !emailNotInList && (
            <Typography variant="body2" sx={{ color: 'text.secondary', px: 3, py: 2 }}>
              {search ? 'No users found. Enter a full email to invite someone new.' : 'All users are already your friends.'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          {emailNotInList && (
            <Button
              onClick={handleInviteNew}
              variant="contained"
              disabled={!search.trim() || invite.isPending}
              startIcon={invite.isPending ? <CircularProgress size={16} /> : <PersonAddIcon />}
            >
              {invite.isPending ? 'Adding…' : 'Add Friend'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PageRoot>
  );
}
