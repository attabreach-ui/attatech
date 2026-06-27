import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Centralized icon resolver for AttaTech.
 *
 * Tries to resolve ANY Lucide icon name dynamically from the full
 * lucide-react namespace. This means admin users can enter any valid
 * Lucide icon name (e.g. "Brain", "Camera", "Fingerprint") and it
 * will render without code changes.
 *
 * Fallback: Code icon if the name is missing or invalid.
 */
export function getIcon(
  name: string | undefined | null,
  fallback: LucideIcon = LucideIcons.Code
): LucideIcon {
  if (!name) return fallback;
  const Icon = (LucideIcons as Record<string, unknown>)[name] as LucideIcon | undefined;
  return Icon || fallback;
}

/** Re-export the full namespace for advanced use cases. */
export { LucideIcons };

/** Re-export type for convenience. */
export type { LucideIcon };

/** Explicit map for fast static lookup (optional). */
export const iconMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;
