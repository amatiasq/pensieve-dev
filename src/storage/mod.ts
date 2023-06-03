import { Accessor, createEffect, createSignal } from 'solid-js';
import { activeRepo } from './ActiveRepoProvider';
import { FilePath } from './types';

export * from './types';

export function listFiles() {}

export function useFile(filepath: Accessor<FilePath>) {
  return () => activeRepo.maybe()?.file(filepath());
}

export function useFileContent(filepath: FilePath) {
  const file = useFile(() => filepath);

  function getContent() {
    return file()?.content;
  }

  function setContent(newContent: string) {
    const current = file();
    if (current) current.content = newContent;
  }

  return [getContent, setContent] as const;
}

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
