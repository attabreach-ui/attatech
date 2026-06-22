import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultConfig } from '@/data/site-config';
import type {
  SiteConfig, Stat, Service, Project, FAQ, Testimonial,
  PricingTier, BlogPost, WhyChooseItem, ClientLogo, AnalyticsConfig,
  NewsletterConfig, IntakeConfig
} from '@/types';

// ─── helpers ────────────────────────────────────────────────────────────────

function mapSettings(row: Record<string, unknown>): Partial<SiteConfig> {
  return {
    company: row.company as SiteConfig['company'],
    founder: row.founder as SiteConfig['founder'],
    contact: row.contact as SiteConfig['contact'],
    social: row.social as SiteConfig['social'],
    seo: row.seo as SiteConfig['seo'],
    hero: row.hero as SiteConfig['hero'],
    pricing: row.pricing as SiteConfig['pricing'] ?? defaultConfig.pricing,
    blogPosts: row.blog_posts as SiteConfig['blogPosts'] ?? defaultConfig.blogPosts,
    whyChooseUs: row.why_choose_us as SiteConfig['whyChooseUs'] ?? defaultConfig.whyChooseUs,
    clientLogos: row.client_logos as SiteConfig['clientLogos'] ?? defaultConfig.clientLogos,
    analytics: row.analytics as SiteConfig['analytics'] ?? defaultConfig.analytics,
    newsletter: row.newsletter as SiteConfig['newsletter'] ?? defaultConfig.newsletter,
    intake: row.intake as SiteConfig['intake'] ?? defaultConfig.intake,
    formspreeEndpoint: (row.formspree_endpoint as string) ?? '',
  };
}

function mapStats(rows: Record<string, unknown>[]): Stat[] {
  return rows.map((r) => ({
    id: r.id as string,
    label: r.label as string,
    value: r.value as string,
    suffix: (r.suffix as string) ?? '',
    icon: (r.icon as string) ?? 'Briefcase',
  }));
}

function mapServices(rows: Record<string, unknown>[]): Service[] {
  return rows.map((r) => ({
    id: r.id as string,
    icon: (r.icon as string) ?? 'Code',
    title: r.title as string,
    description: (r.description as string) ?? '',
    tags: (r.tags as string[]) ?? [],
  }));
}

function mapProjects(rows: Record<string, unknown>[]): Project[] {
  return rows.map((r) => ({
    id: r.id as string,
    title: r.title as string,
    client: (r.client as string) ?? '',
    industry: (r.industry as string) ?? '',
    location: (r.location as string) ?? '',
    year: (r.year as string) ?? '',
    type: (r.type as string) ?? 'Web Apps',
    description: (r.description as string) ?? '',
    longDescription: (r.long_description as string) ?? '',
    features: (r.features as string[]) ?? [],
    results: (r.results as string[]) ?? [],
    techStack: (r.tech_stack as string[]) ?? [],
    liveUrl: (r.live_url as string) ?? '',
    screenshots: ((r.screenshots as { src: string; alt: string }[]) ?? []),
  }));
}

function mapFaqs(rows: Record<string, unknown>[]): FAQ[] {
  return rows.map((r) => ({
    id: r.id as string,
    question: r.question as string,
    answer: (r.answer as string) ?? '',
  }));
}

function mapReviews(rows: Record<string, unknown>[]): Testimonial[] {
  return rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    role: (r.role as string) ?? '',
    company: (r.company as string) ?? '',
    rating: (r.stars as number) ?? 5,
    text: r.review_text as string,
    approved: (r.approved as boolean) ?? false,
    date: (r.created_at as string) ?? '',
  }));
}

