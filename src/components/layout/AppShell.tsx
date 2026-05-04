import { useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import ChatDrawer from '@/components/chat/ChatDrawer';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import { useUiStore } from '@/store/uiStore';

const DRAWER_WIDTH = 420;

const ShellRoot = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export default function AppShell() {
  const location = useLocation();
  const isOnChat = location.pathname === '/chat';
  const { chatDrawerOpen, toggleChatDrawer, setChatDrawerOpen } = useUiStore();

  // Close drawer when navigating to the full chat page
  useEffect(() => {
    if (isOnChat) setChatDrawerOpen(false);
  }, [isOnChat, setChatDrawerOpen]);

  return (
    <ShellRoot>
      <Sidebar />

      {/* Main area shrinks when drawer is open — no overlap */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          marginRight: chatDrawerOpen && !isOnChat ? `${DRAWER_WIDTH}px` : 0,
          transition: 'margin-right 0.25s ease',
        }}
      >
        <TopBar />
        <Content>
          <Outlet />
        </Content>
      </Box>

      {/* Floating button — hidden on /chat page and when drawer is open (drawer has its own close button) */}
      {!isOnChat && !chatDrawerOpen && (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1400 }}>
          <Fab color="primary" onClick={toggleChatDrawer} sx={{ boxShadow: 4 }}>
            <ChatIcon />
          </Fab>
        </Box>
      )}

      {/* Drawer — only rendered outside /chat */}
      {!isOnChat && <ChatDrawer />}

      <AddExpenseModal />
    </ShellRoot>
  );
}
