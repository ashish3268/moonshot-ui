import { useRef, useEffect } from 'react';
import { Box, CircularProgress, Divider, IconButton, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { PageRoot } from '@/components/styled';
import ChatMessage from '@/components/chat/ChatMessage';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import { useChatState } from '@/hooks/useChatState';

export default function ChatPage() {
  const navigate = useNavigate();
  const { messages, input, isLoading, setInput, handleSend, handleConfirm } = useChatState();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handleEdit(messageId: string) {
    const msg = messages.find((m) => m.id === messageId);
    if (msg?.toolCall) {
      setInput(`Edit: ${msg.toolCall.name} — ${JSON.stringify(msg.toolCall.input)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <PageRoot>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'custom.borderLight',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton size="small" onClick={() => navigate(-1)} title="Back">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Moonshot AI
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ask me anything about your expenses
          </Typography>
        </Box>
      </Box>

      {/* Message history */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
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

      <Divider />

      {/* Input bar */}
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask about expenses, balances, or say 'split dinner $60 with Alice and Bob'…"
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
    </PageRoot>
  );
}
