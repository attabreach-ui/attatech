import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { AnimatedCounter } from '@/components/custom/animated-counter';
import { getIcon } from '@/lib/icons';

interface StatsProps {
  config: SiteConfig;
}

export function Stats({ config }: StatsProps) {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-[#0a0e27] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(config.stats || []).map((stat, i) => {
            const Icon = getIcon(stat.icon, getIcon('Briefcase'));
            const isNumeric = !isNaN(Number(stat.value));

            return (
              <ScrollReveal key={stat.id} delay={i * 0.1}>
                <div className="group relative bg-slate-50 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 glow-blue-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#0a0e27] dark:text-white">
                        {isNumeric ? (
                          <AnimatedCounter
                            end={Number(stat.value)}
                            suffix={stat.suffix}
                            duration={2000}
                          />
                        ) : (
                          <span>{stat.value}{stat.suffix}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
