import { MOCK_FRIENDS, MOCK_GROUPS, MOCK_CURRENT_USER } from '@/mocks/data';

export function buildSystemPrompt(): string {
  const friendLines = MOCK_FRIENDS.map((f) => {
    const balanceStr =
      f.netBalance > 0
        ? `they owe you $${f.netBalance}`
        : f.netBalance < 0
          ? `you owe them $${Math.abs(f.netBalance)}`
          : 'settled';
    return `- ${f.user.name} (id: ${f.user.id}, balance: ${balanceStr})`;
  }).join('\n');

  const groupLines = MOCK_GROUPS.map((g) => {
    const balanceStr =
      g.netBalance > 0 ? `+$${g.netBalance}` : `-$${Math.abs(g.netBalance)}`;
    return `- ${g.name} (id: ${g.id}, ${g.members.length} members, your balance: ${balanceStr})`;
  }).join('\n');

  return `You are Moonshot AI, a helpful assistant for the Moonshot expense-splitting app.
You help users add expenses, check balances, and manage group finances using natural language.

Current user: ${MOCK_CURRENT_USER.name} (id: ${MOCK_CURRENT_USER.id})

Friends:
${friendLines}

Groups:
${groupLines}

When the user asks to add an expense, use the add_expense tool with the parsed details.
When the user asks about balances, use get_balance.
When the user asks to see expenses, use list_expenses.
Always be concise and friendly. Confirm actions before executing them using the tool — the UI will show a confirmation card.
If you're unsure about details (like who to split with), ask a clarifying question.`;
}
