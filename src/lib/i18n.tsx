import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh-TW' | 'zh-CN' | 'en';

type Translations = {
  [key in Language]: {
    nav: {
      tryNow: string;
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
      canUseBoost: string;
    };
  }
};

const translations: Translations = {
  'zh-TW': {
    nav: { tryNow: '立即試用', models: '模型中心', pricing: '套餐定價', docs: '文檔博客' },
    hero: {
      badge: '新一代 AI 聚合網關',
      title1: '穩定，才是真正的可用',
      title2: '',
      desc: '不只解決能不能接入，更解決能不能持續使用。HubTo 讓中國大陸與香港開發者更穩定地使用全球主流 AI 模型。',
      placeholder: '立即試用Hubto API...',
      scroll: '滑動查看更多',
      getApiKey: '獲取 API Key',
      viewDocs: '查看文檔'
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
      hermesDesc: '與您共同成長的自主代理',
      openClawDesc: '開源的網頁端代理框架',
      claudeCodeDesc: 'Anthropic 出品的代理編程助手',
      codeXDesc: '強大的 AI 編程與自動化能力'
    },
    features: {
      title: '我們的優勢',
      compareTitle: '為什麼選擇 Hubto？',
      desc: '',
      f1Badge: '聚合接入',
      f1Title: '穩定可達',
      f1Desc: '在中國大陸與香港，穩定接入 Claude Code、GPT、Gemini 等頂級模型。突破區域限制，无需配置VPN KYC 手机号，直接開始開發。',
      f2Badge: '質量保證',
      f2Title: '多路穩援',
      f2Desc: '多通道與備援容量，遇到五小时额度限制、異常或區域波動時自動切換，讓關鍵任務不中斷。',
      f3Badge: '支付渠道',
      f3Title: '付款無阻',
      f3Desc: '支援支付寶、USDT 與信用卡直付，從個人開發者到小團隊，都能快速完成充值與結算。',
      f4Badge: '數據看板',
      f4Title: '成本可視',
      f4Desc: '每次請求、每種模型與每筆 Token 消耗清楚可追蹤，方便控費、對帳與持續優化。',
      link1: '瀏覽全部',
      link2: '了解更多',
      link3: '了解更多',
      link4: '查看文檔',
      virtualKey: '虛擬密鑰',
      realKey: '真實密鑰'
    },
    cta: {
      title: '準備好開始構建了嗎？',
      desc: '加入成千上萬透過 Hubto 路由其 AI 請求的開發者行列。',
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
      canUseBoost: '可使用增值包充值'
    }
  },
  'zh-CN': {
    nav: { tryNow: '立即试用', models: '模型中心', pricing: '套餐定价', docs: '文档博客' },
    hero: {
      badge: '新一代 AI 聚合网关',
      title1: '稳定，才是真正的可用',
      title2: '',
      desc: '不只解决能不能接入，更解决能不能持续使用。HubTo 让中国大陆与香港开发者更稳定地使用全球主流 AI 模型。',
      placeholder: '立即试用Hubto API...',
      scroll: '滑动查看更多',
      getApiKey: '获取 API Key',
      viewDocs: '查看文档'
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
      f2Title: '多路稳援',
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
      desc: '加入成千上万通过 Hubto 路由其 AI 请求的开发者行列。',
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
      canUseBoost: '可使用增值包充值'
    }
  },
  'en': {
    nav: { tryNow: 'Try now', models: 'Models', pricing: 'Pricing', docs: 'Docs & Blog' },
    hero: {
      badge: 'The Next-Gen AI Gateway',
      title1: 'Stability is True Usability',
      title2: '',
      desc: 'Not just solving access, but ensuring sustained usage. HubTo enables developers in Mainland China and Hong Kong to stably use mainstream global AI models.',
      placeholder: 'Try Hubto API now...',
      scroll: 'Scroll to learn more',
      getApiKey: 'Get API Key',
      viewDocs: 'View Docs'
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
      title: 'Ready to build?',
      desc: 'Join thousands of developers routing their AI requests through Hubto.',
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
      canUseBoost: 'Can use boost packages'
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
