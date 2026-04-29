import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../lib/i18n';
import { Navbar } from '../components/Navbar';
import { ModelCard } from '../components/ModelCard';
import { MODELS, PROVIDERS, FEATURE_FILTERS } from '../data/models';
import { ChevronDown, ArrowUpDown, Brain, Image, Search, X } from 'lucide-react';

const THEME = '#9d82f5';

type SortOption = 'capability' | 'price' | 'speed';

const opus47Price = 1650;

const modelCreditPrices: Record<string, number> = {
  'claude-opus-4-6': 1650,
  'claude-sonnet-4-6': 990,
  'claude-haiku-4-6': 324,
  'claude-haiku-4-5': 280,
  'gpt-5-4': 963,
  'gpt-5-3-codex': 688,
  'gpt-5-4-mini': 963,
  'gemini-3-1-pro': 770,
  'gemini-3-flash': 193,
  'gemini-3-1-flash-imagen': 144,
  'gemini-3-pro': 850,
  'qwen3-6-plus': 107,
  'qwen3-5-plus': 63,
  'qwen3-coder-next': 45,
  'qwen3-coder-plus': 1200,
  'qwen3-max': 950,
  'glm-5-1': 242,
  'glm-5': 226,
  'glm-4-7': 212,
  'glm-4-6': 202,
  'glm-5-turbo': 180,
  'minimax-m2-7': 85,
  'minimax-m2-5': 85,
  'minimax-image-01': 42,
  'minimax-m2-7-highspeed': 75,
  'minimax-m2-5-highspeed': 75,
  'kimi-k2-5': 202,
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

function getFilterIcon(icon: string) {
  switch (icon) {
    case 'brain':
      return <Brain className="w-4 h-4" />;
    case 'image':
      return <Image className="w-4 h-4" />;
    default:
      return null;
  }
}

export function ModelsPage() {
  const { t } = useLanguage();
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
      if (providerRef.current && !providerRef.current.contains(event.target as Node)) {
        setShowProviderDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedModels = useMemo(() => {
    let filtered = [...MODELS];

    // Filter by search query (fuzzy search on displayName)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(m =>
        m.displayName.toLowerCase().includes(query) ||
        m.providerLabel.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
      );
    }

    // Filter by provider
    if (selectedProvider !== 'all') {
      filtered = filtered.filter(m => m.provider === selectedProvider);
    }

    // Filter by feature (null means show all)
    if (selectedFeature !== null) {
      filtered = filtered.filter(m => m.features.some(f => {
        if (selectedFeature === 'reasoning') return f.includes('推理');
        if (selectedFeature === 'image') return f.includes('图片');
        return false;
      }));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortBy) {
        case 'capability':
          aVal = a.capabilityScore;
          bVal = b.capabilityScore;
          break;
        case 'speed':
          aVal = a.speedScore;
          bVal = b.speedScore;
          break;
        case 'price':
          aVal = modelCreditPrices[a.id] || 0;
          bVal = modelCreditPrices[b.id] || 0;
          break;
        default:
          return 0;
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [selectedProvider, selectedFeature, sortBy, sortOrder, searchQuery]);

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
    setShowSortDropdown(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'capability':
        return t.modelsPage.sortByCapability;
      case 'price':
        return t.modelsPage.sortByPrice;
      case 'speed':
        return t.modelsPage.sortBySpeed;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="relative pt-32 pb-24 px-6 max-w-[1200px] mx-auto z-10">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-normal tracking-tight mb-4">
            {t.modelsPage.title}
          </h1>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Provider Filter */}
          <div className="relative" ref={providerRef}>
            <button
              onClick={() => setShowProviderDropdown(!showProviderDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-white/10 text-sm text-white/70 hover:border-white/20 transition-colors"
            >
              {selectedProvider !== 'all' && (
                <img
                  src={PROVIDERS.find(p => p.value === selectedProvider)?.logo}
                  alt=""
                  className="w-4 h-4 object-contain"
                />
              )}
              <span>{PROVIDERS.find(p => p.value === selectedProvider)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showProviderDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
                {PROVIDERS.map(provider => (
                  <button
                    key={provider.value}
                    onClick={() => {
                      setSelectedProvider(provider.value);
                      setShowProviderDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 rounded-[16px] ${
                      selectedProvider === provider.value
                        ? 'text-white bg-[#212124]'
                        : 'text-white/70 hover:bg-[#212124]'
                    }`}
                  >
                    {provider.logo && (
                      <img src={provider.logo} alt="" className="w-5 h-5 object-contain" />
                    )}
                    {!provider.logo && <span className="w-5 h-5" />}
                    {provider.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feature Filter */}
          <div className="flex flex-wrap gap-2">
            {FEATURE_FILTERS.map(feature => (
              <button
                key={feature.value}
                onClick={() => setSelectedFeature(selectedFeature === feature.value ? null : feature.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  selectedFeature === feature.value
                    ? 'text-white'
                    : 'border border-white/20 text-white/70 hover:bg-white/10'
                }`}
                style={selectedFeature === feature.value ? { backgroundColor: THEME } : {}}
              >
                {getFilterIcon(feature.icon)}
                {feature.label}
              </button>
            ))}
          </div>

          <div className="lg:ml-auto" />

          {/* Search Input - Expands from circle */}
          <div className="relative flex items-center" style={{ flexShrink: 0 }}>
            <div
              className="overflow-hidden rounded-full bg-[#1a1a1e] border border-white/10 transition-all duration-300 ease-out"
              style={{
                width: showSearch ? '256px' : '40px',
                height: '40px',
              }}
            >
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors"
                >
                  <Search className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </button>
              ) : (
                <div className="relative h-full flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setShowSearch(false);
                    }}
                    className="pl-9 pr-8 py-2 w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative ml-2" ref={sortRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-white/10 text-sm text-white/70 hover:border-white/20 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{getSortLabel()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
                {[
                  { value: 'capability' as SortOption, label: t.modelsPage.sortByCapability },
                  { value: 'price' as SortOption, label: t.modelsPage.sortByPrice },
                  { value: 'speed' as SortOption, label: t.modelsPage.sortBySpeed },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors rounded-[16px] ${
                      sortBy === option.value
                        ? 'text-white bg-[#212124]'
                        : 'text-white/70 hover:bg-[#212124]'
                    }`}
                  >
                    {option.label} {sortBy === option.value && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <span className="text-[13px] text-white/40">
            {t.modelsPage.showing} {filteredAndSortedModels.length} {t.modelsPage.models}
          </span>
        </div>

        {/* Models Grid */}
        {filteredAndSortedModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredAndSortedModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40 text-[15px]">{t.modelsPage.noResults}</p>
          </div>
        )}
      </div>

      <footer className="relative w-full py-10 text-center text-sm text-white/40 z-10">
        Provided by Passto Technology Limited
      </footer>
    </div>
  );
}
