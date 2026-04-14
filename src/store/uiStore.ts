import { create } from 'zustand';

interface UiState {
  addExpenseModalOpen: boolean;
  setAddExpenseModalOpen: (open: boolean) => void;
  chatDrawerOpen: boolean;
  setChatDrawerOpen: (open: boolean) => void;
  toggleChatDrawer: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  addExpenseModalOpen: false,
  setAddExpenseModalOpen: (open) => set({ addExpenseModalOpen: open }),
  chatDrawerOpen: false,
  setChatDrawerOpen: (open) => set({ chatDrawerOpen: open }),
  toggleChatDrawer: () => set((state) => ({ chatDrawerOpen: !state.chatDrawerOpen })),
}));
