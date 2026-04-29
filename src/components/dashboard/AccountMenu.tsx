import { useState } from 'react';
import {
  Crown,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { mockCreditBalance } from '../../data/mockData';

export function AccountMenu({ logout, onUpgrade }: { logout: () => void; onUpgrade: () => void }) {
  const [open, setOpen] = useState(false);

  const now = new Date();
  const refreshDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm text-white/80">passto@ps.com</span>
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-medium text-white">
          H
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-60 rounded-xl bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/0">
              <div className="text-sm text-white font-medium">passto@ps.com</div>
              <div className="text-[14px] text-white/40 mt-0.5 py-1">餘額: {mockCreditBalance} Credit</div>
              <div className="text-[14px] text-white/30 mt-0.5 py-1">刷新時間: {refreshDate}</div>
            </div>
            <button
              onClick={() => { onUpgrade(); setOpen(false); }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#9d82f5] text-white text-sm font-medium text-left hover:bg-[#8b6de8] transition-colors"
            >
              <Crown className="w-4 h-4" />
              升級套餐
            </button>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 h-14 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登錄
            </button>
          </div>
        </>
      )}
    </div>
  );
}
