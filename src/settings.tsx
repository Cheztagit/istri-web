import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  accent: string;
  soft: string;
}

export const THEMES: Theme[] = [
  { id: 'krim', name: 'Krim Susu', bg: '#f5ead6', bg2: '#ead9bd', accent: '#9a5b32', soft: '#d9b48a' },
  { id: 'karamel', name: 'Karamel', bg: '#f2e2c4', bg2: '#e3cc9f', accent: '#8a4b1f', soft: '#cf9f64' },
  { id: 'kopi', name: 'Kopi Susu', bg: '#efe3d6', bg2: '#ddc8b2', accent: '#6e4630', soft: '#b98f70' },
  { id: 'kayu', name: 'Kayu Muda', bg: '#f4ecdc', bg2: '#e4d6bb', accent: '#7b5a2e', soft: '#c9ac78' },
];

export interface Settings {
  themeId: string;
  name: string;
  photo: string | null;
}

const DEFAULTS: Settings = { themeId: 'krim', name: 'kamu', photo: null };
const KEY = 'bunga-buatmu-settings';

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* storage bisa diblokir; pakai default */
  }
  return DEFAULTS;
}

interface Ctx {
  s: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<Ctx>({ s: DEFAULTS, update: () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(load);

  useEffect(() => {
    const t = THEMES.find((x) => x.id === s.themeId) ?? THEMES[0];
    const root = document.documentElement.style;
    root.setProperty('--bg', t.bg);
    root.setProperty('--bg2', t.bg2);
    root.setProperty('--accent', t.accent);
    root.setProperty('--soft', t.soft);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* abaikan */
    }
  }, [s]);

  const update = (patch: Partial<Settings>) => setS((prev) => ({ ...prev, ...patch }));
  return <SettingsContext.Provider value={{ s, update }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
