import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { mockRechargeRecords } from '../../data/mockData';

const statusOptions = [
  { key: 'all', label: '全部狀態', match: '' },
  { key: 'success', label: '成功', match: '成功' },
  { key: 'pending', label: '待支付', match: '待支付' },
  { key: 'cancelled', label: '已取消', match: '已取消' },
];

const cellStyle = { fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' };

export function RechargeRecordPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusOpen, setStatusOpen] = useState(false);

  const currentOption = statusOptions.find(o => o.key === statusFilter) || statusOptions[0];
  const filteredRecords = mockRechargeRecords.filter(r =>
    statusFilter === 'all' || r.status === currentOption.match
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">充值記錄</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="搜尋訂單號..."
              className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors w-44"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              <span>{currentOption.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                  {statusOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => { setStatusFilter(option.key); setStatusOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${statusFilter === option.key ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">訂單號</th>
                <th className="text-left px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">充值套餐</th>
                <th className="text-right px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">到賬 Credit</th>
                <th className="text-right px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">支付金額</th>
                <th className="text-center px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">狀態</th>
                <th className="text-right px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">時間</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/60 whitespace-nowrap" style={cellStyle}>{record.orderNo}</td>
                  <td className="px-5 py-3.5 text-white/60 whitespace-nowrap font-medium" style={cellStyle}>{record.plan}</td>
                  <td className="px-5 py-3.5 text-white/60 text-right font-medium" style={cellStyle}>{record.credits.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-white/60 text-right" style={cellStyle}>{record.paid}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      record.status === '成功'
                        ? 'bg-[#9d82f5]/15 text-[#9d82f5]'
                        : record.status === '待支付'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-right whitespace-nowrap" style={cellStyle}>{record.time}</td>
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
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
