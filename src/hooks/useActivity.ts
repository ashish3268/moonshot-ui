import { useState, useEffect } from 'react';
import type { ActivityItem } from '@/types/api';
import { MOCK_ACTIVITY } from '@/mocks/data';

interface UseActivityResult {
  data: ActivityItem[];
  isLoading: boolean;
}

export function useActivity(): UseActivityResult {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_ACTIVITY);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
