import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';
import { Repository } from '../tools/Repository';

export type RepositoryState = 'none' | 'clonning' | 'ready';
const provider = createContext<Accessor<Repository | null>>(() => null);

export function useRepoState() {
  const repo = useContext(provider);

  return () => {
    const value = repo();

    if (value == null) {
      throw new Error('No active repo');
    }

    return value;
  };
}

export function hasActiveRepo(): Accessor<RepositoryState> {
  const repo = useContext(provider);

  return () => {
    const value = repo();
    if (value == null) return 'none';
    if (value.isCloning()) return 'clonning';
    return 'ready';
  };
}

export function ActiveRepoProvider(props: ParentProps) {
  const [repo, setRepo] = createSignal(getRepositoryFromUrl());

  window.addEventListener('locationchange', () =>
    setRepo(getRepositoryFromUrl())
  );

  return <provider.Provider value={repo}>{props.children}</provider.Provider>;
}

function getRepositoryFromUrl() {
  const url = new URL(location.href);

  const [user, repo] = url.pathname
    .replace(/^\/pensieve-dev/, '')
    .split('/')
    .filter(Boolean);

  return user && repo ? new Repository(user, repo) : null;
}
