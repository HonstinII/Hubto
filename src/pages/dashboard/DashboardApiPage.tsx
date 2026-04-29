import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Eye,
  Copy,
  Plus,
  MoreVertical,
} from 'lucide-react';
import { mockApiKeys } from '../../data/mockData';

export function DashboardApiPage() {
  const [filter, setFilter] = useState<string>('all');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);

  const filterOptions = [
    { key: 'all', label: '全部', count: mockApiKeys.length },
    { key: 'enabled', label: '已啟用', count: mockApiKeys.filter(k => k.status === '已啟用').length },
    { key: 'disabled', label: '已禁用', count: 0 },
    { key: 'expired', label: '已過期', count: 0 },
    { key: 'exhausted', label: '額度耗盡', count: 0 },
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
    <div className="max-w-[1280px] mx-auto">
      <div className="flex items-center justify-end gap-3 mb-4">
        <div className="relative">
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/60 hover:text-white/80 transition-colors"
            style={{ width: '107px', height: '41px', padding: '8px 16px', margin: '0' }}
          >
            <span>{currentFilter.label}</span>
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
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[12px] text-left transition-colors ${
                      filter === option.key ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {[
          { placeholder: '搜尋關鍵字', value: keywordSearch, onChange: setKeywordSearch },
          { placeholder: '密鑰', value: keySearch, onChange: setKeySearch },
        ].map(input => (
          <div key={input.placeholder} className="relative w-[176px] h-[41px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={input.placeholder}
              value={input.value}
              onChange={e => input.onChange(e.target.value)}
              className="w-full h-full pl-9 pr-3 py-[8px] rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
              style={{ padding: '8px 12px 8px 36px' }}
            />
          </div>
        ))}
        <button className="px-4 py-2 rounded-lg bg-[#9d82f5] text-white text-sm font-medium hover:bg-[#8b6de8] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          創建 API 密鑰
        </button>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/10">
                {['名稱', '狀態', '消耗 / 餘額 (Credit)', '密鑰', '可用模型', '創建時間', '過期時間'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[12px] text-white font-medium">{h}</th>
                ))}
                <th className="text-right px-5 py-3 text-[12px] text-white font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((k) => (
                <tr key={k.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-[12px] text-white/70">{k.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#9d82f5]/15 text-[#9d82f5]">
                      {k.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-white/50">{k.used} / {k.remaining}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-white/50 font-mono">{k.key}</span>
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-white/50">{k.models}</td>
                  <td className="px-5 py-3.5 text-[12px] text-white/40 whitespace-nowrap">{k.created}</td>
                  <td className="px-5 py-3.5 text-[12px] text-white/40 whitespace-nowrap">{k.expires}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-[#9d82f5]/15 border border-[#9d82f5]/20 text-[12px] font-medium text-[#9d82f5] hover:bg-[#9d82f5]/25 transition-colors">
                        使用密鑰
                      </button>
                      <button className="px-3 py-1 rounded-lg border border-white/10 text-[12px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
                        編輯
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setMoreMenuId(moreMenuId === k.id ? null : k.id)}
                          className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {moreMenuId === k.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setMoreMenuId(null)} />
                            <div className="absolute top-full right-0 mt-1 w-24 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                              <button className="w-full px-4 py-2.5 text-[12px] text-left text-white/60 hover:bg-white/5 transition-colors">
                                禁用
                              </button>
                              <button className="w-full px-4 py-2.5 text-[12px] text-left text-red-400 hover:bg-white/5 transition-colors">
                                删除
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-white/10">
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">‹</button>
            <button className="w-7 h-7 rounded-md bg-[#9d82f5]/15 border border-[#9d82f5]/30 flex items-center justify-center text-xs text-[#9d82f5] font-medium">1</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">2</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">3</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
