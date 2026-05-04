import apiClient from './client';
import type { User } from '@/types/api';

export async function fetchNonFriendUsers(): Promise<User[]> {
  const { data } = await apiClient.get<Record<string, unknown>[]>('/api/v1/users');
  return data.map((u) => ({
    id: u.id as string,
    email: u.email as string,
    name: u.name as string,
    avatarUrl: u.avatar_url as string | undefined,
  }));
}
