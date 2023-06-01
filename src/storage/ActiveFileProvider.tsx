import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';
import { FilePath } from './types';

const provider = createContext<Accessor<FilePath | null>>(() => null);

export function useActiveFilePath() {
  return useContext(provider) as Accessor<FilePath>;
}

export function ActiveFileProvider(props: ParentProps) {
  const [route, setRoute] = createSignal(getFilePathFromUrl());
  window.addEventListener('hashchange', () => setRoute(getFilePathFromUrl()));
  return <provider.Provider value={route}>{props.children}</provider.Provider>;
}

function getFilePathFromUrl() {
  return location.hash.substring(1) as FilePath;
}
