import type { User, Friend, Group, Expense, ActivityItem, DashboardSummary } from '@/types/api';

export const MOCK_CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatarUrl: undefined,
};

const ALICE: User = { id: 'u2', name: 'Alice Chen', email: 'alice@example.com' };
const BOB: User = { id: 'u3', name: 'Bob Smith', email: 'bob@example.com' };
const CAROL: User = { id: 'u4', name: 'Carol Wu', email: 'carol@example.com' };
const DAN: User = { id: 'u5', name: 'Dan Park', email: 'dan@example.com' };
const EVE: User = { id: 'u6', name: 'Eve Torres', email: 'eve@example.com' };

export const MOCK_FRIENDS: Friend[] = [
  { id: 'u2', user: ALICE, netBalance: -23.5, status: 'active' },
  { id: 'u3', user: BOB, netBalance: 14.0, status: 'active' },
  { id: 'u4', user: CAROL, netBalance: 55.0, status: 'active' },
  { id: 'u5', user: DAN, netBalance: 0, status: 'active' },
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Yosemite Trip',
    emoji: '🏕',
    members: [MOCK_CURRENT_USER, ALICE, BOB, CAROL],
    netBalance: 56.0,
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'g2',
    name: 'Apartment',
    emoji: '🏠',
    members: [MOCK_CURRENT_USER, ALICE, DAN],
    netBalance: -23.0,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'g3',
    name: 'Vegas',
    emoji: '🎉',
    members: [MOCK_CURRENT_USER, ALICE, BOB, CAROL, DAN, EVE],
    netBalance: 80.0,
    createdAt: '2026-02-10T00:00:00Z',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'e1',
    description: 'Campsite booking',
    amount: 120.0,
    date: '2026-03-15',
    category: 'accommodation',
    paidBy: MOCK_CURRENT_USER,
    splits: [
      { userId: 'u1', amount: 30.0, settled: true },
      { userId: 'u2', amount: 30.0, settled: false },
      { userId: 'u3', amount: 30.0, settled: false },
      { userId: 'u4', amount: 30.0, settled: false },
    ],
    groupId: 'g1',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'e2',
    description: 'Groceries for the trip',
    amount: 84.0,
    date: '2026-03-16',
    category: 'food',
    paidBy: ALICE,
    splits: [
      { userId: 'u1', amount: 21.0, settled: false },
      { userId: 'u2', amount: 21.0, settled: true },
      { userId: 'u3', amount: 21.0, settled: false },
      { userId: 'u4', amount: 21.0, settled: false },
    ],
    groupId: 'g1',
    createdAt: '2026-03-16T08:30:00Z',
    updatedAt: '2026-03-16T08:30:00Z',
  },
  {
    id: 'e3',
    description: 'Gas to Yosemite',
    amount: 60.0,
    date: '2026-03-15',
    category: 'transport',
    paidBy: BOB,
    splits: [
      { userId: 'u1', amount: 15.0, settled: false },
      { userId: 'u2', amount: 15.0, settled: false },
      { userId: 'u3', amount: 15.0, settled: true },
      { userId: 'u4', amount: 15.0, settled: false },
    ],
    groupId: 'g1',
    createdAt: '2026-03-15T07:00:00Z',
    updatedAt: '2026-03-15T07:00:00Z',
  },
  {
    id: 'e4',
    description: 'March rent',
    amount: 3000.0,
    date: '2026-03-01',
    category: 'utilities',
    paidBy: MOCK_CURRENT_USER,
    splits: [
      { userId: 'u1', amount: 1000.0, settled: true },
      { userId: 'u2', amount: 1000.0, settled: false },
      { userId: 'u5', amount: 1000.0, settled: true },
    ],
    groupId: 'g2',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'e5',
    description: 'Internet bill',
    amount: 60.0,
    date: '2026-03-05',
    category: 'utilities',
    paidBy: ALICE,
    splits: [
      { userId: 'u1', amount: 20.0, settled: false },
      { userId: 'u2', amount: 20.0, settled: true },
      { userId: 'u5', amount: 20.0, settled: false },
    ],
    groupId: 'g2',
    createdAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
  },
  {
    id: 'e6',
    description: 'Vegas hotel',
    amount: 600.0,
    date: '2026-03-20',
    category: 'accommodation',
    paidBy: CAROL,
    splits: [
      { userId: 'u1', amount: 100.0, settled: false },
      { userId: 'u2', amount: 100.0, settled: false },
      { userId: 'u3', amount: 100.0, settled: false },
      { userId: 'u4', amount: 100.0, settled: true },
      { userId: 'u5', amount: 100.0, settled: false },
      { userId: 'u6', amount: 100.0, settled: false },
    ],
    groupId: 'g3',
    createdAt: '2026-03-20T15:00:00Z',
    updatedAt: '2026-03-20T15:00:00Z',
  },
  {
    id: 'e7',
    description: 'Club tickets',
    amount: 300.0,
    date: '2026-03-21',
    category: 'entertainment',
    paidBy: MOCK_CURRENT_USER,
    splits: [
      { userId: 'u1', amount: 50.0, settled: true },
      { userId: 'u2', amount: 50.0, settled: false },
      { userId: 'u3', amount: 50.0, settled: false },
      { userId: 'u4', amount: 50.0, settled: false },
      { userId: 'u5', amount: 50.0, settled: false },
      { userId: 'u6', amount: 50.0, settled: false },
    ],
    groupId: 'g3',
    createdAt: '2026-03-21T22:00:00Z',
    updatedAt: '2026-03-21T22:00:00Z',
  },
  {
    id: 'e8',
    description: 'Dinner at Nobu',
    amount: 240.0,
    date: '2026-03-22',
    category: 'food',
    paidBy: BOB,
    splits: [
      { userId: 'u1', amount: 40.0, settled: false },
      { userId: 'u2', amount: 40.0, settled: false },
      { userId: 'u3', amount: 40.0, settled: true },
      { userId: 'u4', amount: 40.0, settled: false },
      { userId: 'u5', amount: 40.0, settled: false },
      { userId: 'u6', amount: 40.0, settled: false },
    ],
    groupId: 'g3',
    createdAt: '2026-03-22T20:00:00Z',
    updatedAt: '2026-03-22T20:00:00Z',
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    type: 'expense_added',
    description: 'Bob added "Dinner at Nobu"',
    amount: 240.0,
    groupName: 'Vegas',
    createdAt: '2026-03-22T20:00:00Z',
  },
  {
    id: 'a2',
    type: 'expense_added',
    description: 'Alex added "Club tickets"',
    amount: 300.0,
    groupName: 'Vegas',
    createdAt: '2026-03-21T22:00:00Z',
  },
  {
    id: 'a3',
    type: 'settlement',
    description: 'Dan settled up with Alex',
    amount: 50.0,
    groupName: 'Vegas',
    createdAt: '2026-03-21T10:00:00Z',
  },
  {
    id: 'a4',
    type: 'expense_added',
    description: 'Carol added "Vegas hotel"',
    amount: 600.0,
    groupName: 'Vegas',
    createdAt: '2026-03-20T15:00:00Z',
  },
  {
    id: 'a5',
    type: 'expense_edited',
    description: 'Alice edited "Groceries for the trip"',
    amount: 84.0,
    groupName: 'Yosemite Trip',
    createdAt: '2026-03-16T09:00:00Z',
  },
  {
    id: 'a6',
    type: 'expense_added',
    description: 'Alex added "Campsite booking"',
    amount: 120.0,
    groupName: 'Yosemite Trip',
    createdAt: '2026-03-15T10:00:00Z',
  },
];

export const MOCK_DASHBOARD: DashboardSummary = {
  totalOwed: 149.0,
  totalOwe: 23.5,
  recentActivity: MOCK_ACTIVITY.slice(0, 5),
};
