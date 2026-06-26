import { useState, useEffect } from 'react';
import type { SiteConfig } from '@/types';
import { MeshGradient } from '@/components/custom/mesh-gradient';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';

interface HeroProps {
  config: SiteConfig;
}

export function Hero({ config }: HeroProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [wordsRevealed, setWordsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWordsRevealed(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const headlineWords = (config.hero?.headline || '').split(' ');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0e27] dark:to-[#0d1225]">
      <MeshGradient />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {config.company.tagline}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#0a0e27] dark:text-white">
                {headlineWords.map((word, i) => (
                  <span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    style={{
                      opacity: wordsRevealed ? 1 : 0,
                      transform: wordsRevealed ? 'translateY(0) rotateX(0)' : 'translateY(40px) rotateX(-45deg)',
                      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
                    }}
                  >
                    {word === 'AI-Powered' || word === 'Software' ? (
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </h1>
            </div>

            <ScrollReveal delay={0.4}>
              <p className="text-lg text-[#0a0e27]/70 dark:text-white/70 max-w-xl leading-relaxed">
                {config.hero.subheadline}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="flex flex-wrap gap-4">
                <a
                  href={config.hero.ctaPrimary.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                >
                  {config.hero.ctaPrimary.text}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={config.hero.ctaSecondary.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25d366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  {config.hero.ctaSecondary.text}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {config.hero.trustBar.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-[#0a0e27]/60 dark:text-white/60">
                    <Check className="w-4 h-4 text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Dashboard Screenshot with 3D Tilt */}
          <ScrollReveal delay={0.3} direction="left">
            <div
              className="relative perspective-[1000px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-xl animate-float animation-delay-200 hidden lg:block" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-500/10 rounded-full animate-float animation-delay-500 hidden lg:block" />
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-purple-500/10 rounded-lg rotate-45 animate-float-slow hidden lg:block" />

              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/20 transition-transform duration-200 ease-out"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                }}
              >
                <img
                  src="/images/projects/pakfrost/pakfrost-dashboard.jpg"
                  alt="Pakfrost WMS Dashboard"
                  className="w-full h-auto"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Stats badge */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#131a35] rounded-xl shadow-lg border border-black/5 dark:border-white/10 px-4 py-3 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">System Status</p>
                    <p className="text-sm font-semibold">Live & Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
