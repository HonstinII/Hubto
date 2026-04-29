import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh-TW' | 'zh-CN' | 'en';

type Translations = {
  [key in Language]: {
    nav: {
      tryNow: string;
      login: string;
      logout: string;
      models: string;
      pricing: string;
      docs: string;
    };
    hero: {
      badge: string;
      title1: string;
      title2: string;
      desc: string;
      placeholder: string;
      scroll: string;
      getApiKey: string;
      viewDocs: string;
      dailyQuota: string;
      quotaRemaining: string;
      quotaUsed: string;
    };
    models: {
      title: string;
      desc: string;
      card: {
        context: string;
        inputType: string;
        inputPrice: string;
        outputType: string;
        outputPrice: string;
        maxOutput: string;
      };
    };
    agentCLI: {
      title: string;
      viewAll: string;
      hermesDesc: string;
      openClawDesc: string;
      claudeCodeDesc: string;
      codeXDesc: string;
    };
    features: {
      title: string;
      compareTitle?: string;
      desc: string;
      f1Badge: string;
      f1Title: string;
      f1Desc: ReactNode;
      f2Badge: string;
      f2Title: string;
      f2Desc: string;
      f3Badge: string;
      f3Title: string;
      f3Desc: string;
      f4Badge: string;
      f4Title: string;
      f4Desc: string;
      link1: string;
      link2: string;
      link3: string;
      link4: string;
      virtualKey: string;
      realKey: string;
    };
    cta: {
      title: string;
      viewAll: string;
      desc: string;
      button: string;
    };
    footer: {
      rights: string;
    };
    pricing: {
      title: string;
      plansTitle: string;
      boostTitle: string;
      btnUpgradeGo: string;
      btnUpgradePlus: string;
      btnUpgradePro: string;
      btnUpgradeUltra: string;
      popular: string;
      month: string;
      usageDesc: string;
      tableBoost: string;
      boostDesc: string;
      boostCredits: string;
      goCredits: string;
      plusCredits: string;
      proCredits: string;
      ultraCredits: string;
      officialComparison: {
        go: string;
        plus: string;
        pro: string;
        ultra: string;
      };
      canUseBoost: string;
      teamTitle: string;
      teamFeature1: string;
      teamFeature2: string;
      teamFeature3: string;
      teamFeature4: string;
      teamFeature5: string;
      teamFeature6: string;
      teamBtnContact: string;
      teamBtnSubscribe: string;
    };
    modelsPage: {
      title: string;
      description: string;
      viewAll: string;
      sortByCapability: string;
      sortByPrice: string;
      sortBySpeed: string;
      showing: string;
      models: string;
      noResults: string;
      backToList: string;
      performanceMetrics: string;
      capability: string;
      speed: string;
      price: string;
      pricePerformance: string;
      capabilities: string;
      reasoning: string;
      imageUnderstanding: string;
      codeAbility: string;
      chat: string;
      supported: string;
      notSupported: string;
    };
  }
};

