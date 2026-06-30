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
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  priceUnit: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  sort_order?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  tags: string[];
  published: boolean;
  slug: string;
}

export interface WhyChooseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order?: number;
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  sort_order?: number;
}

export interface AnalyticsConfig {
  googleAnalyticsId: string;
  microsoftClarityId: string;
  metaPixelId: string;
}

export interface NewsletterConfig {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  successMessage: string;
}

export interface IntakeConfig {
  enabled: boolean;
  title: string;
  description: string;
  steps: IntakeStep[];
}

export interface IntakeStep {
  id: string;
  title: string;
  fields: IntakeField[];
}

export interface IntakeField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'number';
  required: boolean;
  options?: string[];
  placeholder: string;
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
    photo: string;
  };
  contact: ContactInfo;
  social: SocialLinks;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    canonicalUrl: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    trustBar: string[];
    heroImage?: string;
    heroBadge?: { label: string; status: string };
  };
  stats: Stat[];
  services: Service[];
  projects: Project[];
  process: ProcessStep[];
  techStack: TechItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  pricing: PricingTier[];
  blogPosts: BlogPost[];
  whyChooseUs: WhyChooseItem[];
  clientLogos: ClientLogo[];
  analytics: AnalyticsConfig;
  newsletter: NewsletterConfig;
  intake: IntakeConfig;
  theme: string;
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
