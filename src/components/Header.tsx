import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import clsx from 'clsx';
import { LayoutDashboard, ReceiptText, PieChart, LineChart, Moon, Sun, Lock, Plus, User, Hexagon, Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { TransactionModal } from './TransactionModal';

export const Header: React.FC = () => {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
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
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between max-w-[1400px]">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-text2 dark:text-[#9CA3AF] cursor-pointer" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className={clsx("hidden sm:flex w-8 h-8 rounded-[10px] shadow-sm transition-colors items-center justify-center", role === 'Admin' ? 'bg-[#16A34A]' : 'bg-[#5B6AF0]')}>
              <Hexagon size={18} className="text-white fill-white/20" />
            </div>
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
              "w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-[#1F2937] cursor-pointer transition-all",
              role === 'Admin' ? 'bg-[#16A34A] hover:ring-[#DCFCE7]' : 'bg-[#5B6AF0] hover:ring-[#EEF0FE]'
            )}>
              <User size={16} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          {/* Sidebar Drawer */}
          <div className="relative w-[80%] max-w-[300px] h-full bg-white dark:bg-[#131A2A] shadow-2xl flex flex-col border-r border-border1 dark:border-[#1F2937] animate-fade-in translate-x-0">
            <div className="p-5 border-b border-border1 dark:border-[#1F2937] flex items-center justify-between bg-[#F7F8FC] dark:bg-[#0B0F19]">
              <div className="flex items-center gap-2">
                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", role === 'Admin' ? 'bg-[#16A34A]' : 'bg-[#5B6AF0]')}>
                  <Hexagon size={16} className="text-white fill-white/20" />
                </div>
                <h2 className="font-bricolage font-bold text-lg text-text1 dark:text-[#F3F4F6]">Navigation</h2>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text3 hover:text-text1 dark:hover:text-[#F3F4F6] cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {[
                { id: 'overview', label: 'Financial Overview', icon: <LayoutDashboard size={18} /> },
                { id: 'insights', label: 'Analytics & Trends', icon: <LineChart size={18} /> },
                { id: 'reports', label: 'Categorical Stats', icon: <PieChart size={18} /> },
                { id: 'transactions', label: 'Transaction Ledger', icon: <ReceiptText size={18} /> },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={clsx(
                    "flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium transition-colors cursor-pointer text-left",
                    activeTab === item.id 
                      ? (role === 'Admin' ? "bg-[#DCFCE7] dark:bg-[#16A34A]/20 text-[#16A34A]" : "bg-[#EEF0FE] dark:bg-[#5B6AF0]/20 text-[#5B6AF0]")
                      : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937]"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              {role === 'Admin' && (
                <div className="mt-8 pt-6 border-t border-border1 dark:border-[#1F2937]">
                  <p className="text-xs font-bold text-[#16A34A] uppercase tracking-wider mb-3 px-2">Admin Actions</p>
                  <button 
                    onClick={() => { setIsAddModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#16A34A] text-white rounded-xl font-bold shadow-md cursor-pointer hover:bg-[#15803d] transition-colors"
                  >
                    <Plus size={18} /> Add New Record
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        editingTx={null} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={() => setRole('Admin')} 
      />
    </>
  );
};
