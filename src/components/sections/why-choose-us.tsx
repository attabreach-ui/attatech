import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { getIcon } from '@/lib/icons';

interface WhyChooseUsProps {
  config: SiteConfig;
}

export function WhyChooseUs({ config }: WhyChooseUsProps) {
  if ((config.whyChooseUs || []).length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0a0e27] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-medium rounded-full mb-4">
              Why AttaTech
            </span>
          </ScrollReveal>
          <TextReveal
            text="What Sets Us Apart"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Not just another developer. We bring real industry experience and long-term commitment to every project.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.whyChooseUs.map((item, i) => {
            const Icon = getIcon(item.icon, getIcon('Zap'));
            return (
              <ScrollReveal key={item.id} delay={i * 0.1}>
                <div className="group bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-secondary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a0e27] dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
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
