import type { SiteConfig } from '@/types';
import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { Services } from '@/components/sections/services';
import { Projects } from '@/components/sections/projects';
import { Process } from '@/components/sections/process';
import { TechStack } from '@/components/sections/tech-stack';
import { Reviews } from '@/components/sections/reviews';
import { FAQ } from '@/components/sections/faq';
import { Contact } from '@/components/sections/contact';
import { CTABanner } from '@/components/sections/cta-banner';

interface HomePageProps {
  config: SiteConfig;
  onUpdateTestimonials: (t: import('@/types').Testimonial[]) => void;
}

export function HomePage({ config, onUpdateTestimonials }: HomePageProps) {
  return (
    <main>
      <Hero config={config} />
      <Stats config={config} />
      <Services config={config} />
      <Projects config={config} />
      <Process config={config} />
      <TechStack config={config} />
      <Reviews config={config} onUpdateTestimonials={onUpdateTestimonials} />
      <FAQ config={config} />
      <Contact config={config} />
      <CTABanner config={config} />
    </main>
  );
}
