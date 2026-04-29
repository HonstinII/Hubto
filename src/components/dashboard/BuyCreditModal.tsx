import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

export function BuyCreditModal({ onClose }: { onClose: () => void }) {
  const [selectedPrice, setSelectedPrice] = useState(5);

  const options = [
    { price: 5, credits: 500 },
    { price: 10, credits: 1030 },
    { price: 20, credits: 2050 },
  ];

  const selectedCredits = options.find(o => o.price === selectedPrice)?.credits || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[640px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/60 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-8 pb-4">
          <h3 className="text-[18px] font-semibold text-white mb-1">购买更多的Credit</h3>
        </div>

        <div className="text-center py-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-6xl font-bold text-white/30">$</span>
            <span className="text-7xl font-bold tracking-tight text-white">{selectedPrice}</span>
          </div>
          <div className="mt-2 text-lg text-white/50">{selectedCredits} credits</div>
        </div>

        <div className="px-8 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {options.map((option) => (
              <button
                key={option.price}
                onClick={() => setSelectedPrice(option.price)}
                className={`relative rounded-xl border-2 p-4 transition-all text-center ${
                  selectedPrice === option.price
                    ? 'border-[#9d82f5] bg-[#9d82f5]/10'
                    : 'border-white/10 bg-[#1a1a1e] hover:border-white/20'
                }`}
              >
                <div className="text-[18px] font-semibold text-white">${option.price}</div>
                <div className="mt-0.5 text-[14px] text-white/30">{option.credits}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#9d82f5] text-white text-base font-medium hover:bg-[#8b6de8] transition-colors flex items-center justify-center gap-2"
          >
            立即充值
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
