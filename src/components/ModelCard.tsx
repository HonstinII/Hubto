import { Model } from '../data/models';
import { useLanguage } from '../lib/i18n';
import { ArrowRight, Brain } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const THEME = '#9d82f5';

const opus47Price = 1650;

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
};

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

  const creditPrice = modelCreditPrices[model.id] || 0;
  const priceScore = Math.round((creditPrice / opus47Price) * 100);

  return (
    <div className="group rounded-[20px] bg-[#1a1a1e] border border-white/10 p-6 lg:p-7 flex flex-col h-full transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={model.providerLogo} alt={`${model.providerLabel} logo`} className="w-6 h-6 object-contain" />
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{model.providerLabel}</span>
        </div>
        <Link to="/models/$id" params={{ id: model.id }} className="shrink-0">
          <button className="p-2 rounded-full border border-white/20 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
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
