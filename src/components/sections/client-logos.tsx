import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { Globe } from 'lucide-react';

interface ClientLogosProps {
  config: SiteConfig;
}

export function ClientLogos({ config }: ClientLogosProps) {
  if (config.clientLogos.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-[#080c20] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              Trusted By
            </span>
          </ScrollReveal>
          <TextReveal
            text="Companies We Work With"
            tag="h2"
            className="text-2xl md:text-3xl font-bold text-[#0a0e27] dark:text-white"
          />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {config.clientLogos.map((logo) => (
            <ScrollReveal key={logo.id}>
              <a
                href={logo.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center h-16 px-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {logo.logoUrl ? (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="h-8 w-auto opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:text-blue-500 transition-colors">
                    <Globe className="w-5 h-5" />
                    <span className="font-semibold text-sm">{logo.name}</span>
                  </div>
                )}
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
