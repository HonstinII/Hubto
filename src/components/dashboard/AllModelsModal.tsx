import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { MODELS } from '../../data/models';

export function AllModelsModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNormalOnly, setShowNormalOnly] = useState(false);

  const serverModels = MODELS.map(m => ({
    name: m.displayName,
    status: m.id === 'gemini-3-1-pro' || m.id === 'gpt-5-3-codex' || m.id === 'gemini-3-pro' ? 'busy' as const : 'normal' as const,
    usage: Math.floor(Math.random() * 30) + 1,
  }));

  const filtered = serverModels
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => !showNormalOnly || m.status === 'normal')
    .sort((a, b) => b.usage - a.usage);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[500px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/0">
          <h3 className="text-sm font-medium text-white/60">所有模型伺服器狀態</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
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
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <span className="text-xs text-white/40">僅顯示正常</span>
              <div
                onClick={() => setShowNormalOnly(!showNormalOnly)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  showNormalOnly ? 'bg-[#9d82f5]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    showNormalOnly ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-5 py-3 space-y-1.5">
          {filtered.map((m, i) => (
            <div key={m.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-white/20 w-5 shrink-0">{i + 1}</span>
                <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'busy' ? 'bg-red-500' : 'bg-[#9d82f5]'}`} />
                <span className="text-xs text-white/60 truncate">{m.name}</span>
              </div>
              <span className={`text-xs font-medium shrink-0 ml-2 px-2 py-0.5 rounded-full ${
                m.status === 'busy' ? 'bg-red-500/15 text-red-400' : 'bg-[#9d82f5]/15 text-[#9d82f5]'
              }`}>
                {m.status === 'busy' ? '繁忙' : '正常'}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-20 text-white/30 text-xs">無符合條件的模型</div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-end">
          <div className="flex items-center gap-4">
            {[
              { color: 'bg-[#9d82f5]', label: '正常' },
              { color: 'bg-red-500', label: '繁忙' },
            ].map(legend => (
              <div key={legend.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${legend.color}`} />
                <span className="text-xs text-white/40">{legend.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
