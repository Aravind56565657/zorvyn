import React, { useState } from 'react';
import { useFinanceStore, Category, TransactionType } from '../store/useFinanceStore';
import { X, Plus } from 'lucide-react';
import clsx from 'clsx';

export const AddTransactionModal: React.FC = () => {
  const { role, addTransaction } = useFinanceStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food' as Category,
    type: 'expense' as TransactionType,
    description: ''
  });

  if (role !== 'Admin') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.description) return;

    addTransaction({
      date: new Date(formData.date).toISOString(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description
    });
    
    setIsOpen(false);
    setFormData(prev => ({ ...prev, description: '', amount: '' }));
  };

  const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Salary', 'Freelance'];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#5B6AF0] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-40 group cursor-pointer"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text1/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131A2A] rounded-2xl shadow-xl border border-border1 dark:border-[#1F2937] w-full max-w-md overflow-hidden transition-colors duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-border1 dark:border-[#1F2937]">
              <h2 className="font-bricolage text-xl font-bold text-text1 dark:text-[#F3F4F6]">New Transaction</h2>
              <button onClick={() => setIsOpen(false)} className="text-text3 dark:text-[#9CA3AF] hover:text-text1 dark:hover:text-[#F3F4F6] transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, type: 'expense' }))}
                  className={clsx("py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer", formData.type === 'expense' ? "bg-red-l dark:bg-red/20 text-red border-red-l/50 dark:border-red/30" : "bg-base dark:bg-[#0B0F19] text-text2 dark:text-[#9CA3AF] border-border1 dark:border-[#1F2937] hover:bg-white dark:hover:bg-[#1F2937]")}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, type: 'income' }))}
                  className={clsx("py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer", formData.type === 'income' ? "bg-green-l dark:bg-green/20 text-green border-green-l/50 dark:border-green/30" : "bg-base dark:bg-[#0B0F19] text-text2 dark:text-[#9CA3AF] border-border1 dark:border-[#1F2937] hover:bg-white dark:hover:bg-[#1F2937]")}
                >
                  Income
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text2 dark:text-[#9CA3AF]">Date</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))} className="input-field w-full" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text2 dark:text-[#9CA3AF]">Amount (₹)</label>
                <input type="number" step="0.01" min="0" required placeholder="0.00" value={formData.amount} onChange={(e) => setFormData(f => ({ ...f, amount: e.target.value }))} className="input-field w-full font-mono text-base" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text2 dark:text-[#9CA3AF]">Category</label>
                <select value={formData.category} onChange={(e) => setFormData(f => ({ ...f, category: e.target.value as Category }))} className="input-field w-full cursor-pointer">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text2 dark:text-[#9CA3AF]">Description</label>
                <input type="text" required placeholder="e.g. Swiggy Order" value={formData.description} onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))} className="input-field w-full" />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="btn-ghost cursor-pointer">Cancel</button>
                <button type="submit" className="btn-primary cursor-pointer">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
