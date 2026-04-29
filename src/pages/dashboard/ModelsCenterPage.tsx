import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ArrowUpDown, X, Brain, Image } from 'lucide-react';
import { MODELS, PROVIDERS, FEATURE_FILTERS } from '../../data/models';
import { THEME, mockCreditBalance } from '../../data/mockData';

type SortOption = 'capability' | 'price' | 'speed';

const sortLabels: Record<SortOption, string> = { capability: '能力', price: '價格', speed: '速度' };
const opus47Price = 1650;

function getFilterIcon(icon: string) {
  switch (icon) {
    case 'brain': return <Brain className="w-4 h-4" />;
    case 'image': return <Image className="w-4 h-4" />;
    default: return null;
  }
}

function ModelCardSimple({ model }: { model: typeof MODELS[0] }) {
  const creditPrice = model.creditPrice;
  const priceScore = Math.round((creditPrice / opus47Price) * 100);

  const bars = [
    { label: '能力', value: model.capabilityScore },
    { label: '速度', value: model.speedScore },
    { label: '價格', value: priceScore },
  ];

  return (
    <div className="group rounded-[20px] bg-[#1a1a1e] border border-white/10 p-6 flex flex-col h-full transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={model.providerLogo} alt={model.providerLabel} className="w-6 h-6 object-contain" />
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{model.providerLabel}</span>
        </div>
        <div className="relative group/quota">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/70 border border-white/10">
            <div className="w-4 h-4 rounded-full border-2 border-white/20" style={{ borderColor: THEME }} />
            <span>{Math.round(mockCreditBalance / (creditPrice || 100) * 10) / 10}</span>
          </div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#1a1a1e] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/quota:opacity-100 group-hover/quota:visible transition-all duration-200 z-20 whitespace-nowrap">
            <span className="text-[12px] text-white/70">当前Credit预估可使用该模型：<span className="font-medium" style={{ color: THEME }}>{Math.round(mockCreditBalance / (creditPrice || 100))}</span> 次</span>
          </div>
        </div>
      </div>

      <h3 className="text-[17px] font-semibold text-white leading-tight mb-3">{model.displayName}</h3>
      <p className="text-[13px] text-white/50 leading-relaxed mb-5 line-clamp-2">{model.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {model.features.map((feature, index) => (
          <span key={index} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${feature.includes('图片') ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
            <Brain className="w-3 h-3" />
            {feature}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {bars.map(bar => (
          <div key={bar.label} className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-white/50">{bar.label}</span>
              <span className="text-[13px] font-medium text-white/70">{bar.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${bar.value}%`, backgroundColor: THEME }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModelsCenterPage() {
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('capability');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const providerRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (providerRef.current && !providerRef.current.contains(event.target as Node)) setShowProviderDropdown(false);
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setShowSortDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedModels = useMemo(() => {
    let filtered = [...MODELS];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(m => m.displayName.toLowerCase().includes(q) || m.providerLabel.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    if (selectedProvider !== 'all') filtered = filtered.filter(m => m.provider === selectedProvider);
    if (selectedFeature !== null) {
      filtered = filtered.filter(m => m.features.some(f => {
        if (selectedFeature === 'reasoning') return f.includes('推理');
        if (selectedFeature === 'image') return f.includes('图片');
        return false;
      }));
    }
    filtered.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortBy) {
        case 'capability': aVal = a.capabilityScore; bVal = b.capabilityScore; break;
        case 'speed': aVal = a.speedScore; bVal = b.speedScore; break;
        case 'price': aVal = a.creditPrice; bVal = b.creditPrice; break;
        default: return 0;
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return filtered;
  }, [selectedProvider, selectedFeature, sortBy, sortOrder, searchQuery]);

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    else { setSortBy(option); setSortOrder('desc'); }
    setShowSortDropdown(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative" ref={providerRef}>
          <button onClick={() => setShowProviderDropdown(!showProviderDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-white/10 text-sm text-white/70 hover:border-white/20 transition-colors">
            {selectedProvider !== 'all' && <img src={PROVIDERS.find(p => p.value === selectedProvider)?.logo} alt="" className="w-4 h-4 object-contain" />}
            <span>{PROVIDERS.find(p => p.value === selectedProvider)?.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showProviderDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
              {PROVIDERS.map(provider => (
                <button key={provider.value} onClick={() => { setSelectedProvider(provider.value); setShowProviderDropdown(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 rounded-[16px] ${selectedProvider === provider.value ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}>
                  {provider.logo ? <img src={provider.logo} alt="" className="w-5 h-5 object-contain" /> : <span className="w-5 h-5" />}
                  {provider.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {FEATURE_FILTERS.map(feature => (
            <button key={feature.value} onClick={() => setSelectedFeature(selectedFeature === feature.value ? null : feature.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${selectedFeature === feature.value ? 'text-white' : 'border border-white/20 text-white/70 hover:bg-white/10'}`}
              style={selectedFeature === feature.value ? { backgroundColor: THEME } : {}}>
              {getFilterIcon(feature.icon)}
              {feature.label}
            </button>
          ))}
        </div>

        <div className="lg:ml-auto" />

        <div className="relative flex items-center" style={{ flexShrink: 0 }}>
          <div className="overflow-hidden rounded-full bg-[#1a1a1e] border border-white/10 transition-all duration-300 ease-out" style={{ width: showSearch ? '256px' : '40px', height: '40px' }}>
            {!showSearch ? (
              <button onClick={() => setShowSearch(true)} className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors">
                <Search className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </button>
            ) : (
              <div className="relative h-full flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input type="text" autoFocus placeholder="Search models..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                  className="pl-9 pr-8 py-2 w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative ml-2" ref={sortRef}>
          <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-white/10 text-sm text-white/70 hover:border-white/20 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            <span>{sortLabels[sortBy]}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
              {(Object.entries(sortLabels) as [SortOption, string][]).map(([value, label]) => (
                <button key={value} onClick={() => handleSortChange(value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors rounded-[16px] ${sortBy === value ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}>
                  {label} {sortBy === value && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <span className="text-[13px] text-white/40">顯示 {filteredAndSortedModels.length} 個模型</span>
      </div>

      {filteredAndSortedModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-8">
          {filteredAndSortedModels.map(model => <ModelCardSimple key={model.id} model={model} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-[15px]">沒有符合條件的模型</p>
        </div>
      )}
    </div>
  );
}
