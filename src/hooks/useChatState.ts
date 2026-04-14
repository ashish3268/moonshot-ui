import { useState } from 'react';
import { sendMessage, type ClaudeMessage } from '@/api/claude';
import { MOONSHOT_TOOLS } from '@/ai/tools';
import { buildSystemPrompt } from '@/ai/systemPrompt';
import { MOCK_FRIENDS, MOCK_GROUPS } from '@/mocks/data';
import { formatCurrency } from '@/utils/currency';
import type { ChatMessageItem } from '@/types/chat';

const AUTO_EXECUTE_TOOLS = new Set(['get_balance', 'list_expenses', 'list_friends', 'list_groups']);

function executeToolAction(toolName: string, input: Record<string, unknown>): string {
  switch (toolName) {
    case 'add_expense':
      return `Added "${String(input.description ?? '')}" for ${formatCurrency(input.amount as number)}`;
    case 'get_balance': {
      if (input.friendId) {
        const friend = MOCK_FRIENDS.find((f) => f.user.id === input.friendId);
        if (!friend) return 'Friend not found.';
        return friend.netBalance > 0
          ? `${friend.user.name} owes you ${formatCurrency(friend.netBalance)}`
          : `You owe ${friend.user.name} ${formatCurrency(Math.abs(friend.netBalance))}`;
      }
      return 'Overall: you are owed $149.00, you owe $23.50';
    }
    case 'list_expenses':
      return 'Showing recent expenses (mock data loaded)';
    case 'settle_up':
      return 'Settlement recorded';
    case 'list_friends':
      return MOCK_FRIENDS.map((f) =>
        f.netBalance > 0
          ? `${f.user.name}: owes you ${formatCurrency(f.netBalance)}`
          : f.netBalance < 0
            ? `${f.user.name}: you owe ${formatCurrency(Math.abs(f.netBalance))}`
            : `${f.user.name}: settled`,
      ).join('\n');
    case 'list_groups':
      return MOCK_GROUPS.map((g) =>
        g.netBalance > 0
          ? `${g.name}: +${formatCurrency(g.netBalance)}`
          : `${g.name}: ${formatCurrency(g.netBalance)}`,
      ).join('\n');
    default:
      return 'Action completed.';
  }
}

export interface UseChatStateReturn {
  messages: ChatMessageItem[];
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
  handleSend: (text?: string) => Promise<void>;
  handleConfirm: (messageId: string) => void;
}

export function useChatState(): UseChatStateReturn {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend(text?: string): Promise<void> {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    setInput('');

    const userMsg: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const history: ClaudeMessage[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await sendMessage(history, MOONSHOT_TOOLS, buildSystemPrompt());

      if (response.stop_reason === 'tool_use') {
        const toolBlock = response.content.find((b) => b.type === 'tool_use');
        const textBlock = response.content.find((b) => b.type === 'text');

        if (toolBlock && toolBlock.type === 'tool_use') {
          const assistantMsg: ChatMessageItem = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: textBlock && textBlock.type === 'text' ? textBlock.text : '',
            toolCall: { name: toolBlock.name, input: toolBlock.input },
            confirmed: false,
          };

          if (AUTO_EXECUTE_TOOLS.has(toolBlock.name)) {
            const result = executeToolAction(toolBlock.name, toolBlock.input);
            const autoMsg: ChatMessageItem = {
              ...assistantMsg,
              confirmed: true,
            };
            const resultMsg: ChatMessageItem = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: result,
            };
            setMessages((prev) => [...prev, autoMsg, resultMsg]);
          } else {
            setMessages((prev) => [...prev, assistantMsg]);
          }
        }
      } else {
        const textBlock = response.content.find((b) => b.type === 'text');
        const assistantMsg: ChatMessageItem = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: textBlock && textBlock.type === 'text' ? textBlock.text : '',
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      const errorMsg: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting. Make sure VITE_ANTHROPIC_API_KEY is set.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirm(messageId: string): void {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.toolCall) return;

    const result = executeToolAction(msg.toolCall.name, msg.toolCall.input);
    const resultMsg: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result,
    };

    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === messageId ? { ...m, confirmed: true } : m,
      );
      return [...updated, resultMsg];
    });
  }

  return { messages, input, isLoading, setInput, handleSend, handleConfirm };
}
