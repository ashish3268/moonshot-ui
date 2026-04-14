export type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'entertainment' | 'utilities' | 'other';

export const CATEGORIES: Record<ExpenseCategory, { label: string; icon: string }> = {
  food: { label: 'Food & Drink', icon: '🍕' },
  transport: { label: 'Transport', icon: '🚕' },
  accommodation: { label: 'Accommodation', icon: '🏨' },
  entertainment: { label: 'Entertainment', icon: '🎟' },
  utilities: { label: 'Utilities', icon: '💡' },
  other: { label: 'Other', icon: '📦' },
};
