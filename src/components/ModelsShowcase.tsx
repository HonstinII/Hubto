import { motion } from 'framer-motion'
import { Flame, MessageSquare, Type, Image as ImageIcon, FileText } from 'lucide-react'
import { useLanguage } from '../lib/i18n'

const modelsData = [
  {
    name: 'Gemini 3.1 Pro',
    desc: 'Google 最強大、最通用的模型，專為處理高度複雜的任務和多模態輸入而構建。',
    tags: ['LLM', 'Multimodal'],
    context: '2M',
    logo: 'https://i.postimg.cc/C18qB3fF/Mask-group.png',
    isHot: false
  },
  {
    name: 'Claude 4.6 Sonnet',
    desc: 'Anthropic 速度最快、最智能的模型，適用於複雜的企業任務和編程。',
    tags: ['HOT', 'LLM'],
    context: '200K',
    logo: 'https://i.postimg.cc/W4CZ4NtV/Vector.png',
    isHot: true
  },
  {
    name: 'GPT-5.4',
    desc: 'OpenAI 的旗艦模型，具備先進的代理工作流，適用於推理、編程和創意生成。',
    tags: ['LLM'],
    context: '128K',
    logo: 'https://i.postimg.cc/mrtMRzLy/openai-light-1.png',
    isHot: false
  },
  {
    name: 'MiniMax 2.7',
    desc: '輕量級、最先進的大型語言模型，專為編程和現代應用程式開發而優化。',
    tags: ['HOT', 'LLM'],
    context: '196.6K',
    logo: 'https://i.postimg.cc/rp1TDgFj/V1ector.png',
    isHot: true
  },
  {
    name: 'GLM 5 Turbo',
    desc: '高性能模型，具備增強的推理能力、多輪對話和快速推論。',
    tags: ['LLM', 'Fast'],
    context: '128K',
    logo: 'https://i.postimg.cc/Bvr80m7M/zhipu-1.png',
    isHot: false
  },
  {
    name: 'Kimi 2.5',
    desc: '針對長上下文理解、文件分析和詳細摘要進行了優化。',
    tags: ['LLM', 'Long Context'],
    context: '1M',
    logo: 'https://i.postimg.cc/rwhWvCkV/Frame1.png',
    isHot: false
  },
  {
    name: 'Qwen 3.6 Plus',
    desc: '阿里巴巴先進的大型語言模型，在複雜推理、編程和多語言任務中表現卓越。',
    tags: ['HOT', 'LLM'],
    context: '128K',
    logo: 'https://i.postimg.cc/YCSLfGmR/1Frame.png',
    isHot: true
  }
];

const ModelCard = ({ model }: { model: typeof modelsData[0] }) => {
  const { t } = useLanguage();
  
  return (
    <div className="w-[280px] shrink-0 rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md flex flex-col gap-4 text-left transition-all hover:bg-white/[0.12] hover:border-white/20 relative group">
      <div className="flex justify-between items-center h-6">
        {model.isHot ? (
          <div className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> HOT
          </div>
        ) : <div />}
      </div>

      <div className="flex gap-3 h-[4rem]">
        <div className="flex h-[3.5rem] w-[3.5rem] shrink-0 items-center justify-center">
          <img src={model.logo} alt={`${model.name} logo`} className="w-10 h-10 object-contain" />
        </div>
        <p className="text-[11px] leading-relaxed text-white/50 line-clamp-4">
          {model.desc}
        </p>
      </div>

      <div className="flex items-center mt-1">
        <div className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
          LLM <MessageSquare className="w-3 h-3 ml-1" />
        </div>
      </div>

      <h3 className="text-[1.15rem] font-semibold text-white/90">{model.name}</h3>

      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white/70">
        {model.context} {t.models.card.context}
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-3 text-[11px] mt-1">
        <div className="flex flex-col gap-1">
          <span className="text-white/40">{t.models.card.inputType}：</span>
          <div className="flex gap-1 text-white/60">
            <div className="border border-white/10 rounded p-0.5"><Type className="w-2.5 h-2.5" /></div>
            <div className="border border-white/10 rounded p-0.5"><ImageIcon className="w-2.5 h-2.5" /></div>
            <div className="border border-white/10 rounded p-0.5"><FileText className="w-2.5 h-2.5" /></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/40">{t.models.card.context}：</span>
          <span className="text-white/80">{model.context}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/40">{t.models.card.outputType}：</span>
          <div className="flex gap-1 text-white/60">
            <div className="border border-white/10 rounded p-0.5"><Type className="w-2.5 h-2.5" /></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/40">{t.models.card.maxOutput}：</span>
          <span className="text-white/80">8K</span>
        </div>
      </div>
    </div>
  )
}

export function ModelsShowcase() {
  const { t } = useLanguage();

  return (
    <section id="models" className="relative overflow-hidden bg-transparent pt-16 md:pt-24 pb-6 md:pb-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-xl space-y-4 text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.08]" style={{ fontSize: '32px' }}>
            {t.models.title}
          </h2>
          {t.models.desc && (
            <p className="text-base font-light leading-8 text-white/62 md:text-lg">
              {t.models.desc}
            </p>
          )}
        </div>
      </div>

      <div className="relative w-full py-4 flex justify-center">
        <div
          className="relative overflow-hidden"
          style={{
            width: '1152px',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
          }}
        >
          <div
            className="flex w-max gap-6 pr-6 animate-marquee group-hover/slider:[animation-play-state:paused]"
          >
            {[...modelsData, ...modelsData].map((model, idx) => (
              <ModelCard key={idx} model={model} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
