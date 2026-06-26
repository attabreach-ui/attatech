import { Link } from 'react-router-dom';
import type { SiteConfig } from '@/types';
import { Phone, Mail, MapPin, Clock, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  config: SiteConfig;
}

export function Footer({ config }: FooterProps) {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Process', href: '/#process' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/#contact' },
  ];

  const serviceLinks = config.services.slice(0, 5).map((s) => s.title);

  return (
    <footer className="bg-[#0a0e27] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-at.png"
                alt="AttaTech"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">
                Atta<span className="text-blue-400">Tech</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {config.company.tagline}<br />
              Custom software development for businesses across Pakistan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={config.social.whatsapp || 'https://wa.me/923478481093'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-blue-500 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href={`mailto:${config.contact.email}`}
                className="p-2 bg-white/10 hover:bg-blue-500 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              {config.social.linkedin && (
                <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-blue-500 rounded-lg transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {config.social.github && (
                <a href={config.social.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-blue-500 rounded-lg transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a href="/#services" className="text-white/60 hover:text-blue-400 text-sm transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                {config.contact.phone}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                {config.contact.email}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                {config.contact.address}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                {config.contact.workingHours}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} {config.company.name}. Developed by {config.founder.name}.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link to="/admin" className="hover:text-blue-400 transition-colors">Admin</Link>
            <span className="text-white/20">|</span>
            <span className="hover:text-blue-400 transition-colors cursor-default">Privacy Policy</span>
            <span className="text-white/20">|</span>
            <span className="hover:text-blue-400 transition-colors cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
