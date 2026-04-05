import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO, subMonths } from 'date-fns';
import { formatINR } from './SummaryCards';

export const BalanceTrendChart: React.FC = () => {
  const { transactions, theme } = useFinanceStore();

  const data = useMemo(() => {
    const now = new Date();
    const monthsData: Record<string, { income: number; expense: number; label: string }> = {};
    
    // Create strict canonical keys 'yyyy-MM' to prevent previous years merging
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const strictKey = format(d, 'yyyy-MM');
      monthsData[strictKey] = { income: 0, expense: 0, label: format(d, 'MMM') };
    }
    
    transactions.forEach(tx => {
      const strictKey = format(parseISO(tx.date), 'yyyy-MM');
      if (monthsData[strictKey]) {
        if (tx.type === 'income') monthsData[strictKey].income += tx.amount;
        else monthsData[strictKey].expense += tx.amount;
      }
    });

    return Object.keys(monthsData).sort().map(k => ({
      name: monthsData[k].label,
      Income: monthsData[k].income,
      Expense: monthsData[k].expense
    }));
  }, [transactions]);

  return (
    <div id="tour-trends" className="card h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bricolage text-lg font-bold text-text1 dark:text-[#F3F4F6]">Balance Trend</h3>
          <p className="text-xs text-text2 dark:text-[#9CA3AF]">Income vs Expense (6 months)</p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green"></span>
            <span className="text-text2 dark:text-[#9CA3AF]">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red"></span>
            <span className="text-text2 dark:text-[#9CA3AF]">Expense</span>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.02} />
              </linearGradient>
              {/* 3D Volumetric Neumorphic Shadow */}
              <filter id="neonExtrusion" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={theme === 'dark' ? '#16A34A' : '#16A34A'} floodOpacity="0.4" />
                <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor={theme === 'dark' ? '#16A34A' : '#16A34A'} floodOpacity="0.2" />
              </filter>
              <filter id="neonExtrusionRed" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={theme === 'dark' ? '#DC2626' : '#DC2626'} floodOpacity="0.4" />
                <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor={theme === 'dark' ? '#DC2626' : '#DC2626'} floodOpacity="0.2" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={theme === 'dark' ? '#1F2937' : '#E8EAF0'} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontFamily: 'Outfit' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `₹${val / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: theme === 'dark' ? '#131A2A' : '#FFFFFF', border: `1px solid ${theme === 'dark' ? '#1F2937' : '#E8EAF0'}`, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 500, fontFamily: 'Outfit', color: theme === 'dark' ? '#F3F4F6' : undefined }}
              labelStyle={{ fontSize: '12px', color: theme === 'dark' ? '#9CA3AF' : '#6B7280', marginBottom: '8px', fontFamily: 'Outfit' }}
              formatter={(value: number) => [formatINR(value), undefined]}
            />
            <Area 
              type="monotone" 
              dataKey="Income" 
              stroke="#16A34A" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorInc)" 
              filter="url(#neonExtrusion)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#16A34A', filter: 'url(#neonExtrusion)' }} 
            />
            <Area 
              type="monotone" 
              dataKey="Expense" 
              stroke="#DC2626" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorExp)" 
              filter="url(#neonExtrusionRed)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#DC2626', filter: 'url(#neonExtrusionRed)' }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
