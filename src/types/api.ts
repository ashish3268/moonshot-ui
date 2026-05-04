/* ------------------------------------------------------------------ */
/*  Core domain types — single source of truth                         */
/* ------------------------------------------------------------------ */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Friend {
  id: string;
  user: User;
  netBalance: number;
  status: 'active' | 'pending';
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  members: User[];
  netBalance: number;
  createdAt: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'utilities'
  | 'other';

export interface Split {
  userId: string;
  amount: number;
  settled: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidBy: User;
  splits: Split[];
  groupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Balance {
  userId: string;
  owes: number;
  isOwed: number;
  net: number;
}

export interface Settlement {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SplitParticipant {
  userId: string;
  name: string;
  amount: number;
}

export interface ActivityItem {
  id: string;
  type: 'expense_added' | 'expense_edited' | 'settlement';
  description: string;
  amount?: number;
  groupName?: string;
  groupId?: string;
  createdAt: string;
  settlementId?: string;
  expenseId?: string;
  paidByName?: string;
  paidById?: string;
  splits?: SplitParticipant[];
}

export interface DashboardSummary {
  totalOwed: number;
  totalOwe: number;
  recentActivity: ActivityItem[];
}

export interface GroupMember {
  user: User;
  joinedAt: string;
  netBalance: number;
}

export interface BalanceBreakdown {
  totalPaid: number;
  totalOwedToMe: number;
  totalIOwe: number;
  net: number;
}

export interface GroupDetail {
  id: string;
  name: string;
  emoji: string;
  members: GroupMember[];
  expenses: GroupExpense[];
  currentUserBalance: BalanceBreakdown;
  createdAt: string;
}

export interface GroupExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidBy: User;
  splits: Split[];
  createdAt: string;
}

export interface SharedExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidBy: User;
  mySplitAmount: number;
  mySplitSettled: boolean;
  groupId?: string;
  createdAt: string;
}

export interface FriendBalance {
  userId: string;
  isOwed: number;
  owes: number;
  net: number;
}

export interface ExpenseCreatePayload {
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidById: string;
  groupId?: string;
  splitMode: 'equal' | 'exact' | 'percent' | 'shares';
  participants: { userId: string; value?: number }[];
}