// ─── hook ───────────────────────────────────────────────────────────────────

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [dbAvailable, setDbAvailable] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [settingsRes, statsRes, servicesRes, projectsRes, faqsRes, reviewsRes] =
        await Promise.all([
          supabase.from('site_settings').select('*').eq('id', 1).single(),
          supabase.from('stats').select('*').order('sort_order'),
          supabase.from('services').select('*').order('sort_order'),
          supabase.from('projects').select('*').order('sort_order'),
          supabase.from('faqs').select('*').order('sort_order'),
          supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }),
        ]);

      // If settings row doesn't exist, DB hasn't been seeded yet — use defaults
      if (settingsRes.error || !settingsRes.data) {
        setDbAvailable(false);
        return;
      }

      setDbAvailable(true);
      setConfig((prev) => ({
        ...prev,
        ...(settingsRes.data ? mapSettings(settingsRes.data as unknown as Record<string, unknown>) : {}),
        stats: statsRes.data ? mapStats(statsRes.data as unknown as Record<string, unknown>[]) : prev.stats,
        services: servicesRes.data ? mapServices(servicesRes.data as unknown as Record<string, unknown>[]) : prev.services,
        projects: projectsRes.data ? mapProjects(projectsRes.data as unknown as Record<string, unknown>[]) : prev.projects,
        faqs: faqsRes.data ? mapFaqs(faqsRes.data as unknown as Record<string, unknown>[]) : prev.faqs,
        testimonials: reviewsRes.data ? mapReviews(reviewsRes.data as unknown as Record<string, unknown>[]) : prev.testimonials,
      }));
    } catch {
      // Supabase not reachable / env vars missing — silently use defaults
      setDbAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Admin write helpers ──────────────────────────────────────────────────

  const saveSettings = useCallback(async (partial: Partial<SiteConfig>): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      company: partial.company,
      founder: partial.founder,
      contact: partial.contact,
      social: partial.social,
      seo: partial.seo,
      hero: partial.hero,
      pricing: partial.pricing,
      blog_posts: partial.blogPosts,
      why_choose_us: partial.whyChooseUs,
      client_logos: partial.clientLogos,
      analytics: partial.analytics,
      newsletter: partial.newsletter,
      intake: partial.intake,
      formspree_endpoint: partial.formspreeEndpoint,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, ...partial }));
    return null;
  }, []);

  const saveStats = useCallback(async (stats: Stat[]): Promise<string | null> => {
    const { error: delErr } = await supabase.from('stats').delete().neq('id', '__none__');
    if (delErr) return delErr.message;
    const rows = stats.map((s, i) => ({ ...s, sort_order: i }));
    const { error } = await supabase.from('stats').insert(rows);
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, stats }));
    return null;
  }, []);

  const saveServices = useCallback(async (services: Service[]): Promise<string | null> => {
    const { error: delErr } = await supabase.from('services').delete().neq('id', '__none__');
    if (delErr) return delErr.message;
    const rows = services.map((s, i) => ({ ...s, sort_order: i }));
    const { error } = await supabase.from('services').insert(rows);
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, services }));
    return null;
  }, []);

  const saveProjects = useCallback(async (projects: Project[]): Promise<string | null> => {
    const { error: delErr } = await supabase.from('projects').delete().neq('id', '__none__');
    if (delErr) return delErr.message;
    const rows = projects.map((p, i) => ({
      id: p.id,
      title: p.title,
      client: p.client,
      industry: p.industry,
      location: p.location,
      year: p.year,
      type: p.type,
      description: p.description,
      long_description: p.longDescription,
      features: p.features,
      results: p.results,
      tech_stack: p.techStack,
      live_url: p.liveUrl,
      screenshots: p.screenshots,
      sort_order: i,
    }));
    const { error } = await supabase.from('projects').insert(rows);
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, projects }));
    return null;
  }, []);

  const saveFaqs = useCallback(async (faqs: FAQ[]): Promise<string | null> => {
    const { error: delErr } = await supabase.from('faqs').delete().neq('id', '__none__');
    if (delErr) return delErr.message;
    const rows = faqs.map((f, i) => ({ ...f, sort_order: i }));
    const { error } = await supabase.from('faqs').insert(rows);
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, faqs }));
    return null;
  }, []);

  const savePricing = useCallback(async (pricing: PricingTier[]): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      pricing: pricing,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, pricing }));
    return null;
  }, []);

  const saveBlogPosts = useCallback(async (blogPosts: BlogPost[]): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      blog_posts: blogPosts,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, blogPosts }));
    return null;
  }, []);

  const saveWhyChooseUs = useCallback(async (items: WhyChooseItem[]): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      why_choose_us: items,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, whyChooseUs: items }));
    return null;
  }, []);

  const saveClientLogos = useCallback(async (logos: ClientLogo[]): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      client_logos: logos,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, clientLogos: logos }));
    return null;
  }, []);

  const saveAnalytics = useCallback(async (analytics: AnalyticsConfig): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      analytics: analytics,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, analytics }));
    return null;
  }, []);

  const saveNewsletter = useCallback(async (newsletter: NewsletterConfig): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      newsletter: newsletter,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, newsletter }));
    return null;
  }, []);

  const saveIntake = useCallback(async (intake: IntakeConfig): Promise<string | null> => {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      intake: intake,
      updated_at: new Date().toISOString(),
    });
    if (error) return error.message;
    setConfig((prev) => ({ ...prev, intake }));
    return null;
  }, []);

  return {
    config,
    loading,
    dbAvailable,
    refetch: fetchAll,
    saveSettings,
    saveStats,
    saveServices,
    saveProjects,
    saveFaqs,
    savePricing,
    saveBlogPosts,
    saveWhyChooseUs,
    saveClientLogos,
    saveAnalytics,
    saveNewsletter,
    saveIntake,
  };
}
