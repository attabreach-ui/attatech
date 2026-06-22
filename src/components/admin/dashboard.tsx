import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SiteConfig, Testimonial, Project, Service, FAQ, Stat } from '@/types';
import { cn, generateId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Settings, Rocket, Wrench, Star, BarChart3,
  HelpCircle, LogOut, ChevronLeft, Menu,
  Plus, Trash2, Edit2, Check, EyeOff, Save, Loader2, X,
  TrendingUp, TrendingDown, Minus, ArrowUpRight, Activity,
  ChevronDown, Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { AdminHeader, type Notification } from './admin-header';
import type { User } from '@supabase/supabase-js';

interface DashboardProps {
  config: SiteConfig;
  onSaveSettings: (partial: Partial<SiteConfig>) => Promise<string | null>;
  onSaveStats: (stats: Stat[]) => Promise<string | null>;
  onSaveServices: (services: Service[]) => Promise<string | null>;
  onSaveProjects: (projects: Project[]) => Promise<string | null>;
  onSaveFaqs: (faqs: FAQ[]) => Promise<string | null>;
  onRefetch: () => Promise<void>;
  onLogout: () => void;
  user: User | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type TabId = 'overview' | 'settings' | 'projects' | 'services' | 'testimonials' | 'stats' | 'faq';

interface SidebarCategory {
  label: string;
  items: { id: TabId; label: string; icon: React.ElementType }[];
}

const sidebarCategories: SidebarCategory[] = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'stats', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'projects', label: 'Projects', icon: Rocket },
      { id: 'services', label: 'Services', icon: Wrench },
      { id: 'testimonials', label: 'Reviews', icon: Star },
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ],
  },
  {
    label: 'Settings',
    items: [
      { id: 'settings', label: 'General', icon: Settings },
    ],
  },
];

const allTabs = sidebarCategories.flatMap((c) => c.items);

// ─── Mock activity data (will be replaced with real data when available) ───
function generateMockActivity(): ActivityItem[] {
  const now = new Date();
  return [
    { id: '1', type: 'update', title: 'Project updated', description: 'Pakfrost WMS details modified', timestamp: new Date(now.getTime() - 1000 * 60 * 30), icon: Rocket },
    { id: '2', type: 'create', title: 'New service added', description: 'Cloud-Based SaaS Solutions', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), icon: Wrench },
    { id: '3', type: 'review', title: 'New review received', description: 'From Ahmed K. — 5 stars', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), icon: Star },
    { id: '4', type: 'update', title: 'FAQ updated', description: 'Pricing question modified', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), icon: HelpCircle },
    { id: '5', type: 'setting', title: 'SEO settings changed', description: 'Meta description updated', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 48), icon: Settings },
  ];
}

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'review' | 'setting';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ElementType;
}

// ─── Mock chart data ───
const mockChartData = [
  { name: 'Mon', visitors: 120, pageViews: 240 },
  { name: 'Tue', visitors: 132, pageViews: 260 },
  { name: 'Wed', visitors: 101, pageViews: 210 },
  { name: 'Thu', visitors: 134, pageViews: 280 },
  { name: 'Fri', visitors: 90, pageViews: 190 },
  { name: 'Sat', visitors: 230, pageViews: 450 },
  { name: 'Sun', visitors: 210, pageViews: 410 },
];

const mockContentDistribution = [
  { name: 'Projects', value: 1, color: '#3b82f6' },
  { name: 'Services', value: 8, color: '#6366f1' },
  { name: 'Reviews', value: 1, color: '#22c55e' },
  { name: 'FAQs', value: 6, color: '#f97316' },
];

