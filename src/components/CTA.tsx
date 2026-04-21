import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto flex min-h-[72vh] w-full max-w-6xl items-center justify-center px-6 py-28 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl text-center"
      >
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.08]">
            {t.cta.title}
          </h2>
          <p className="max-w-2xl text-lg font-light leading-8 text-white/68 md:text-2xl">
            {t.cta.desc}
          </p>

          <div className="relative mt-6 inline-flex">
            <div className="absolute inset-x-8 -bottom-1 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.52)_0%,rgba(96,165,250,0.34)_42%,rgba(0,0,0,0)_78%)] blur-xl" />
            <button className="relative inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15">
              {t.cta.button}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
