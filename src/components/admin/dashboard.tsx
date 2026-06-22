import { useState, useEffect } from 'react';
import type { SiteConfig, Testimonial, Project, Service, FAQ, Stat } from '@/types';
import { cn, generateId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Settings, Rocket, Wrench, Star, BarChart3,
  HelpCircle, LogOut, ChevronLeft, ChevronRight,
  Plus, Trash2, Edit2, Check, EyeOff, Save, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardProps {
  config: SiteConfig;
  onSaveSettings: (partial: Partial<SiteConfig>) => Promise<string | null>;
  onSaveStats: (stats: Stat[]) => Promise<string | null>;
  onSaveServices: (services: Service[]) => Promise<string | null>;
  onSaveProjects: (projects: Project[]) => Promise<string | null>;
  onSaveFaqs: (faqs: FAQ[]) => Promise<string | null>;
  onRefetch: () => Promise<void>;
  onLogout: () => void;
}

type TabId = 'overview' | 'settings' | 'projects' | 'services' | 'testimonials' | 'stats' | 'faq';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'settings',      label: 'General Settings',  icon: Settings },
  { id: 'projects',      label: 'Projects',          icon: Rocket },
  { id: 'services',      label: 'Services',          icon: Wrench },
  { id: 'testimonials',  label: 'Testimonials',      icon: Star },
  { id: 'stats',         label: 'Stats',             icon: BarChart3 },
  { id: 'faq',           label: 'FAQ',               icon: HelpCircle },
];

