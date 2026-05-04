import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { friendKeys, groupKeys, userKeys } from '@/api/queryKeys';
import { fetchActivity } from '@/api/activity';
import {
  updateSettlement,
  deleteSettlementById,
  type SettlementUpdatePayload,
} from '@/api/settlements';
import { updateExpenseBasic, deleteExpenseById } from '@/api/expenses';

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [...userKeys.me, 'activity'] });
  queryClient.invalidateQueries({ queryKey: [...userKeys.me, 'dashboard'] });
  queryClient.invalidateQueries({ queryKey: friendKeys.all });
  queryClient.invalidateQueries({ queryKey: groupKeys.all });
}

export function useActivity() {
  return useQuery({
    queryKey: [...userKeys.me, 'activity'],
    queryFn: () => fetchActivity(),
  });
}

export function useUpdateSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: SettlementUpdatePayload & { id: string }) =>
      updateSettlement(id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useDeleteSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSettlementById(id),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      description?: string;
      amount?: number;
      date?: string;
      category?: string;
      paidById?: string;
      splitMode?: string;
      participants?: { userId: string; amount: number }[];
    }) => updateExpenseBasic(id, body),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpenseById(id),
    onSuccess: () => invalidateAll(queryClient),
  });
}
