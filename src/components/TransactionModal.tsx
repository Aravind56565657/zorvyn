import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType, useFinanceStore } from '../store/useFinanceStore';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // If editing an existing transaction, pass it here. If null, we are creating a new one.
  editingTx: Transaction | null; 
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, editingTx }) => {
  const { addTransaction, updateTransaction } = useFinanceStore();

  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');

  const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Salary', 'Freelance'];

  useEffect(() => {
    if (isOpen) {
      if (editingTx) {
        setDate(editingTx.date);
        setDescription(editingTx.description);
        setAmount(editingTx.amount.toString());
        setType(editingTx.type);
        setCategory(editingTx.category);
      } else {
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setAmount('');
        setType('expense');
        setCategory('Food');
      }
    }
  }, [isOpen, editingTx]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || !date) return;

    const payload = {
      date,
      description,
      amount: parsedAmount,
      type,
      category
    };

    if (editingTx) {
      updateTransaction(editingTx.id, payload);
    } else {
      addTransaction(payload);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-[#131A2A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-border1 dark:border-[#1F2937]">
        <div className="p-5 border-b border-border1 dark:border-[#1F2937] flex justify-between items-center">
          <h2 className="text-xl font-bricolage font-bold text-text1 dark:text-[#F3F4F6]">
            {editingTx ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-text3 hover:text-text1 dark:hover:text-[#F3F4F6] rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text2 dark:text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="input-field w-full cursor-pointer"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-text2 dark:text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)}
                className="input-field w-full cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text2 dark:text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text2 dark:text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Description</label>
            <input 
              type="text" 
              placeholder="e.g. Grocery Run"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text2 dark:text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Amount (₹)</label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="input-field w-full font-mono"
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-base dark:bg-[#0B0F19] hover:bg-[#E8EAF0] dark:hover:bg-[#1F2937] text-text1 dark:text-[#F3F4F6] rounded-xl font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 px-4 bg-[#5B6AF0] hover:bg-[#4a58dd] text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
            >
              {editingTx ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