export function Dashboard({
  config,
  onSaveSettings,
  onSaveStats,
  onSaveServices,
  onSaveProjects,
  onSaveFaqs,
  onLogout,
}: DashboardProps) {
  const [activeTab, setActiveTab]         = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFAQ, setEditingFAQ]       = useState<FAQ | null>(null);
  const [editingStat, setEditingStat]     = useState<Stat | null>(null);

  const approvedCount = config.testimonials.filter((t) => t.approved).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e27] flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-40 bg-white dark:bg-[#0f1535] border-r border-black/5 dark:border-white/10 transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
      )}>
        <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
          <div className={cn('flex items-center gap-2', !sidebarOpen && 'lg:hidden')}>
            <img src="/images/attatech-logo.png" alt="" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[#0a0e27] dark:text-white">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#0a0e27] dark:hover:text-white',
              !sidebarOpen && 'lg:justify-center'
            )}>
              <tab.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-black/5 dark:border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-[#0a0e27] dark:text-white">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your website content</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Projects"         value={config.projects.length}    icon={Rocket}    color="blue" />
                <StatCard label="Services"         value={config.services.length}    icon={Wrench}    color="indigo" />
                <StatCard label="Approved Reviews" value={approvedCount}             icon={Star}      color="green" />
                <StatCard label="FAQs"             value={config.faqs.length}        icon={HelpCircle} color="orange" />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  ✅ All changes save directly to Supabase — every visitor sees updates instantly.
                </p>
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
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500', indigo: 'bg-indigo-500/10 text-indigo-500',
    green: 'bg-green-500/10 text-green-500', orange: 'bg-orange-500/10 text-orange-500',
  };
  return (
    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-[#0a0e27] dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

/* ── Settings Editor ──────────────────────────────────────────────────────── */
function SettingsEditor({ config, onSaveSettings }: { config: SiteConfig; onSaveSettings: (p: Partial<SiteConfig>) => Promise<string | null> }) {
  const [form, setForm] = useState({ ...config });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const err = await onSaveSettings(form);
    if (err) toast.error(err);
    else toast.success('Settings saved! ✅');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">General Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your company info and contact details</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-lg transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-[#0a0e27] dark:text-white">Company Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name"  value={form.company.name}         onChange={(v) => setForm({ ...form, company: { ...form.company, name: v } })} />
          <Field label="Tagline"       value={form.company.tagline}      onChange={(v) => setForm({ ...form, company: { ...form.company, tagline: v } })} />
          <Field label="Founded"       value={form.company.founded}      onChange={(v) => setForm({ ...form, company: { ...form.company, founded: v } })} />
          <Field label="Location"      value={form.company.location}     onChange={(v) => setForm({ ...form, company: { ...form.company, location: v } })} />
        </div>

        <h3 className="font-semibold text-[#0a0e27] dark:text-white pt-4">Founder</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name"  value={form.founder.name}  onChange={(v) => setForm({ ...form, founder: { ...form.founder, name: v } })} />
          <Field label="Title" value={form.founder.title} onChange={(v) => setForm({ ...form, founder: { ...form.founder, title: v } })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Bio</label>
          <textarea value={form.founder.bio} onChange={(e) => setForm({ ...form, founder: { ...form.founder, bio: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
        </div>

        <h3 className="font-semibold text-[#0a0e27] dark:text-white pt-4">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="WhatsApp"      value={form.contact.whatsapp}     onChange={(v) => setForm({ ...form, contact: { ...form.contact, whatsapp: v } })} />
          <Field label="Phone"         value={form.contact.phone}        onChange={(v) => setForm({ ...form, contact: { ...form.contact, phone: v } })} />
          <Field label="Email"         value={form.contact.email}        onChange={(v) => setForm({ ...form, contact: { ...form.contact, email: v } })} />
          <Field label="Address"       value={form.contact.address}      onChange={(v) => setForm({ ...form, contact: { ...form.contact, address: v } })} />
          <Field label="Working Hours" value={form.contact.workingHours} onChange={(v) => setForm({ ...form, contact: { ...form.contact, workingHours: v } })} />
        </div>

        <h3 className="font-semibold text-[#0a0e27] dark:text-white pt-4">Social Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="WhatsApp Link" value={form.social.whatsapp}  onChange={(v) => setForm({ ...form, social: { ...form.social, whatsapp: v } })} />
          <Field label="LinkedIn"      value={form.social.linkedin}  onChange={(v) => setForm({ ...form, social: { ...form.social, linkedin: v } })} />
          <Field label="GitHub"        value={form.social.github}    onChange={(v) => setForm({ ...form, social: { ...form.social, github: v } })} />
          <Field label="Twitter"       value={form.social.twitter}   onChange={(v) => setForm({ ...form, social: { ...form.social, twitter: v } })} />
        </div>

        <h3 className="font-semibold text-[#0a0e27] dark:text-white pt-4">SEO</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Title"    value={form.seo.title}    onChange={(v) => setForm({ ...form, seo: { ...form.seo, title: v } })} />
          <div>
            <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Description</label>
            <textarea value={form.seo.description} onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
          </div>
          <Field label="Keywords" value={form.seo.keywords} onChange={(v) => setForm({ ...form, seo: { ...form.seo, keywords: v } })} />
        </div>

        <h3 className="font-semibold text-[#0a0e27] dark:text-white pt-4">Hero Section</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Headline"    value={form.hero.headline}    onChange={(v) => setForm({ ...form, hero: { ...form.hero, headline: v } })} />
          <Field label="Subheadline" value={form.hero.subheadline} onChange={(v) => setForm({ ...form, hero: { ...form.hero, subheadline: v } })} />
          <Field label="CTA Primary Text"  value={form.hero.ctaPrimary.text}   onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaPrimary: { ...form.hero.ctaPrimary, text: v } } })} />
          <Field label="CTA Primary Link"  value={form.hero.ctaPrimary.link}   onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaPrimary: { ...form.hero.ctaPrimary, link: v } } })} />
          <Field label="CTA Secondary Text" value={form.hero.ctaSecondary.text}  onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaSecondary: { ...form.hero.ctaSecondary, text: v } } })} />
          <Field label="CTA Secondary Link" value={form.hero.ctaSecondary.link}  onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaSecondary: { ...form.hero.ctaSecondary, link: v } } })} />
          <Field label="Trust Bar (comma-separated)" value={form.hero.trustBar.join(', ')} onChange={(v) => setForm({ ...form, hero: { ...form.hero, trustBar: v.split(',').map(s => s.trim()).filter(Boolean) } })} />
        </div>

        <h3 className="font-semibold text-[#0a0e27] dark:text-white pt-4">Contact Form</h3>
        <Field label="Formspree Endpoint" value={form.formspreeEndpoint} onChange={(v) => setForm({ ...form, formspreeEndpoint: v })} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

