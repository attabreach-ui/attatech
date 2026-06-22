export interface Project {
  id: string;
  title: string;
  client: string;
  industry: string;
  location: string;
  year: string;
  type: string;
  description: string;
  longDescription: string;
  features: string[];
  results: string[];
  techStack: string[];
  liveUrl: string;
  screenshots: Screenshot[];
  testimonial?: Testimonial;
  sort_order?: number;
}

export interface Screenshot {
  src: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  avatar?: string;
  approved: boolean;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order?: number;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  suffix: string;
  icon: string;
  sort_order?: number;
}

export interface ContactInfo {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface SocialLinks {
  whatsapp: string;
  linkedin: string;
  github: string;
  twitter: string;
}

export interface SiteConfig {
  company: {
    name: string;
    tagline: string;
    founded: string;
    location: string;
    workingHours: string;
  };
  founder: {
    name: string;
    title: string;
    bio: string;
  };
  contact: ContactInfo;
  social: SocialLinks;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    trustBar: string[];
  };
  stats: Stat[];
  services: Service[];
  projects: Project[];
  process: ProcessStep[];
  techStack: TechItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  formspreeEndpoint: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  sort_order?: number;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface TechItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}
