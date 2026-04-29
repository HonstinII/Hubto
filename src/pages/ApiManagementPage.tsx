import { useState } from 'react';
import { LayoutDashboard, KeyRound, Braces, FileText, CreditCard, User, LogOut, ChevronDown, Search, Crown, Eye, Trash2, Key, Copy, Plus, MoreVertical, Send, Filter } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Link } from '@tanstack/react-router';

const mockCreditBalance = 5000;

function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 border-r border-white/10 bg-[#0a0a0c] min-h-[calc(100vh-56px)] mt-10">
      <div className="px-3 py-3">
        <Link to="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-white/50 hover:text-white/80 hover:bg-white/5">
          <LayoutDashboard className="w-4 h-4" />
          數據看板
        </Link>
        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-[#9d82f5]/15 text-[#9d82f5] font-medium">
          <KeyRound className="w-4 h-4" />
          API 管理
        </div>
        <Link to="/test-api" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-white/50 hover:text-white/80 hover:bg-white/5">
          <Braces className="w-4 h-4" />
          測試 API
        </Link>
        <Link to="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-white/50 hover:text-white/80 hover:bg-white/5">
          <FileText className="w-4 h-4" />
          使用記錄
        </Link>

        <div className="px-3 pt-6 pb-2 text-xs text-white/30 uppercase tracking-wider">個人中心</div>

        <button
          onClick={() => { window.location.href = '/Hubto/pricing'; }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-white/50 hover:text-white/80 hover:bg-white/5"
        >
          <CreditCard className="w-4 h-4" />
          套餐充值
        </button>
        <Link to="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-white/50 hover:text-white/80 hover:bg-white/5">
          <User className="w-4 h-4" />
          帳戶概覽
        </Link>
      </div>
    </aside>
  );
}

function AccountMenu({ logout, onUpgrade }: { logout: () => void; onUpgrade: () => void }) {
  const [open, setOpen] = useState(false);

  const now = new Date();
  const refreshDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm text-white/80">honstinhui@gmail.com</span>
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-medium text-white">
          H
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-60 rounded-xl bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-sm text-white font-medium">honstinhui@gmail.com</div>
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

const mockApiKeys = [
  { id: '1', name: '1776913908', status: '已啟用', used: '$0.00', remaining: '不限額', key: 'sk-2FZg***********kS6H', models: '無限制', created: '2026-04-23 11:11:47', expires: '永不過期' },
  { id: '2', name: 'honstin 測試', status: '已啟用', used: '$0.01', remaining: '不限額', key: 'sk-yR1n***********weoq', models: '無限制', created: '2026-04-23 10:44:49', expires: '永不過期' },
  { id: '3', name: '1776911904', status: '已啟用', used: '$0.00', remaining: '不限額', key: 'sk-etVA***********si4L', models: '無限制', created: '2026-04-23 10:38:23', expires: '永不過期' },
  { id: '4', name: '123', status: '已啟用', used: '$0.00', remaining: '不限額', key: 'sk-MjwP***********Y5K1', models: '無限制', created: '2026-04-23 10:36:54', expires: '永不過期' },
  { id: '5', name: '1122', status: '已啟用', used: '$0.09', remaining: '不限額', key: 'sk-R18W***********oRxf', models: '無限制', created: '2026-04-22 10:07:15', expires: '永不過期' },
  { id: '6', name: 'qwe', status: '已啟用', used: '$0.01', remaining: '不限額', key: 'sk-TLee***********8Hrv', models: 'minimax-m2.7 +2', created: '2026-04-16 17:46:05', expires: '永不過期' },
  { id: '7', name: '12312321', status: '已啟用', used: '$20.56', remaining: '不限額', key: 'sk-90mL***********vW6', models: '無限制', created: '2026-04-15 10:45:34', expires: '永不過期' },
];

function ApiManagementPage() {
  const [filter, setFilter] = useState<string>('all');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const filterOptions = [
    { key: 'all', label: '全部', count: mockApiKeys.length, color: 'bg-white/10' },
    { key: 'enabled', label: '已啟用', count: mockApiKeys.filter(k => k.status === '已啟用').length, color: 'bg-emerald-500/20 text-emerald-400' },
    { key: 'disabled', label: '已禁用', count: 0, color: 'bg-white/10' },
    { key: 'expired', label: '已過期', count: 0, color: 'bg-amber-500/20 text-amber-400' },
    { key: 'exhausted', label: '額度耗盡', count: 0, color: 'bg-red-500/20 text-red-400' },
  ];

  const currentFilter = filterOptions.find(f => f.key === filter) || filterOptions[0];

  const filteredKeys = mockApiKeys.filter(k => {
    if (filter !== 'all') {
      if (filter === 'enabled' && k.status !== '已啟用') return false;
      if (filter === 'disabled' && k.status === '已啟用') return false;
      if (filter === 'expired' && k.expires !== '永不過期') return false;
      if (filter === 'exhausted' && k.remaining !== '不限額') return false;
    }
    if (keywordSearch && !k.name.toLowerCase().includes(keywordSearch.toLowerCase())) return false;
    if (keySearch && !k.key.toLowerCase().includes(keySearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">API 管理</h1>
        <button className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          創建 API 密鑰
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={keywordSearch}
            onChange={e => setKeywordSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
          />
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="密鑰"
            value={keySearch}
            onChange={e => setKeySearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
          />
        </div>
        <div className="relative ml-auto">
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>{currentFilter.label}</span>
            <span className={`px-1.5 py-0.5 rounded text-xs ${currentFilter.color}`}>{currentFilter.count}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {filterDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-44 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                {filterOptions.map(option => (
                  <button
                    key={option.key}
                    onClick={() => { setFilter(option.key); setFilterDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                      filter === option.key ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${option.color}`}>{option.count}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider w-10">
                  <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                </th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">名稱</th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">狀態</th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">已使用 / 還剩餘</th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">密鑰</th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">可用模型</th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">創建時間</th>
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">過期時間</th>
                <th className="text-right px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((k) => (
                <tr key={k.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/70">{k.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/15 text-emerald-400">
                      {k.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-0">
                      <span className="px-2 py-1 rounded-l text-xs text-white/50 bg-white/5 border border-white/10 border-r-0">{k.used}</span>
                      <span className="px-2 py-1 rounded-r text-xs text-white/50 bg-white/5 border border-white/10 border-l-0">{k.remaining}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 font-mono">{k.key}</span>
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/50">{k.models}</td>
                  <td className="px-5 py-3.5 text-xs text-white/40 whitespace-nowrap">{k.created}</td>
                  <td className="px-5 py-3.5 text-xs text-white/40 whitespace-nowrap">{k.expires}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5" />
                        使用密鑰
                      </button>
                      <button className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>每頁行數: 10</span>
            <span>第 1 項至第 {filteredKeys.length} 項，共 {filteredKeys.length} 項</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors">‹</button>
              <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApiManagementPageWrapper() {
  const { logout } = useAuth();

  const handleTopUp = () => {
    window.location.href = '/Hubto/pricing';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <nav className="flex items-center justify-between px-6 py-4 lg:px-12 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 cursor-pointer">
              <Link to="/" className="flex items-center gap-1">
                <img src="https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png" alt="HubTo" className="h-8 w-auto rounded-lg" />
                <span className="text-[21px] font-semibold tracking-tight text-white">HubTo</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
              <Link to="/models" className="hover:text-white transition-colors">模型中心</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">套餐定價</Link>
              <a href="https://docs.hubto.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">文檔</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-full bg-[#9d82f5] text-white text-sm font-medium hover:bg-[#8b6de8] transition-colors"
            >
              增加 Credit
            </button>
            <AccountMenu logout={logout} onUpgrade={handleTopUp} />
          </div>
        </nav>
      </div>

      <div className="flex pt-14">
        <Sidebar />

        <main className="flex-1 pt-[80px] pb-12 px-8" style={{ marginLeft: '285px' }}>
          <div className="max-w-[1280px] mx-auto">
            <ApiManagementPage />
          </div>
        </main>
      </div>
    </div>
  );
}
