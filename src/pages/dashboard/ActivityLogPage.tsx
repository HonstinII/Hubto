import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { MODELS } from '../../data/models';
import { mockActivityLogs } from '../../data/mockData';
import type { Page } from '../../data/mockData';

const cellStyle = { fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' };

function getModelLogo(displayName: string): string {
  const model = MODELS.find(m => m.displayName === displayName);
  return model?.providerLogo || '';
}

export function ActivityLogPage({ compact, onNavigate }: { compact?: boolean; onNavigate?: (page: Page) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusOpen, setStatusOpen] = useState(false);

  const displayLogs = compact ? mockActivityLogs.slice(0, 8) : mockActivityLogs;
  const filteredDisplayLogs = displayLogs.filter(log =>
    statusFilter === 'all' || log.status === (statusFilter === 'success' ? '成功' : '錯誤')
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {compact && <h3 className="text-lg font-medium text-white">使用记录</h3>}
        {!compact && <div />}
        <div className="flex items-center gap-3 justify-end">
          {compact ? (
            <button
              onClick={() => onNavigate?.('logs')}
              className="text-sm text-[#9d82f5] hover:text-[#8b6de8] transition-colors"
            >
              查看更多
            </button>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="搜尋模型..."
                  className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[14px] text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors w-44"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setStatusOpen(!statusOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[14px] text-white/60 hover:text-white/80 transition-colors"
                >
                  <span>{statusFilter === 'all' ? '全部狀態' : statusFilter === 'success' ? '成功' : '錯誤'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                </button>
                {statusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                      {[
                        { key: 'all', label: '全部狀態' },
                        { key: 'success', label: '成功' },
                        { key: 'error', label: '錯誤' },
                      ].map(option => (
                        <button
                          key={option.key}
                          onClick={() => { setStatusFilter(option.key); setStatusOpen(false); }}
                          className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors ${statusFilter === option.key ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-white/10">
                {['時間', 'API 名稱', '模型', '消耗 Credit', '用時/首字', '狀態'].map((header, idx) => (
                  <th key={header} className={`${idx >= 3 ? (idx === 5 ? 'text-center' : 'text-right') : 'text-left'} px-5 py-3 text-[14px] text-white font-medium`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDisplayLogs.map((log, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ ...cellStyle, color: 'rgba(255,255,255,0.5)' }}>{log.time}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ ...cellStyle, color: 'rgba(255,255,255,0.5)' }}>{log.api}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-medium">
                    <div className="flex items-center gap-2">
                      {getModelLogo(log.model) && (
                        <img src={getModelLogo(log.model)} alt="" className="w-4 h-4 object-contain" />
                      )}
                      <span style={{ ...cellStyle, color: 'rgba(255,255,255,0.6)' }}>{log.model}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium" style={{ ...cellStyle, color: 'rgba(255,255,255,0.6)' }}>{log.credits.toFixed(1)}</td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap" style={{ ...cellStyle, color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{log.duration}</span>
                    <span className="mx-1">/</span>
                    <span>{log.firstToken}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[14px] font-medium ${
                      log.status === '成功' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!compact && (
          <div className="flex items-center justify-end px-5 py-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">‹</button>
              <button className="w-7 h-7 rounded-md bg-[#9d82f5]/15 border border-[#9d82f5]/30 flex items-center justify-center text-xs text-[#9d82f5] font-medium">1</button>
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">2</button>
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">3</button>
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
