import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Award, Target, Flame, Hash } from 'lucide-react';
import { parseISO, format, isSameMonth } from 'date-fns';
import { formatINR } from './SummaryCards';

export const InsightsSection: React.FC = () => {
  const transactions = useFinanceStore((state) => state.transactions);

  const insights = useMemo(() => {
    const now = new Date();
    let topCategory = { name: '-', amount: 0 };
    let biggestTx = { name: '-', amount: 0 };
    let txCount = 0;
    
    // Calculate top category
    const catTotals: Record<string, number> = {};

    transactions.forEach(tx => {
      const date = parseISO(tx.date);
      txCount++;
      if (tx.type === 'expense') {
        catTotals[tx.category] = (catTotals[tx.category] || 0) + tx.amount;
        if (catTotals[tx.category] > topCategory.amount) {
          topCategory = { name: tx.category, amount: catTotals[tx.category] };
        }

        if (isSameMonth(date, now) && tx.amount > biggestTx.amount) {
          biggestTx = { name: tx.description, amount: tx.amount };
        }
      }
    });

    const monthsData: Record<string, { in: number, out: number }> = {};
    transactions.forEach(tx => {
      const k = format(parseISO(tx.date), 'yyyy-MM');
      if (!monthsData[k]) monthsData[k] = { in: 0, out: 0 };
      if (tx.type === 'income') monthsData[k].in += tx.amount;
      else monthsData[k].out += tx.amount;
    });

    const sortedMonths = Object.keys(monthsData).sort().reverse();
    let streak = 0;
    for (const m of sortedMonths) {
      if (monthsData[m].in > monthsData[m].out) streak++;
      else break;
    }

    return { topCategory, biggestTx, streak, txCount };
  }, [transactions]);

  const cards = [
    { title: 'Top Category', value: insights.topCategory.name, sub: formatINR(insights.topCategory.amount), icon: <Target size={18} className="text-amber" />, bg: 'bg-amber-l' },
    { title: 'Largest Single Expense', value: formatINR(insights.biggestTx.amount), sub: insights.biggestTx.name, icon: <Award size={18} className="text-accent" />, bg: 'bg-accent-l' },
    { title: 'Savings Streak', value: `${insights.streak} Months`, sub: 'Positive cashflow streak', icon: <Flame size={18} className="text-green" />, bg: 'bg-green-l' },
    { title: 'Total Transactions', value: insights.txCount.toString(), sub: 'Recorded entries', icon: <Hash size={18} className="text-purple" />, bg: 'bg-purple-l' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="card flex items-center gap-4 hover:border-border2 transition-colors">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} dark:bg-opacity-20`}>
            {card.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-text2 dark:text-[#9CA3AF] font-medium mb-0.5">{card.title}</p>
            <h4 className="text-lg font-bricolage font-bold text-text1 dark:text-[#F3F4F6] truncate">{card.value}</h4>
            <p className="text-xs text-text3 dark:text-[#6B7280] truncate">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