const translations: Translations = {
  'zh-TW': {
    nav: { tryNow: '立即試用', login: '登入', logout: '登出', models: '模型中心', pricing: '套餐定價', docs: '文檔博客' },
    hero: {
      badge: '新一代 AI 聚合網關',
      title1: '穩定，才是真正的可用',
      title2: '',
      desc: '不只解決能不能接入，更解決能不能持續使用。讓中國大陸與香港開發者更穩定地使用全球主流 AI 模型。',
      placeholder: '立即試用Hubto API...',
      scroll: '滑動查看更多',
      getApiKey: '獲取 API Key',
      viewDocs: '查看文檔',
      dailyQuota: '每日額度',
      quotaRemaining: '剩餘',
      quotaUsed: '已使用',
    },
    models: {
      title: '支援模型',
      desc: '',
      card: {
        context: '上下文',
        inputType: '輸入類型',
        inputPrice: '輸入',
        outputType: '輸出類型',
        outputPrice: '輸出',
        maxOutput: '最大輸出'
      }
    },
    agentCLI: {
      title: '支援 Agent CLI',
      viewAll: '查看全部',
      hermesDesc: '與您共同成長的自主代理',
      openClawDesc: '開源的網頁端代理框架',
      claudeCodeDesc: 'Anthropic 出品的代理編程助手',
      codeXDesc: '強大的 AI 編程與自動化能力'
    },
    features: {
      title: '我們的優勢',
      compareTitle: '為什麼選擇 HubTo？',
      desc: '',
      f1Badge: '聚合接入',
      f1Title: '穩定可達',
      f1Desc: '在中國大陸與香港，穩定接入 Claude Code、GPT、Gemini 等頂級模型。突破區域限制，无需配置VPN KYC 手机号，直接開始開發。',
      f2Badge: '質量保證',
      f2Title: '突破限額',
      f2Desc: '多通道與備援容量，遇到五小时额度限制、異常或區域波動時自動切換，讓關鍵任務不中斷。',
      f2Link: '了解更多',
      f2LinkTo: 'https://docs.hubto.ai/zh-Hant',
      f3Badge: '支付渠道',
      f3Title: '付款無阻',
      f3Desc: '支援支付寶、USDT 與信用卡直付，從個人開發者到小團隊，都能快速完成充值與結算。',
      f4Badge: '數據看板',
      f4Title: '成本可視',
      f4Desc: '每次請求、每種模型與每筆 Credit 消耗清楚可追蹤，方便控費、對帳與持續優化。',
      link1: '瀏覽全部',
      link2: '了解更多',
      link3: '了解更多',
      link4: '查看文檔',
      f4LinkTo: 'https://docs.hubto.ai/zh-Hant',
      virtualKey: '虛擬密鑰',
      realKey: '真實密鑰'
    },
    cta: {
      title: '準備好開始構建了嗎？',
      viewAll: '查看全部',
      desc: '加入成千上萬透過 HubTo 路由其 AI 請求的開發者行列。',
      button: '獲取 API Key'
    },
    footer: { rights: '版權所有。' },
    pricing: {
      title: '套餐定價',
      plansTitle: '套餐檔位',
      boostTitle: '增值包充值',
      btnUpgradeGo: '升級至 Go',
      btnUpgradePlus: '升級至 Plus',
      btnUpgradePro: '升級至 Pro',
      btnUpgradeUltra: '升級至 Ultra',
      popular: '最多人選擇',
      month: '月',
      usageDesc: '補充當月額度，長期有效，不限期',
      tableBoost: '增值包',
      boostDesc: '一次性購買，永久有效',
      boostCredits: 'Credits',
      goCredits: '800 Credits / 月',
      plusCredits: '2,100 Credits / 月',
      proCredits: '5,500 Credits / 月',
      ultraCredits: '11,500 Credits / 月',
      officialComparison: {
        go: '相比官方多 2x 使用額度',
        plus: '相比官方多 2.1x 使用額度',
        pro: '相比官方多 2.2x 使用額度',
        ultra: '相比官方多 2.3x 使用額度',
      },
      canUseBoost: '可靈活充值Credit',
      teamTitle: '為團隊賦能的 Hubto 企業版',
      teamFeature1: '多模型靈活切換：支援多模型按需切換，統一扣費。',
      teamFeature2: '兼容多種工具：適配多種主流編程工具及熱門 Agent 工具。',
      teamFeature3: '多檔位套餐：提供多檔位套餐，匹配不同使用強度。',
      teamFeature4: '預算可控：按包月形式訂閱，保證預算可控。',
      teamFeature5: '平穩運行：多租戶隔離架構，調用高峰期間不排隊。',
      teamFeature6: '數據安全：企業安全和隱私控制。',
      teamBtnContact: '聯絡銷售',
      officialComparisonNote: '注：相比"官方多 2x 使用額度"意思為：同等金額消費下對比Hubto 使用額度可獲得直接調用官方 API， 最高 2x 的使用額度體驗。',
      teamBtnSubscribe: '為團隊訂閱'
    },
    modelsPage: {
      title: '模型中心',
      description: '探索 Hubto 支援的全部 AI 模型，按能力、速度和價格進行比較，找到最適合您需求的模型。',
      viewAll: '查看全部',
      sortByCapability: '能力',
      sortByPrice: '价格',
      sortBySpeed: '速度',
      showing: '顯示',
      models: '個模型',
      noResults: '沒有找到符合條件的模型',
      backToList: '返回模型列表',
      performanceMetrics: '性能評估',
      capability: '能力',
      speed: '速度',
      price: '價格',
      pricePerformance: '性價比',
      capabilities: '功能支援',
      reasoning: '推理能力',
      imageUnderstanding: '圖片理解',
      codeAbility: '代碼能力',
      chat: '對話能力',
      supported: '支援',
      notSupported: '不支援'
    }
  },
  'zh-CN': {
    nav: { tryNow: '立即试用', login: '登录', logout: '登出', models: '模型中心', pricing: '套餐定价', docs: '文档博客' },
    hero: {
      badge: '新一代 AI 聚合网关',
      title1: '稳定，才是真正的可用',
      title2: '',
      desc: '不只解决能不能接入，更解决能不能持续使用。让中国大陆与香港开发者更稳定地使用全球主流 AI 模型。',
      placeholder: '立即试用Hubto API...',
      scroll: '滑动查看更多',
      getApiKey: '获取 API Key',
      viewDocs: '查看文档',
      dailyQuota: '每日额度',
      quotaRemaining: '剩余',
      quotaUsed: '已使用',
    },
    models: {
      title: '支持模型',
      desc: '',
      card: {
        context: '上下文',
        inputType: '输入类型',
        inputPrice: '输入',
        outputType: '输出类型',
        outputPrice: '输出',
        maxOutput: '最大输出'
      }
    },
    agentCLI: {
      title: '支持 Agent CLI',
      viewAll: '查看全部',
      hermesDesc: '与您共同成长的自主代理',
      openClawDesc: '开源的网页端代理框架',
      claudeCodeDesc: 'Anthropic 出品的代理编程助手',
      codeXDesc: '强大的 AI 编程与自动化能力'
    },
    features: {
      title: '我们的优势',
      compareTitle: '为什么选择 Hubto？',
      desc: '',
      f1Badge: '聚合接入',
      f1Title: '稳定可达',
      f1Desc: '在中国大陆与香港，稳定接入 Claude Code、GPT、Gemini 等顶级模型。突破区域限制，无需配置VPN KYC 手机号，直接开始开发。',
      f2Badge: '质量保证',
      f2Title: '突破限额',
      f2Desc: '多通道与备援容量，遇到五小时额度限制、异常或区域波动时自动切换，让关键任务不中断。',
      f3Badge: '支付渠道',
      f3Title: '付款无阻',
      f3Desc: '支持支付宝、USDT 与信用卡直付，从个人开发者到小团队，都能快速完成充值与结算。',
      f4Badge: '数据看板',
      f4Title: '成本可视',
      f4Desc: '每次请求、每种模型与每笔 Token 消耗清楚可追踪，方便控费、对账与持续优化。',
      link1: '浏览全部',
      link2: '了解更多',
      link3: '了解更多',
      link4: '查看文档',
      virtualKey: '虚拟密钥',
      realKey: '真实密钥'
    },
    cta: {
      title: '准备好开始构建了吗？',
      viewAll: '查看全部',
      desc: '加入成千上万透过 HubTo 路由其 AI 请求的开发者行列。',
      button: '获取 API Key'
    },
    footer: { rights: '版权所有。' },
    pricing: {
      title: '套餐定价',
      plansTitle: '套餐档位',
      boostTitle: '增值包充值',
      btnUpgradeGo: '升级至 Go',
      btnUpgradePlus: '升级至 Plus',
      btnUpgradePro: '升级至 Pro',
      btnUpgradeUltra: '升级至 Ultra',
      popular: '最多人选择',
      month: '月',
      usageDesc: '补充当月额度，长期有效，不限期',
      tableBoost: '增值包',
      boostDesc: '一次性购买，永久有效',
      boostCredits: 'Credits',
      goCredits: '800 Credits / 月',
      plusCredits: '2,100 Credits / 月',
      proCredits: '5,500 Credits / 月',
      ultraCredits: '11,500 Credits / 月',
      officialComparison: {
        go: '相比官方多 2x 使用额度',
        plus: '相比官方多 2.1x 使用额度',
        pro: '相比官方多 2.2x 使用额度',
        ultra: '相比官方多 2.3x 使用额度',
      },
      canUseBoost: '可灵活充值Credit',
      teamTitle: '为团队赋能的 Hubto 企业版',
      teamFeature1: '多模型灵活切换：支持多模型按需切换，统一扣费。',
      teamFeature2: '兼容多种工具：适配多种主流编程工具及热门 Agent 工具。',
      teamFeature3: '多档位套餐：提供多档位套餐，匹配不同使用强度。',
      teamFeature4: '预算可控：按包月形式订阅，保证预算可控。',
      teamFeature5: '平稳运行：多租户隔离架构，调用高峰期间不排队。',
      teamFeature6: '数据安全：企业安全和隐私控制。',
      teamBtnContact: '联系销售',
      teamBtnSubscribe: '为团队订阅'
    },
    officialComparisonNote: '注：套餐说明中的相比"官方多 2x 使用额度"意思为：直接调用官方 API，同等金额消费下对比 Hubto 使用额度可获得最高 2x 的使用额度体验。',
    modelsPage: {
      title: '模型中心',
      viewAll: '查看全部',
      sortByCapability: '能力',
      sortByPrice: '价格',
      sortBySpeed: '速度',
      showing: '显示',
      models: '个模型',
      noResults: '没有找到符合条件的模型',
      backToList: '返回模型列表',
      performanceMetrics: '性能评估',
      capability: '能力',
      speed: '速度',
      price: '价格',
      pricePerformance: '性价比',
      capabilities: '功能支持',
      reasoning: '推理能力',
      imageUnderstanding: '图片理解',
      codeAbility: '代码能力',
      chat: '对话能力',
      supported: '支持',
      notSupported: '不支持'
    }
  },
  'en': {
    nav: { tryNow: 'Try now', login: 'Login', logout: 'Logout', models: 'Models', pricing: 'Pricing', docs: 'Docs & Blog' },
    hero: {
      badge: 'The Next-Gen AI Gateway',
      title1: 'Stability is True Usability',
      title2: '',
      desc: 'Not just solving access, but ensuring sustained usage. HubTo enables developers in Mainland China and Hong Kong to stably use mainstream global AI models.',
      placeholder: 'Try Hubto API now...',
      scroll: 'Scroll to learn more',
      getApiKey: 'Get API Key',
      viewDocs: 'View Docs',
      dailyQuota: 'Daily Quota',
      quotaRemaining: 'Remaining',
      quotaUsed: 'Used',
    },
    models: {
      title: "Supported Models",
      desc: '',
      card: {
        context: 'Context',
        inputType: 'Input Type',
        inputPrice: 'Input',
        outputType: 'Output Type',
        outputPrice: 'Output',
        maxOutput: 'Max Output'
      }
    },
    agentCLI: {
      title: 'Supported Agent CLIs',
      viewAll: 'View all',
      hermesDesc: 'An autonomous agent that grows with you',
      openClawDesc: 'Open source web-based agent framework',
      claudeCodeDesc: 'Agentic coding assistant by Anthropic',
      codeXDesc: 'Advanced AI coding capabilities'
    },
    features: {
      title: 'Our Advantages',
      compareTitle: 'Why Hubto?',
      desc: '',
      f1Badge: 'Unified Access',
      f1Title: 'Stable Access',
      f1Desc: 'Stable access to top models like Claude Code, GPT, Gemini in Mainland China and HK. Break through regional restrictions, no VPN/KYC/Phone needed, start developing immediately.',
      f2Badge: 'Quality Assurance',
      f2Title: 'Multi-Channel Fallback',
      f2Desc: 'Multi-channel with backup capacity. Automatically switches when encountering 5-hour quota limits, anomalies, or regional fluctuations, keeping critical tasks uninterrupted.',
      f3Badge: 'Payment Channels',
      f3Title: 'Frictionless Payments',
      f3Desc: 'Supports Alipay, USDT, and direct credit card payments. From individual developers to small teams, top-ups and settlements can be completed quickly.',
      f4Badge: 'Data Dashboard',
      f4Title: 'Visible Costs',
      f4Desc: 'Every request, model type, and Token consumption is clearly trackable, facilitating cost control, reconciliation, and continuous optimization.',
      link1: 'Browse all',
      link2: 'Learn more',
      link3: 'Learn more',
      link4: 'View docs',
      virtualKey: 'Virtual Key',
      realKey: 'Real Key'
    },
    cta: {
      title: 'Ready to Start Building?',
      viewAll: 'View all',
      desc: 'Join thousands of developers routing their AI requests through HubTo.',
      button: 'Get API Key'
    },
    footer: { rights: 'All rights reserved.' },
    pricing: {
      title: 'Pricing',
      plansTitle: 'Subscription Tiers',
      boostTitle: 'Boost Packages',
      btnUpgradeGo: 'Upgrade to Go',
      btnUpgradePlus: 'Upgrade to Plus',
      btnUpgradePro: 'Upgrade to Pro',
      btnUpgradeUltra: 'Upgrade to Ultra',
      popular: 'Most Popular',
      month: 'mo',
      usageDesc: 'Supplements monthly quota, permanently valid',
      tableBoost: 'Boost Package',
      boostDesc: 'One-time purchase, permanent',
      boostCredits: 'Credits',
      goCredits: '800 Credits / mo',
      plusCredits: '2,100 Credits / mo',
      proCredits: '5,500 Credits / mo',
      ultraCredits: '11,500 Credits / mo',
      officialComparison: {
        go: '2x more usage than official',
        plus: '2.1x more usage than official',
        pro: '2.2x more usage than official',
        ultra: '2.3x more usage than official',
      },
      canUseBoost: 'Flexible credit recharge',
      teamTitle: 'Empower your team with Hubto for enterprise',
      teamFeature1: 'Flexible model switching: Support on-demand model switching with unified billing.',
      teamFeature2: 'Compatible with various tools: Works with mainstream programming and popular Agent tools.',
      teamFeature3: 'Multiple plan tiers: Multiple subscription tiers matching different usage intensity.',
      teamFeature4: 'Budget control: Monthly subscription for predictable budget management.',
      teamFeature5: 'Smooth operation: Multi-tenant isolation architecture, no queuing during peak usage.',
      teamFeature6: 'Data security: Enterprise-level security and privacy controls.',
      teamBtnContact: 'Contact sales',
      teamBtnSubscribe: 'Subscribe your team',
      officialComparisonNote: 'Note: "2x more usage than official" in the plan descriptions means that compared to directly calling official APIs, you can get up to 2x more usage experience with Hubto at the same cost.',
    },
    modelsPage: {
      title: 'Model Center',
      description: 'Explore all AI models supported by Hubto, compare by capability, speed and price, and find the best model for your needs.',
      viewAll: 'View all',
      sortByCapability: 'Capability',
      sortByPrice: 'Price Performance',
      sortBySpeed: 'Speed',
      showing: 'Showing',
      models: 'models',
      noResults: 'No models found matching your criteria',
      backToList: 'Back to model list',
      performanceMetrics: 'Performance Metrics',
      capability: 'Capability',
      speed: 'Speed',
      price: 'Price',
      pricePerformance: 'Price Performance',
      capabilities: 'Capabilities',
      reasoning: 'Reasoning',
      imageUnderstanding: 'Image Understanding',
      codeAbility: 'Code Ability',
      chat: 'Chat',
      supported: 'Supported',
      notSupported: 'Not Supported'
    }
  }
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh-TW');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
