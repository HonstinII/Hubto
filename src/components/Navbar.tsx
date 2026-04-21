import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@blinkdotnew/ui';
import { Globe, Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function Navbar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center justify-between px-6 py-4 lg:px-12 w-full max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2 cursor-pointer">
          <Link to="/" className="font-semibold text-lg tracking-tight text-white hover:text-white/80 transition-colors">Hubto</Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link to="/#models" className="hover:text-white transition-colors">{t.nav.models}</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">{t.nav.pricing}</Link>
          <a href="#" className="hover:text-white transition-colors">{t.nav.docs}</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm text-zinc-300 outline-none">
            <Globe className="w-4 h-4" />
            <span>
              {lang === 'zh-TW' ? '繁體中文' : lang === 'zh-CN' ? '简体中文' : 'English'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/10 text-zinc-200" align="end">
            <DropdownMenuItem onClick={() => setLang('zh-TW')} className="flex items-center justify-between cursor-pointer hover:bg-white/10">
              繁體中文 {lang === 'zh-TW' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('zh-CN')} className="flex items-center justify-between cursor-pointer hover:bg-white/10">
              简体中文 {lang === 'zh-CN' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('en')} className="flex items-center justify-between cursor-pointer hover:bg-white/10">
              English {lang === 'en' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="px-5 py-2 text-sm font-medium rounded-full bg-white text-black hover:bg-zinc-200 transition-colors">
          {t.nav.tryNow}
        </button>
      </div>
    </motion.nav>
  );
}
