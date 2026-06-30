export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;      // HSL e.g. "217 91% 60%"
    'primary-50': string;
    'primary-100': string;
    'primary-200': string;
    'primary-300': string;
    'primary-400': string;
    'primary-500': string;
    'primary-600': string;
    'primary-700': string;
    'primary-800': string;
    'primary-900': string;
    'primary-950': string;
    secondary: string;      // HSL
    'secondary-400': string;
    'secondary-500': string;
    'secondary-600': string;
    accent: string;         // HSL
    'accent-400': string;
    'accent-500': string;
    'accent-600': string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Professional corporate blue with indigo accents — clean, trustworthy, modern.',
    colors: {
      primary: '217 91% 60%',
      'primary-50': '213 100% 97%',
      'primary-100': '213 94% 94%',
      'primary-200': '213 94% 87%',
      'primary-300': '213 94% 78%',
      'primary-400': '213 94% 68%',
      'primary-500': '217 91% 60%',
      'primary-600': '221 83% 53%',
      'primary-700': '224 76% 48%',
      'primary-800': '226 71% 40%',
      'primary-900': '224 64% 33%',
      'primary-950': '226 57% 21%',
      secondary: '239 84% 67%',
      'secondary-400': '238 83% 72%',
      'secondary-500': '239 84% 67%',
      'secondary-600': '243 75% 59%',
      accent: '262 83% 58%',
      'accent-400': '258 90% 66%',
      'accent-500': '262 83% 58%',
      'accent-600': '263 70% 50%',
    },
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    description: 'Fresh eco-friendly green with teal accents — sustainable, growth-focused, organic.',
    colors: {
      primary: '160 84% 39%',
      'primary-50': '152 81% 96%',
      'primary-100': '149 80% 90%',
      'primary-200': '152 69% 77%',
      'primary-300': '156 62% 63%',
      'primary-400': '158 55% 52%',
      'primary-500': '160 84% 39%',
      'primary-600': '161 94% 30%',
      'primary-700': '163 94% 24%',
      'primary-800': '163 88% 20%',
      'primary-900': '164 86% 16%',
      'primary-950': '166 81% 9%',
      secondary: '174 72% 56%',
      'secondary-400': '172 66% 64%',
      'secondary-500': '174 72% 56%',
      'secondary-600': '175 80% 45%',
      accent: '145 80% 42%',
      'accent-400': '143 70% 50%',
      'accent-500': '145 80% 42%',
      'accent-600': '147 75% 35%',
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Deep violet with magenta accents — creative, premium, innovative.',
    colors: {
      primary: '263 70% 50%',
      'primary-50': '270 100% 98%',
      'primary-100': '268 100% 95%',
      'primary-200': '269 100% 92%',
      'primary-300': '269 100% 86%',
      'primary-400': '270 95% 75%',
      'primary-500': '263 70% 50%',
      'primary-600': '262 83% 58%',
      'primary-700': '263 85% 45%',
      'primary-800': '263 70% 40%',
      'primary-900': '264 67% 35%',
      'primary-950': '261 73% 23%',
      secondary: '292 84% 60%',
      'secondary-400': '290 80% 68%',
      'secondary-500': '292 84% 60%',
      'secondary-600': '293 80% 52%',
      accent: '330 81% 60%',
      'accent-400': '330 85% 68%',
      'accent-500': '330 81% 60%',
      'accent-600': '330 75% 50%',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm amber with coral accents — energetic, bold, approachable.',
    colors: {
      primary: '25 95% 53%',
      'primary-50': '24 100% 97%',
      'primary-100': '24 100% 94%',
      'primary-200': '25 100% 88%',
      'primary-300': '25 100% 80%',
      'primary-400': '25 95% 65%',
      'primary-500': '25 95% 53%',
      'primary-600': '21 90% 48%',
      'primary-700': '17 88% 40%',
      'primary-800': '15 79% 34%',
      'primary-900': '15 75% 28%',
      'primary-950': '13 81% 15%',
      secondary: '35 92% 60%',
      'secondary-400': '35 95% 68%',
      'secondary-500': '35 92% 60%',
      'secondary-600': '35 85% 52%',
      accent: '0 84% 60%',
      'accent-400': '0 90% 68%',
      'accent-500': '0 84% 60%',
      'accent-600': '0 75% 50%',
    },
  },
  {
    id: 'crimson-red',
    name: 'Crimson Red',
    description: 'Bold red with rose accents — powerful, confident, action-oriented.',
    colors: {
      primary: '0 84% 60%',
      'primary-50': '0 100% 98%',
      'primary-100': '0 100% 95%',
      'primary-200': '0 100% 90%',
      'primary-300': '0 100% 82%',
      'primary-400': '0 95% 72%',
      'primary-500': '0 84% 60%',
      'primary-600': '0 72% 51%',
      'primary-700': '0 74% 42%',
      'primary-800': '0 70% 35%',
      'primary-900': '0 63% 31%',
      'primary-950': '0 74% 17%',
      secondary: '340 75% 55%',
      'secondary-400': '340 80% 63%',
      'secondary-500': '340 75% 55%',
      'secondary-600': '340 70% 48%',
      accent: '15 85% 55%',
      'accent-400': '15 90% 63%',
      'accent-500': '15 85% 55%',
      'accent-600': '15 80% 48%',
    },
  },
];

export const defaultThemeId = 'ocean-blue';

export function getThemeById(id: string): ThemePreset | undefined {
  return themePresets.find((t) => t.id === id);
}

export function getAllThemeIds(): string[] {
  return themePresets.map((t) => t.id);
}

/**
 * Generate CSS variable overrides for a theme.
 * Returns a string of CSS rules to inject into a <style> tag.
 */
export function generateThemeCSS(themeId: string): string {
  const theme = getThemeById(themeId);
  if (!theme) return '';

  const vars = Object.entries(theme.colors)
    .map(([key, value]) => `  --brand-${key}: ${value};`)
    .join('\n');

  return `:root {\n${vars}\n}`;
}

/**
 * Generate the full base CSS that maps brand variables to the default theme.
 * This is the fallback when no theme is set.
 */
export function generateBaseCSS(): string {
  return generateThemeCSS(defaultThemeId);
}
