import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatCurrency } from '@/utils/currency';

interface ConfirmationCardProps {
  toolName: string;
  input: Record<string, unknown>;
  onConfirm: () => void;
  onEdit: () => void;
  confirmed: boolean;
}

function renderDetails(toolName: string, input: Record<string, unknown>): string {
  switch (toolName) {
    case 'add_expense': {
      const amount = typeof input.amount === 'number' ? input.amount : 0;
      const splitWith = Array.isArray(input.splitWith) ? input.splitWith : [];
      const peopleCount = splitWith.length + 1;
      const perPerson = peopleCount > 0 ? amount / peopleCount : amount;
      return `${String(input.description ?? '')} · ${formatCurrency(amount)}\nSplit equally · ${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}\n${formatCurrency(perPerson)} each`;
    }
    case 'settle_up': {
      const amount = typeof input.amount === 'number' ? input.amount : 0;
      return `Settling ${formatCurrency(amount)} with friend id: ${String(input.friendId ?? '')}`;
    }
    default:
      return JSON.stringify(input, null, 2);
  }
}

function toolLabel(toolName: string): string {
  switch (toolName) {
    case 'add_expense':
      return 'Add Expense';
    case 'get_balance':
      return 'Get Balance';
    case 'list_expenses':
      return 'List Expenses';
    case 'settle_up':
      return 'Settle Up';
    case 'list_friends':
      return 'List Friends';
    case 'list_groups':
      return 'List Groups';
    default:
      return toolName;
  }
}

const AUTO_EXECUTE_TOOLS = new Set(['get_balance', 'list_expenses', 'list_friends', 'list_groups']);

export default function ConfirmationCard({
  toolName,
  input,
  onConfirm,
  onEdit,
  confirmed,
}: ConfirmationCardProps) {
  const needsConfirm = !AUTO_EXECUTE_TOOLS.has(toolName);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1,
        p: 1.5,
        border: '1px solid',
        borderColor: 'custom.borderLight',
        borderRadius: 2,
        bgcolor: 'background.default',
        maxWidth: 320,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
        {toolLabel(toolName)}
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', whiteSpace: 'pre-line', mb: 1 }}
      >
        {renderDetails(toolName, input)}
      </Typography>

      {confirmed ? (
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label="Done"
          size="small"
          sx={{
            bgcolor: 'custom.badgeGreen',
            color: 'custom.badgeGreenText',
            border: '1px solid',
            borderColor: 'custom.badgeGreenBorder',
            fontWeight: 600,
          }}
        />
      ) : needsConfirm ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={onConfirm}
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            Confirm
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onEdit}
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            Edit
          </Button>
        </Box>
      ) : null}
    </Paper>
  );
}
