import { create } from 'zustand';

interface UiState {
  addExpenseModalOpen: boolean;
  setAddExpenseModalOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  addExpenseModalOpen: false,
  setAddExpenseModalOpen: (open) => set({ addExpenseModalOpen: open }),
}));
