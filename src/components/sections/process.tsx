import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { getIcon } from '@/lib/icons';

interface ProcessProps {
  config: SiteConfig;
}

export function Process({ config }: ProcessProps) {
  return (
    <section id="process" className="py-20 md:py-28 bg-slate-50 dark:bg-[#080c20] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              How It Works
            </span>
          </ScrollReveal>
          <TextReveal
            text="Our Process"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              How we bring your project to life
            </p>
          </ScrollReveal>
        </div>

        {/* Connecting Line (Desktop) */}
        <div className="hidden lg:block relative">
          <div className="absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {config.process.map((step, i) => {
            const Icon = getIcon(step.icon, getIcon('Search'));
            return (
              <ScrollReveal key={step.id} delay={i * 0.15}>
                <div className="relative text-center group">
                  <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-blue-500/20"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${340 * (i + 1) / 4} 340`}
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute text-4xl font-bold text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-blue-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0a0e27] dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
