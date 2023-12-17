import { Accessor } from 'solid-js';
import { activeRepo } from './activeRepo';
import { FilePath } from './types';

export function useFile(filepath: Accessor<FilePath>) {
  return () => activeRepo.maybe()?.file(filepath());
}
