import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { ModelsShowcase } from './ModelsShowcase';
import { AgentCLIShowcase } from './AgentCLIShowcase';
import { Link } from '@tanstack/react-router';

function FeatureCard({
  title,
  description,
  className = '',
  linkText = 'Learn more',
  linkTo = '/models',
  image,
  external,
}: {
  title: string;
  description: React.ReactNode;
  className?: string;
  linkText?: string;
  linkTo?: string;
  image?: React.ReactNode;
  external?: boolean;
}) {
  const LinkComponent = external ? 'a' : Link;
  const linkProps = external
    ? { href: linkTo, target: '_blank', rel: 'noopener noreferrer' }
    : { to: linkTo };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      className={`group relative overflow-hidden flex flex-col rounded-2xl border border-white/10 bg-[#1e1e20]/70 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}
    >
      {/* Top Image Section */}
      <div className="relative h-[220px] w-full border-b border-white/5 bg-white/[0.02] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.01)_18%,rgba(0,0,0,0)_40%)]" />
        {image}
      </div>

      {/* Bottom Text Section */}
      <div className="relative flex flex-col flex-1 p-6">
        <h3 className="text-xl font-semibold tracking-tight text-white mb-3 leading-snug">
          {title}
        </h3>
        <p className="text-sm font-light leading-relaxed text-white/60 flex-1 mb-6">
          {description}
        </p>
        <div>
          <LinkComponent {...linkProps} className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1.5">
            {linkText}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </LinkComponent>
        </div>
      </div>
    </motion.article>
  );
}

export function Features() {
  const { t } = useLanguage();

  const circleLogos = [
    'https://i.postimg.cc/rwhWvCkV/Frame1.png',
    'https://i.postimg.cc/YCSLfGmR/1Frame.png',
    'https://i.postimg.cc/Bvr80m7M/zhipu-1.png',
    'https://i.postimg.cc/k4QSZn3W/white-chatgpt-logo-svgstack-com-36921776760120.png',
    'https://i.postimg.cc/hjWxpXwS/gemini-logo-svgstack-com-37141776760072.png',
    'https://i.postimg.cc/W4CZ4NtV/Vector.png',
    'https://i.postimg.cc/rp1TDgFj/V1ector.png'
  ];

  return (
    <>
      <section className="relative z-10 w-full bg-transparent px-6 pb-28 pt-6 md:pb-36 md:pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl space-y-5">
            <h2 className="text-left text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.08]" style={{ fontSize: '32px' }}>
              {t.features.title}
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              {t.features.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title={t.features.f1Title}
              description={t.features.f1Desc}
              linkText={t.features.link1}
              className="h-full"
              image={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center scale-[0.65] pointer-events-none">
                  <div className="flex items-center justify-between gap-6">
                    {/* Hubto Gateway */}
                    <div className="z-10 relative shrink-0">
                      <div className="absolute -inset-6 rounded-full bg-violet-500/20 blur-xl animate-pulse" />
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-violet-500/50 bg-violet-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                        <span className="font-bold text-white text-xl">Hubto</span>
                      </div>
                    </div>

                    {/* Connection Lines from Hubto to Models */}
                    <div className="flex-1 relative h-[140px] w-[60px]">
                      <div className="absolute top-[10%] left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-blue-400/50 to-transparent overflow-hidden">
                        <motion.div className="w-1/2 h-full bg-gradient-to-r from-transparent to-blue-300" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, ease: 'linear' }} />
                      </div>
                      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-emerald-400/50 to-transparent overflow-hidden">
                        <motion.div className="w-1/2 h-full bg-gradient-to-r from-transparent to-emerald-300" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, ease: 'linear' }} />
                      </div>
                      <div className="absolute bottom-[10%] left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-orange-400/50 to-transparent overflow-hidden">
                        <motion.div className="w-1/2 h-full bg-gradient-to-r from-transparent to-orange-300" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, delay: 1.1, repeat: Infinity, ease: 'linear' }} />
                      </div>
                    </div>

                    {/* Destination Models */}
                    <div className="flex flex-col gap-4 z-10 shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden p-2.5">
                        <img src="https://i.postimg.cc/W4CZ4NtV/Vector.png" alt="Claude" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden p-2.5">
                        <img src="https://i.postimg.cc/k4QSZn3W/white-chatgpt-logo-svgstack-com-36921776760120.png" alt="GPT" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden p-2.5">
                        <img src="https://i.postimg.cc/hjWxpXwS/gemini-logo-svgstack-com-37141776760072.png" alt="Gemini" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <FeatureCard
              title={t.features.f2Title}
              description={t.features.f2Desc}
              linkText={t.features.link2}
              linkTo="https://docs.hubto.ai/zh-Hant"
              external
              className="h-full"
              image={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] pointer-events-none">
                  <div className="relative space-y-4">
                    {/* Main Channel */}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                          <span className="text-sm font-medium text-emerald-100">Main Channel</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400/80">Active</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                          <div className="h-full w-[45%] bg-emerald-500 rounded-full" />
                        </div>
                        <span className="text-[10px] text-emerald-400/60">45%</span>
                      </div>
                    </div>

                    {/* Arrow/Switch Icon */}
                    <div className="absolute left-[20px] top-[50%] -translate-y-1/2 h-8 w-[1px] border-l-2 border-dashed border-white/20" />
                    
                    {/* Backup Channel */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                          <span className="text-sm font-medium text-zinc-300">Backup Channel 1</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-500">Standby</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                          <div className="h-full w-[0%] bg-zinc-500 rounded-full" />
                        </div>
                        <span className="text-[10px] text-zinc-500">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <FeatureCard
              title={t.features.f3Title}
              description={t.features.f3Desc}
              linkText={t.features.link3}
              linkTo="/pricing"
              className="h-full"
              image={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] flex justify-center pointer-events-none scale-[0.7] origin-center">
                  <div className="w-full rounded-2xl border border-white/10 bg-[#141415] shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                      <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Available Balance</div>
                      <div className="text-2xl font-semibold text-white tracking-tight">$1,250.00</div>
                    </div>
                    <div className="p-3 bg-black/20 flex-1 space-y-2">
                      <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00A1E9]/20 text-[#00A1E9]">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h4v2h-4v4h-2v-4H7V9h4V7z"/></svg>
                          </div>
                          <span className="text-[11px] text-white/80">Alipay</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">+$500</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#26A17B]/20 text-[#26A17B]">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
                          </div>
                          <span className="text-[11px] text-white/80">USDT</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">+$250</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/20 text-violet-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                          </div>
                          <span className="text-[11px] text-white/80">Credit Card</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">+$500</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <FeatureCard
              title={t.features.f4Title}
              description={t.features.f4Desc}
              linkText={t.features.link4}
              linkTo="https://docs.hubto.ai/zh-Hant"
              external
              className="h-full"
              image={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] pointer-events-none scale-[0.7] origin-center">
                  <div className="rounded-2xl border border-white/10 bg-[#161618] p-4 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-white/80">Overview</span>
                      <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">7D</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-2">
                        <div className="text-[9px] text-white/40 mb-1">Requests</div>
                        <div className="text-sm font-semibold text-white">1.2M</div>
                        <div className="text-[9px] text-emerald-400 mt-0.5">↑ 12.5%</div>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/5 p-2">
                        <div className="text-[9px] text-white/40 mb-1">Cost</div>
                        <div className="text-sm font-semibold text-white">$342.5</div>
                        <div className="text-[9px] text-emerald-400 mt-0.5">↑ 8.2%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-medium text-white/50 mb-1.5">Distribution</div>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex justify-between text-[9px] text-white/70 mb-1">
                            <span>Claude</span>
                            <span>45%</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[45%] bg-orange-400 rounded-full" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] text-white/70 mb-1">
                            <span>GPT-4o</span>
                            <span>35%</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[35%] bg-emerald-400 rounded-full" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] text-white/70 mb-1">
                            <span>Gemini</span>
                            <span>20%</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[20%] bg-blue-400 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="relative z-10 w-full bg-transparent px-6 pb-28 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-left text-3xl font-semibold tracking-tight text-white md:text-5xl" style={{ fontSize: '32px' }}>
              {t.features.compareTitle || '為什麼選擇 Hubto？'}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[900px] rounded-2xl border border-white/10 bg-[#1e1e20]/40 backdrop-blur-md overflow-hidden">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="bg-white/5 border-b border-white/10 text-white font-medium">
                  <tr>
                    <th className="p-5 w-[15%]">項目</th>
                    <th className="p-5 w-[20%] text-violet-400">HubTo</th>
                    <th className="p-5">OpenRouter</th>
                    <th className="p-5">矽基流動</th>
                    <th className="p-5">国内低價中轉</th>
                    <th className="p-5">官方套餐</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white/90">穩定可達</td>
                    <td className="p-5 font-medium text-violet-300 bg-violet-500/5">針對中國大陸與香港設計，Claude Code、GPT、Gemini 可穩定接入</td>
                    <td className="p-5">海外平台，不專門解決受限區域可達性</td>
                    <td className="p-5">以國內場景為主</td>
                    <td className="p-5">可用性不穩，依賴單一通道</td>
                    <td className="p-5">高封號風險</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white/90">多路穩援</td>
                    <td className="p-5 font-medium text-violet-300 bg-violet-500/5">多供應商通道、備援容量、自動切換</td>
                    <td className="p-5">聚合能力強，但非受限區域優化</td>
                    <td className="p-5">偏推理效能，不以跨區穩定性為核心</td>
                    <td className="p-5">通道品質不透明，穩定性參差</td>
                    <td className="p-5">接入門檻高</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white/90">付款無阻</td>
                    <td className="p-5 font-medium text-violet-300 bg-violet-500/5">支付寶、USDT、信用卡直付</td>
                    <td className="p-5">不支援人民幣付款</td>
                    <td className="p-5">本地付款方便</td>
                    <td className="p-5">視平台而定</td>
                    <td className="p-5">開通與付款條件較高</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white/90">成本可視</td>
                    <td className="p-5 font-medium text-violet-300 bg-violet-500/5">用量、Token、模型消耗清楚追蹤</td>
                    <td className="p-5">費用溢價</td>
                    <td className="p-5">費用溢價</td>
                    <td className="p-5">常見黑盒計價</td>
                    <td className="p-5">額度限制大</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white/90">頂級模型覆蓋</td>
                    <td className="p-5 font-medium text-violet-300 bg-violet-500/5">Claude、GPT、Gemini、GLM 等主流模型</td>
                    <td className="p-5">模型很多，但接入體驗不一定適合大陸 / 香港</td>
                    <td className="p-5">只支持國產模型</td>
                    <td className="p-5">覆蓋依供應波動</td>
                    <td className="p-5">官方能力完整，但使用限制多</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white/90">更適合誰</td>
                    <td className="p-5 font-medium text-violet-300 bg-violet-500/5">中國大陸 / 香港開發者與小團隊</td>
                    <td className="p-5">海外多模型探索用戶</td>
                    <td className="p-5">本地推理需求</td>
                    <td className="p-5">只追求低價的短期用戶</td>
                    <td className="p-5">能承擔高風險、高門檻與配額限制的用戶</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <ModelsShowcase />
      <AgentCLIShowcase />
    </>
  );
}