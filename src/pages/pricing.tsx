import { useState } from 'react';
import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { Check, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingPageProps {
  config: SiteConfig;
}

export function PricingPage({ config }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'onetime' | 'monthly'>('onetime');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e27]">
      {/* Header */}
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              Pricing
            </span>
          </ScrollReveal>
          <TextReveal
            text="Transparent Pricing"
            tag="h1"
            className="text-4xl md:text-5xl font-bold text-[#0a0e27] dark:text-white mb-4"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No surprises. Choose the plan that fits your business needs and budget.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
            <button
              onClick={() => setBillingCycle('onetime')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                billingCycle === 'onetime'
                  ? 'bg-white dark:bg-white/10 text-[#0a0e27] dark:text-white shadow-sm'
                  : 'text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white'
              )}
            >
              One-Time
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-white/10 text-[#0a0e27] dark:text-white shadow-sm'
                  : 'text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white'
              )}
            >
              Monthly
              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] rounded-full font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.pricing.map((tier, i) => (
              <ScrollReveal key={tier.id} delay={i * 0.1}>
                <div
                  className={cn(
                    'relative rounded-2xl border p-8 transition-all hover:-translate-y-2 duration-300',
                    tier.highlighted
                      ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 shadow-xl shadow-blue-500/10'
                      : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10 hover:shadow-lg'
                  )}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0a0e27] dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[#0a0e27] dark:text-white">
                        {billingCycle === 'monthly' ? Math.round(Number(tier.price) * 0.8) : tier.price}
                      </span>
                      <span className="text-lg text-muted-foreground">{tier.priceUnit}</span>
                    </div>
                    {billingCycle === 'monthly' && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        per month (20% discount applied)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-blue-500" />
                        </div>
                        <span className="text-[#0a0e27]/70 dark:text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={config.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full text-center py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                      tier.highlighted
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-[#0a0e27] dark:text-white'
                    )}
                  >
                    {tier.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#1a1f4d] rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a Custom Solution?</h2>
              <p className="text-white/70 mb-6 max-w-lg mx-auto">
                Every business is unique. If your needs don&apos;t fit our standard packages, let&apos;s discuss a custom quote tailored to your requirements.
              </p>
              <a
                href={config.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#25d366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                Discuss Custom Quote
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
