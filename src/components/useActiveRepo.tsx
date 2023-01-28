import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';
import { Repository } from '../tools/Repository';

const ActiveRepoProvider = createContext<Accessor<Repository | null>>(
  () => null
);

export function useActiveRepo() {
  const repo = useContext(ActiveRepoProvider);

  return () => {
    const value = repo();

    if (value == null) {
      throw new Error('No active repo');
    }

    return value;
  };
}

export function hasActiveRepo() {
  const repo = useContext(ActiveRepoProvider);
  return repo() != null;
}

export function ProvideActiveRepo(props: ParentProps) {
  const [repo, setRepo] = createSignal(getRepositoryFromUrl());

  window.addEventListener('locationchange', () =>
    setRepo(getRepositoryFromUrl())
  );

  return (
    <ActiveRepoProvider.Provider value={repo}>
      {props.children}
    </ActiveRepoProvider.Provider>
  );
}

function getRepositoryFromUrl() {
  const url = new URL(location.href);
  const [user, repo, ...params] = url.pathname.split('/').filter(Boolean);
  return user && repo ? new Repository(user, repo) : null;
}
