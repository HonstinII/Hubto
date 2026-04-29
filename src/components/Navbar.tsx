import { useLanguage } from '../lib/i18n';
import { useAuth } from '../lib/AuthContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@blinkdotnew/ui';
import { Globe, Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 lg:px-12 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2 cursor-pointer">
          <Link to="/" className="flex items-center gap-1">
            <img src="https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png" alt="HubTo" className="h-8 w-auto rounded-lg" />
            <span className="text-[21px] font-semibold tracking-tight text-white">HubTo</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link to="/models" className="hover:text-white transition-colors">{t.nav.models}</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">{t.nav.pricing}</Link>
          <a href="https://docs.hubto.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t.nav.docs}</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm text-zinc-300 outline-none">
            <Globe className="w-4 h-4" />
            <span>
              {lang === 'zh-TW' ? '繁體中文' : lang === 'zh-CN' ? '简体中文' : 'English'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20" align="end">
            <DropdownMenuItem onClick={() => setLang('zh-TW')} className={`flex items-center justify-between cursor-pointer px-4 py-2.5 text-sm transition-colors rounded-[16px] ${lang === 'zh-TW' ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}>
              繁體中文 {lang === 'zh-TW' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('zh-CN')} className={`flex items-center justify-between cursor-pointer px-4 py-2.5 text-sm transition-colors rounded-[16px] ${lang === 'zh-CN' ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}>
              简体中文 {lang === 'zh-CN' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('en')} className={`flex items-center justify-between cursor-pointer px-4 py-2.5 text-sm transition-colors rounded-[16px] ${lang === 'en' ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}>
              English {lang === 'en' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          to="/login"
          className="rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition-all border border-white/20 bg-white/10 text-white hover:bg-white/20"
        >
          {t.nav.login}
        </Link>
        <button
          onClick={isLoggedIn ? logout : login}
          className="px-5 py-2 text-sm font-medium rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          {t.nav.tryNow}
        </button>
      </div>
    </nav>
  );
}
