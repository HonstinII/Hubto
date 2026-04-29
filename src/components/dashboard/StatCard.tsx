import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { MODELS } from '../../data/models';

function getDisplayName(modelId: string) {
  const model = MODELS.find(m => m.id === modelId);
  return model ? model.displayName : modelId;
}

export { getDisplayName };

export function StatCard({
  title,
  value,
  models,
  showAddButton,
  onAddClick,
  isRequestCard,
  onExpand,
}: {
  title: string;
  value: string;
  models: { modelId: string; value: number; color: string }[];
  showAddButton?: boolean;
  onAddClick?: () => void;
  isRequestCard?: boolean;
  onExpand?: () => void;
}) {
  const max = Math.max(...models.map(m => m.value), 0.01);

  return (
    <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5 h-[264px] flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-white/60">{title}</div>
        <div className="flex items-center gap-2">
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold text-white">{value}</div>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="px-3 py-1 rounded-full bg-white text-black text-xs font-medium hover:bg-gray-100 transition-colors shrink-0"
          >
            增加 Credit
          </button>
        )}
      </div>

      <div className="flex items-end gap-4 flex-1 pb-4">
        {models.map((m, i) => {
          const barHeight = (m.value / max) * 100;
          const displayName = getDisplayName(m.modelId);
          return (
            <div key={m.modelId} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group/bar">
              <div className="w-full relative flex-1 flex items-end justify-center">
                <div className="absolute bottom-full mb-2 hidden group-hover/bar:block z-10">
                  <div className="rounded-lg bg-[#1a1a1e] border border-white/10 px-3 py-2 shadow-xl whitespace-nowrap">
                    {isRequestCard ? (
                      <>
                        <p className="text-xs text-white/70">{displayName}</p>
                        <p className="text-sm text-white font-semibold">{m.value.toLocaleString()} 次</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-white/70">{displayName}</p>
                        <p className="text-sm text-white font-semibold">{m.value} Credit</p>
                      </>
                    )}
                  </div>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="w-full max-w-[48px] rounded-t-md cursor-pointer"
                  style={{
                    background: `linear-gradient(to top, ${m.color}30, ${m.color})`,
                  }}
                />
              </div>
              <span className="text-xs text-white/50 text-center truncate w-full leading-tight">{displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
