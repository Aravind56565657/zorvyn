import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import clsx from 'clsx';
import { LayoutDashboard, ReceiptText, PieChart, LineChart, Moon, Sun, Lock } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleNav = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoleToggle = () => {
    if (role === 'Viewer') {
      setIsAuthOpen(true);
    } else {
      setRole('Viewer'); // Instantly downgrade without password
    }
  };

  return (
    <>
      {role === 'Admin' && (
        <div className="w-full bg-[#16A34A] text-white text-[11px] font-bold py-1.5 text-center tracking-[0.2em] relative z-40 uppercase animate-fade-in shadow-sm">
          Administrator Privileges Active — Full System Access
        </div>
      )}
      <header className="bg-white dark:bg-[#131A2A] border-b border-border1 dark:border-[#1F2937] h-16 sticky top-0 z-30 transition-colors duration-200">
        <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-[1400px]">
          <div className="flex items-center gap-3">
            <div className={clsx("w-8 h-8 rounded-md shadow-sm transition-colors", role === 'Admin' ? 'bg-[#16A34A]' : 'bg-[#5B6AF0]')}></div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bricolage font-bold text-text1 dark:text-[#F3F4F6] leading-none text-lg">FinFlow</h1>
              <span className="text-[10px] text-text3 dark:text-[#9CA3AF] font-medium uppercase tracking-wider">
                {role === 'Admin' ? 'Admin Gateway' : 'Finance Dashboard'}
              </span>
            </div>
          </div>

          {/* Center */}
          <nav className="hidden md:flex items-center gap-2 p-1 bg-base dark:bg-[#0B0F19] border border-border1 dark:border-[#1F2937] rounded-full transition-colors duration-200">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={14} /> },
              { id: 'insights', label: 'Insights', icon: <LineChart size={14} /> },
              { id: 'reports', label: 'Reports', icon: <PieChart size={14} /> },
              { id: 'transactions', label: 'Transactions', icon: <ReceiptText size={14} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer",
                  activeTab === item.id 
                    ? (role === 'Admin' ? "bg-[#DCFCE7] dark:bg-[#16A34A]/20 text-[#16A34A]" : "bg-[#EEF0FE] dark:bg-[#5B6AF0]/20 text-[#5B6AF0]")
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1D2E] dark:hover:text-[#F3F4F6]"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-text2 dark:text-[#9CA3AF] hover:text-text1 dark:hover:text-amber-400 transition-colors cursor-pointer" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={handleRoleToggle}
              className={clsx(
                "pill cursor-pointer transition-colors border flex items-center gap-1.5 px-3 py-1.5",
                role === 'Admin' ? "bg-[#DCFCE7] dark:bg-[#16A34A]/20 text-[#16A34A] border-[#DCFCE7]/50 dark:border-[#16A34A]/30" : "bg-[#F7F8FC] dark:bg-[#0B0F19] text-[#6B7280] dark:text-[#9CA3AF] border-[#E8EAF0] dark:border-[#1F2937]"
              )}
            >
              {role === 'Admin' ? <span className="text-xs sm:text-sm font-medium">Admin Mode</span> : <><Lock size={12} /> <span className="text-xs sm:text-sm font-medium">Viewer Mode</span></>}
            </button>
            
            <div className={clsx(
              "w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white cursor-pointer transition-all",
              role === 'Admin' ? 'bg-[#16A34A] hover:ring-[#DCFCE7]' : 'bg-[#5B6AF0] hover:ring-[#EEF0FE]'
            )}>
              AK
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#131A2A]/90 backdrop-blur-lg border-t border-border1 dark:border-[#1F2937] flex justify-around items-center px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        {[
          { id: 'overview', label: 'Home', icon: <LayoutDashboard size={20} /> },
          { id: 'insights', label: 'Trends', icon: <LineChart size={20} /> },
          { id: 'reports', label: 'Stats', icon: <PieChart size={20} /> },
          { id: 'transactions', label: 'Ledger', icon: <ReceiptText size={20} /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all cursor-pointer",
              activeTab === item.id 
                ? (role === 'Admin' ? "text-[#16A34A] bg-[#DCFCE7] dark:bg-[#16A34A]/20" : "text-[#5B6AF0] bg-[#EEF0FE] dark:bg-[#5B6AF0]/20")
                : "text-[#9CA3AF] hover:text-[#6B7280] dark:hover:text-[#D1D5DB]"
            )}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={() => setRole('Admin')} 
      />
    </>
  );
};
