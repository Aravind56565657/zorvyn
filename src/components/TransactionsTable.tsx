import React, { useState, useMemo } from 'react';
import { useFinanceStore, Transaction } from '../store/useFinanceStore';
import { Search, Download, Filter, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Trash2, Plus, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatINR } from './SummaryCards';
import clsx from 'clsx';
import { TransactionModal } from './TransactionModal';

type SortConfig = { key: keyof Transaction | null; direction: 'asc' | 'desc' };

export const TransactionsTable: React.FC = () => {
  const { transactions, filters, setFilter, clearFilters, role, deleteTransaction } = useFinanceStore();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const itemsPerPage = 10;

  const displayedData = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.type !== 'All') result = result.filter(t => t.type === filters.type);
    if (filters.category !== 'All') result = result.filter(t => t.category === filters.category);

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key!];
        let bVal: any = b[sortConfig.key!];
        if (sortConfig.key === 'date') {
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [transactions, filters, sortConfig]);

  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const paginatedData = displayedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...displayedData.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = ['All', 'Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Salary', 'Freelance'];

  return (
    <div className="card p-0 flex flex-col mb-12 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border1 dark:border-[#1F2937] bg-white dark:bg-[#131A2A]">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-bricolage text-xl font-bold text-text1 dark:text-[#F3F4F6]">Recent Transactions</h3>
            <span className="pill bg-base dark:bg-[#0B0F19] text-text2 dark:text-[#9CA3AF] border border-border1 dark:border-[#1F2937] ml-2">{displayedData.length} records</span>
          </div>

          <div className="flex items-center gap-3">
            {role === 'Admin' && (
              <button
                onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
                className="btn flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Add Record</span>
              </button>
            )}
            <button onClick={clearFilters} className="btn-ghost flex items-center justify-center gap-2 cursor-pointer">
              <Filter size={14} /> <span className="hidden sm:inline">Clear</span>
            </button>
            <button onClick={handleExport} className="btn-ghost flex items-center justify-center gap-2 cursor-pointer">
              <Download size={14} /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-text3" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="input-field w-full pl-9"
            />
          </div>
          <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)} className="input-field cursor-pointer">
            <option value="All">Filter by Type...</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className="input-field cursor-pointer">
            <option value="All">Filter by Category...</option>
            {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#131A2A]">
        <table className="w-full text-left">
          <thead className="bg-[#F7F8FC] dark:bg-[#0B0F19] border-b border-[#E8EAF0] dark:border-[#1F2937]">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-text2 dark:text-[#9CA3AF] uppercase tracking-wide cursor-pointer hover:text-text1 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('date')}>Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-text2 dark:text-[#9CA3AF] uppercase tracking-wide">Description</th>
              <th className="px-6 py-3 text-xs font-semibold text-text2 dark:text-[#9CA3AF] uppercase tracking-wide hidden sm:table-cell">Category</th>
              <th className="px-6 py-3 text-xs font-semibold text-text2 dark:text-[#9CA3AF] uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-text2 dark:text-[#9CA3AF] uppercase tracking-wide text-right cursor-pointer hover:text-text1 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('amount')}>Amount</th>
              {role === 'Admin' && <th className="px-6 py-3 text-xs font-semibold text-text2 dark:text-[#9CA3AF] uppercase tracking-wide text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border1 dark:divide-[#1F2937]">
            {paginatedData.length > 0 ? (
              paginatedData.map((tx) => (
                <tr key={tx.id} className="hover:bg-base/50 dark:hover:bg-[#1F2937]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-text2 dark:text-[#9CA3AF] whitespace-nowrap">{format(parseISO(tx.date), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-text1 dark:text-[#F3F4F6]">{tx.description}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-text2 dark:text-[#9CA3AF]">{tx.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx("pill inline-flex items-center gap-1", tx.type === 'income' ? 'bg-green-l dark:bg-green/20 text-green' : 'bg-base dark:bg-[#0B0F19] text-text2 dark:text-[#9CA3AF]')}>
                      {tx.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className={clsx("px-6 py-4 text-right font-mono font-medium", tx.type === 'income' ? 'text-green' : 'text-text1 dark:text-[#F3F4F6]')}>
                    {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                  </td>
                  {role === 'Admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => { setEditingTx(tx); setIsModalOpen(true); }}
                          className="text-text3 hover:text-[#5B6AF0] transition-colors cursor-pointer"
                          title="Edit Transaction"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-text3 hover:text-red transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-text3 dark:text-[#6B7280]">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border1 dark:border-[#1F2937] bg-white dark:bg-[#131A2A] flex items-center justify-between">
          <span className="text-sm text-text2 dark:text-[#9CA3AF]">
            Showing <span className="font-medium text-text1 dark:text-[#F3F4F6]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-text1 dark:text-[#F3F4F6]">{Math.min(currentPage * itemsPerPage, displayedData.length)}</span> of <span className="font-medium text-text1 dark:text-[#F3F4F6]">{displayedData.length}</span>
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-ghost px-2 py-1 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-ghost px-2 py-1 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTx(null); }}
        editingTx={editingTx}
      />
    </div>
  );
};
