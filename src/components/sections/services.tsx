import type { SiteConfig, Service } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import {
  Code, Warehouse, Package, Users, Bot, Cloud, Globe, RefreshCw,
} from 'lucide-react';

interface ServicesProps {
  config: SiteConfig;
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Warehouse,
  Package,
  Users,
  Bot,
  Cloud,
  Globe,
  RefreshCw,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = iconMap[service.icon] || Code;

  return (
    <ScrollReveal delay={index * 0.08}>
      <div className="group relative bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 glow-blue-hover h-full border-gradient">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function Services({ config }: ServicesProps) {
  return (
    <section id="services" className="py-20 md:py-28 bg-slate-50 dark:bg-[#080c20] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              What We Do
            </span>
          </ScrollReveal>
          <TextReveal
            text="Our Services"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Comprehensive business software solutions tailored to your needs
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(config.services || []).map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
