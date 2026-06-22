import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Search, Bell, LogOut, Moon, Sun, ChevronRight,
  Keyboard, Command, CheckCircle2, AlertCircle, Info,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminHeaderProps {
  user: SupabaseUser | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  breadcrumbs: { label: string; href?: string }[];
  onLogout: () => void;
  onSearch: (query: string) => void;
  notifications?: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  read: boolean;
}

export function AdminHeader({
  user,
  darkMode,
  toggleDarkMode,
  breadcrumbs,
  onLogout,
  onSearch,
  notifications = [],
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setNotifOpen(false);
        setShortcutHelpOpen(false);
      }
      // ? for shortcut help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShortcutHelpOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
    setSearchOpen(false);
    setSearchQuery('');
  }, [searchQuery, onSearch]);

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split(/[._-]/)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2);
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0a0e27]/80 backdrop-blur-xl">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs */}
          <nav className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 shrink-0 text-sm font-semibold text-[#0a0e27] dark:text-white hover:opacity-80 transition-opacity"
            >
              <img src="/images/attatech-logo.png" alt="" className="w-6 h-6 object-contain" />
              <span className="hidden sm:inline">AttaTech</span>
            </button>
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                {crumb.href ? (
                  <button
                    onClick={() => navigate(crumb.href!)}
                    className="text-sm text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white transition-colors truncate"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-sm text-[#0a0e27] dark:text-white font-medium truncate">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs font-mono">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>

            {/* Mobile search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((p) => !p)}
                className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#0f1535] border border-black/5 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#0a0e27] dark:text-white">Notifications</span>
                      <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              'p-3 flex items-start gap-3 border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer',
                              !n.read && 'bg-blue-50/50 dark:bg-blue-500/5'
                            )}
                          >
                            {getNotifIcon(n.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#0a0e27] dark:text-white">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {n.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.email ? getInitials(user.email) : 'A'}
                </div>
                <span className="hidden md:block text-sm text-[#0a0e27] dark:text-white max-w-[120px] truncate">
                  {user?.email?.split('@')[0] || 'Admin'}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0f1535] border border-black/5 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-black/5 dark:border-white/10">
                      <p className="text-sm font-medium text-[#0a0e27] dark:text-white truncate">{user?.email || 'Admin User'}</p>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          toggleDarkMode();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0a0e27] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                      </button>
                      <button
                        onClick={() => {
                          setShortcutHelpOpen(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0a0e27] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Keyboard className="w-4 h-4" />
                        Keyboard Shortcuts
                      </button>
                      <div className="border-t border-black/5 dark:border-white/10 my-1" />
                      <button
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#0f1535] rounded-xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/10">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search projects, services, reviews, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-transparent text-[#0a0e27] dark:text-white placeholder:text-muted-foreground outline-none text-sm"
              />
              <kbd className="hidden sm:inline-flex px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-xs font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2">
                Press <kbd className="px-1 rounded bg-black/5 dark:bg-white/10 font-mono">Enter</kbd> to search
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {shortcutHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShortcutHelpOpen(false)} />
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-[#0f1535] rounded-xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden">
            <div className="p-4 border-b border-black/5 dark:border-white/10">
              <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground">Press <kbd className="px-1 rounded bg-black/5 dark:bg-white/10 font-mono">?</kbd> anytime to show this</p>
            </div>
            <div className="p-4 space-y-3">
              {[
                { keys: ['⌘', 'K'], desc: 'Open global search' },
                { keys: ['?'], desc: 'Show keyboard shortcuts' },
                { keys: ['Esc'], desc: 'Close any modal/dropdown' },
                { keys: ['⌘', 'B'], desc: 'Toggle sidebar (planned)' },
                { keys: ['⌘', 'S'], desc: 'Save current form (planned)' },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[#0a0e27] dark:text-white">{shortcut.desc}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((k, j) => (
                      <kbd key={j} className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-xs font-mono text-muted-foreground">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
