import apiClient from './client';
import type { Group, GroupDetail } from '@/types/api';

function toUser(u: Record<string, unknown>) {
  return {
    id: u.id as string,
    email: u.email as string,
    name: u.name as string,
    avatarUrl: u.avatar_url as string | undefined,
  };
}

export async function createGroup(payload: { name: string; emoji: string; memberEmails: string[] }): Promise<Group> {
  const { data } = await apiClient.post<Record<string, unknown>>('/api/v1/groups', {
    name: payload.name,
    emoji: payload.emoji,
    member_emails: payload.memberEmails,
  });
  return {
    id: data.id as string,
    name: data.name as string,
    emoji: data.emoji as string,
    members: (data.members as Record<string, unknown>[]).map(toUser),
    netBalance: (data.net_balance as number) ?? 0,
    createdAt: data.created_at as string,
  };
}

export async function updateGroup(groupId: string, payload: { name?: string; emoji?: string }): Promise<Group> {
  const { data } = await apiClient.patch<Record<string, unknown>>(`/api/v1/groups/${groupId}`, payload);
  return {
    id: data.id as string,
    name: data.name as string,
    emoji: data.emoji as string,
    members: (data.members as Record<string, unknown>[]).map(toUser),
    netBalance: data.net_balance as number,
    createdAt: data.created_at as string,
  };
}

export async function addGroupMember(groupId: string, email: string, name?: string): Promise<void> {
  await apiClient.post(`/api/v1/groups/${groupId}/members`, { email, name });
}

export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  await apiClient.delete(`/api/v1/groups/${groupId}/members/${userId}`);
}

export async function fetchGroups(): Promise<Group[]> {
  const { data } = await apiClient.get<Record<string, unknown>[]>('/api/v1/groups');
  return data.map((d) => ({
    id: d.id as string,
    name: d.name as string,
    emoji: d.emoji as string,
    members: (d.members as Record<string, unknown>[]).map(toUser),
    netBalance: d.net_balance as number,
    createdAt: d.created_at as string,
  }));
}

export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  const { data } = await apiClient.get<Record<string, unknown>>(`/api/v1/groups/${groupId}`);
  const balance = data.current_user_balance as Record<string, unknown>;
  return {
    id: data.id as string,
    name: data.name as string,
    emoji: data.emoji as string,
    members: (data.members as Record<string, unknown>[]).map((m) => ({
      user: toUser(m.user as Record<string, unknown>),
      joinedAt: m.joined_at as string,
      netBalance: m.net_balance as number,
    })),
    expenses: (data.expenses as Record<string, unknown>[]).map((e) => ({
      id: e.id as string,
      description: e.description as string,
      amount: e.amount as number,
      date: e.date as string,
      category: e.category as GroupDetail['expenses'][0]['category'],
      paidBy: toUser(e.paid_by as Record<string, unknown>),
      splits: (e.splits as Record<string, unknown>[]).map((s) => ({
        userId: s.user_id as string,
        amount: s.amount as number,
        settled: s.settled as boolean,
      })),
      createdAt: e.created_at as string,
    })),
    currentUserBalance: {
      totalPaid: balance.total_paid as number,
      totalOwedToMe: balance.total_owed_to_me as number,
      totalIOwe: balance.total_i_owe as number,
      net: balance.net as number,
    },
    createdAt: data.created_at as string,
  };
}
