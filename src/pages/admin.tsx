import { useNavigate } from 'react-router-dom';
import type { SiteConfig, Stat, Service, Project, FAQ } from '@/types';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { LoginForm } from '@/components/admin/login-form';
import { Dashboard } from '@/components/admin/dashboard';
import { Loader2 } from 'lucide-react';

interface AdminPageProps {
  config: SiteConfig;
  onSaveSettings: (partial: Partial<SiteConfig>) => Promise<string | null>;
  onSaveStats: (stats: Stat[]) => Promise<string | null>;
  onSaveServices: (services: Service[]) => Promise<string | null>;
  onSaveProjects: (projects: Project[]) => Promise<string | null>;
  onSaveFaqs: (faqs: FAQ[]) => Promise<string | null>;
  onRefetch: () => Promise<void>;
}

export function AdminPage({
  config,
  onSaveSettings,
  onSaveStats,
  onSaveServices,
  onSaveProjects,
  onSaveFaqs,
  onRefetch,
}: AdminPageProps) {
  const { isAuthenticated, loading, login, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Wait for Supabase session check
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f4d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
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
      onRefetch={onRefetch}
      onLogout={handleLogout}
    />
  );
}
