import apiClient from './client';
import type { Expense, ExpenseCreatePayload } from '@/types/api';

function toExpense(d: Record<string, unknown>): Expense {
  const paidBy = d.paid_by as Record<string, unknown>;
  return {
    id: d.id as string,
    description: d.description as string,
    amount: d.amount as number,
    date: d.date as string,
    category: d.category as Expense['category'],
    paidBy: {
      id: paidBy.id as string,
      email: paidBy.email as string,
      name: paidBy.name as string,
      avatarUrl: paidBy.avatar_url as string | undefined,
    },
    splits: (d.splits as Array<Record<string, unknown>>).map((s) => ({
      userId: s.user_id as string,
      amount: s.amount as number,
      settled: s.settled as boolean,
    })),
    groupId: d.group_id as string | undefined,
    createdAt: d.created_at as string,
    updatedAt: d.updated_at as string,
  };
}

export async function fetchExpenses(groupId?: string): Promise<Expense[]> {
  const params = groupId ? { group_id: groupId } : {};
  const { data } = await apiClient.get<Record<string, unknown>[]>('/api/v1/expenses', { params });
  return data.map(toExpense);
}

export async function createExpense(body: ExpenseCreatePayload): Promise<Expense> {
  const { data } = await apiClient.post<Record<string, unknown>>('/api/v1/expenses', {
    description: body.description,
    amount: body.amount,
    date: body.date,
    category: body.category,
    paid_by_id: body.paidById,
    group_id: body.groupId ?? null,
    split_mode: body.splitMode,
    participants: body.participants.map((p) => ({ user_id: p.userId, value: p.value ?? null })),
  });
  return toExpense(data);
}

export async function updateExpenseBasic(
  id: string,
  body: {
    description?: string;
    amount?: number;
    date?: string;
    category?: string;
    paidById?: string;
    splitMode?: string;
    participants?: { userId: string; amount: number }[];
  },
): Promise<void> {
  const payload: Record<string, unknown> = {
    ...(body.description !== undefined ? { description: body.description } : {}),
    ...(body.amount !== undefined ? { amount: body.amount } : {}),
    ...(body.date !== undefined ? { date: body.date } : {}),
    ...(body.category !== undefined ? { category: body.category } : {}),
    ...(body.paidById !== undefined ? { paid_by_id: body.paidById } : {}),
    ...(body.splitMode !== undefined ? { split_mode: body.splitMode } : {}),
    ...(body.participants !== undefined
      ? { participants: body.participants.map((p) => ({ user_id: p.userId, value: p.amount })) }
      : {}),
  };
  await apiClient.patch(`/api/v1/expenses/${id}`, payload);
}

export async function deleteExpenseById(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/expenses/${id}`);
}
