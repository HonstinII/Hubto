import { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import ShinyButton from '../components/ShinyButton';

// Layout components
import { Sidebar } from '../components/dashboard/Sidebar';
import { AccountMenu } from '../components/dashboard/AccountMenu';
import { StatCard } from '../components/dashboard/StatCard';
import { ModelServerStatus } from '../components/dashboard/ModelServerStatus';

// Modals
import { SpendingRankingModal } from '../components/dashboard/SpendingRankingModal';
import { RequestRankingModal } from '../components/dashboard/RequestRankingModal';
import { AllModelsModal } from '../components/dashboard/AllModelsModal';
import { BuyCreditModal } from '../components/dashboard/BuyCreditModal';

// Sub-pages
import { ActivityLogPage } from './dashboard/ActivityLogPage';
import { DashboardApiPage } from './dashboard/DashboardApiPage';
import { DashboardTestApiPage } from './dashboard/DashboardTestApiPage';
import { AccountOverviewPage } from './dashboard/AccountOverviewPage';
import { ModelsCenterPage } from './dashboard/ModelsCenterPage';

// Data
import { mockDataByPeriod, mockCreditBalance } from '../data/mockData';
import type { Page } from '../data/mockData';

const timeRanges = [
  { key: 'today' as const, label: '今天' },
  { key: '7days' as const, label: '最近7天' },
  { key: '30days' as const, label: '最近30天' },
  { key: 'custom' as const, label: '自定義' },
];

const pageConfig: { key: Page; title: string }[] = [
  { key: 'dashboard', title: '數據看板' },
  { key: 'logs', title: '使用記錄' },
  { key: 'api', title: 'API 管理' },
  { key: 'app', title: '測試 API' },
  { key: 'account', title: '帳戶概覽' },
  { key: 'models', title: '模型中心' },
];

export function DashboardPage() {
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedDays, setSelectedDays] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [showAllModels, setShowAllModels] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const mockData = mockDataByPeriod[selectedDays];

  const topSpendingModels = [
    { modelId: 'gemini-3-1-pro', value: mockData.topSpending[0], color: '#9d82f5' },
    { modelId: 'qwen3-6-plus', value: mockData.topSpending[1], color: '#a855f7' },
    { modelId: 'claude-haiku-4-5', value: mockData.topSpending[2], color: '#c084fc' },
  ];

  const topRequestModels = [
    { modelId: 'gemini-3-1-pro', value: mockData.topRequests[0], color: '#9d82f5' },
    { modelId: 'qwen3-6-plus', value: mockData.topRequests[1], color: '#a855f7' },
    { modelId: 'glm-5-1', value: mockData.topRequests[2], color: '#c084fc' },
  ];

  const handleTopUp = () => {
    window.location.href = '/Hubto/pricing';
  };

  const currentTitle = pageConfig.find(p => p.key === activePage)?.title;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top Nav */}
      <div className="fixed-navbar fixed top-0 right-0 z-50 w-full">
        <nav className="flex items-center justify-end px-6 py-4">
          <div className="flex items-center gap-3">
            <ShinyButton
              onClick={() => setShowBuyModal(true)}
              textColor="#000000"
              shineColor="rgba(157, 130, 245, 0.35)"
              speed="2.67s"
              delay="2s"
              spread={240}
              direction="left"
            >
              增加 Credit
            </ShinyButton>
            <AccountMenu logout={logout} onUpgrade={handleTopUp} />
          </div>
        </nav>
      </div>

      <div className="flex pt-0">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />

        <main className="flex-1 pt-[80px] pb-12 px-8" style={{ marginLeft: '285px' }}>
          <div className="max-w-[1280px] mx-auto">
            {/* Page Title */}
            {currentTitle && (
              <div className="flex items-center justify-start mb-6">
                <h1 className="text-xl font-semibold text-white">{currentTitle}</h1>
              </div>
            )}

            {/* Dashboard Overview */}
            {activePage === 'dashboard' && (
              <>
                <div className="flex items-center justify-end mb-6">
                  <div className="relative">
                    <button
                      onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
                    >
                      <span>{timeRanges.find(tr => tr.key === selectedDays)?.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dateDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDateDropdownOpen(false)} />
                        <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                          {timeRanges.map(tr => (
                            <button
                              key={tr.key}
                              onClick={() => { setSelectedDays(tr.key); setDateDropdownOpen(false); }}
                              className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                                selectedDays === tr.key
                                  ? 'bg-[#9d82f5]/15 text-[#9d82f5]'
                                  : 'text-white/60 hover:bg-white/5'
                              }`}
                            >
                              {tr.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    title="總消耗"
                    value={`${mockData.totalSpent} / ${mockCreditBalance} Credit`}
                    models={topSpendingModels}
                    showAddButton={true}
                    onAddClick={() => setShowBuyModal(true)}
                    onExpand={() => setShowSpendingModal(true)}
                  />
                  <StatCard
                    title="總請求數"
                    value={`${mockData.totalRequests}`}
                    models={topRequestModels}
                    isRequestCard={true}
                    onExpand={() => setShowRequestModal(true)}
                  />
                  <ModelServerStatus onShowAll={() => setShowAllModels(true)} />
                </div>

                <div className="mt-8">
                  <ActivityLogPage compact onNavigate={setActivePage} />
                </div>
              </>
            )}

            {activePage === 'logs' && <ActivityLogPage />}
            {activePage === 'api' && <DashboardApiPage />}
            {activePage === 'app' && <DashboardTestApiPage />}
            {activePage === 'account' && <AccountOverviewPage onBuyCredit={() => setShowBuyModal(true)} />}
            {activePage === 'models' && <ModelsCenterPage />}

            {/* Fallback for unknown pages */}
            {!pageConfig.some(p => p.key === activePage) && (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-white/30">
                <FileText className="w-16 h-16 mb-4 text-white/10" />
                <p className="text-sm text-white/40 font-medium">此功能即將上線</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showAllModels && <AllModelsModal onClose={() => setShowAllModels(false)} />}
      {showBuyModal && <BuyCreditModal onClose={() => setShowBuyModal(false)} />}
      {showSpendingModal && <SpendingRankingModal onClose={() => setShowSpendingModal(false)} />}
      {showRequestModal && <RequestRankingModal onClose={() => setShowRequestModal(false)} />}
    </div>
  );
}
