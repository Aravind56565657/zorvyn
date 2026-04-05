import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';
import clsx from 'clsx';

export const formatINR = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export const SummaryCards: React.FC = () => {
  const transactions = useFinanceStore((state) => state.transactions);

  const { income, expense, balance, savingsRate } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });

    const bal = inc - exp;
    const sRate = inc > 0 ? Math.round(((inc - exp) / inc) * 100) : 0;

    return { income: inc, expense: exp, balance: bal, savingsRate: sRate };
  }, [transactions]);

  const cards = [
    { title: 'Total Balance', amount: balance, type: 'balance', icon: <Wallet size={18} className="text-accent" />, color: 'accent' },
    { title: 'Total Income', amount: income, type: 'income', icon: <ArrowUpRight size={18} className="text-green" />, color: 'green' },
    { title: 'Total Expenses', amount: expense, type: 'expense', icon: <ArrowDownRight size={18} className="text-red" />, color: 'red' },
    { title: 'Savings Rate', amount: savingsRate, type: 'savings', icon: <Activity size={18} className="text-cyan" />, color: 'cyan', suffix: '%' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="card flex flex-col justify-between h-32 hover:border-border2 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center bg-base dark:bg-[#0B0F19]"
            )}>
              {card.icon}
            </div>
            <p className="text-sm font-medium text-text2 dark:text-[#9CA3AF]">{card.title}</p>
          </div>
          <div className="mt-auto">
            <h3 className="font-bricolage text-3xl font-bold text-text1 dark:text-[#F3F4F6]">
              {card.type !== 'savings' ? formatINR(card.amount) : `${card.amount}${card.suffix}`}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};
