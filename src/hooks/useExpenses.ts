import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseKeys, friendKeys, groupKeys } from '@/api/queryKeys';
import { fetchExpenses, createExpense, deleteExpenseById } from '@/api/expenses';
import type { ExpenseCreatePayload } from '@/types/api';

export function useExpenses(groupId?: string) {
  return useQuery({
    queryKey: groupId ? expenseKeys.byGroup(groupId) : expenseKeys.list(),
    queryFn: () => fetchExpenses(groupId),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ExpenseCreatePayload) => createExpense(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      if (variables.groupId) {
        queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
      }
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpenseById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
    },
  });
}
