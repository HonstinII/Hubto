import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { MODELS } from '../../data/models';

export function ModelServerStatus({ onShowAll }: { onShowAll: () => void }) {
  const [showNormalOnly, setShowNormalOnly] = useState(false);

  const serverModels = MODELS.map(m => ({
    name: m.displayName,
    status: m.id === 'gemini-3-1-pro' || m.id === 'gpt-5-3-codex' || m.id === 'gemini-3-pro' ? 'busy' as const : 'normal' as const,
    usage: Math.floor(Math.random() * 30) + 1,
  }));

  const filtered = serverModels
    .filter(m => !showNormalOnly || m.status === 'normal')
    .sort((a, b) => b.usage - a.usage);

  return (
    <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5 h-[264px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white/60">模型伺服器狀態</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
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
          <button
            onClick={onShowAll}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {filtered.map(m => (
          <div key={m.name} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
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
    </div>
  );
}
