import { Avatar, Box, Typography } from '@mui/material';
import ConfirmationCard from '@/components/chat/ConfirmationCard';
import type { ChatMessageItem } from '@/types/chat';

export type { ChatMessageItem };

interface ChatMessageProps {
  message: ChatMessageItem;
  onConfirm: (id: string) => void;
  onEdit: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ChatMessage({ message, onConfirm, onEdit }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1,
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          fontSize: '0.75rem',
          fontWeight: 700,
          bgcolor: isUser ? 'primary.main' : 'custom.navBorder',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          flexShrink: 0,
          mt: 0.5,
        }}
      >
        {isUser ? getInitials('Alex Johnson') : 'M'}
      </Avatar>

      <Box sx={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: isUser ? 'primary.main' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            border: isUser ? 'none' : '1px solid',
            borderColor: 'custom.borderLight',
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {message.content}
          </Typography>
        </Box>

        {message.toolCall && (
          <ConfirmationCard
            toolName={message.toolCall.name}
            input={message.toolCall.input}
            onConfirm={() => onConfirm(message.id)}
            onEdit={() => onEdit(message.id)}
            confirmed={message.confirmed ?? false}
          />
        )}
      </Box>
    </Box>
  );
}
