import { useState } from 'react';
import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { validateEmail } from '@/lib/utils';
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactProps {
  config: SiteConfig;
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

  const contactCards = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: config.contact.whatsapp,
      href: config.social.whatsapp,
      color: 'bg-[#25d366]/10 text-[#25d366]',
      btnText: 'Chat on WhatsApp',
      external: true,
    },
    {
      icon: Mail,
      label: 'Email',
      value: config.contact.email,
      href: `mailto:${config.contact.email}`,
      color: 'bg-blue-500/10 text-blue-500',
      btnText: 'Send Email',
      external: false,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: config.contact.phone,
      href: `tel:${config.contact.phone.replace(/\s/g, '')}`,
      color: 'bg-indigo-500/10 text-indigo-500',
      btnText: 'Call Now',
      external: false,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: config.contact.address,
      href: '#',
      color: 'bg-purple-500/10 text-purple-500',
      btnText: 'View Map',
      external: false,
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: config.contact.workingHours,
      href: '#',
      color: 'bg-orange-500/10 text-orange-500',
      btnText: 'Schedule',
      external: false,
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-[#080c20] dark:to-[#0a0e27] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
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
          {/* Contact Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactCards.map((card, i) => (
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
                    className="block w-full text-center py-2 bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                  >
                    {card.btnText}
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact Form */}
          <ScrollReveal delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help?"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={5}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
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
