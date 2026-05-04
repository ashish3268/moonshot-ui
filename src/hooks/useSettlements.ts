import { useMutation, useQueryClient } from '@tanstack/react-query';
import { friendKeys, groupKeys, userKeys } from '@/api/queryKeys';
import { createSettlement } from '@/api/settlements';
import type { SettlementCreatePayload } from '@/api/settlements';

export function useCreateSettlement(friendId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SettlementCreatePayload) => createSettlement(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      queryClient.invalidateQueries({ queryKey: [...friendKeys.detail(friendId), 'expenses'] });
      queryClient.invalidateQueries({ queryKey: [...userKeys.me, 'activity'] });
      queryClient.invalidateQueries({ queryKey: [...userKeys.me, 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}
