import React, { useMemo, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatINR } from './SummaryCards';
import { parseISO, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#D97706',       // amber
  Transport: '#5B6AF0',  // accent
  Shopping: '#7C3AED',   // purple
  Utilities: '#0891B2',  // cyan
  Healthcare: '#DC2626', // red
  Entertainment: '#16A34A'// green
};
const FALLBACK_COLOR = '#6B7280'; // text2

export const SpendingPieChart: React.FC = () => {
  const { transactions, theme } = useFinanceStore();

  const currentY = new Date().getFullYear();
  const currentM = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const [filterMode, setFilterMode] = useState<'all' | 'month' | 'year'>('all');
  const [startMonth, setStartMonth] = useState(currentM);
  const [endMonth, setEndMonth] = useState(currentM);
  const [startYear, setStartYear] = useState(currentY);
  const [endYear, setEndYear] = useState(currentY);

  const data = useMemo(() => {
    let filtered = transactions.filter(t => t.type === 'expense');

    if (filterMode === 'month' && startMonth && endMonth) {
      const s = startOfMonth(parseISO(startMonth + '-01')).getTime();
      const e = endOfMonth(parseISO(endMonth + '-01')).getTime();
      filtered = filtered.filter(t => {
        const d = parseISO(t.date).getTime();
        return d >= s && d <= e;
      });
    } else if (filterMode === 'year' && startYear && endYear) {
      const s = startOfYear(parseISO(`${startYear}-01-01`)).getTime();
      const e = endOfYear(parseISO(`${endYear}-12-31`)).getTime();
      filtered = filtered.filter(t => {
        const d = parseISO(t.date).getTime();
        return d >= s && d <= e;
      });
    }

    const expensesByCategory: Record<string, number> = {};
    filtered.forEach(tx => {
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
    });

    return Object.keys(expensesByCategory)
      .map(category => ({
        name: category,
        value: expensesByCategory[category]
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [transactions, filterMode, startMonth, endMonth, startYear, endYear]);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="card h-auto sm:h-[400px] flex flex-col relative overflow-hidden">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h3 className="font-bricolage text-lg font-bold text-text1 dark:text-[#F3F4F6]">Expenses by Category</h3>
          <p className="text-xs text-text2 dark:text-[#9CA3AF]">Top spending areas</p>
        </div>
        <div className="flex flex-col gap-2 items-start sm:items-end z-20">
          <select 
            value={filterMode} 
            onChange={e => setFilterMode(e.target.value as any)}
            className="input-field text-xs py-1.5 px-2 w-auto bg-transparent border-border2 dark:border-[#374151] cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="month">Month Range</option>
            <option value="year">Year Range</option>
          </select>
          {filterMode === 'month' && (
            <div className="flex items-center gap-1">
              <input type="month" value={startMonth} onChange={e=>setStartMonth(e.target.value)} className="input-field text-xs py-1 px-1.5 w-[110px]" />
              <span className="text-text3 text-xs">-</span>
              <input type="month" value={endMonth} onChange={e=>setEndMonth(e.target.value)} className="input-field text-xs py-1 px-1.5 w-[110px]" />
            </div>
          )}
          {filterMode === 'year' && (
            <div className="flex items-center gap-1">
              <input type="number" min="2000" max="2100" value={startYear} onChange={e=>setStartYear(parseInt(e.target.value))} className="input-field text-xs py-1 px-1.5 w-[70px]" />
              <span className="text-text3 text-xs">-</span>
              <input type="number" min="2000" max="2100" value={endYear} onChange={e=>setEndYear(parseInt(e.target.value))} className="input-field text-xs py-1 px-1.5 w-[70px]" />
            </div>
          )}
        </div>
      </div>

      {data.length > 0 ? (
        <>
          <div className="h-[250px] sm:h-auto sm:flex-1 w-full min-h-0 relative -mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="pie3DShadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="2" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity={theme === 'dark' ? '0.6' : '0.25'} />
                    <feDropShadow dx="-2" dy="-2" stdDeviation="3" floodColor="#ffffff" floodOpacity={theme === 'dark' ? '0.05' : '0.8'} />
                  </filter>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  paddingAngle={6}
                  dataKey="value"
                  stroke="transparent"
                  filter="url(#pie3DShadow)"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || FALLBACK_COLOR} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatINR(value), 'Amount']}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#131A2A' : '#FFFFFF', border: `1px solid ${theme === 'dark' ? '#1F2937' : '#E8EAF0'}`, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  itemStyle={{ color: theme === 'dark' ? '#F3F4F6' : '#1A1D2E', fontFamily: 'JetBrains Mono', fontSize: '13px', fontWeight: 600 }}
                  labelStyle={{ fontFamily: 'Outfit', color: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xs text-text2 dark:text-[#9CA3AF]">Total</span>
              <span className="text-xl font-bricolage font-bold text-text1 dark:text-[#F3F4F6]">{formatINR(total)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 sm:mt-4 justify-center pb-2 sm:pb-0">
            {data.slice(0, 4).map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[d.name] || FALLBACK_COLOR }}></span>
                <span className="text-text2 dark:text-[#9CA3AF]">{d.name}</span>
                <span className="font-mono font-medium text-text1 dark:text-[#F3F4F6]">{formatINR(d.value)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-text3">
          No expenses recorded
        </div>
      )}
    </div>
  );
};
