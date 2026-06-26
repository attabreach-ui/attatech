import { useEffect } from 'react';
import type { SiteConfig } from '@/types';

interface SEOHeadProps {
  config: SiteConfig;
  pathname: string;
}

export function SEOHead({ config, pathname }: SEOHeadProps) {
  const isAdmin = pathname === '/admin';

  const title = isAdmin
    ? 'Dashboard — AttaTech Admin'
    : config.seo.title || 'AttaTech — AI-Powered Business Solutions';
  const description = isAdmin
    ? 'AttaTech Admin Dashboard — Manage your website content, projects, and settings.'
    : config.seo.description;

  const canonicalUrl = `${config.seo.canonicalUrl || 'https://attatech.dev'}${pathname}`;
  const ogImage = config.seo.ogImage || '/images/og-image.jpg';

  useEffect(() => {
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: `${config.seo.canonicalUrl || 'https://attatech.dev'}${ogImage}` },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${config.seo.canonicalUrl || 'https://attatech.dev'}${ogImage}` },
    ];

    ogTags.forEach(({ property, name, content }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (property) tag.setAttribute('property', property);
        if (name) tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // JSON-LD Structured Data
    let scriptLd = document.querySelector('script[type="application/ld+json"]');
    if (!scriptLd) {
      scriptLd = document.createElement('script');
      scriptLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptLd);
    }
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.company.name,
      url: config.seo.canonicalUrl || 'https://attatech.dev',
      logo: `${config.seo.canonicalUrl || 'https://attatech.dev'}/images/logo-at.png`,
      sameAs: [
        config.social.linkedin,
        config.social.github,
        config.social.twitter,
        config.social.facebook,
      ].filter(Boolean),
      address: {
        '@type': 'PostalAddress',
        addressLocality: config.company.location?.split(',')[0],
        addressCountry: 'PK',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: config.contact.phone,
        contactType: 'customer service',
        availableLanguage: ['English'],
      },
      founder: {
        '@type': 'Person',
        name: config.founder.name,
        jobTitle: config.founder.title,
      },
      description: config.seo.description,
      keywords: config.seo.keywords,
    };
    scriptLd.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup on unmount
    };
  }, [title, description, canonicalUrl, ogImage, config, pathname]);

  return null;
}
