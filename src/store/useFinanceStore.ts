import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'Food' | 'Transport' | 'Shopping' | 'Utilities' | 'Healthcare' | 'Entertainment' | 'Salary' | 'Freelance';
export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: Category;
  type: TransactionType;
  amount: number;
};

type Role = 'Admin' | 'Viewer';

interface Filters {
  search: string;
  type: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

interface FinanceState {
  transactions: Transaction[];
  role: Role;
  hasSeenTour: boolean;
  theme: 'light' | 'dark';
  filters: Filters;
  setRole: (role: Role) => void;
  addTransaction: (data: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  setFilter: (key: keyof Filters, value: string) => void;
  clearFilters: () => void;
  toggleTheme: () => void;
  completeTour: () => void;
}

const generateMockData = (): Transaction[] => {
  const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment'];
  const res: Transaction[] = [];
  
  // Deterministic Pseudo-Random Number Generator so every browser sees identical data
  let seed = 12345;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  // Fixed seed logic so the dummy data looks structured
  for (let i = 0; i < 150; i++) {
    const start = new Date('2024-01-01').getTime();
    const end = new Date('2026-04-10').getTime();
    const d = new Date(start + random() * (end - start));
    const dateStr = d.toISOString().split('T')[0];
    
    const isIncome = random() > 0.85; // 85% expenses, 15% income
    const type: TransactionType = isIncome ? 'income' : 'expense';
    
    // realistic rounding
    const amount = isIncome 
      ? Math.floor((50000 + random() * 50000) / 100) * 100 
      : Math.floor((200 + random() * 9000) / 50) * 50;
      
    const category: Category = isIncome ? 'Salary' : categories[Math.floor(random() * categories.length)];
    
    res.push({
      id: `t_mock_${i}`,
      date: dateStr,
      description: `Mock ${category} Tx`,
      category,
      type,
      amount
    });
  }
  return res.sort((a, b) => a.date.localeCompare(b.date));
};

const mockTransactions: Transaction[] = generateMockData();

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'Viewer',
      hasSeenTour: false,
      theme: 'light',
      filters: {
        search: '',
        type: 'All',
        category: 'All',
        dateFrom: '',
        dateTo: '',
      },
      setRole: (role) => set({ role }),
      addTransaction: (data) => set((state) => ({
        transactions: [...state.transactions, { id: `t_user_${Date.now()}`, ...data }]
      })),
      updateTransaction: (id, data) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...data } : t)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      clearFilters: () => set({
        filters: { search: '', type: 'All', category: 'All', dateFrom: '', dateTo: '' }
      }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      completeTour: () => set({ hasSeenTour: true }),
    }),
    {
      name: 'finflow-storage-v4',
      partialize: (state) => {
        const { role, ...rest } = state;
        return rest;
      }
    }
  )
);
