import { useState, useEffect } from 'react';
import type { DashboardSummary } from '@/types/api';
import { MOCK_DASHBOARD } from '@/mocks/data';

interface UseDashboardResult {
  data: DashboardSummary | null;
  isLoading: boolean;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DASHBOARD);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
