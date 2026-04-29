import { useState } from 'react';
import { LayoutDashboard, KeyRound, Braces, FileText, CreditCard, User, LogOut, ChevronDown, Crown, Send, Plus, Trash2, MessageCircle, Settings, X, Copy, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Link } from '@tanstack/react-router';

const mockCreditBalance = 5000;

type Page = 'dashboard' | 'api' | 'app' | 'logs' | 'topup' | 'account';

function Sidebar({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
  const navItems: { key: Page; icon: React.ReactNode; label: string }[] = [
    { key: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: '數據看板' },
    { key: 'api', icon: <KeyRound className="w-4 h-4" />, label: 'API 管理' },
    { key: 'app', icon: <Braces className="w-4 h-4" />, label: '測試 API' },
    { key: 'logs', icon: <FileText className="w-4 h-4" />, label: '使用記錄' },
  ];

  const personalItems: { key: Page; icon: React.ReactNode; label: string }[] = [
    { key: 'topup', icon: <CreditCard className="w-4 h-4" />, label: '套餐充值' },
    { key: 'account', icon: <User className="w-4 h-4" />, label: '帳戶概覽' },
  ];

  return (
    <aside className="w-[220px] shrink-0 border-r border-white/10 bg-[#0a0a0c] min-h-[calc(100vh-56px)] mt-10">
      <div className="px-3 py-3">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activePage === item.key
                ? 'bg-[#9d82f5]/15 text-[#9d82f5] font-medium'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="px-3 pt-6 pb-2 text-xs text-white/30 uppercase tracking-wider">個人中心</div>

        {personalItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (item.key === 'topup') {
                window.location.href = '/Hubto/pricing';
              } else {
                onNavigate(item.key);
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activePage === item.key
                ? 'bg-[#9d82f5]/15 text-[#9d82f5] font-medium'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function AccountMenu({ logout, onUpgrade }: { logout: () => void; onUpgrade: () => void }) {
  const [open, setOpen] = useState(false);

  const now = new Date();
  const refreshDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm text-white/80">honstinhui@gmail.com</span>
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-medium text-white">
          H
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-60 rounded-xl bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-sm text-white font-medium">honstinhui@gmail.com</div>
              <div className="text-[14px] text-white/40 mt-0.5 py-1">餘額: {mockCreditBalance} Credit</div>
              <div className="text-[14px] text-white/30 mt-0.5 py-1">刷新時間: {refreshDate}</div>
            </div>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 h-14 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登錄
            </button>
            <button
              onClick={() => { onUpgrade(); setOpen(false); }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#9d82f5] text-white text-sm font-medium text-left hover:bg-[#8b6de8] transition-colors"
            >
              <Crown className="w-4 h-4" />
              升級套餐
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp?: string;
  error?: boolean;
}

const mockConversations = [
  { id: '1', title: '創造一個女性 黃頭... 發', active: true },
  { id: '2', title: 'New Chat', active: false },
  { id: '3', title: 'New Chat', active: false },
  { id: '4', title: '你是什麼模型', active: false },
];

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'system',
    content: '2026/4/23 15:42:26  glm-4-turbo',
  },
  {
    id: '2',
    role: 'system',
    content: JSON.stringify({
      message: 'fetch error, please check url',
      url: 'https://api.alltoken.co/v1/chat/completions',
      code: 'fetch_error',
    }, null, 2),
    model: '失敗原因!',
    timestamp: '加載代碼',
    error: true,
  },
  {
    id: '3',
    role: 'user',
    content: '你好',
    timestamp: '2026/4/23 15:42:48',
    model: 'gpt-4',
  },
  {
    id: '4',
    role: 'system',
    content: '2026/4/23 15:43:49  llama-2.7b',
  },
  {
    id: '5',
    role: 'system',
    content: JSON.stringify({
      error: {
        code: 'model_not_found',
        message: 'The model llama-2.7b 並不可用 (distributor) (request id: 2026042315434900150120110412)',
        type: 'new_api_error',
      }
    }, null, 2),
    model: '失敗原因!',
    timestamp: '加載代碼',
    error: true,
  },
  {
    id: '6',
    role: 'user',
    content: '你是什麼模型',
    timestamp: '2026/4/23 11:50:24',
    model: 'glm-4-turbo',
  },
  {
    id: '7',
    role: 'system',
    content: '我是 GLM，當前運行的是 glm-4-turbo。',
    timestamp: '2026/4/23 11:50:27',
  },
];

function TestAPIPage() {
  const [activeConversation, setActiveConversation] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [modelOpen, setModelOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const models = ['gpt-4', 'gpt-4-turbo', 'glm-4-turbo', 'llama-2.7b', 'claude-opus', 'gemini-pro'];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] -mt-10">
      {/* Left sidebar - conversations */}
      <div className="w-[280px] shrink-0 border-r border-white/10 bg-[#0a0a0c] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm font-medium text-white/70">對話列表</span>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                activeConversation === conv.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="px-3 py-3 border-t border-white/10">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm">設置</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              <span>{selectedModel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
            </button>
            {modelOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                  {models.map(m => (
                    <button
                      key={m}
                      onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                        selectedModel === m
                          ? 'bg-[#9d82f5]/15 text-[#9d82f5]'
                          : 'text-white/60 hover:bg-white/5'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">已選: honstin 測試</span>
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {mockMessages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-white/30">{msg.timestamp}</span>
                    <div className="bg-emerald-500/20 text-white text-sm px-4 py-2 rounded-2xl rounded-br-md max-w-md">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.error) {
              return (
                <div key={msg.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">{mockMessages[mockMessages.indexOf(msg) - 1]?.timestamp}</span>
                    <span className="text-xs text-white/40">{msg.model}</span>
                  </div>
                  <div className="bg-[#1a1a1e] border border-white/10 rounded-xl p-4 max-w-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-red-400 font-medium">{msg.model}</span>
                      <button className="text-xs text-white/30 hover:text-white/60 transition-colors">{msg.timestamp}</button>
                    </div>
                    <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap">{msg.content}</pre>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex justify-start gap-3">
                <div className="flex flex-col items-start gap-1">
                  {msg.timestamp && <span className="text-xs text-white/30">{msg.timestamp}</span>}
                  <div className="bg-[#1a1a1e] border border-white/10 text-white text-sm px-4 py-3 rounded-2xl rounded-tl-md max-w-2xl">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="可輸入訊息內容，也可能要添加指令代碼（Shift + Enter = 換行）"
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors resize-none h-[52px]"
              rows={1}
            />
            <button className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-[#9d82f5] text-white hover:bg-[#8b6de8] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestAPIPageWrapper() {
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('app');

  const handleTopUp = () => {
    window.location.href = '/Hubto/pricing';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <nav className="flex items-center justify-between px-6 py-4 lg:px-12 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 cursor-pointer">
              <Link to="/" className="flex items-center gap-1">
                <img src="https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png" alt="HubTo" className="h-8 w-auto rounded-lg" />
                <span className="text-[21px] font-semibold tracking-tight text-white">HubTo</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
              <Link to="/models" className="hover:text-white transition-colors">模型中心</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">套餐定價</Link>
              <a href="https://docs.hubto.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">文檔</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-full bg-[#9d82f5] text-white text-sm font-medium hover:bg-[#8b6de8] transition-colors"
            >
              增加 Credit
            </button>
            <AccountMenu logout={logout} onUpgrade={handleTopUp} />
          </div>
        </nav>
      </div>

      <div className="flex pt-14">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />

        <main className="flex-1 pt-[80px] pb-12 px-8" style={{ marginLeft: '285px' }}>
          <div className="max-w-6xl mx-auto">
            <TestAPIPage />
          </div>
        </main>
      </div>
    </div>
  );
}
