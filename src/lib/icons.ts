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
  Headphones, Headset, LifeBuoy, MessageCircle,
  GitBranch, GitFork, GitMerge, Terminal, Braces, FileCode,
  Lock, Unlock, Key, BookOpen, Award, Trophy, Lightbulb,
  Monitor, Laptop, Smartphone, Wifi, Signal, Battery,
  Truck, Plane, Anchor, Compass, Navigation,
  Book, Bookmark, Library, GraduationCap, Microscope,
  HeartPulse, Stethoscope, Brain, Glasses,
  Scan, ScanLine, QrCode, Fingerprint, BadgeCheck,
  ShieldCheck, ShieldAlert, LockOpen, KeyRound,
  HandHelping, Accessibility, Hand,
  Paintbrush, PaintBucket, Pencil, Eraser, Highlighter,
  Scissors, Sticker, StickyNote,
  Folder, FolderOpen, File, FileSpreadsheet,
  Calculator, Scale, Ruler,
  TreePine, TreeDeciduous, Flower, Leaf,
  CloudRain, CloudSnow, Wind, Flame,
  Droplets, Waves, Mountain,
  Tent, Fish, Bug, Rabbit, Cat, Dog,
  Egg, Cookie, Coffee, Beer, Wine, GlassWater,
  Cherry, Apple, Carrot, Pizza, Hamburger, Sandwich,
  Drumstick, Bone, Popcorn, IceCream, Candy, Donut,
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
  Headphones, Headset, LifeBuoy, MessageCircle,
  GitBranch, GitFork, GitMerge, Terminal, Braces, FileCode,
  Lock, Unlock, Key, BookOpen, Award, Trophy, Lightbulb,
  Monitor, Laptop, Smartphone, Wifi, Signal, Battery,
  Truck, Plane, Anchor, Compass, Navigation,
  Book, Bookmark, Library, GraduationCap, Microscope,
  HeartPulse, Stethoscope, Brain, Glasses,
  Scan, ScanLine, QrCode, Fingerprint, BadgeCheck,
  ShieldCheck, ShieldAlert, LockOpen, KeyRound,
  HandHelping, Accessibility, Hand,
  Paintbrush, PaintBucket, Pencil, Eraser, Highlighter,
  Scissors, Sticker, StickyNote,
  Folder, FolderOpen, File, FileSpreadsheet,
  Calculator, Scale, Ruler,
  TreePine, TreeDeciduous, Flower, Leaf,
  CloudRain, CloudSnow, Wind, Flame,
  Droplets, Waves, Mountain,
  Tent, Fish, Bug, Rabbit, Cat, Dog,
  Egg, Cookie, Coffee, Beer, Wine, GlassWater,
  Cherry, Apple, Carrot, Pizza, Hamburger, Sandwich,
  Drumstick, Bone, Popcorn, IceCream, Candy, Donut,
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
