import { useState, useEffect } from 'react';
import type { SiteConfig } from '@/types';
import { MeshGradient } from '@/components/custom/mesh-gradient';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { Check, ArrowRight, MessageCircle, Code2, Layers, Zap, Shield, Database } from 'lucide-react';

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
  const hasHeroImage = !!(config.hero?.heroImage || '').trim();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0e27] dark:to-[#0d1225]">
      <MeshGradient />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/20 rounded-full text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                {config.company?.tagline || 'AI-Powered Solutions'}
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
                      <span className="bg-gradient-to-r from-brand-500 to-brand-secondary-500 bg-clip-text text-transparent">
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
                {config.hero?.subheadline || ''}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="flex flex-wrap gap-4">
                <a
                  href={config.hero?.ctaPrimary?.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5"
                >
                  {config.hero?.ctaPrimary?.text || 'Get Started'}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={config.hero?.ctaSecondary?.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25d366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  {config.hero?.ctaSecondary?.text || 'Contact Us'}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {(config.hero?.trustBar || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-[#0a0e27]/60 dark:text-white/60">
                    <Check className="w-4 h-4 text-brand-500" />
                    {item}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Hero Visual */}
          <ScrollReveal delay={0.3} direction="left">
            <div
              className="relative perspective-[1000px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-brand-500/10 rounded-xl animate-float animation-delay-200 hidden lg:block" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-secondary-500/10 rounded-full animate-float animation-delay-500 hidden lg:block" />
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-brand-accent-500/10 rounded-lg rotate-45 animate-float-slow hidden lg:block" />

              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10 border border-white/20 transition-transform duration-200 ease-out"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                }}
              >
                {hasHeroImage ? (
                  <img
                    src={config.hero?.heroImage}
                    alt="AttaTech Software"
                    className="w-full h-auto"
                  />
                ) : (
                  <GenericHeroVisual />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Stats badge */}
              {config.hero?.heroBadge && (
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#131a35] rounded-xl shadow-lg border border-black/5 dark:border-white/10 px-4 py-3 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{config.hero.heroBadge.label}</p>
                      <p className="text-sm font-semibold">{config.hero.heroBadge.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/** Generic professional CSS-only hero visual — no project-specific imagery */
function GenericHeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating code blocks */}
      <div className={`absolute top-[15%] left-[8%] w-[55%] transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-lg border border-brand-500/20 p-3 shadow-lg">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ml-2 text-[10px] text-slate-400 font-mono">app.tsx</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-[80%] bg-brand-500/30 rounded" />
            <div className="h-1.5 w-[60%] bg-brand-secondary-500/30 rounded" />
            <div className="h-1.5 w-[70%] bg-brand-accent-500/30 rounded" />
            <div className="h-1.5 w-[40%] bg-brand-500/20 rounded" />
          </div>
        </div>
      </div>

      <div className={`absolute top-[42%] right-[5%] w-[45%] transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-lg border border-brand-secondary-500/20 p-3 shadow-lg">
          <div className="flex items-center gap-1.5 mb-2">
            <Database className="w-3 h-3 text-brand-secondary-400" />
            <span className="text-[10px] text-slate-400 font-mono">schema.sql</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-[65%] bg-brand-secondary-500/30 rounded" />
            <div className="h-1.5 w-[50%] bg-brand-500/20 rounded" />
            <div className="h-1.5 w-[75%] bg-brand-accent-500/20 rounded" />
          </div>
        </div>
      </div>

      <div className={`absolute bottom-[12%] left-[15%] w-[40%] transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-lg border border-brand-accent-500/20 p-3 shadow-lg">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-[10px] text-slate-400 font-mono">security.config</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-[55%] bg-green-500/30 rounded" />
            <div className="h-1.5 w-[70%] bg-emerald-500/20 rounded" />
          </div>
        </div>
      </div>

      {/* Floating icons */}
      <div className="absolute top-[8%] right-[20%] animate-float-slow">
        <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20">
          <Code2 className="w-5 h-5 text-brand-400" />
        </div>
      </div>
      <div className="absolute bottom-[25%] right-[12%] animate-float animation-delay-300">
        <div className="w-10 h-10 bg-brand-secondary-500/10 rounded-lg flex items-center justify-center border border-brand-secondary-500/20">
          <Layers className="w-5 h-5 text-brand-secondary-400" />
        </div>
      </div>
      <div className="absolute top-[55%] left-[5%] animate-float animation-delay-500">
        <div className="w-10 h-10 bg-brand-accent-500/10 rounded-lg flex items-center justify-center border border-brand-accent-500/20">
          <Zap className="w-5 h-5 text-brand-accent-400" />
        </div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-brand-secondary-500/10 rounded-full blur-3xl" />
    </div>
  );
}
