import { useActiveFilePath } from './ActiveFileProvider';
import { useActiveRepo } from './ActiveRepoProvider';

export function useActiveFile() {
  const repo = useActiveRepo();
  const filePath = useActiveFilePath();
  return () => repo().getFile(filePath());
}
