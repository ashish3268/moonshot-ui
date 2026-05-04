import { useQuery } from '@tanstack/react-query';
import { userKeys } from '@/api/queryKeys';
import { fetchDashboard } from '@/api/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: [...userKeys.me, 'dashboard'],
    queryFn: fetchDashboard,
  });
}
