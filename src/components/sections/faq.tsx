import { useState } from 'react';
import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQProps {
  config: SiteConfig;
}

export function FAQ({ config }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-[#0a0e27] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-medium rounded-full mb-4">
              FAQ
            </span>
          </ScrollReveal>
          <TextReveal
            text="Frequently Asked Questions"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
        </div>

        <div className="space-y-4">
          {(config.faqs || []).map((faq, i) => (
            <ScrollReveal key={faq.id} delay={i * 0.05}>
              <div className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium text-[#0a0e27] dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0 transition-colors',
                      openId === faq.id && 'bg-brand-500 text-white'
                    )}
                  >
                    {openId === faq.id ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4 text-brand-500" />
                    )}
                  </div>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    openId === faq.id ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
