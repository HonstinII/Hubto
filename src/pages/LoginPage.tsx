import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../lib/i18n';
import { useAuth } from '../lib/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AnimatedBackgroundBox } from '../components/AnimatedBackgroundBox';

export function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Logo - Top Left */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <img
          src="https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png"
          alt="HubTo"
          className="h-9 w-auto rounded-lg"
        />
        <span className="text-xl font-semibold tracking-tight text-white">HubTo</span>
      </Link>

      {/* Content - 内容层 */}
      <div className="relative z-10 flex items-center justify-center w-full h-full bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md px-6"
        >
          <div className="space-y-4 mb-8 text-center">
            <h1 className="text-3xl font-medium tracking-tight text-white leading-tight">
              <span className="block text-2xl mb-1">登入</span>
              <span className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-white font-semibold">HubTo</span>
                <AnimatedBackgroundBox
                  texts={['Coding', 'Thinking', 'Create', 'AI']}
                  rotationInterval={2000}
                  className="text-xl font-bold"
                  textClassName="text-white"
                />
              </span>
            </h1>
            <p className="text-sm text-white/50">
              還沒有賬戶？{' '}
              <Link
                to="/register"
                className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                註冊
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">電郵或用戶名</label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focusedField === 'email'
                    ? 'border-violet-500/50 bg-white/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="請輸入電郵或用戶名"
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">密碼</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  忘記密碼？
                </Link>
              </div>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focusedField === 'password'
                    ? 'border-violet-500/50 bg-white/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="請輸入您的密碼"
                  className="w-full bg-transparent px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black py-3.5 text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              登入
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-white/30 leading-relaxed">
            登入即表示您同意我們的{' '}
            <a href="#" className="text-white/50 hover:text-white/70 transition-colors underline underline-offset-2">
              服務條款
            </a>{' '}
            與{' '}
            <a href="#" className="text-white/50 hover:text-white/70 transition-colors underline underline-offset-2">
              私隱政策
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
