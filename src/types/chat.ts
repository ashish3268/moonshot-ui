export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCall?: { name: string; input: Record<string, unknown> };
  confirmed?: boolean;
}
