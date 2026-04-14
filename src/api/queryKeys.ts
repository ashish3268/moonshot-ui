/* ------------------------------------------------------------------ */
/*  React Query key factory — centralised key definitions              */
/*  All query keys MUST be defined here. Never hardcode inline.        */
/* ------------------------------------------------------------------ */

export const userKeys = {
  me: ['user', 'me'] as const,
};

export const friendKeys = {
  all: ['friends'] as const,
  list: () => [...friendKeys.all, 'list'] as const,
  detail: (id: string) => [...friendKeys.all, 'detail', id] as const,
};

export const groupKeys = {
  all: ['groups'] as const,
  list: () => [...groupKeys.all, 'list'] as const,
  detail: (id: string) => [...groupKeys.all, 'detail', id] as const,
};

export const expenseKeys = {
  all: ['expenses'] as const,
  list: (filters?: Record<string, string>) =>
    [...expenseKeys.all, 'list', filters ?? {}] as const,
  detail: (id: string) => [...expenseKeys.all, 'detail', id] as const,
  byGroup: (groupId: string) => [...expenseKeys.all, 'byGroup', groupId] as const,
};

export const balanceKeys = {
  byFriend: (friendId: string) => ['balances', 'friend', friendId] as const,
  byGroup: (groupId: string) => ['balances', 'group', groupId] as const,
};

export const settlementKeys = {
  all: ['settlements'] as const,
  byFriend: (friendId: string) => [...settlementKeys.all, 'friend', friendId] as const,
};
