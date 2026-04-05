import React, { useState, useEffect } from 'react';
import { Lock, X, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Auto-focus logic can be handled naturally, reset on open
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in">
      <div className="bg-white dark:bg-[#131A2A] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-border1 dark:border-[#1F2937]">
        <div className="p-5 border-b border-border1 dark:border-[#1F2937] flex justify-between items-center bg-[#F7F8FC] dark:bg-[#0B0F19]">
          <h2 className="text-lg font-bricolage font-bold text-text1 dark:text-[#F3F4F6] flex items-center gap-2">
            <Lock size={18} className="text-[#16A34A]" /> Admin Authentication
          </h2>
          <button onClick={onClose} className="p-1 text-text3 hover:text-text1 dark:hover:text-[#F3F4F6] rounded-lg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-text2 dark:text-[#9CA3AF] mb-6">
            You are attempting to access a highly privileged layout. Please enter the master override key to unlock full CRUD capabilities.
            <br/><br/>
            <span className="text-xs font-mono bg-base dark:bg-[#0B0F19] p-1 rounded border border-border1 dark:border-[#1F2937]">Hint: admin123</span>
          </p>

          <div className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Enter Administrator Password..."
                value={password} 
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`input-field w-full font-mono text-center tracking-widest ${error ? 'border-red ring-1 ring-red outline-none' : ''}`}
                autoFocus
                required
              />
              {error && (
                <p className="text-red text-xs mt-2 flex items-center gap-1 font-medium select-none">
                  <AlertTriangle size={12} /> Invalid authentication credentials.
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              Verify & Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
