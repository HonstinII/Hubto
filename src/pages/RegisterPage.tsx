import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { useLanguage } from '../lib/i18n';
import { Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';

export function RegisterPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Password validation
  const hasMinLength = formData.password.length >= 8;
  const hasMaxLength = formData.password.length <= 20;
  const hasLetter = /[a-zA-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

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
          <div className="space-y-2 mb-8 text-center">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              建立賬戶
            </h1>
            <p className="text-sm text-white/50">
              已有賬戶？{' '}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                登入
              </Link>
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">用戶名</label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === 'username'
                  ? 'border-violet-500/50 bg-white/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="請輸入用戶名"
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">電郵地址</label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === 'email'
                  ? 'border-violet-500/50 bg-white/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="請輸入電郵地址"
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
            </div>
          </div>

          {/* Verification Code Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">電郵驗證碼</label>
            <div className="flex gap-3">
              <div
                className={`relative flex-1 rounded-xl border transition-all duration-200 ${
                  focusedField === 'verificationCode'
                    ? 'border-violet-500/50 bg-white/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                  onFocus={() => setFocusedField('verificationCode')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="請輸入電郵驗證碼"
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/70 hover:bg-white/[0.06] hover:border-white/20 transition-all whitespace-nowrap"
              >
                發送驗證碼
              </motion.button>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">密碼</label>
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
                placeholder="請輸入密碼，最少 8 個，最多 20 個"
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

            {/* Password Requirements */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <X className="h-3.5 w-3.5 text-white/20" />
                )}
                <span className={`text-xs ${hasMinLength ? 'text-emerald-400' : 'text-white/30'}`}>
                  最少 8 個字符
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasMaxLength && formData.password.length > 0 ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <X className="h-3.5 w-3.5 text-white/20" />
                )}
                <span className={`text-xs ${hasMaxLength && formData.password.length > 0 ? 'text-emerald-400' : 'text-white/30'}`}>
                  最多 20 個字符
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLetter && hasNumber ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <X className="h-3.5 w-3.5 text-white/20" />
                )}
                <span className={`text-xs ${hasLetter && hasNumber ? 'text-emerald-400' : 'text-white/30'}`}>
                  需同時包含至少一個大寫字母和數字
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">確認密碼</label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === 'confirmPassword'
                  ? 'border-violet-500/50 bg-white/[0.05] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="請再次輸入密碼"
                className="w-full bg-transparent px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-400">密碼不一致</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black py-3.5 text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            註冊
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </form>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-white/30 leading-relaxed">
          註冊即表示您同意我們的{' '}
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
