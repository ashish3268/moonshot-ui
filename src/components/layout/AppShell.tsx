import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

const ShellRoot = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

const MainArea = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
});

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export default function AppShell() {
  return (
    <ShellRoot>
      <Sidebar />
      <MainArea>
        <TopBar />
        <Content>
          <Outlet />
        </Content>
      </MainArea>
    </ShellRoot>
  );
}