/* ── Projects Editor ──────────────────────────────────────────────────────── */
function ProjectsEditor({ config, onSaveProjects, editingProject, setEditingProject }: {
  config: SiteConfig; onSaveProjects: (p: Project[]) => Promise<string | null>;
  editingProject: Project | null; setEditingProject: (p: Project | null) => void;
}) {
  const saveProject = async (project: Project) => {
    const exists = config.projects.find((p) => p.id === project.id);
    const updated = exists ? config.projects.map((p) => (p.id === project.id ? project : p)) : [...config.projects, project];
    const err = await onSaveProjects(updated);
    if (err) toast.error(err);
    else { toast.success('Project saved! ✅'); setEditingProject(null); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const err = await onSaveProjects(config.projects.filter((p) => p.id !== id));
    if (err) toast.error(err); else toast.success('Project deleted');
  };

  if (editingProject) return <ProjectForm project={editingProject} onSave={saveProject} onCancel={() => setEditingProject(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">Projects</h2><p className="text-sm text-muted-foreground">Manage your portfolio projects</p></div>
        <button onClick={() => setEditingProject({ id: generateId(), title: '', client: '', industry: '', location: '', year: '', type: 'Web Apps', description: '', longDescription: '', features: [], results: [], techStack: [], liveUrl: '', screenshots: [] })} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      <div className="space-y-3">
        {config.projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {project.screenshots[0] && <img src={project.screenshots[0].src} alt="" className="w-16 h-12 object-cover rounded-lg" />}
              <div><h3 className="font-medium text-[#0a0e27] dark:text-white">{project.title}</h3><p className="text-sm text-muted-foreground">{project.client} · {project.type}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingProject(project)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => deleteProject(project.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ project, onSave, onCancel }: { project: Project; onSave: (p: Project) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Project>({ ...project });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">{form.title ? 'Edit Project' : 'Add Project'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title"    value={form.title}    onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Client"   value={form.client}   onChange={(v) => setForm({ ...form, client: v })} />
          <Field label="Industry" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
          <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <Field label="Year"     value={form.year}     onChange={(v) => setForm({ ...form, year: v })} />
          <Field label="Type"     value={form.type}     onChange={(v) => setForm({ ...form, type: v })} />
          <Field label="Live URL" value={form.liveUrl}  onChange={(v) => setForm({ ...form, liveUrl: v })} />
        </div>
        <div><label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} /></div>
        <div><label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Long Description</label><textarea value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} /></div>
        <div><label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Features (one per line)</label><textarea value={form.features.join('\n')} onChange={(e) => setForm({ ...form, features: e.target.value.split('\n').filter((f) => f.trim()) })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} /></div>
        <div><label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Results (one per line)</label><textarea value={form.results.join('\n')} onChange={(e) => setForm({ ...form, results: e.target.value.split('\n').filter((f) => f.trim()) })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} /></div>
        <Field label="Tech Stack (comma-separated)" value={form.techStack.join(', ')} onChange={(v) => setForm({ ...form, techStack: v.split(',').map((s) => s.trim()) })} />
      </div>
    </div>
  );
}

/* ── Services Editor ──────────────────────────────────────────────────────── */
function ServicesEditor({ config, onSaveServices, editingService, setEditingService }: {
  config: SiteConfig; onSaveServices: (s: Service[]) => Promise<string | null>;
  editingService: Service | null; setEditingService: (s: Service | null) => void;
}) {
  const saveService = async (service: Service) => {
    const exists = config.services.find((s) => s.id === service.id);
    const updated = exists ? config.services.map((s) => (s.id === service.id ? service : s)) : [...config.services, service];
    const err = await onSaveServices(updated);
    if (err) toast.error(err); else { toast.success('Service saved! ✅'); setEditingService(null); }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const err = await onSaveServices(config.services.filter((s) => s.id !== id));
    if (err) toast.error(err); else toast.success('Service deleted');
  };

  if (editingService) return <ServiceForm service={editingService} onSave={saveService} onCancel={() => setEditingService(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">Services</h2><p className="text-sm text-muted-foreground">Manage your services</p></div>
        <button onClick={() => setEditingService({ id: generateId(), icon: 'Code', title: '', description: '', tags: [] })} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Plus className="w-4 h-4" /> Add Service</button>
      </div>
      <div className="space-y-3">
        {config.services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div><h3 className="font-medium text-[#0a0e27] dark:text-white">{service.title}</h3><p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingService(service)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => deleteService(service.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceForm({ service, onSave, onCancel }: { service: Service; onSave: (s: Service) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Service>({ ...service });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">{form.title ? 'Edit Service' : 'Add Service'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <div><label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} /></div>
        <Field label="Icon (Lucide name)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
        <Field label="Tags (comma-separated)" value={form.tags.join(', ')} onChange={(v) => setForm({ ...form, tags: v.split(',').map((s) => s.trim()) })} />
      </div>
    </div>
  );
}

/* ── Testimonials Editor (Supabase live) ─────────────────────────────────── */
function TestimonialsEditor({ config }: { config: SiteConfig }) {
  const [dbReviews, setDbReviews] = useState<(Testimonial & { db_id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchAllReviews(); }, []);

  const fetchAllReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setDbReviews(data.map((row) => ({ db_id: row.id, id: row.id, name: row.name, role: row.role || '', company: row.company || '', rating: row.stars, text: row.review_text, approved: row.approved, date: row.created_at })));
    } catch { toast.error('Reviews load nahi ho sake'); }
    finally { setIsLoading(false); }
  };

  const toggleApproval = async (dbId: string, currentApproved: boolean) => {
    setActionLoading(dbId);
    try {
      const { error } = await supabase.from('reviews').update({ approved: !currentApproved }).eq('id', dbId);
      if (error) throw error;
      setDbReviews((prev) => prev.map((r) => (r.db_id === dbId ? { ...r, approved: !currentApproved } : r)));
      toast.success(!currentApproved ? 'Review approved! ✅' : 'Review hidden');
    } catch { toast.error('Action fail ho gaya'); }
    finally { setActionLoading(null); }
  };

  const deleteReview = async (dbId: string) => {
    if (!confirm('Delete this review?')) return;
    setActionLoading(dbId);
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', dbId);
      if (error) throw error;
      setDbReviews((prev) => prev.filter((r) => r.db_id !== dbId));
      toast.success('Review deleted');
    } catch { toast.error('Delete fail ho gaya'); }
    finally { setActionLoading(null); }
  };

  const pendingCount = dbReviews.filter((r) => !r.approved).length;
  void config;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">
            Testimonials {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full">{pendingCount} pending</span>}
          </h2>
          <p className="text-sm text-muted-foreground">Approve visitor reviews to show on site</p>
        </div>
        <button onClick={fetchAllReviews} className="flex items-center gap-2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors">↻ Refresh</button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : dbReviews.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No reviews yet</p>
      ) : (
        <div className="space-y-3">
          {dbReviews.map((t) => (
            <div key={t.db_id} className={cn('bg-white dark:bg-white/5 border rounded-xl p-4 flex items-start justify-between', t.approved ? 'border-green-200 dark:border-green-500/20' : 'border-yellow-200 dark:border-yellow-500/20')}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-medium text-[#0a0e27] dark:text-white">{t.name}</span>
                  {(t.role || t.company) && <span className="text-sm text-muted-foreground">{t.role}{t.company ? `, ${t.company}` : ''}</span>}
                  <span className={cn('px-2 py-0.5 text-xs rounded-full', t.approved ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400')}>
                    {t.approved ? 'Approved ✅' : 'Pending ⏳'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{t.text}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={cn('w-3 h-3', i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />))}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => toggleApproval(t.db_id, t.approved)} disabled={actionLoading === t.db_id} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50">
                  {t.approved ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Check className="w-4 h-4 text-green-500" />}
                </button>
                <button onClick={() => deleteReview(t.db_id)} disabled={actionLoading === t.db_id} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50">
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

/* ── Stats Editor ─────────────────────────────────────────────────────────── */
function StatsEditor({ config, onSaveStats, editingStat, setEditingStat }: {
  config: SiteConfig; onSaveStats: (s: Stat[]) => Promise<string | null>;
  editingStat: Stat | null; setEditingStat: (s: Stat | null) => void;
}) {
  const saveStat = async (stat: Stat) => {
    const exists = config.stats.find((s) => s.id === stat.id);
    const updated = exists ? config.stats.map((s) => (s.id === stat.id ? stat : s)) : [...config.stats, stat];
    const err = await onSaveStats(updated);
    if (err) toast.error(err); else { toast.success('Stats saved! ✅'); setEditingStat(null); }
  };

  if (editingStat) return <StatForm stat={editingStat} onSave={saveStat} onCancel={() => setEditingStat(null)} />;

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">Stats</h2><p className="text-sm text-muted-foreground">Edit your achievement numbers</p></div>
      <div className="space-y-3">
        {config.stats.map((stat) => (
          <div key={stat.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-blue-500">{stat.value}{stat.suffix}</div>
              <div><h3 className="font-medium text-[#0a0e27] dark:text-white">{stat.label}</h3><p className="text-sm text-muted-foreground">Icon: {stat.icon}</p></div>
            </div>
            <button onClick={() => setEditingStat(stat)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatForm({ stat, onSave, onCancel }: { stat: Stat; onSave: (s: Stat) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Stat>({ ...stat });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">Edit Stat</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Label"            value={form.label}  onChange={(v) => setForm({ ...form, label: v })} />
        <Field label="Value"            value={form.value}  onChange={(v) => setForm({ ...form, value: v })} />
        <Field label="Suffix"           value={form.suffix} onChange={(v) => setForm({ ...form, suffix: v })} />
        <Field label="Icon (Lucide name)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
      </div>
    </div>
  );
}

/* ── FAQ Editor ───────────────────────────────────────────────────────────── */
function FAQEditor({ config, onSaveFaqs, editingFAQ, setEditingFAQ }: {
  config: SiteConfig; onSaveFaqs: (f: FAQ[]) => Promise<string | null>;
  editingFAQ: FAQ | null; setEditingFAQ: (f: FAQ | null) => void;
}) {
  const saveFAQ = async (faq: FAQ) => {
    const exists = config.faqs.find((f) => f.id === faq.id);
    const updated = exists ? config.faqs.map((f) => (f.id === faq.id ? faq : f)) : [...config.faqs, faq];
    const err = await onSaveFaqs(updated);
    if (err) toast.error(err); else { toast.success('FAQ saved! ✅'); setEditingFAQ(null); }
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    const err = await onSaveFaqs(config.faqs.filter((f) => f.id !== id));
    if (err) toast.error(err); else toast.success('FAQ deleted');
  };

  if (editingFAQ) return <FAQForm faq={editingFAQ} onSave={saveFAQ} onCancel={() => setEditingFAQ(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">FAQ</h2><p className="text-sm text-muted-foreground">Manage frequently asked questions</p></div>
        <button onClick={() => setEditingFAQ({ id: generateId(), question: '', answer: '' })} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Plus className="w-4 h-4" /> Add FAQ</button>
      </div>
      <div className="space-y-3">
        {config.faqs.length === 0 && <p className="text-muted-foreground text-center py-8">No FAQs yet</p>}
        {config.faqs.map((faq) => (
          <div key={faq.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex items-start justify-between">
            <div><h3 className="font-medium text-[#0a0e27] dark:text-white">{faq.question}</h3><p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p></div>
            <div className="flex items-center gap-1 ml-4 shrink-0">
              <button onClick={() => setEditingFAQ(faq)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => deleteFAQ(faq.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQForm({ faq, onSave, onCancel }: { faq: FAQ; onSave: (f: FAQ) => void; onCancel: () => void }) {
  const [form, setForm] = useState<FAQ>({ ...faq });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0a0e27] dark:text-white">{faq.question ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Question" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
        <div><label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Answer</label><textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} /></div>
      </div>
    </div>
  );
}
