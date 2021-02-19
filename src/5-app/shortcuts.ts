import { CommandName, getCommand } from '../1-core/commands';
import { onShortcut } from '../1-core/keyboard';
import { getSetting, onSettingsChanged } from './settings';

export const DEFAULT_SHORTCUTS: Record<string, CommandName> = {
  'CTRL+TAB': 'goBack',
  'CTRL+SHIFT+TAB': 'goForward',

  'ALT+N': 'toggleWordWrap',

  'CMD+S': 'saveCurrentFile',
  'CMD+,': 'settings',
  'CMD+B': 'hideSidebar',
  'CMD+W': 'goHome',
  'CMD+N': 'createGist',
  'CMD+T': 'createFile',

  // 'CMD+ArrowRight': 'nextFile',
  // 'CMD+ArrowLeft': 'prevFile',

  'CTRL+S': 'saveCurrentFile',
  'CTRl+,': 'settings',
  'CTRL+B': 'hideSidebar',
  'CTRL+W': 'goHome',
  'CTRL+N': 'createGist',
  'CTRL+T': 'createFile',

  // 'ALT+CTRL+META+SHIFT+Space': () =>
  // 'ALT+CMD+CTRL+SHIFT+Space': () =>
};

const normalizeKeys = (x: string) =>
  x.toUpperCase().replace(/CMD|WINDOWS|WIN/, 'META');

export function initShorcuts() {
  let shortcuts = getShortcuts();

  onSettingsChanged(() => (shortcuts = getShortcuts()));

  onShortcut(event => {
    const keys = event.keys.join('+').toUpperCase();

    if (event.keys.length > 1) {
      console.log(keys);
    }

    if (keys in shortcuts) {
      const commandName = shortcuts[keys];
      const command = getCommand(commandName);

      console.log('Shortcut received', {
        keys,
        commandName,
        command,
      });

      if (typeof command === 'function') {
        event.preventDefault();
        command();
      }
    }
  });

  function getShortcuts() {
    const value = getSetting('shortcuts') || DEFAULT_SHORTCUTS;

    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [normalizeKeys(key), value]),
    );
  }
}