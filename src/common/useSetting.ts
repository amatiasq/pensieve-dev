import { createEffect, createSignal } from 'solid-js';
import { FilePath, executeFile } from '../storage/mod';

interface Settings {
  autosave: number;
  highlight: Record<string, string>;
  links: Record<string, string>;
  reloadIfAwayForSeconds: number;
  renderIndentGuides: boolean;
  rulers: number | number[];
  sidebarVisible: boolean;
  sidebarWidth: number;
  starNewNotes: boolean;
  tabSize: number;
  wordWrap: boolean;
  customizeFileList: (files: string[]) => string[];
  foo: (a: number) => void;
}

const DEFAULT_SETTINGS: Settings = {
  autosave: 5,
  highlight: {
    '~~[^~]*~~': '#505050',
    '@(\\w|-)+': '#6fb9ef',
  },
  links: {
    '\\[(\\w+/\\w+)]': 'https://github.com/$1',
  },
  reloadIfAwayForSeconds: 5,
  renderIndentGuides: false,
  rulers: [],
  sidebarVisible: true,
  sidebarWidth: 400,
  starNewNotes: true,
  tabSize: 2,
  wordWrap: true,
  customizeFileList: (files) => files,
  foo: (files) => files,
};

const files = ['pensieve.js', 'pensieve.ts'].map(FilePath).map(executeFile);
const [settings, setSettings] = createSignal<Partial<Settings>>({});

createEffect(() => {
  setSettings(() => {
    for (const file of files) {
      const mod = file();
      if (mod) return mod;
    }

    return {};
  });
});

export function useSetting<Key extends keyof Settings>(key: Key) {
  return [
    () => settings()[key] ?? DEFAULT_SETTINGS[key],
    (value: Settings[Key]) => {
      throw new Error('Are you nuts!?');
    },
  ] as const;
}
