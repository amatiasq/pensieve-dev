import { Accessor, createEffect, createSignal } from 'solid-js';
import { useActiveRepo } from './ActiveRepoProvider';

interface Settings {
  // [key: string]: any;
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

const SETTINGS_FILES = ['pensieve.js', 'pensieve.ts'];

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

export function useSettingsFile() {
  const repo = useActiveRepo();
  const [settings, setSettings] = createSignal<Partial<Settings>>({});

  createEffect(async () => {
    // watch changes in file list
    repo().files();

    for (const file of SETTINGS_FILES) {
      if (await repo().hasFile(file)) {
        try {
          const content = await repo().importFile(file);
          setSettings(content);
          console.log('Settings:', content);
        } catch (e) {
          console.error(`Error importing config file: ${file}`, e);
        }
      }
    }
  });

  return settings;
}

export function useSetting<Key extends keyof Settings>(
  key: Key
): Accessor<Settings[Key]> {
  const settingsFile = useSettingsFile();

  return () => {
    const settings = settingsFile();
    const value = settings[key];
    return value ?? DEFAULT_SETTINGS[key];
  };
}

type FnSettings = Pick<
  Settings,
  {
    [Key in keyof Settings]: Settings[Key] extends (...args: any[]) => any
      ? Key
      : never;
  }[keyof Settings]
>;

export function useSettingFunction<Key extends keyof FnSettings>(
  key: Key
): (...args: Parameters<FnSettings[Key]>) => ReturnType<FnSettings[Key]> {
  const settingsFile = useSettingsFile();

  return (...args: Parameters<Settings[Key]>): ReturnType<Settings[Key]> => {
    const settings = settingsFile();
    const fn = settings[key] as any;
    const def = DEFAULT_SETTINGS[key] as any;

    if (typeof fn !== 'function') {
      return def(...args);
    }

    try {
      return fn(...args);
    } catch (error) {
      console.error(`Error running setting function: ${key}`, error);
      return def(...args);
    }
  };
}
