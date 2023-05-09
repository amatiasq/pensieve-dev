import { createEffect, createSignal } from 'solid-js';
import { useActiveRepo } from './ActiveRepoProvider';

interface Settings {}

const SETTINGS_FILES = ['pensieve.js', 'pensieve.ts'];

export function useSettingsFile() {
  const repo = useActiveRepo();

  const [settings, setSettings] = createSignal<Settings>({});

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
