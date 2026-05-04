import { useState } from 'react';
import {
  Box, Button, Card, CardActionArea, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import BalanceBadge from '@/components/common/BalanceBadge';
import { useGroups, useCreateGroup } from '@/hooks/useGroups';
import { extractErrorMessage } from '@/utils/errors';

export default function GroupsPage() {
  const { data: groups = [], isPending: isLoading } = useGroups();
  const navigate = useNavigate();
  const createGroup = useCreateGroup();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏷');
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setName('');
    setEmoji('🏷');
    setError(null);
    setOpen(true);
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setError(null);
    try {
      const group = await createGroup.mutateAsync({ name: name.trim(), emoji: emoji || '🏷', memberEmails: [] });
      setOpen(false);
      navigate(`/groups/${group.id}`);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create group. Please try again.'));
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageRoot>
      <SectionPane>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
            Groups
          </Typography>
          <Button variant="contained" size="small" onClick={openDialog}>
            + New Group
          </Button>
        </Box>

        {groups.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No groups yet"
            subtitle="Create a group to split expenses with multiple people."
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2,
            }}
          >
            {groups.map((group) => (
              <Card
                key={group.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'custom.borderLight',
                  borderRadius: 2,
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/groups/${group.id}`)}
                  sx={{ p: 2.5 }}
                >
                  <Typography sx={{ fontSize: '2rem', mb: 1, lineHeight: 1 }}>
                    {group.emoji}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.25 }}>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                    {group.members.length} members
                  </Typography>
                  <BalanceBadge amount={group.netBalance} />
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </SectionPane>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>New Group</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              size="small"
              sx={{ width: 80 }}
              inputProps={{ maxLength: 2 }}
            />
            <TextField
              label="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              fullWidth
              size="small"
              autoFocus
              placeholder="e.g. Apartment, Trip to Vegas"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!name.trim() || createGroup.isPending}
            startIcon={createGroup.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {createGroup.isPending ? 'Creating…' : 'Create Group'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageRoot>
  );
}
