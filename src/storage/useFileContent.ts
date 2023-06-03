import { FilePath } from './types';
import { useFile } from './useFile';

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
