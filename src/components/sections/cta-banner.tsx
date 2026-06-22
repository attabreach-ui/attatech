import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react';

interface CTABannerProps {
  config: SiteConfig;
}

export function CTABanner({ config }: CTABannerProps) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#1a1f4d] relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Automate Your Business?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how custom software can streamline your operations and boost efficiency.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={config.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25d366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a
              href={`${config.social.whatsapp}?text=Hi%20AttaTech,%20I'd%20like%20to%20schedule%20a%20call%20to%20discuss%20my%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Call
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
