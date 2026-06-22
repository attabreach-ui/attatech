import type { SiteConfig } from '@/types';

// This is the FALLBACK config used only when Supabase is unavailable
// (e.g. during first load before DB is seeded, or if env vars are missing).
// All live data is fetched from Supabase via useSiteConfig().
export const defaultConfig: SiteConfig = {
  company: {
    name: 'AttaTech',
    tagline: 'AI-Powered Business Solutions',
    founded: '2026',
    location: 'Peshawar, Pakistan',
    workingHours: 'Monday–Saturday, 09:00–18:00 (PKT)',
  },
  founder: {
    name: 'Atta Ullah',
    title: 'Founder & Developer',
    bio: 'Cybersecurity student and self-taught web developer currently working in cold storage operations. Built Pakfrost WMS as my first enterprise project to solve real warehouse problems. Now offering custom software development for businesses across Pakistan.',
  },
  contact: {
    whatsapp: '+92 347 8481093',
    phone: '+92 347 8481093',
    email: 'attatech.dev@gmail.com',
    address: 'Peshawar, Pakistan',
    workingHours: 'Mon–Sat, 09:00–18:00',
  },
  social: {
    whatsapp: 'https://wa.me/923478481093',
    linkedin: '',
    github: '',
    twitter: '',
  },
  seo: {
    title: 'AttaTech — AI-Powered Business Solutions | Custom Software Pakistan',
    description: 'Custom warehouse systems, inventory, HR and business software built with AI-assisted development. Based in Peshawar, Pakistan. First project: Pakfrost WMS.',
    keywords: 'warehouse management system Pakistan, custom business software, WMS Peshawar, inventory system, HR software Pakistan, AI business solutions, cold storage management, Atta Ullah developer',
  },
  hero: {
    headline: 'AI-Powered Business Software Built for Real Operations',
    subheadline: 'Custom WMS, Inventory, HR & business software. Built for every business — from startups to enterprises.',
    ctaPrimary:   { text: 'View Live Project', link: 'https://pakfrost.netlify.app' },
    ctaSecondary: { text: 'Chat on WhatsApp',  link: 'https://wa.me/923478481093'  },
    trustBar: ['Enterprise WMS Delivered', 'Next.js Specialist', 'Long-Term Partnership'],
  },
  stats: [
    { id: '1', label: 'Projects Delivered',  value: '1',   suffix: '',   icon: 'Briefcase' },
    { id: '2', label: 'Client Satisfaction', value: '100', suffix: '%',  icon: 'Heart'     },
    { id: '3', label: 'Long-Term Partnership',value:'100', suffix: '%',  icon: 'Handshake' },
    { id: '4', label: 'Specialization',       value: 'WMS',suffix: '',   icon: 'Snowflake' },
  ],
  services: [
    { id: '1', icon: 'Code',      title: 'Custom Business Software Development', description: 'Tailored software solutions designed to streamline your unique business processes.', tags: ['React', 'TypeScript', 'Node.js'] },
    { id: '2', icon: 'Warehouse', title: 'Warehouse Management Systems (WMS)',   description: 'Enterprise-grade WMS with real-time tracking and automated IGP/OGP generation.',   tags: ['Next.js', 'WMS', 'Real-time'] },
    { id: '3', icon: 'Package',   title: 'Inventory & Stock Control Systems',    description: 'Smart inventory management with automated expiry alerts and FEFO rotation.',         tags: ['Analytics', 'FEFO', 'Alerts'] },
    { id: '4', icon: 'Users',     title: 'HR & Payroll Management Software',     description: 'Complete HR solutions from attendance tracking to automated payroll processing.',     tags: ['HR', 'Payroll', 'Attendance'] },
    { id: '5', icon: 'Bot',       title: 'AI-Powered Automation & Integration',  description: 'Leverage AI to automate repetitive tasks and integrate disconnected systems.',       tags: ['AI/ML', 'Automation', 'APIs'] },
    { id: '6', icon: 'Cloud',     title: 'Cloud-Based SaaS Solutions',           description: 'Scalable cloud applications with secure data management and role-based access.',      tags: ['Cloud', 'SaaS', 'Security'] },
    { id: '7', icon: 'Globe',     title: 'Website & Web Application Development',description: 'Modern, responsive websites and PWAs built with Next.js and Tailwind.',              tags: ['Next.js', 'Tailwind', 'PWA'] },
    { id: '8', icon: 'RefreshCw', title: 'Legacy System Modernization',          description: 'Upgrade outdated Excel/paper-based systems to modern digital platforms.',             tags: ['Migration', 'Digital', 'Modern'] },
  ],
  projects: [
    {
      id: '1',
      title: 'Pakfrost WMS — Cold Storage Warehouse Management',
      client: 'Pakfrost (PVT) Limited',
      industry: 'Cold Storage / Frozen Food Logistics',
      location: '2 KM Off Manga Raiwind Road, Behind Achha Foods, Lahore, Pakistan',
      year: '2026', type: 'WMS',
      description: 'A full-featured enterprise Warehouse Management System built from scratch for Pakfrost (PVT) Limited.',
      longDescription: 'A full-featured enterprise Warehouse Management System built from scratch for Pakfrost (PVT) Limited, a premium temperature-controlled warehousing company operating -18°C to -22°C frozen storage facilities in Lahore.',
      features: ['Secure Login & Role-Based User Access Control', 'Real-Time Dashboard with KPI Cards', '7-Day Activity Charts', 'Cold Room Temperature Monitoring', 'Stock IN / Receiving with Auto IGP Generation', 'Stock OUT / Dispatch with Auto OGP Generation', 'Expiry Alerts (7-day urgent, 30-day warning)', 'Multi-User Support with Admin/Operator roles'],
      results: ['Replaced manual paper-based tracking system', 'Eliminated stock misplacement errors', 'Automated IGP/OGP document generation', 'Real-time temperature compliance monitoring'],
      techStack: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
      liveUrl: 'https://pakfrost.netlify.app',
      screenshots: [
        { src: '/images/projects/pakfrost/pakfrost-login.jpg',     alt: 'Pakfrost WMS login page' },
        { src: '/images/projects/pakfrost/pakfrost-dashboard.jpg', alt: 'Pakfrost WMS dashboard' },
      ],
    },
  ],
  process: [
    { id: '1', number: '01', title: 'Discovery',    description: 'We discuss your business needs, analyze workflows, and define the project scope together.',                          icon: 'Search'  },
    { id: '2', number: '02', title: 'Design',       description: 'I create wireframes and UI mockups so you can visualize the system before development begins.',                      icon: 'Palette' },
    { id: '3', number: '03', title: 'Development',  description: 'Your software is built with modern tech, with weekly progress updates and demos.',                                  icon: 'Code2'   },
    { id: '4', number: '04', title: 'Deployment',   description: 'The system goes live with training, documentation, and ongoing support included.',                                  icon: 'Rocket'  },
  ],
  techStack: [
    { id: '1',  name: 'Next.js 14',    icon: 'nextjs',    description: 'React framework for production' },
    { id: '2',  name: 'React',         icon: 'react',     description: 'UI library for web apps' },
    { id: '3',  name: 'TypeScript',    icon: 'typescript',description: 'Type-safe JavaScript' },
    { id: '4',  name: 'Tailwind CSS',  icon: 'tailwind',  description: 'Utility-first CSS framework' },
    { id: '5',  name: 'Node.js',       icon: 'nodejs',    description: 'JavaScript runtime' },
    { id: '6',  name: 'Framer Motion', icon: 'framer',    description: 'Animation library' },
    { id: '7',  name: 'Git',           icon: 'git',       description: 'Version control' },
    { id: '8',  name: 'Supabase',      icon: 'supabase',  description: 'Open-source backend' },
    { id: '9',  name: 'Vercel',        icon: 'vercel',    description: 'Deployment platform' },
    { id: '10', name: 'Figma',         icon: 'figma',     description: 'Design tool' },
  ],
  testimonials: [],
  faqs: [
    { id: '1', question: 'What is AttaTech and what do you specialize in?',       answer: 'AttaTech is a software development initiative founded by Atta Ullah, specializing in custom business software, warehouse management systems (WMS), and AI-powered automation.' },
    { id: '2', question: 'Is this a registered company or freelance work?',       answer: 'Currently, AttaTech operates as a professional freelance development service. Every project is treated with the same professionalism as a registered agency.' },
    { id: '3', question: 'How much does a custom WMS or inventory system cost?',  answer: 'Pricing depends on scope, features, and timeline. Reach out for a free consultation and custom quote.' },
    { id: '4', question: 'Can you modify the system after deployment?',           answer: 'Absolutely. I build systems with scalability in mind. New modules, reports, or integrations can always be added. Monthly maintenance packages are also available.' },
    { id: '5', question: 'Do you only build warehouse systems?',                  answer: 'No — I build all types of business software: HR & payroll, inventory, SaaS platforms, e-commerce backends, and custom web applications.' },
    { id: '6', question: 'How do I get started?',                                answer: "Message me on WhatsApp at +92 347 8481093 or email attatech.dev@gmail.com. We'll discuss your requirements and I'll send a proposal with timeline and cost." },
  ],
  formspreeEndpoint: '',
};