export function Dashboard({
  config,
  onSaveSettings,
  onSaveStats,
  onSaveServices,
  onSaveProjects,
  onSaveFaqs,
  onRefetch,
  onLogout,
  user,
  darkMode,
  toggleDarkMode,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [activityFeed] = useState<ActivityItem[]>(generateMockActivity());
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const approvedCount = config.testimonials.filter((t) => t.approved).length;

  // Generate notifications based on real data
  const notifications: Notification[] = useMemo(() => {
    const notifs: Notification[] = [];
    if (config.projects.length === 0) {
      notifs.push({ id: 'n1', title: 'No projects yet', message: 'Add your first project to showcase your work', type: 'warning', timestamp: new Date(), read: false });
    }
    if (config.testimonials.length > 0 && config.testimonials.some((t) => !t.approved)) {
      notifs.push({ id: 'n2', title: 'Pending reviews', message: `${config.testimonials.filter((t) => !t.approved).length} review(s) awaiting approval`, type: 'info', timestamp: new Date(), read: false });
    }
    notifs.push({ id: 'n3', title: 'Welcome to AttaTech Admin', message: 'All changes are saved directly to Supabase', type: 'success', timestamp: new Date(), read: true });
    return notifs;
  }, [config.projects.length, config.testimonials]);

  const breadcrumbs = useMemo(() => {
    const tab = allTabs.find((t) => t.id === activeTab);
    return [
      { label: 'Admin', href: '/admin' },
      { label: tab?.label || 'Dashboard' },
    ];
  }, [activeTab]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Find matching tab and navigate
    const lower = query.toLowerCase();
    const match = allTabs.find((t) => t.label.toLowerCase().includes(lower));
    if (match) {
      setActiveTab(match.id);
      toast.success(`Navigated to ${match.label}`);
    } else {
      toast.info('No matching section found');
    }
  }, []);

  const toggleCategory = (label: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Mobile sidebar overlay
  const MobileSidebarOverlay = () => (
    <>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e27] flex">
      {/* Mobile Sidebar Overlay */}
      <MobileSidebarOverlay />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-[#0f1535] border-r border-black/5 dark:border-white/10 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20',
          mobileSidebarOpen && 'w-64 lg:w-64'
        )}
      >
        {/* Sidebar Header - Logo */}
        <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
          <div className={cn('flex items-center gap-2', (!sidebarOpen && !mobileSidebarOpen) && 'lg:hidden')}>
            <img src="/images/attatech-logo.png" alt="" className="w-7 h-7 object-contain" />
            <span className="font-bold text-sm text-[#0a0e27] dark:text-white">AttaTech</span>
          </div>
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileSidebarOpen(false);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {mobileSidebarOpen ? (
              <X className="w-4 h-4 lg:hidden" />
            ) : (
              <ChevronLeft className={cn('w-4 h-4 hidden lg:block', !sidebarOpen && 'rotate-180')} />
            )}
          </button>
        </div>

        {/* Sidebar Navigation - Grouped */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {sidebarCategories.map((category) => {
            const isCollapsed = collapsedCategories[category.label];
            return (
              <div key={category.label}>
                <button
                  onClick={() => toggleCategory(category.label)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-[#0a0e27] dark:hover:text-white transition-colors',
                    (!sidebarOpen && !mobileSidebarOpen) && 'lg:hidden'
                  )}
                >
                  {category.label}
                  <ChevronDown className={cn('w-3 h-3 ml-auto transition-transform', isCollapsed && 'rotate-180')} />
                </button>
                <div className={cn('space-y-1 mt-1', isCollapsed && 'hidden')}>
                  {category.items.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        activeTab === tab.id
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500'
                          : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#0a0e27] dark:hover:text-white',
                        (!sidebarOpen && !mobileSidebarOpen) && 'lg:justify-center'
                      )}
                    >
                      <tab.icon className="w-5 h-5 shrink-0" />
                      {(sidebarOpen || mobileSidebarOpen) && <span>{tab.label}</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer - Logout */}
        <div className="p-3 border-t border-black/5 dark:border-white/10">
          <button
            onClick={onLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors',
              (!sidebarOpen && !mobileSidebarOpen) && 'lg:justify-center'
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(sidebarOpen || mobileSidebarOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        {/* Admin Header */}
        <AdminHeader
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          breadcrumbs={breadcrumbs}
          onLogout={onLogout}
          onSearch={handleSearch}
          notifications={notifications}
        />

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden px-4 pt-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-muted-foreground"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">Dashboard</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage your content and track performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                  <button
                    onClick={() => onRefetch()}
                    className="flex items-center gap-2 px-3 py-2 border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Projects"
                  value={config.projects.length}
                  icon={Rocket}
                  color="blue"
                  trend={0}
                  trendLabel="vs last month"
                />
                <StatCard
                  label="Services"
                  value={config.services.length}
                  icon={Wrench}
                  color="indigo"
                  trend={0}
                  trendLabel="vs last month"
                />
                <StatCard
                  label="Approved Reviews"
                  value={approvedCount}
                  icon={Star}
                  color="green"
                  trend={config.testimonials.length > 0 ? 100 : 0}
                  trendLabel="approval rate"
                />
                <StatCard
                  label="FAQs"
                  value={config.faqs.length}
                  icon={HelpCircle}
                  color="orange"
                  trend={0}
                  trendLabel="vs last month"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#0a0e27] dark:text-white">Weekly Activity</h3>
                      <p className="text-xs text-muted-foreground">Visitors and page views</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Visitors
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        Views
                      </span>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(0,0,0,0.3)" />
                        <YAxis tick={{ fontSize: 12 }} stroke="rgba(0,0,0,0.3)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#0f1535' : '#fff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                        <Line type="monotone" dataKey="pageViews" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Content Distribution */}
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#0a0e27] dark:text-white mb-1">Content Distribution</h3>
                  <p className="text-xs text-muted-foreground mb-4">Breakdown by type</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockContentDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {mockContentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#0f1535' : '#fff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {mockContentDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </span>
                        <span className="font-medium text-[#0a0e27] dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#0a0e27] dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <QuickActionButton
                      icon={Rocket}
                      label="Add New Project"
                      description="Showcase a new project"
                      onClick={() => setActiveTab('projects')}
                    />
                    <QuickActionButton
                      icon={Wrench}
                      label="Add Service"
                      description="Add a service offering"
                      onClick={() => setActiveTab('services')}
                    />
                    <QuickActionButton
                      icon={HelpCircle}
                      label="Add FAQ"
                      description="Answer common questions"
                      onClick={() => setActiveTab('faq')}
                    />
                    <QuickActionButton
                      icon={Settings}
                      label="Edit Settings"
                      description="Update company info"
                      onClick={() => setActiveTab('settings')}
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#0a0e27] dark:text-white">Recent Activity</h3>
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {activityFeed.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0a0e27] dark:text-white">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsEditor config={config} onSaveSettings={onSaveSettings} />
          )}
          {activeTab === 'projects' && (
            <ProjectsEditor config={config} onSaveProjects={onSaveProjects} editingProject={editingProject} setEditingProject={setEditingProject} />
          )}
          {activeTab === 'services' && (
            <ServicesEditor config={config} onSaveServices={onSaveServices} editingService={editingService} setEditingService={setEditingService} />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsEditor config={config} />
          )}
          {activeTab === 'stats' && (
            <StatsEditor config={config} onSaveStats={onSaveStats} editingStat={editingStat} setEditingStat={setEditingStat} />
          )}
          {activeTab === 'faq' && (
            <FAQEditor config={config} onSaveFaqs={onSaveFaqs} editingFAQ={editingFAQ} setEditingFAQ={setEditingFAQ} />
          )}
        </div>

        {/* Admin Footer */}
        <footer className="px-4 lg:px-8 py-4 border-t border-black/5 dark:border-white/10 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>AttaTech Admin v1.0.0 — Built with ♥ in Peshawar, Pakistan</span>
            <span>© {new Date().getFullYear()} AttaTech. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  trendLabel,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend: number;
  trendLabel: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
  };

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-[#0a0e27] dark:text-white">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{trendLabel}</p>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0a0e27] dark:text-white">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e27] flex">
      <div className="w-64 bg-white dark:bg-[#0f1535] border-r border-black/5 dark:border-white/10 animate-pulse" />
      <div className="flex-1 p-8 space-y-8">
        <div className="h-8 bg-black/5 dark:bg-white/5 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-black/5 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-black/5 dark:bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

// ─── Settings Editor (with breadcrumbs) ────────────────────────────────────

function SettingsEditor({
  config,
  onSaveSettings,
}: {
  config: SiteConfig;
  onSaveSettings: (partial: Partial<SiteConfig>) => Promise<string | null>;
}) {
  const [form, setForm] = useState({ ...config });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const err = await onSaveSettings(form);
    if (err) toast.error(err);
    else toast.success('Settings saved!');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">General Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your company info and contact details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-lg transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-6">
        <Section title="Company Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company Name" value={form.company.name} onChange={(v) => setForm({ ...form, company: { ...form.company, name: v } })} />
            <Field label="Tagline" value={form.company.tagline} onChange={(v) => setForm({ ...form, company: { ...form.company, tagline: v } })} />
            <Field label="Founded" value={form.company.founded} onChange={(v) => setForm({ ...form, company: { ...form.company, founded: v } })} />
            <Field label="Location" value={form.company.location} onChange={(v) => setForm({ ...form, company: { ...form.company, location: v } })} />
          </div>
        </Section>

        <Section title="Founder">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" value={form.founder.name} onChange={(v) => setForm({ ...form, founder: { ...form.founder, name: v } })} />
            <Field label="Title" value={form.founder.title} onChange={(v) => setForm({ ...form, founder: { ...form.founder, title: v } })} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Bio</label>
            <textarea
              value={form.founder.bio}
              onChange={(e) => setForm({ ...form, founder: { ...form.founder, bio: e.target.value } })}
              className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp" value={form.contact.whatsapp} onChange={(v) => setForm({ ...form, contact: { ...form.contact, whatsapp: v } })} />
            <Field label="Phone" value={form.contact.phone} onChange={(v) => setForm({ ...form, contact: { ...form.contact, phone: v } })} />
            <Field label="Email" value={form.contact.email} onChange={(v) => setForm({ ...form, contact: { ...form.contact, email: v } })} />
            <Field label="Address" value={form.contact.address} onChange={(v) => setForm({ ...form, contact: { ...form.contact, address: v } })} />
            <Field label="Working Hours" value={form.contact.workingHours} onChange={(v) => setForm({ ...form, contact: { ...form.contact, workingHours: v } })} />
          </div>
        </Section>

        <Section title="Social Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp Link" value={form.social.whatsapp} onChange={(v) => setForm({ ...form, social: { ...form.social, whatsapp: v } })} />
            <Field label="LinkedIn" value={form.social.linkedin} onChange={(v) => setForm({ ...form, social: { ...form.social, linkedin: v } })} />
            <Field label="GitHub" value={form.social.github} onChange={(v) => setForm({ ...form, social: { ...form.social, github: v } })} />
            <Field label="Twitter" value={form.social.twitter} onChange={(v) => setForm({ ...form, social: { ...form.social, twitter: v } })} />
          </div>
        </Section>

        <Section title="SEO">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Title" value={form.seo.title} onChange={(v) => setForm({ ...form, seo: { ...form.seo, title: v } })} />
            <div>
              <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Description</label>
              <textarea
                value={form.seo.description}
                onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <Field label="Keywords" value={form.seo.keywords} onChange={(v) => setForm({ ...form, seo: { ...form.seo, keywords: v } })} />
          </div>
        </Section>

        <Section title="Hero Section">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Headline" value={form.hero.headline} onChange={(v) => setForm({ ...form, hero: { ...form.hero, headline: v } })} />
            <Field label="Subheadline" value={form.hero.subheadline} onChange={(v) => setForm({ ...form, hero: { ...form.hero, subheadline: v } })} />
            <Field label="CTA Primary Text" value={form.hero.ctaPrimary.text} onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaPrimary: { ...form.hero.ctaPrimary, text: v } } })} />
            <Field label="CTA Primary Link" value={form.hero.ctaPrimary.link} onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaPrimary: { ...form.hero.ctaPrimary, link: v } } })} />
            <Field label="CTA Secondary Text" value={form.hero.ctaSecondary.text} onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaSecondary: { ...form.hero.ctaSecondary, text: v } } })} />
            <Field label="CTA Secondary Link" value={form.hero.ctaSecondary.link} onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaSecondary: { ...form.hero.ctaSecondary, link: v } } })} />
            <Field label="Trust Bar (comma-separated)" value={form.hero.trustBar.join(', ')} onChange={(v) => setForm({ ...form, hero: { ...form.hero, trustBar: v.split(',').map((s) => s.trim()).filter(Boolean) } })} />
          </div>
        </Section>

        <Section title="Contact Form">
          <Field label="Formspree Endpoint" value={form.formspreeEndpoint} onChange={(v) => setForm({ ...form, formspreeEndpoint: v })} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-black/5 dark:border-white/10 pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-semibold text-[#0a0e27] dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// ─── Projects Editor (with empty state) ────────────────────────────────────

function ProjectsEditor({
  config,
  onSaveProjects,
  editingProject,
  setEditingProject,
}: {
  config: SiteConfig;
  onSaveProjects: (p: Project[]) => Promise<string | null>;
  editingProject: Project | null;
  setEditingProject: (p: Project | null) => void;
}) {
  const saveProject = async (project: Project) => {
    const exists = config.projects.find((p) => p.id === project.id);
    const updated = exists ? config.projects.map((p) => (p.id === project.id ? project : p)) : [...config.projects, project];
    const err = await onSaveProjects(updated);
    if (err) toast.error(err);
    else {
      toast.success('Project saved!');
      setEditingProject(null);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const err = await onSaveProjects(config.projects.filter((p) => p.id !== id));
    if (err) toast.error(err);
    else toast.success('Project deleted');
  };

  if (editingProject) return <ProjectForm project={editingProject} onSave={saveProject} onCancel={() => setEditingProject(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() =>
            setEditingProject({
              id: generateId(),
              title: '',
              client: '',
              industry: '',
              location: '',
              year: '',
              type: 'Web Apps',
              description: '',
              longDescription: '',
              features: [],
              results: [],
              techStack: [],
              liveUrl: '',
              screenshots: [],
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {config.projects.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">Add your first project to showcase your work on the portfolio.</p>
          <button
            onClick={() =>
              setEditingProject({
                id: generateId(),
                title: '',
                client: '',
                industry: '',
                location: '',
                year: '',
                type: 'Web Apps',
                description: '',
                longDescription: '',
                features: [],
                results: [],
                techStack: [],
                liveUrl: '',
                screenshots: [],
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {config.projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {project.screenshots[0] && (
                  <img src={project.screenshots[0].src} alt="" className="w-16 h-12 object-cover rounded-lg" />
                )}
                <div>
                  <h3 className="font-medium text-[#0a0e27] dark:text-white">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.client} · {project.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Project>({ ...project });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0a0e27] dark:text-white">{form.title ? 'Edit Project' : 'Add Project'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Client" value={form.client} onChange={(v) => setForm({ ...form, client: v })} />
          <Field label="Industry" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
          <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <Field label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} />
          <Field label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} />
          <Field label="Live URL" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Long Description</label>
          <textarea
            value={form.longDescription}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Features (one per line)</label>
          <textarea
            value={form.features.join('\n')}
            onChange={(e) => setForm({ ...form, features: e.target.value.split('\n').filter((f) => f.trim()) })}
            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Results (one per line)</label>
          <textarea
            value={form.results.join('\n')}
            onChange={(e) => setForm({ ...form, results: e.target.value.split('\n').filter((f) => f.trim()) })}
            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <Field label="Tech Stack (comma-separated)" value={form.techStack.join(', ')} onChange={(v) => setForm({ ...form, techStack: v.split(',').map((s) => s.trim()) })} />
      </div>
    </div>
  );
}

// ─── Services Editor (with empty state) ────────────────────────────────────

function ServicesEditor({
  config,
  onSaveServices,
  editingService,
  setEditingService,
}: {
  config: SiteConfig;
  onSaveServices: (s: Service[]) => Promise<string | null>;
  editingService: Service | null;
  setEditingService: (s: Service | null) => void;
}) {
  const saveService = async (service: Service) => {
    const exists = config.services.find((s) => s.id === service.id);
    const updated = exists ? config.services.map((s) => (s.id === service.id ? service : s)) : [...config.services, service];
    const err = await onSaveServices(updated);
    if (err) toast.error(err);
    else {
      toast.success('Service saved!');
      setEditingService(null);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const err = await onSaveServices(config.services.filter((s) => s.id !== id));
    if (err) toast.error(err);
    else toast.success('Service deleted');
  };

  if (editingService) return <ServiceForm service={editingService} onSave={saveService} onCancel={() => setEditingService(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your services</p>
        </div>
        <button
          onClick={() => setEditingService({ id: generateId(), icon: 'Code', title: '', description: '', tags: [] })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {config.services.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-2">No services yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">Add your first service to showcase what you offer.</p>
          <button
            onClick={() => setEditingService({ id: generateId(), icon: 'Code', title: '', description: '', tags: [] })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add First Service
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {config.services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-medium text-[#0a0e27] dark:text-white">{service.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service: Service;
  onSave: (s: Service) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Service>({ ...service });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0a0e27] dark:text-white">{form.title ? 'Edit Service' : 'Add Service'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <Field label="Icon (Lucide name)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
        <Field label="Tags (comma-separated)" value={form.tags.join(', ')} onChange={(v) => setForm({ ...form, tags: v.split(',').map((s) => s.trim()) })} />
      </div>
    </div>
  );
}

// ─── Testimonials Editor (with empty state) ────────────────────────────────

function TestimonialsEditor({ config }: { config: SiteConfig }) {
  const [dbReviews, setDbReviews] = useState<(Testimonial & { db_id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data)
        setDbReviews(
          data.map((row) => ({
            db_id: row.id,
            id: row.id,
            name: row.name,
            role: row.role || '',
            company: row.company || '',
            rating: row.stars,
            text: row.review_text,
            approved: row.approved,
            date: row.created_at,
          }))
        );
    } catch {
      toast.error('Reviews load nahi ho sake');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproval = async (dbId: string, currentApproved: boolean) => {
    setActionLoading(dbId);
    try {
      const { error } = await supabase.from('reviews').update({ approved: !currentApproved }).eq('id', dbId);
      if (error) throw error;
      setDbReviews((prev) => prev.map((r) => (r.db_id === dbId ? { ...r, approved: !currentApproved } : r)));
      toast.success(!currentApproved ? 'Review approved!' : 'Review hidden');
    } catch {
      toast.error('Action fail ho gaya');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReview = async (dbId: string) => {
    if (!confirm('Delete this review?')) return;
    setActionLoading(dbId);
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', dbId);
      if (error) throw error;
      setDbReviews((prev) => prev.filter((r) => r.db_id !== dbId));
      toast.success('Review deleted');
    } catch {
      toast.error('Delete fail ho gaya');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = dbReviews.filter((r) => !r.approved).length;
  void config;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">
            Reviews
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Approve visitor reviews to show on site</p>
        </div>
        <button
          onClick={fetchAllReviews}
          className="flex items-center gap-2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      ) : dbReviews.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-2">No reviews yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Reviews will appear here when visitors submit them through the site.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dbReviews.map((t) => (
            <div
              key={t.db_id}
              className={cn(
                'bg-white dark:bg-white/5 border rounded-xl p-4 flex items-start justify-between',
                t.approved ? 'border-green-200 dark:border-green-500/20' : 'border-yellow-200 dark:border-yellow-500/20'
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-medium text-[#0a0e27] dark:text-white">{t.name}</span>
                  {(t.role || t.company) && (
                    <span className="text-sm text-muted-foreground">
                      {t.role}
                      {t.company ? `, ${t.company}` : ''}
                    </span>
                  )}
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full',
                      t.approved
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    )}
                  >
                    {t.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{t.text}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-3 h-3', i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => toggleApproval(t.db_id, t.approved)}
                  disabled={actionLoading === t.db_id}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  {t.approved ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Check className="w-4 h-4 text-green-500" />}
                </button>
                <button
                  onClick={() => deleteReview(t.db_id)}
                  disabled={actionLoading === t.db_id}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stats Editor (with empty state) ───────────────────────────────────────

function StatsEditor({
  config,
  onSaveStats,
  editingStat,
  setEditingStat,
}: {
  config: SiteConfig;
  onSaveStats: (s: Stat[]) => Promise<string | null>;
  editingStat: Stat | null;
  setEditingStat: (s: Stat | null) => void;
}) {
  const saveStat = async (stat: Stat) => {
    const exists = config.stats.find((s) => s.id === stat.id);
    const updated = exists ? config.stats.map((s) => (s.id === stat.id ? stat : s)) : [...config.stats, stat];
    const err = await onSaveStats(updated);
    if (err) toast.error(err);
    else {
      toast.success('Stats saved!');
      setEditingStat(null);
    }
  };

  if (editingStat) return <StatForm stat={editingStat} onSave={saveStat} onCancel={() => setEditingStat(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">Stats</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Edit your achievement numbers</p>
        </div>
      </div>

      {config.stats.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-2">No stats yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">Add stats to showcase your achievements on the homepage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {config.stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-blue-500">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div>
                  <h3 className="font-medium text-[#0a0e27] dark:text-white">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">Icon: {stat.icon}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStat(stat)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatForm({
  stat,
  onSave,
  onCancel,
}: {
  stat: Stat;
  onSave: (s: Stat) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Stat>({ ...stat });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0a0e27] dark:text-white">Edit Stat</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Label" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
        <Field label="Value" value={form.value} onChange={(v) => setForm({ ...form, value: v })} />
        <Field label="Suffix" value={form.suffix} onChange={(v) => setForm({ ...form, suffix: v })} />
        <Field label="Icon (Lucide name)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
      </div>
    </div>
  );
}

// ─── FAQ Editor (with empty state) ─────────────────────────────────────────

function FAQEditor({
  config,
  onSaveFaqs,
  editingFAQ,
  setEditingFAQ,
}: {
  config: SiteConfig;
  onSaveFaqs: (f: FAQ[]) => Promise<string | null>;
  editingFAQ: FAQ | null;
  setEditingFAQ: (f: FAQ | null) => void;
}) {
  const saveFAQ = async (faq: FAQ) => {
    const exists = config.faqs.find((f) => f.id === faq.id);
    const updated = exists ? config.faqs.map((f) => (f.id === faq.id ? faq : f)) : [...config.faqs, faq];
    const err = await onSaveFaqs(updated);
    if (err) toast.error(err);
    else {
      toast.success('FAQ saved!');
      setEditingFAQ(null);
    }
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    const err = await onSaveFaqs(config.faqs.filter((f) => f.id !== id));
    if (err) toast.error(err);
    else toast.success('FAQ deleted');
  };

  if (editingFAQ) return <FAQForm faq={editingFAQ} onSave={saveFAQ} onCancel={() => setEditingFAQ(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0a0e27] dark:text-white">FAQ</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage frequently asked questions</p>
        </div>
        <button
          onClick={() => setEditingFAQ({ id: generateId(), question: '', answer: '' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {config.faqs.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-2">No FAQs yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">Add FAQs to answer common questions from visitors.</p>
          <button
            onClick={() => setEditingFAQ({ id: generateId(), question: '', answer: '' })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {config.faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-start justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-medium text-[#0a0e27] dark:text-white">{faq.question}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1 ml-4 shrink-0">
                <button
                  onClick={() => setEditingFAQ(faq)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => deleteFAQ(faq.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FAQForm({
  faq,
  onSave,
  onCancel,
}: {
  faq: FAQ;
  onSave: (f: FAQ) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FAQ>({ ...faq });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0a0e27] dark:text-white">{faq.question ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Question" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Answer</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
