import type { ToolDefinition } from '@/api/claude';

export const MOONSHOT_TOOLS: ToolDefinition[] = [
  {
    name: 'add_expense',
    description: 'Add a new expense and split it among friends or group members',
    input_schema: {
      type: 'object',
      properties: {
        description: { type: 'string', description: 'What the expense was for' },
        amount: { type: 'number', description: 'Total amount in USD' },
        category: {
          type: 'string',
          enum: ['food', 'transport', 'accommodation', 'entertainment', 'utilities', 'other'],
        },
        groupId: { type: 'string', description: 'Group ID if part of a group (optional)' },
        splitWith: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of user IDs to split with',
        },
        splitType: {
          type: 'string',
          enum: ['equal', 'exact', 'percent'],
          default: 'equal',
        },
      },
      required: ['description', 'amount', 'category'],
    },
  },
  {
    name: 'get_balance',
    description: 'Get the balance with a specific friend or overall balance summary',
    input_schema: {
      type: 'object',
      properties: {
        friendId: {
          type: 'string',
          description: 'Friend user ID (optional — omit for overall balance)',
        },
      },
    },
  },
  {
    name: 'list_expenses',
    description: 'List recent expenses, optionally filtered by group or friend',
    input_schema: {
      type: 'object',
      properties: {
        groupId: { type: 'string', description: 'Filter by group ID (optional)' },
        friendId: { type: 'string', description: 'Filter by friend ID (optional)' },
        limit: { type: 'number', default: 5 },
      },
    },
  },
  {
    name: 'settle_up',
    description: 'Record a settlement payment with a friend',
    input_schema: {
      type: 'object',
      properties: {
        friendId: { type: 'string', description: 'Friend user ID to settle with' },
        amount: { type: 'number', description: 'Amount to settle' },
      },
      required: ['friendId', 'amount'],
    },
  },
  {
    name: 'list_friends',
    description: 'List all friends and their balances',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'list_groups',
    description: 'List all groups and their balances',
    input_schema: { type: 'object', properties: {} },
  },
];
