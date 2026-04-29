import { useLanguage } from '../lib/i18n';
import { Navbar } from '../components/Navbar';
import { MODELS } from '../data/models';
import { ArrowLeft, Brain, Zap } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-white/50" />
          <span className="text-[15px] font-medium text-white/70">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-[16px]">
              {i < Math.ceil(value / 20) ? (
                <span style={{ color: THEME }}>🧠</span>
              ) : (
                <span className="opacity-20">🧠</span>
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: THEME }}
        />
      </div>
    </div>
  );
}

export function ModelDetailPage({ id }: { id: string }) {
  const { t, lang } = useLanguage();
  const model = MODELS.find(m => m.id === id);

  if (!model) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
          <Navbar />
        </div>
        <div className="relative pt-32 pb-24 px-6 max-w-[1200px] mx-auto z-10 text-center">
          <h1 className="text-[24px] font-semibold mb-4">Model not found</h1>
          <Link to="/models" className="text-white/50 hover:text-white transition-colors">
            ← {t.modelsPage.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(price < 1 ? 2 : 2)}`;
  };

  const formatContext = (context: number) => {
    if (context >= 1000000) {
      return `${(context / 1000000).toFixed(context % 1000000 === 0 ? 0 : 1)}M`;
    }
    return `${(context / 1000).toFixed(0)}K`;
  };

  const formatMaxOutput = (output: number) => {
    if (output >= 1000000) {
      return `${(output / 1000000).toFixed(output % 1000000 === 0 ? 0 : 1)}M`;
    }
    return `${(output / 1000).toFixed(0)}K`;
  };

  const creditPrice = modelCreditPrices[model.id] || 0;
  const priceScore = Math.round((creditPrice / opus47Price) * 100);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="relative pt-32 pb-24 px-6 max-w-[1200px] mx-auto z-10">
        {/* Back Link */}
        <Link to="/models" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.modelsPage.backToList}
        </Link>

        {/* Model Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <img src={model.providerLogo} alt={`${model.providerLabel} logo`} className="w-6 h-6 object-contain" />
            <span className="text-[12px] font-medium text-white/40 uppercase tracking-wider">{model.providerLabel}</span>
          </div>
          <h1 className="text-[32px] font-semibold text-white leading-tight mb-4">{model.displayName}</h1>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {model.features.map((feature, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium bg-white/10 text-white/70">
                {feature.includes('推理') && <Brain className="w-4 h-4" />}
                {feature}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-[15px] text-white/60 leading-relaxed max-w-3xl">{model.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5">
            <div className="text-[12px] text-white/40 mb-2">{t.models.card.inputPrice}</div>
            <div className="text-[20px] font-semibold text-white">{formatPrice(model.inputPrice)}<span className="text-[12px] text-white/40 ml-1">/M</span></div>
          </div>
          <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5">
            <div className="text-[12px] text-white/40 mb-2">{t.models.card.outputPrice}</div>
            <div className="text-[20px] font-semibold text-white">{formatPrice(model.outputPrice)}<span className="text-[12px] text-white/40 ml-1">/M</span></div>
          </div>
          <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5">
            <div className="text-[12px] text-white/40 mb-2">{t.models.card.context}</div>
            <div className="text-[20px] font-semibold text-white">{formatContext(model.contextWindow)}</div>
          </div>
          <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5">
            <div className="text-[12px] text-white/40 mb-2">{t.models.card.maxOutput}</div>
            <div className="text-[20px] font-semibold text-white">{formatMaxOutput(model.maxOutput)}</div>
          </div>
        </div>

        {/* Progress Bars Section */}
        <div className="rounded-[20px] bg-[#1a1a1e] border border-white/10 p-8 lg:p-10">
          <h2 className="text-[20px] font-semibold text-white mb-8">{t.modelsPage.performanceMetrics}</h2>
          <div className="space-y-8">
            <ProgressBar value={model.capabilityScore} label={t.modelsPage.capability} />
            <ProgressBar value={model.speedScore} label={t.modelsPage.speed} />
            <ProgressBar value={priceScore} label={t.modelsPage.price} />
          </div>
        </div>
      </div>

      <footer className="relative w-full py-10 text-center text-sm text-white/40 z-10">
        Provided by Passto Technology Limited
      </footer>
    </div>
  );
}
