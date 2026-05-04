import apiClient from './client';
import type { Friend, FriendBalance, SharedExpense } from '@/types/api';

function toFriend(d: Record<string, unknown>): Friend {
  const user = d.user as Record<string, unknown>;
  return {
    id: d.id as string,
    user: {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      avatarUrl: user.avatar_url as string | undefined,
    },
    netBalance: d.net_balance as number,
    status: d.status as Friend['status'],
  };
}

export async function inviteFriend(email: string, name?: string): Promise<Friend> {
  const { data } = await apiClient.post<Record<string, unknown>>('/api/v1/friends', { email, name });
  return toFriend(data);
}

export async function fetchFriends(): Promise<Friend[]> {
  const { data } = await apiClient.get<Record<string, unknown>[]>('/api/v1/friends');
  return data.map(toFriend);
}

export async function fetchFriendBalance(friendId: string): Promise<FriendBalance> {
  const { data } = await apiClient.get<Record<string, unknown>>(`/api/v1/friends/${friendId}/balance`);
  return {
    userId: data.user_id as string,
    isOwed: data.is_owed as number,
    owes: data.owes as number,
    net: data.net as number,
  };
}

export async function fetchSharedExpenses(friendId: string): Promise<SharedExpense[]> {
  const { data } = await apiClient.get<Record<string, unknown>[]>(`/api/v1/friends/${friendId}/expenses`);
  return data.map((d) => {
    const paidBy = d.paid_by as Record<string, unknown>;
    return {
      id: d.id as string,
      description: d.description as string,
      amount: d.amount as number,
      date: d.date as string,
      category: d.category as SharedExpense['category'],
      paidBy: {
        id: paidBy.id as string,
        email: paidBy.email as string,
        name: paidBy.name as string,
        avatarUrl: paidBy.avatar_url as string | undefined,
      },
      mySplitAmount: d.my_split_amount as number,
      mySplitSettled: d.my_split_settled as boolean,
      groupId: d.group_id as string | undefined,
      createdAt: d.created_at as string,
    };
  });
}
