import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultConfig } from '@/data/site-config';
import type {
  SiteConfig, Stat, Service, Project, FAQ, Testimonial,
  PricingTier, BlogPost, WhyChooseItem, ClientLogo, AnalyticsConfig,
  NewsletterConfig, IntakeConfig
} from '@/types';

// ─── localStorage helpers for theme fallback ──────────────────────────────────

const THEME_STORAGE_KEY = 'attatech-theme';

function loadThemeFromStorage(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveThemeToStorage(theme: string) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

// ─── helpers ────────────────────────────────────────────────────────────────

function mapSettings(row: Record<string, unknown>): Partial<SiteConfig> {
  const result: Partial<SiteConfig> = {};
  if (row.company != null) result.company = row.company as SiteConfig['company'];
  if (row.founder != null) result.founder = row.founder as SiteConfig['founder'];
  if (row.contact != null) result.contact = row.contact as SiteConfig['contact'];
  if (row.social != null) result.social = row.social as SiteConfig['social'];
  if (row.seo != null) result.seo = row.seo as SiteConfig['seo'];
  if (row.hero != null) result.hero = row.hero as SiteConfig['hero'];
  if (row.pricing != null) result.pricing = row.pricing as SiteConfig['pricing'];
  if (row.blog_posts != null) result.blogPosts = row.blog_posts as SiteConfig['blogPosts'];
  if (row.why_choose_us != null) result.whyChooseUs = row.why_choose_us as SiteConfig['whyChooseUs'];
  if (row.client_logos != null) result.clientLogos = row.client_logos as SiteConfig['clientLogos'];
  if (row.analytics != null) result.analytics = row.analytics as SiteConfig['analytics'];
  if (row.newsletter != null) result.newsletter = row.newsletter as SiteConfig['newsletter'];
  if (row.intake != null) result.intake = row.intake as SiteConfig['intake'];
  if (row.theme != null) result.theme = row.theme as string;
  else {
    const stored = loadThemeFromStorage();
    if (stored) result.theme = stored;
  }
  const fse = (row.formspree_endpoint as string) || '';
  result.formspreeEndpoint = fse.includes('YOUR_FORM_ID') ? defaultConfig.formspreeEndpoint : (fse || defaultConfig.formspreeEndpoint);
  return result;
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
  const [config, setConfig] = useState<SiteConfig>(() => {
    const storedTheme = loadThemeFromStorage();
    return storedTheme ? { ...defaultConfig, theme: storedTheme } : defaultConfig;
  });
  const [loading, setLoading] = useState(true);
  const [dbAvailable, setDbAvailable] = useState(false);

  const fetchVersionRef = useRef(0);
  const savingLockRef = useRef(false);

  const fetchAll = useCallback(async () => {
    const currentVersion = ++fetchVersionRef.current;
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

      if (fetchVersionRef.current !== currentVersion) return;

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
      setDbAvailable(false);
    } finally {
      if (fetchVersionRef.current === currentVersion) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAll();

    // Subscribe to real-time changes on site_settings so ALL devices auto-update
    const channel = supabase
      .channel('site-settings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          // Refetch whenever site_settings changes in DB
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  // ── Admin write helpers ──────────────────────────────────────────────────

  const withSaveLock = useCallback(async <T extends unknown>(fn: () => Promise<T>): Promise<T | 'Save in progress, please wait'> => {
    if (savingLockRef.current) return 'Save in progress, please wait' as unknown as T;
    savingLockRef.current = true;
    try {
      return await fn();
    } finally {
      savingLockRef.current = false;
    }
  }, []);

  const saveSettings = useCallback(async (partial: Partial<SiteConfig>): Promise<string | null> => {
    return withSaveLock(async () => {
      // Save base fields that always exist in the database
      const baseFields = {
        id: 1,
        company: partial.company,
        founder: partial.founder,
        contact: partial.contact,
        social: partial.social,
        seo: partial.seo,
        hero: partial.hero,
        updated_at: new Date().toISOString(),
      };
      const { error: baseError } = await supabase.from('site_settings').upsert(baseFields);
      if (baseError) return baseError.message;

      // Try to save new fields separately (columns may not exist in older databases)
      const newFields: Record<string, unknown> = {};
      if (partial.pricing !== undefined) newFields.pricing = partial.pricing;
      if (partial.blogPosts !== undefined) newFields.blog_posts = partial.blogPosts;
      if (partial.whyChooseUs !== undefined) newFields.why_choose_us = partial.whyChooseUs;
      if (partial.clientLogos !== undefined) newFields.client_logos = partial.clientLogos;
      if (partial.analytics !== undefined) newFields.analytics = partial.analytics;
      if (partial.newsletter !== undefined) newFields.newsletter = partial.newsletter;
      if (partial.intake !== undefined) newFields.intake = partial.intake;
      if (partial.formspreeEndpoint !== undefined) newFields.formspree_endpoint = partial.formspreeEndpoint;
      if (partial.theme !== undefined) {
        newFields.theme = partial.theme;
        saveThemeToStorage(partial.theme);
      }

      if (Object.keys(newFields).length > 0) {
        const { error: newError } = await supabase.from('site_settings').update(newFields).eq('id', 1);
        if (newError && !newError.message?.includes('Could not find')) {
          return newError.message;
        }
      }

      setConfig((prev) => ({ ...prev, ...partial }));
      return null;
    });
  }, [withSaveLock]);

  const saveStats = useCallback(async (stats: Stat[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error: delErr } = await supabase.from('stats').delete().neq('id', '__none__');
      if (delErr) return delErr.message;
      const rows = stats.map((s, i) => ({ ...s, sort_order: i }));
      const { error } = await supabase.from('stats').insert(rows);
      if (error) return error.message;
      setConfig((prev) => ({ ...prev, stats }));
      return null;
    });
  }, [withSaveLock]);

  const saveServices = useCallback(async (services: Service[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error: delErr } = await supabase.from('services').delete().neq('id', '__none__');
      if (delErr) return delErr.message;
      const rows = services.map((s, i) => ({ ...s, sort_order: i }));
      const { error } = await supabase.from('services').insert(rows);
      if (error) return error.message;
      setConfig((prev) => ({ ...prev, services }));
      return null;
    });
  }, [withSaveLock]);

  const saveProjects = useCallback(async (projects: Project[]): Promise<string | null> => {
    return withSaveLock(async () => {
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
    });
  }, [withSaveLock]);

  const saveFaqs = useCallback(async (faqs: FAQ[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error: delErr } = await supabase.from('faqs').delete().neq('id', '__none__');
      if (delErr) return delErr.message;
      const rows = faqs.map((f, i) => ({ ...f, sort_order: i }));
      const { error } = await supabase.from('faqs').insert(rows);
      if (error) return error.message;
      setConfig((prev) => ({ ...prev, faqs }));
      return null;
    });
  }, [withSaveLock]);

  const savePricing = useCallback(async (pricing: PricingTier[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ pricing, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, pricing }));
      return null;
    });
  }, [withSaveLock]);

  const saveBlogPosts = useCallback(async (blogPosts: BlogPost[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ blog_posts: blogPosts, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, blogPosts }));
      return null;
    });
  }, [withSaveLock]);

  const saveWhyChooseUs = useCallback(async (items: WhyChooseItem[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ why_choose_us: items, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, whyChooseUs: items }));
      return null;
    });
  }, [withSaveLock]);

  const saveClientLogos = useCallback(async (logos: ClientLogo[]): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ client_logos: logos, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, clientLogos: logos }));
      return null;
    });
  }, [withSaveLock]);

  const saveAnalytics = useCallback(async (analytics: AnalyticsConfig): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ analytics, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, analytics }));
      return null;
    });
  }, [withSaveLock]);

  const saveNewsletter = useCallback(async (newsletter: NewsletterConfig): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ newsletter, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, newsletter }));
      return null;
    });
  }, [withSaveLock]);

  const saveIntake = useCallback(async (intake: IntakeConfig): Promise<string | null> => {
    return withSaveLock(async () => {
      const { error } = await supabase.from('site_settings').update({ intake, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error && !error.message?.includes('Could not find')) return error.message;
      setConfig((prev) => ({ ...prev, intake }));
      return null;
    });
  }, [withSaveLock]);

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
