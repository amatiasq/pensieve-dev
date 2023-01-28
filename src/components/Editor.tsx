import { createEffect, createSignal } from 'solid-js';
import { MonacoEditor } from './MonacoEditor';
import { useActiveFile } from './useActiveFile';
import { useActiveRepo } from './useActiveRepo';

export function Editor(props: { readonly?: boolean }) {
  const repo = useActiveRepo();
  const route = useActiveFile();
  const [content, setContent] = createSignal(null as string | null);

  createEffect(() => {
    const value = route();
    if (value) repo().getFileContent(value).then(setContent);
    else setContent('No file selected');
  });

  return <MonacoEditor filename={route() || 'none'} content={content()} />;
}
