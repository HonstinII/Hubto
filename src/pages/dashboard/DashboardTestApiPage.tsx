import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronDown, Sparkles, ArrowUp, MessageCircle } from 'lucide-react';
import { mockConversations } from '../../data/mockData';
import type { Message } from '../../data/mockData';

function DropdownSelect({ label, items, selected, onSelect, open, setOpen, title, position, width }: {
  label: string; items: string[]; selected: string; onSelect: (v: string) => void;
  open: boolean; setOpen: (v: boolean) => void; title: string; position: string; width: string;
}) {
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/30 hover:text-white/50 text-[12px] transition-colors">
        <span>{label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute ${position} ${width} rounded-xl bg-[#232425] border border-white/[0.1] shadow-2xl z-50 overflow-hidden`}>
            <div className="px-3 py-2 text-[11px] text-white/30 uppercase tracking-wider">{title}</div>
            {items.map(item => (
              <button key={item} onClick={() => { onSelect(item); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-[13px] text-left transition-colors flex items-center gap-2 ${selected === item ? 'bg-[#9d82f5]/10 text-[#9d82f5]' : 'text-white/50 hover:bg-white/[0.04]'}`}>
                {selected === item && <div className="w-1 h-1 rounded-full bg-[#9d82f5]" />}
                {item}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DashboardTestApiPage() {
  const [activeConversation, setActiveConversation] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT-5.4');
  const [modelOpen, setModelOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState('honstin 測試');
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const models = ['GPT-5.4', 'GPT-4', 'GPT-4-turbo', 'Claude Opus 4.6', 'Gemini 3.1 Pro'];
  const apiKeys = ['honstin 測試', '1776913908', '1776911904'];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(), role: 'user', content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    }]);
    setInputValue('');
    setIsThinking(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <div className="flex h-[calc(100vh-184px)] bg-[#171717] rounded-[16px] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[280px] shrink-0 flex flex-col bg-[#232425]">
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/30" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/30" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab2e]/30" />
        </div>
        <div className="px-3 pt-4 pb-2">
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-start gap-2 px-3 py-2.5 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
            <Plus className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
            <span className="text-[12px] text-white/50 font-medium group-hover:text-white/70">新對話</span>
          </motion.button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-1">
          <div className="text-[11px] font-medium text-white/20 uppercase tracking-wider px-3 py-2">聊天</div>
          {mockConversations.map(conv => (
            <motion.button key={conv.id} whileHover={{ x: 1 }} onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all flex items-center gap-2.5 ${
                activeConversation === conv.id ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'
              }`}>
              <MessageCircle className={`w-3.5 h-3.5 shrink-0 ${activeConversation === conv.id ? 'text-white/50' : 'text-white/20'}`} />
              <span className="truncate">{conv.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#171717]">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {messages.map((msg, idx) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`flex items-start gap-4 mb-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#9d82f5]/15 border border-[#9d82f5]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#9d82f5]" />
                  </div>
                )}
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  {msg.role !== 'user' && msg.title && (
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-[13px] font-semibold text-white/90">{msg.title}</span>
                      <span className="text-[11px] text-white/25">{msg.timestamp}</span>
                    </div>
                  )}
                  {msg.role === 'user' && <div className="text-[11px] text-white/25 mb-1.5">{msg.timestamp}</div>}
                  <div className={`text-[14px] whitespace-pre-wrap leading-[1.7] ${
                    msg.role === 'user' ? 'bg-[#232425] text-white/90 rounded-[20px] rounded-tr-[4px] px-5 py-3.5 max-w-[80%]' : 'text-white/70'
                  }`}>{msg.content}</div>
                </div>
              </motion.div>
            ))}
            {isThinking && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start mb-10">
                <div className="flex items-center gap-2 text-[14px] text-white/50">
                  <span>思考中</span>
                  <span className="flex gap-0.5">
                    {[0, 0.2, 0.4].map(d => (
                      <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: d }} className="text-white/70">.</motion.span>
                    ))}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <motion.div animate={{ borderColor: isFocused ? 'rgba(157,130,245,0.25)' : 'rgba(255,255,255,0.08)', backgroundColor: isFocused ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)' }}
              transition={{ duration: 0.2 }} className="rounded-2xl border p-4">
              <textarea value={inputValue} onChange={e => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={handleKeyDown}
                placeholder="輸入訊息..." className="w-full bg-transparent text-[14px] text-white/80 placeholder:text-white/25 focus:outline-none resize-none min-h-[24px] max-h-[200px] leading-relaxed" rows={1}
                onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }} />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/25 hover:text-white/50 transition-colors"><Plus className="w-4 h-4" /></button>
                  <DropdownSelect label={selectedApiKey} items={apiKeys} selected={selectedApiKey} onSelect={setSelectedApiKey} open={apiKeyOpen} setOpen={setApiKeyOpen} title="選擇 API Key" position="bottom-full left-0 mb-2" width="w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <DropdownSelect label={selectedModel} items={models} selected={selectedModel} onSelect={setSelectedModel} open={modelOpen} setOpen={setModelOpen} title="選擇模型" position="bottom-full right-0 mb-2" width="w-52" />
                  <motion.button whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }} whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }} onClick={handleSendMessage}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${inputValue.trim() ? 'bg-[#939393] text-white hover:bg-[#a8a8a8]' : 'bg-[#939393]/30 text-white/30 cursor-not-allowed'}`}
                    disabled={!inputValue.trim()}>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-[11px] text-white/15">按</span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/25 border border-white/[0.06]">Enter</kbd>
              <span className="text-[11px] text-white/15">發送，</span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/25 border border-white/[0.06]">Shift</kbd>
              <span className="text-[11px] text-white/15">+</span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/25 border border-white/[0.06]">Enter</kbd>
              <span className="text-[11px] text-white/15">換行</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
