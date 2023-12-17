import { createEffect, createSignal } from 'solid-js';
import { FilePath } from './types';
import { useFileContent } from './useFileContent';

export function executeFile<T = unknown>(filepath: FilePath) {
  const type = 'text/javascript';
  const [module, setModule] = createSignal<T | null>(null);
  const [content] = useFileContent(filepath);

  createEffect(async () => {
    const currentContent = content();
    console.log('EXECUTE', filepath, currentContent);
    if (!currentContent) return setModule(null);

    const blob = new Blob([currentContent!], { type });
    const url = URL.createObjectURL(blob);
    const module = await import(/* @vite-ignore */ url);

    URL.revokeObjectURL(url);
    return setModule(module);
  });

  return module;
}
