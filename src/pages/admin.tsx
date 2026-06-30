import { useNavigate } from 'react-router-dom';
import type { SiteConfig, Stat, Service, Project, FAQ } from '@/types';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { LoginForm } from '@/components/admin/login-form';
import { Dashboard } from '@/components/admin/dashboard';
import { Loader2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AdminPageProps {
  config: SiteConfig;
  onSaveSettings: (partial: Partial<SiteConfig>) => Promise<string | null>;
  onSaveStats: (stats: Stat[]) => Promise<string | null>;
  onSaveServices: (services: Service[]) => Promise<string | null>;
  onSaveProjects: (projects: Project[]) => Promise<string | null>;
  onSaveFaqs: (faqs: FAQ[]) => Promise<string | null>;
  onSavePricing: (pricing: SiteConfig['pricing']) => Promise<string | null>;
  onSaveBlogPosts: (posts: SiteConfig['blogPosts']) => Promise<string | null>;
  onSaveWhyChooseUs: (items: SiteConfig['whyChooseUs']) => Promise<string | null>;
  onSaveClientLogos: (logos: SiteConfig['clientLogos']) => Promise<string | null>;
  onSaveAnalytics: (analytics: SiteConfig['analytics']) => Promise<string | null>;
  onSaveNewsletter: (newsletter: SiteConfig['newsletter']) => Promise<string | null>;
  onSaveIntake: (intake: SiteConfig['intake']) => Promise<string | null>;
  onRefetch: () => Promise<void>;
  user: User | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function AdminPage({
  config,
  onSaveSettings,
  onSaveStats,
  onSaveServices,
  onSaveProjects,
  onSaveFaqs,
  onSavePricing,
  onSaveBlogPosts,
  onSaveWhyChooseUs,
  onSaveClientLogos,
  onSaveAnalytics,
  onSaveNewsletter,
  onSaveIntake,
  onRefetch,
  user,
  darkMode,
  toggleDarkMode,
}: AdminPageProps) {
  const { isAuthenticated, loading, login, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f4d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <Dashboard
      config={config}
      onSaveSettings={onSaveSettings}
      onSaveStats={onSaveStats}
      onSaveServices={onSaveServices}
      onSaveProjects={onSaveProjects}
      onSaveFaqs={onSaveFaqs}
      onSavePricing={onSavePricing}
      onSaveBlogPosts={onSaveBlogPosts}
      onSaveWhyChooseUs={onSaveWhyChooseUs}
      onSaveClientLogos={onSaveClientLogos}
      onSaveAnalytics={onSaveAnalytics}
      onSaveNewsletter={onSaveNewsletter}
      onSaveIntake={onSaveIntake}
      onRefetch={onRefetch}
      onLogout={handleLogout}
      user={user}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    />
  );
}
