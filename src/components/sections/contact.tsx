import { useState } from 'react';
import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { validateEmail } from '@/lib/utils';
import {
  Phone, Mail, MapPin, Clock, Send, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactProps {
  config: SiteConfig;
}

/* ─── Social brand icons (inline SVGs, since Lucide removed them) ─── */
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

function buildContactCards(config: SiteConfig) {
  const cards: {
    icon: React.ElementType;
    label: string;
    value: string;
    href: string;
    color: string;
    btnText: string;
    external: boolean;
  }[] = [];

  if (config.contact.whatsapp) {
    cards.push({
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: config.contact.whatsapp,
      href: config.social.whatsapp || '#',
      color: 'bg-[#25d366]/10 text-[#25d366]',
      btnText: 'Chat on WhatsApp',
      external: true,
    });
  }
  if (config.contact.email) {
    cards.push({
      icon: Mail,
      label: 'Email',
      value: config.contact.email,
      href: `mailto:${config.contact.email}`,
      color: 'bg-brand-500/10 text-brand-500',
      btnText: 'Send Email',
      external: false,
    });
  }
  if (config.contact.phone) {
    cards.push({
      icon: Phone,
      label: 'Phone',
      value: config.contact.phone,
      href: `tel:${config.contact.phone.replace(/\s/g, '')}`,
      color: 'bg-brand-secondary-500/10 text-brand-secondary-500',
      btnText: 'Call Now',
      external: false,
    });
  }
  if (config.contact.address) {
    cards.push({
      icon: MapPin,
      label: 'Address',
      value: config.contact.address,
      href: '#',
      color: 'bg-brand-accent-500/10 text-brand-accent-500',
      btnText: 'View Map',
      external: false,
    });
  }
  if (config.contact.workingHours) {
    cards.push({
      icon: Clock,
      label: 'Working Hours',
      value: config.contact.workingHours,
      href: '#',
      color: 'bg-orange-500/10 text-orange-500',
      btnText: 'Schedule',
      external: false,
    });
  }
  return cards;
}

function buildSocialLinks(config: SiteConfig) {
  const { social } = config;
  const links: { key: string; label: string; href: string; icon: React.ElementType }[] = [];
  if (social.whatsapp) links.push({ key: 'wa', label: 'WhatsApp', href: social.whatsapp, icon: WhatsAppIcon });
  if (social.linkedin) links.push({ key: 'li', label: 'LinkedIn', href: social.linkedin, icon: LinkedInIcon });
  if (social.github) links.push({ key: 'gh', label: 'GitHub', href: social.github, icon: GitHubIcon });
  if (social.facebook) links.push({ key: 'fb', label: 'Facebook', href: social.facebook, icon: FacebookIcon });
  if (social.twitter) links.push({ key: 'tw', label: 'X / Twitter', href: social.twitter, icon: TwitterIcon });
  if (social.instagram) links.push({ key: 'ig', label: 'Instagram', href: social.instagram, icon: InstagramIcon });
  if (social.youtube) links.push({ key: 'yt', label: 'YouTube', href: social.youtube, icon: YouTubeIcon });
  return links;
}

export function Contact({ config }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!validateEmail(formData.email)) errs.email = 'Invalid email address';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const endpoint = (config.formspreeEndpoint && !config.formspreeEndpoint.includes('YOUR_FORM_ID'))
        ? config.formspreeEndpoint
        : 'https://formspree.io/f/mqevkoao';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(`Failed to send (status ${res.status}). Please try WhatsApp.`);
      }
    } catch {
      toast.error('Failed to send. Please use WhatsApp instead.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = buildContactCards(config);
  const socialLinks = buildSocialLinks(config);

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-[#080c20] dark:to-[#0a0e27] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-medium rounded-full mb-4">
              Get In Touch
            </span>
          </ScrollReveal>
          <TextReveal
            text="Contact Us"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ─── Left: Contact Cards + Social Links ─── */}
          <div className="lg:col-span-2 space-y-4">
            {contactCards.length > 0 ? (
              contactCards.map((card, i) => (
                <ScrollReveal key={card.label} delay={i * 0.08}>
                  <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                        <p className="text-sm font-medium text-[#0a0e27] dark:text-white">{card.value}</p>
                      </div>
                    </div>
                    <a
                      href={card.href}
                      target={card.external ? '_blank' : undefined}
                      rel={card.external ? 'noopener noreferrer' : undefined}
                      className="block w-full text-center py-2 bg-slate-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-sm font-medium text-brand-600 dark:text-brand-400 rounded-lg transition-colors"
                    >
                      {card.btnText}
                    </a>
                  </div>
                </ScrollReveal>
              ))
            ) : (
              <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground">Contact info not configured yet.</p>
              </div>
            )}

            {/* Social Links Row */}
            {socialLinks.length > 0 && (
              <ScrollReveal delay={0.4}>
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">Follow Us</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((s) => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.key}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-sm text-[#0a0e27] dark:text-white rounded-lg transition-colors"
                          title={s.label}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{s.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* ─── Right: Contact Form ─── */}
          <ScrollReveal delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="How can we help?"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  rows={5}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
