import { Box, Button, Card, CardActionArea, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageRoot, SectionPane } from '@/components/styled';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import BalanceBadge from '@/components/common/BalanceBadge';
import { useGroups } from '@/hooks/useGroups';

export default function GroupsPage() {
  const { data: groups, isLoading } = useGroups();
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageRoot>
      <SectionPane>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
            Groups
          </Typography>
          <Button variant="contained" size="small" onClick={() => alert('Coming soon')}>
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
    </PageRoot>
  );
}
