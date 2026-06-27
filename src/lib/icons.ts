import {
  Code, Zap, Bot, Globe, Cloud, RefreshCw, Package, Users,
  MessageSquareMore, ShoppingCart, BarChart, Settings, Database,
  Shield, Cpu, Layers, Workflow, Warehouse, Briefcase, Heart,
  Clock, Snowflake, MapPin, Wrench, Search, Palette, Code2, Rocket,
  ArrowRight, ArrowLeft, Check, CheckCircle2, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Circle, X, Plus, Minus, Trash2, Edit2,
  EyeOff, Save, Loader2, Send, Star, TrendingUp, TrendingDown,
  Activity, Sparkles, DollarSign, Megaphone, MessageSquare, FileText,
  Image, ToggleLeft, ToggleRight, Tag, Sliders, Link2, ExternalLink,
  Building2, Calendar, User, LayoutDashboard, BarChart3, HelpCircle,
  LogOut, Menu, Eye, Server, Sun, Moon, Bell, Home,
  Phone, Mail, Link, PenTool,
  type LucideIcon,
} from 'lucide-react';

/** Explicit map of commonly-used Lucide icons. Add more here if needed. */
export const iconMap: Record<string, LucideIcon> = {
  Code, Zap, Bot, Globe, Cloud, RefreshCw, Package, Users,
  MessageSquareMore, ShoppingCart, BarChart, Settings, Database,
  Shield, Cpu, Layers, Workflow, Warehouse, Briefcase, Heart,
  Clock, Snowflake, MapPin, Wrench, Search, Palette, Code2, Rocket,
  ArrowRight, ArrowLeft, Check, CheckCircle2, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Circle, X, Plus, Minus, Trash2, Edit2,
  EyeOff, Save, Loader2, Send, Star, TrendingUp, TrendingDown,
  Activity, Sparkles, DollarSign, Megaphone, MessageSquare, FileText,
  Image, ToggleLeft, ToggleRight, Tag, Sliders, Link2, ExternalLink,
  Building2, Calendar, User, LayoutDashboard, BarChart3, HelpCircle,
  LogOut, Menu, Eye, Server, Sun, Moon, Bell, Home,
  Phone, Mail, Link, PenTool,
};

/**
 * Resolve an icon by name. Tries the explicit map first, then falls back to Code.
 *
 * If you need an icon that is not in the map, add its import + entry above.
 * This keeps the bundle small while still allowing dynamic icon resolution.
 */
export function getIcon(
  name: string | undefined | null,
  fallback: LucideIcon = Code
): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] || fallback;
}

/** Re-export type for convenience. */
export type { LucideIcon };
