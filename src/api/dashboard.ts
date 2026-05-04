import apiClient from './client';
import type { DashboardSummary } from '@/types/api';

export async function fetchDashboard(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<Record<string, unknown>>('/api/v1/dashboard');
  return {
    totalOwed: data.total_owed as number,
    totalOwe: data.total_owe as number,
    recentActivity: (data.recent_activity as Record<string, unknown>[]).map((a) => ({
      id: a.id as string,
      type: a.type as DashboardSummary['recentActivity'][0]['type'],
      description: a.description as string,
      amount: a.amount as number | undefined,
      groupName: a.group_name as string | undefined,
      createdAt: a.created_at as string,
    })),
  };
}
