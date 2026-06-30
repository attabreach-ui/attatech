import { useEffect, useMemo } from 'react';
import { generateThemeCSS, defaultThemeId } from '@/lib/themes';

interface ThemeProviderProps {
  themeId: string;
  children: React.ReactNode;
}

/**
 * Injects a <style> tag that sets CSS custom properties based on the active theme.
 * All brand-colored components read from these variables.
 */
export function ThemeProvider({ themeId, children }: ThemeProviderProps) {
  const css = useMemo(() => {
    const id = themeId || defaultThemeId;
    return generateThemeCSS(id);
  }, [themeId]);

  useEffect(() => {
    let style = document.getElementById('attatech-theme-vars') as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = 'attatech-theme-vars';
      document.head.appendChild(style);
    }
    style.textContent = css;
  }, [css]);

  // Cross-tab sync: if another tab changes the theme in localStorage, update immediately
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'attatech-theme' && e.newValue) {
        const newCss = generateThemeCSS(e.newValue);
        let style = document.getElementById('attatech-theme-vars') as HTMLStyleElement | null;
        if (!style) {
          style = document.createElement('style');
          style.id = 'attatech-theme-vars';
          document.head.appendChild(style);
        }
        style.textContent = newCss;
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return <>{children}</>;
}
