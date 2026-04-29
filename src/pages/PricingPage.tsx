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
      <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="relative pt-32 pb-24 px-6 max-w-[1200px] mx-auto z-10">
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-normal tracking-tight mb-4 text-center">
            {t.pricing.title}
          </h1>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
                <div className="flex items-center gap-2.5">
                  <Check className="w-[16px] h-[16px] shrink-0" style={{ color: THEME }} />
                  <span className="text-[14px] text-white/70">{t.pricing.officialComparison[plan.name.toLowerCase() as keyof typeof t.pricing.officialComparison]}</span>
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

        {/* Team / Enterprise Card */}
        <div 
          className="rounded-[20px] bg-[#1a1a1e] border border-white/10 p-8 lg:p-10 mt-6"
          style={{ 
            height: '324px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#000000'
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/3 flex flex-col gap-5">
              <h2 
                className="text-[22px] font-semibold text-white leading-snug"
                style={{ width: '270px' }}
              >
                {t.pricing.teamTitle}
              </h2>
              <div 
                className="flex flex-wrap gap-3"
                style={{ width: '271px' }}
              >
                <button 
                  className="px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
                  style={{ width: '152px' }}
                >
                  {t.pricing.teamBtnSubscribe}
                </button>
                <button className="px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors">
                  {t.pricing.teamBtnContact}
                </button>
              </div>
            </div>
            <div 
              className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5"
              style={{ height: '240px' }}
            >
              <div className="flex items-start gap-2.5">
                <Check className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: THEME }} />
                <span className="text-[14px] text-white/70">{t.pricing.teamFeature1}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: THEME }} />
                <span className="text-[14px] text-white/70">{t.pricing.teamFeature2}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: THEME }} />
                <span className="text-[14px] text-white/70">{t.pricing.teamFeature3}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: THEME }} />
                <span className="text-[14px] text-white/70">{t.pricing.teamFeature4}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: THEME }} />
                <span className="text-[14px] text-white/70">{t.pricing.teamFeature5}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: THEME }} />
                <span className="text-[14px] text-white/70">{t.pricing.teamFeature6}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Comparison Note */}
        <p className="text-left text-sm text-white/40 mt-6">
          *{t.pricing.officialComparisonNote}
        </p>
      </div>

      <footer className="relative w-full py-10 text-center text-sm text-white/40 z-10">
        Provided by Passto Technology Limited
      </footer>
    </div>
  );
}
