import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, Plus, Info } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@blinkdotnew/ui';
import { useLanguage } from '../lib/i18n';

const MODELS = [
  { id: 'auto', name: 'Auto' },
  { id: 'gemini', name: 'Gemini 3.1 Pro' },
  { id: 'claude', name: 'Claude 4.6' },
  { id: 'glm', name: 'GLM-5' },
  { id: 'kimi', name: 'Kimi 2.5' },
  { id: 'minimax', name: 'MiniMax 2.7' },
];

function TypingCursor() {
  return (
    <motion.span
      className="ml-1 inline-block h-[1.1em] w-[2px] rounded-full bg-violet-300 align-[-0.15em]"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function Hero() {
  const { t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="mx-auto flex min-h-[92vh] w-full max-w-6xl items-center justify-center px-4 pb-24 pt-28 md:pb-32 md:pt-32" style={{ marginTop: '72px', marginBottom: '72px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex w-full flex-col items-center gap-7"
        style={{ paddingTop: '100px', paddingBottom: '100px' }}
      >
        <h1 className="max-w-4xl text-center text-[2.9rem] font-medium tracking-[-0.04em] text-white md:text-[4.6rem] md:leading-[1.04]" style={{ fontSize: '60px' }}>
          {t.hero.title1}
          <br />
          <span className="text-white">{t.hero.title2}</span>
        </h1>

        <p className="max-w-2xl text-center text-sm font-medium leading-7 text-white md:text-[1.05rem] md:leading-[1.85]">
          {t.hero.desc}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-6">
          <button className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-transform hover:scale-105">
            {t.hero.getApiKey}
          </button>
          <button className="rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105">
            {t.hero.viewDocs}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-[0_25px_100px_rgba(76,29,149,0.1)] backdrop-blur-md"
        >
          <div className="flex min-h-[220px] flex-col justify-between">
            <div className="relative flex-grow">
              {!prompt && !isFocused && (
                <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-[85%] text-left text-lg text-[#b5b9be] md:text-[1.35rem]">
                  <span>{t.hero.placeholder}</span>
                  <TypingCursor />
                </div>
              )}

              <textarea
                value={prompt}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setPrompt(e.target.value)}
                className="relative z-0 min-h-[138px] w-full resize-none bg-transparent px-3 py-3 text-left text-lg text-white focus:outline-none md:text-[1.35rem]"
              />
            </div>

            <div className="flex items-center justify-between gap-3 px-2 pt-2">
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10 outline-none backdrop-blur-md">
                    <Plus className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[150px] rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
                    <DropdownMenuItem className="cursor-pointer py-2.5 px-4 text-sm text-white/70 hover:bg-[#212124] rounded-[16px]">上传文件</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2.5 px-4 text-sm text-white/70 hover:bg-[#212124] rounded-[16px]">上传图片</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-[#19191a] outline-none backdrop-blur-md md:text-base">
                    {selectedModel.name}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px] rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
                    {MODELS.map((model) => (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`flex cursor-pointer items-center justify-between py-2.5 px-4 text-sm transition-colors ${
                          selectedModel.id === model.id
                            ? 'text-white bg-[#212124] rounded-[16px]'
                            : 'text-white/70 hover:bg-[#212124] rounded-[16px]'
                        }`}
                      >
                        {model.name}
                        {selectedModel.id === model.id && <Check className="h-4 w-4 text-violet-400" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative group">
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 text-sm text-white/80 backdrop-blur-md">
                    <svg className="w-5 h-5" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#9d82f5" strokeWidth="3" strokeDasharray="100, 100" strokeDashoffset="0" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm font-medium">5/5</span>
                  </div>
                  <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
                    <div className="w-48 rounded-[16px] bg-[#1a1a1e] border border-white/10 p-4 shadow-xl overflow-hidden z-20">
                      <p className="text-xs font-medium text-white/70 mb-3">{t.hero.dailyQuota}</p>
                      <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                        <span>{t.hero.quotaRemaining}</span>
                        <span className="text-emerald-400">5</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span>{t.hero.quotaUsed}</span>
                        <span className="text-white/80">0</span>
                      </div>
                    </div>
                    <div className="absolute top-full right-4 -mt-px">
                      <div className="w-2 h-2 bg-[#1a1a1e] border-r border-b border-white/10 transform rotate-45"></div>
                    </div>
                  </div>
                </div>

                <button
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-all backdrop-blur-md ${
                    prompt.trim()
                      ? 'bg-white text-black hover:scale-[1.03] hover:bg-zinc-200'
                      : 'cursor-not-allowed bg-white/5 text-white/30'
                  }`}
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
