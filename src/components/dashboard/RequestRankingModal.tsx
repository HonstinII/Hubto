import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, ChevronDown } from 'lucide-react';
import { getDisplayName } from './StatCard';

export function RequestRankingModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [sortOpen, setSortOpen] = useState(false);

  const rankings = [
    { modelId: 'gemini-3-1-pro', count: 1024, color: '#9d82f5' },
    { modelId: 'qwen3-6-plus', count: 876, color: '#a855f7' },
    { modelId: 'claude-haiku-4-5', count: 654, color: '#b36cf7' },
    { modelId: 'glm-5-1', count: 543, color: '#be83f9' },
    { modelId: 'gpt-5-3-codex', count: 432, color: '#c99afb' },
  ];

  const sorted = rankings
    .filter(r => getDisplayName(r.modelId).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === 'desc' ? b.count - a.count : a.count - b.count);

  const maxCount = Math.max(...rankings.map(r => r.count));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[700px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/0">
          <h3 className="text-lg font-medium text-white">總請求數排行</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="搜尋模型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              <span>{sortOrder === 'desc' ? '從高到低' : '從低到高'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                  {(['desc', 'asc'] as const).map(order => (
                    <button
                      key={order}
                      onClick={() => { setSortOrder(order); setSortOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${sortOrder === order ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      {order === 'desc' ? '從高到低' : '從低到高'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
          {sorted.map((r, i) => {
            const displayName = getDisplayName(r.modelId);
            const barWidth = (r.count / maxCount) * 100;
            return (
              <div key={r.modelId} className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-4 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden relative bg-white/[0.03]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, ${r.color}60, ${r.color})` }}
                  />
                </div>
                <span className="text-[16px] text-white/60 truncate w-[140px] shrink-0 text-right">{displayName}</span>
                <span className="text-[14px] text-white/40 w-[80px] text-right shrink-0">{r.count} 次</span>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="flex items-center justify-center h-32 text-white/30 text-sm">無符合條件的模型</div>
          )}
        </div>
      </div>
    </div>
  );
}
