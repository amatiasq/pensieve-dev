import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';
import { activeRepo } from './ActiveRepoProvider';
import { FilePath } from './types';

const provider = createContext<Accessor<FilePath | null>>(() => null);
const activeFilePath = () => useContext(provider)();

export function activeFile() {
  const filePath = activeFilePath();
  return filePath && activeRepo().file(filePath);
}

export function ActiveFileProvider(props: ParentProps) {
  const [route, setRoute] = createSignal(getFilePathFromUrl());
  window.addEventListener('hashchange', () => setRoute(getFilePathFromUrl()));
  return <provider.Provider value={route}>{props.children}</provider.Provider>;
}

function getFilePathFromUrl() {
  return location.hash.substring(1) as FilePath;
}
