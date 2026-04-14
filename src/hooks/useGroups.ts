import { useState, useEffect } from 'react';
import type { Group } from '@/types/api';
import { MOCK_GROUPS } from '@/mocks/data';

interface UseGroupsResult {
  data: Group[];
  isLoading: boolean;
}

export function useGroups(): UseGroupsResult {
  const [data, setData] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_GROUPS);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
