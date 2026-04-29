import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useLanguage } from '../lib/i18n';

export function AgentCLIShowcase() {
  const { t } = useLanguage();

  const agentsData = [
    {
      name: 'Hermes-agent',
      desc: t.agentCLI.hermesDesc,
      image: 'https://i.postimg.cc/hPqQ54f5/image.png',
      icon: 'https://i.postimg.cc/dVvLQWFd/nousresearch-hermes-512px.png',
    },
    {
      name: 'OpenClaw',
      desc: t.agentCLI.openClawDesc,
      image: 'https://i.postimg.cc/m2qJsqWK/image.png',
      icon: 'https://i.postimg.cc/2SFrHmPh/openclaw-moltbot-clawdbot-512px.png',
    },
    {
      name: 'Claude Code',
      desc: t.agentCLI.claudeCodeDesc,
      image: 'https://i.postimg.cc/nhQQMs9L/image.png',
      icon: 'https://i.postimg.cc/HxWx0jnM/claude-code-512px.png',
    },
    {
      name: 'CodeX',
      desc: t.agentCLI.codeXDesc,
      image: 'https://i.postimg.cc/0QWZCMkK/image.png',
      icon: 'https://i.postimg.cc/Z5gFMtpK/image.png',
    }
  ];

  return (
    <section className="relative overflow-hidden bg-transparent pt-16 md:pt-28 pb-16 md:pb-24">
      <div className="mx-auto px-6" style={{ width: '1104px' }}>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.08]" style={{ fontSize: '32px' }}>
            {t.agentCLI.title}
          </h2>
          <Link to="/agents" className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors inline-flex items-center gap-1.5 shrink-0">
            {t.agentCLI.viewAll}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentsData.map((agent, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="h-[274px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#1e1e20]/70 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-white/20 flex flex-col group shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            >
              {/* Top Image */}
              <div className="h-[178px] w-full overflow-hidden border-b border-white/5 relative bg-[#131315]">
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Bottom Content */}
              <div className="flex-1 px-5 py-4 flex items-center gap-4 bg-white/[0.02]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 shadow-sm overflow-hidden p-1.5">
                  <img src={agent.icon} alt={agent.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col text-left justify-center overflow-hidden">
                  <h3 className="text-base font-semibold text-white/90 leading-tight truncate">{agent.name}</h3>
                  <p className="text-[13px] text-white/50 leading-tight mt-1 truncate">{agent.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}