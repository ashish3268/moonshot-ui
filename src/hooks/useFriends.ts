import { useState, useEffect } from 'react';
import type { Friend } from '@/types/api';
import { MOCK_FRIENDS } from '@/mocks/data';

interface UseFriendsResult {
  data: Friend[];
  isLoading: boolean;
}

export function useFriends(): UseFriendsResult {
  const [data, setData] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_FRIENDS);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
