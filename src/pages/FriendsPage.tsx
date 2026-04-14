import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import BalanceBadge from '@/components/common/BalanceBadge';
import UserAvatar from '@/components/common/UserAvatar';
import { useFriends } from '@/hooks/useFriends';
import type { Friend } from '@/types/api';

export default function FriendsPage() {
  const { data: friends, isLoading } = useFriends();
  const navigate = useNavigate();

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
          <Button variant="contained" size="small" onClick={() => alert('Coming soon')}>
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
    </PageRoot>
  );
}
