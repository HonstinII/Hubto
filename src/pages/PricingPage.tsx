import { useLanguage } from '../lib/i18n';
import { Navbar } from '../components/Navbar';
import { Check } from 'lucide-react';

const THEME = '#9d82f5';

const plans = [
  { name: 'Go', price: 8, creditsKey: 'goCredits', btnKey: 'btnUpgradeGo', canBoost: false, popular: false },
  { name: 'Plus', price: 20, creditsKey: 'plusCredits', btnKey: 'btnUpgradePlus', canBoost: true, popular: false },
  { name: 'Pro', price: 50, creditsKey: 'proCredits', btnKey: 'btnUpgradePro', canBoost: true, popular: true },
  { name: 'Ultra', price: 100, creditsKey: 'ultraCredits', btnKey: 'btnUpgradeUltra', canBoost: true, popular: false },
];

export function PricingPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <div className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="relative pt-32 pb-24 px-6 max-w-[1200px] mx-auto z-10">
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-normal tracking-tight mb-4 text-center">
            {t.pricing.title}
          </h1>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[16px] bg-[#1a1a1e] p-6 lg:p-7 flex flex-col h-full relative ${
                plan.popular ? 'ring-2 ring-[#9d82f5]/40' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-white text-[11px] rounded-full font-semibold" style={{ backgroundColor: THEME }}>
                    {t.pricing.popular}
                  </span>
                </div>
              )}
              <h3 className="text-[15px] font-medium text-white/70 uppercase tracking-wider mb-3">{plan.name}</h3>
              <div className="border-b border-white/10 mb-5" />
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[36px] font-semibold">${plan.price}</span>
              </div>
              <p className="text-[14px] text-white/50 mb-6">{t.lang === 'en' ? 'per month' : t.pricing.month}</p>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Check className="w-[16px] h-[16px] shrink-0" style={{ color: THEME }} />
                  <span className="text-[14px] text-white/70">{t.pricing[plan.creditsKey]}</span>
                </div>
                {plan.canBoost && (
                  <div className="flex items-center gap-2.5">
                    <Check className="w-[16px] h-[16px] shrink-0" style={{ color: THEME }} />
                    <span className="text-[14px] text-white/70">{t.pricing.canUseBoost}</span>
                  </div>
                )}
              </div>

              <button
                className={`w-full mt-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  plan.popular
                    ? 'text-white'
                    : 'border border-white/20 text-white/80 hover:bg-white/10'
                }`}
                style={plan.popular ? { backgroundColor: THEME } : {}}
              >
                {t.pricing[plan.btnKey]}
              </button>
            </div>
          ))}
        </div>

        {/* Boost Packages */}
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[22px] font-normal tracking-tight">
              {t.pricing.boostTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {[
              { name: 'Boost 5', price: 5, credits: 500 },
              { name: 'Boost 10', price: 10, credits: 1030 },
              { name: 'Boost 20', price: 20, credits: 2100 },
            ].map((boost, idx) => (
              <div
                key={boost.name}
                className={`rounded-[16px] bg-[#1a1a1e] p-6 lg:p-7 flex flex-col h-full relative ${
                  idx === 2 ? 'ring-2 ring-[#9d82f5]/40' : ''
                }`}
              >
                {idx === 2 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-white text-[11px] rounded-full font-semibold" style={{ backgroundColor: THEME }}>
                      {t.pricing.popular}
                    </span>
                  </div>
                )}
                <h3 className="text-[15px] font-medium text-white/70 mb-3">{boost.name}</h3>
                <div className="border-b border-white/10 mb-5" />
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-sm text-white/50">$</span>
                  <span className="text-[36px] font-semibold leading-none">{boost.price}</span>
                </div>
                <p className="text-[14px] text-white/50 mb-6">USD</p>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-[16px] h-[16px] shrink-0" style={{ color: THEME }} />
                    <span className="text-[14px] text-white/70">{t.pricing.boostCredits}: {boost.credits.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  className={`w-full mt-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    idx === 2
                      ? 'text-white'
                      : 'border border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                  style={idx === 2 ? { backgroundColor: THEME } : {}}
                >
                  {t.lang === 'en' ? 'Purchase' : t.lang === 'zh-TW' ? '購買' : '购买'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer className="relative w-full py-10 text-center text-sm text-white/40 z-10">
        Provided by Passto Technology Limited
      </footer>

    </div>
  );
}
