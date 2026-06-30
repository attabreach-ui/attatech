import type { SiteConfig } from '@/types';
import { useState } from 'react';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { Mail, ArrowRight, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterProps {
  config: SiteConfig;
}

export function Newsletter({ config }: NewsletterProps) {
  if (!config.newsletter?.enabled) return null;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = (config.formspreeEndpoint && !config.formspreeEndpoint.includes('YOUR_FORM_ID'))
        ? config.formspreeEndpoint
        : 'https://formspree.io/f/mqevkoao';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          _subject: 'Newsletter Subscription — AttaTech',
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(config.newsletter.successMessage);
      } else {
        toast.error(`Failed to subscribe (status ${res.status}). Please try again.`);
      }
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#1a1f4d] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-500/10 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-brand-400" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {config.newsletter.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            {config.newsletter.description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-medium">{config.newsletter.successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {config.newsletter.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
