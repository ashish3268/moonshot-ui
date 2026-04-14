import { useRef, useEffect } from 'react';
import { Box, CircularProgress, IconButton, Paper, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { useChatState } from '@/hooks/useChatState';
import { useUiStore } from '@/store/uiStore';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';

const DRAWER_WIDTH = 420;

export default function ChatDrawer() {
  const navigate = useNavigate();
  const { chatDrawerOpen, setChatDrawerOpen } = useUiStore();
  const { messages, input, isLoading, setInput, handleSend, handleConfirm } = useChatState();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleEdit(messageId: string) {
    const msg = messages.find((m) => m.id === messageId);
    if (msg?.toolCall) {
      setInput(`Edit: ${msg.toolCall.name} — ${JSON.stringify(msg.toolCall.input)}`);
    }
  }

  function handleOpenFull() {
    setChatDrawerOpen(false);
    navigate('/chat');
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: DRAWER_WIDTH,
        zIndex: 1300,
        transform: chatDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Moonshot AI
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ask me anything
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleOpenFull} title="Open full chat">
          <OpenInFullIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => setChatDrawerOpen(false)} title="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Messages area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.length === 0 && !isLoading ? (
          <SuggestedPrompts onSelect={(prompt) => void handleSend(prompt)} />
        ) : (
          messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
            />
          ))
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Moonshot AI is thinking...
            </Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={() => void handleSend()}
          disabled={!input.trim() || isLoading}
          sx={{ mb: 0.25 }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
