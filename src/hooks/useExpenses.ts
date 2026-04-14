import { useState, useEffect } from 'react';
import type { Expense } from '@/types/api';
import { MOCK_EXPENSES } from '@/mocks/data';

interface UseExpensesResult {
  data: Expense[];
  isLoading: boolean;
}

export function useExpenses(groupId?: string): UseExpensesResult {
  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = groupId
        ? MOCK_EXPENSES.filter((e) => e.groupId === groupId)
        : MOCK_EXPENSES;
      setData(filtered);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [groupId]);

  return { data, isLoading };
}
