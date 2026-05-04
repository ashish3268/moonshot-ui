import apiClient from './client';
import type { ActivityItem, SplitParticipant } from '@/types/api';

interface RawSplitParticipant {
  user_id: string;
  name: string;
  amount: number;
}

export async function fetchActivity(limit = 50): Promise<ActivityItem[]> {
  const { data } = await apiClient.get<Record<string, unknown>[]>('/api/v1/activity', {
    params: { limit },
  });
  return data.map((a) => {
    const rawSplits = a.splits as RawSplitParticipant[] | undefined | null;
    const splits: SplitParticipant[] | undefined = rawSplits
      ? rawSplits.map((s) => ({ userId: s.user_id, name: s.name, amount: s.amount }))
      : undefined;
    return {
      id: a.id as string,
      type: a.type as ActivityItem['type'],
      description: a.description as string,
      amount: a.amount as number | undefined,
      groupName: a.group_name as string | undefined,
      groupId: a.group_id as string | undefined,
      createdAt: a.created_at as string,
      settlementId: a.settlement_id as string | undefined,
      expenseId: a.expense_id as string | undefined,
      paidByName: a.paid_by_name as string | undefined,
      paidById: a.paid_by_id as string | undefined,
      splits,
    };
  });
}
