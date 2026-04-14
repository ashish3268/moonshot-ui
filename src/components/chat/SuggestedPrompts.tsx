import { Box, Chip, Typography } from '@mui/material';

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  { label: 'Split dinner with friends', emoji: '💸' },
  { label: 'How much does Alice owe me?', emoji: '💰' },
  { label: 'Show Yosemite expenses', emoji: '📋' },
  { label: 'Settle up with Bob', emoji: '✅' },
];

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 6,
        px: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Hi Alex! What can I help you with?
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
          maxWidth: 480,
        }}
      >
        {SUGGESTED_PROMPTS.map((p) => (
          <Chip
            key={p.label}
            label={`${p.emoji} ${p.label}`}
            onClick={() => onSelect(p.label)}
            variant="outlined"
            sx={{
              fontSize: '0.875rem',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'custom.hoverItem' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
