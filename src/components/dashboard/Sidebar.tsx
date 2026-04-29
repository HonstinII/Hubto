import { useState } from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Braces,
  FileText,
  User,
  Box,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Page } from '../../data/mockData';

export function Sidebar({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
  const mainItems: { key: Page; icon: React.ReactNode; label: string }[] = [
    { key: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: '數據看板' },
    { key: 'api', icon: <KeyRound className="w-4 h-4" />, label: 'API 管理' },
    { key: 'app', icon: <Braces className="w-4 h-4" />, label: '測試 API' },
    { key: 'logs', icon: <FileText className="w-4 h-4" />, label: '使用記錄' },
  ];

  const personalItems: { key: Page; icon: React.ReactNode; label: string }[] = [
    { key: 'account', icon: <User className="w-4 h-4" />, label: '帳戶概覽' },
    { key: 'models', icon: <Box className="w-4 h-4" />, label: '模型中心' },
  ];

  const renderNavItem = (item: { key: Page; icon: React.ReactNode; label: string }) => (
    <button
      key={item.key}
      onClick={() => onNavigate(item.key)}
      className={`w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-2.5 ${
        activePage === item.key
          ? 'bg-white/10 text-white font-medium'
          : 'text-white/50 hover:bg-white/5 hover:text-white/70'
      }`}
    >
      {item.icon}
      <span className="w-20 text-left">{item.label}</span>
    </button>
  );

  return (
    <aside className="fixed z-[100] flex flex-col" style={{ top: '20px', left: '24px', bottom: '48px', width: '285px' }}>
      <div className="flex-1 bg-[#1a1a1e] overflow-hidden flex flex-col" style={{ borderRadius: '30px' }}>
        {/* Header: vertically centered */}
        <div className="flex items-center justify-center" style={{ paddingTop: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer px-4">
            <img src="https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png" alt="HubTo" className="w-9 h-9 rounded-md" />
            <span
              className="text-[24px] font-semibold tracking-tight"
              style={{
                background: 'linear-gradient(120deg, #b5b5b5 0%, #ffffff 50%, #b5b5b5 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shinyText 2.3s linear 0s infinite',
              }}
            >
              HubTo
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto flex flex-col items-center" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '24px' }}>
          {mainItems.map(renderNavItem)}
          {personalItems.map(renderNavItem)}
        </nav>
      </div>
    </aside>
  );
}
