import { Model } from '../data/models';
import { useLanguage } from '../lib/i18n';
import { useAuth } from '../lib/AuthContext';
import { ArrowRight, Brain } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const THEME = '#9d82f5';

const opus47Price = 1650;

const mockCreditBalance = 5000;

const modelCreditPrices: Record<string, number> = {
  'claude-opus-4-6': 1650,
  'claude-sonnet-4-6': 990,
  'claude-haiku-4-6': 324,
  'gpt-5-4': 963,
  'gpt-5-3-codex': 688,
  'gpt-5-4-mini': 963,
  'gemini-3-1-pro': 770,
  'gemini-3-flash': 193,
  'gemini-3-1-flash-imagen': 144,
  'qwen3-6-plus': 107,
  'qwen3-5-plus': 63,
  'glm-5-1': 242,
  'glm-5': 226,
  'glm-4-7': 212,
  'glm-4-6': 202,
  'minimax-m2-7': 85,
  'minimax-m2-5': 85,
  'minimax-image-01': 42,
  'kimi-k2-5': 202,
  'claude-haiku-4-5': 280,
  'gemini-3-pro': 850,
  'qwen3-coder-next': 45,
  'qwen3-coder-plus': 1200,
  'qwen3-max': 950,
  'glm-5-turbo': 180,
  'minimax-m2-7-highspeed': 75,
  'minimax-m2-5-highspeed': 75,
  'kimi-k2-6': 190,
  'deepseek-chat-search': 120,
  'deepseek-expert-chat-search': 150,
  'deepseek-expert-reasoner-search': 180,
  'deepseek-reasoner-search': 140,
  'deepseek-vision-chat-search': 130,
  'deepseek-vision-reasoner-search': 160,
  'grok-4-20': 110,
  'grok-4-20-auto': 105,
  'grok-4-20-expert': 130,
  'grok-4-20-non-reasoning': 80,
  'grok-4-20-reasoning': 140,
};

function calculateEstimatedTimes(creditPrice: number): number {
  if (creditPrice <= 0) return 100;
  const raw = mockCreditBalance / creditPrice;
  const rounded = Math.round(raw * 10) / 10;
  return Math.min(Math.max(rounded, 0.7), 100);
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-white/50">{label}</span>
        <span className="text-[13px] font-medium text-white/70">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: THEME }}
        />
      </div>
    </div>
  );
}

function FeatureBadge({ feature }: { feature: string }) {
  let icon = <Brain className="w-3 h-3" />;
  let bgColor = 'bg-purple-500/20';
  let textColor = 'text-purple-300';

  if (feature.includes('图片')) {
    bgColor = 'bg-blue-500/20';
    textColor = 'text-blue-300';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${bgColor} ${textColor}`}>
      {icon}
      {feature}
    </span>
  );
}

export function ModelCard({ model }: { model: Model }) {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();

  const creditPrice = modelCreditPrices[model.id] || 0;
  const priceScore = Math.round((creditPrice / opus47Price) * 100);
  const estimatedTimes = calculateEstimatedTimes(creditPrice);

  return (
    <div className="group rounded-[20px] bg-[#1a1a1e] border border-white/10 p-6 lg:p-7 flex flex-col h-full transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={model.providerLogo} alt={`${model.providerLabel} logo`} className="w-6 h-6 object-contain" />
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{model.providerLabel}</span>
        </div>
        {isLoggedIn ? (
          <div className="relative group/quota shrink-0">
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/70 backdrop-blur-md border border-white/10">
              <svg className="w-4 h-4" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#9d82f5" strokeWidth="3" strokeDasharray="100, 100" strokeDashoffset="0" strokeLinecap="round" />
              </svg>
              <span>{estimatedTimes}</span>
            </div>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/quota:block z-30">
              <div className="w-52 rounded-[12px] bg-[#1a1a1e] border border-white/10 px-3.5 py-3 shadow-xl overflow-hidden">
                <p className="text-[11px] font-medium text-white/70 leading-snug">
                  当前Credit预估可使用该模型：<span className="text-violet-400 font-semibold">{estimatedTimes}</span> 次
                </p>
              </div>
              <div className="absolute top-full right-4 -mt-px">
                <div className="w-2 h-2 bg-[#1a1a1e] border-r border-b border-white/10 transform rotate-45"></div>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/models/$id" params={{ id: model.id }} className="shrink-0">
            <button className="p-2 rounded-full border border-white/20 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>

      <h3 className="text-[17px] font-semibold text-white leading-tight mb-3">{model.displayName}</h3>

      <p className="text-[13px] text-white/50 leading-relaxed mb-5 line-clamp-2">{model.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {model.features.map((feature, index) => (
          <FeatureBadge key={index} feature={feature} />
        ))}
      </div>

      <div className="space-y-4">
        <ProgressBar value={model.capabilityScore} label={t.modelsPage.capability} />
        <ProgressBar value={model.speedScore} label={t.modelsPage.speed} />
        <ProgressBar value={priceScore} label={t.modelsPage.price} />
      </div>
    </div>
  );
}
