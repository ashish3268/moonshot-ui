import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { friendKeys, userKeys } from '@/api/queryKeys';
import { fetchFriends, fetchFriendBalance, fetchSharedExpenses, inviteFriend } from '@/api/friends';
import { fetchNonFriendUsers } from '@/api/users';

export function useFriends() {
  return useQuery({
    queryKey: friendKeys.list(),
    queryFn: fetchFriends,
  });
}

export function useFriendBalance(friendId: string) {
  return useQuery({
    queryKey: friendKeys.detail(friendId),
    queryFn: () => fetchFriendBalance(friendId),
  });
}

export function useSharedExpenses(friendId: string) {
  return useQuery({
    queryKey: [...friendKeys.detail(friendId), 'expenses'],
    queryFn: () => fetchSharedExpenses(friendId),
  });
}

export function useNonFriendUsers() {
  return useQuery({
    queryKey: [...userKeys.me, 'non-friends'],
    queryFn: fetchNonFriendUsers,
  });
}

export function useInviteFriend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, name }: { email: string; name?: string }) => inviteFriend(email, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      queryClient.invalidateQueries({ queryKey: [...userKeys.me, 'non-friends'] });
    },
  });
}
