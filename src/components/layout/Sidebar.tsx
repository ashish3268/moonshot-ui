import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import HistoryIcon from '@mui/icons-material/History';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '@/store/authStore';

const SIDEBAR_WIDTH = 240;

const SidebarRoot = styled(Box)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  minWidth: SIDEBAR_WIDTH,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.custom.navBg,
  borderRight: `1px solid ${theme.palette.custom.navBorder}`,
}));

const navItemSx = (selected: boolean) =>
  ({
    borderRadius: 2,
    mx: 1,
    mb: '2px',
    ...(selected && {
      bgcolor: 'primary.main',
      color: '#ffffff',
      '& .MuiListItemIcon-root': { color: '#ffffff' },
      '&:hover': { bgcolor: 'primary.dark' },
    }),
  }) as const;

interface NavLinkItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavLinkItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Friends', path: '/friends', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Groups', path: '/groups', icon: <GroupsIcon fontSize="small" /> },
  { label: 'Activity', path: '/activity', icon: <HistoryIcon fontSize="small" /> },
  { label: 'Chat', path: '/chat', icon: <AutoAwesomeIcon fontSize="small" /> },
];

export default function Sidebar() {
  const location = useLocation();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <SidebarRoot>
      {/* Brand */}
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.3rem',
            color: theme.palette.primary.main,
            letterSpacing: '-0.02em',
          }}
        >
          Moonshot
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.custom.navTextMuted }}>
          Split expenses, not friendships
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              sx={navItemSx(selected)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontSize: '0.95rem', fontWeight: 500 } },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* User + Logout */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.custom.navBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.75rem',
            fontWeight: 600,
            bgcolor: theme.palette.primary.main,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name ?? 'Guest'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.custom.navTextMuted,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email ?? ''}
          </Typography>
        </Box>
        <Box
          component="button"
          onClick={clearUser}
          sx={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: theme.palette.custom.navTextMuted,
            p: 0.5,
            borderRadius: 1,
            display: 'flex',
            '&:hover': { color: theme.palette.error.main },
          }}
        >
          <LogoutIcon fontSize="small" />
        </Box>
      </Box>
    </SidebarRoot>
  );
}
