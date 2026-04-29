import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { mockDataByPeriod, mockCreditBalance } from '../../data/mockData';
import { RechargeRecordPage } from './RechargeRecordPage';

export function AccountOverviewPage({ onBuyCredit }: { onBuyCredit: () => void }) {
  const mockData = mockDataByPeriod['7days'];
  const creditUsed = mockData.totalSpent;
  const creditTotal = mockCreditBalance;
  const creditLeft = creditTotal - creditUsed;
  const creditPercent = (creditLeft / creditTotal) * 100;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#1a1a1e] border border-white/10 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs text-white/60 mb-4">
              當前套餐
            </div>
            <h2
              className="text-[32px] font-semibold"
              style={{
                background: 'linear-gradient(120deg, #b5b5b5 0%, #ffffff 50%, #b5b5b5 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shinyText 2s linear 0s infinite',
              }}
            >
              Pro
            </h2>
          </div>
          <button
            onClick={() => { window.location.href = '/Hubto/pricing'; }}
            className="px-5 py-2.5 rounded-full bg-white/10 text-sm text-white/70 hover:bg-white/15 transition-colors"
          >
            管理套餐
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[24px] font-semibold text-white">Credit</span>
            <div className="flex items-center gap-3">
              <span className="text-[24px] font-semibold text-white">{creditLeft} 剩余</span>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBuyCredit}
                className="w-7 h-7 rounded-full bg-[#9d82f5] flex items-center justify-center text-white hover:bg-[#8b6de8] transition-colors shadow-lg shadow-[#9d82f5]/25"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-[#9d82f5] to-violet-400 shimmer-bar"
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-[14px] text-white/30">Credit刷新时间：05 / 27</span>
          </div>
        </div>
      </div>

      <RechargeRecordPage />
    </div>
  );
}
