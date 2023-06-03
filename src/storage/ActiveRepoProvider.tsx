import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';
import { Repository } from './Repository';

const provider = createContext<Accessor<Repository | null>>(() => null);

const repo = useContext(provider);

export function activeRepo() {
  const value = repo();
  if (!value) throw new Error('No active repository');
  return value;
}
activeRepo.maybe = repo;

export function repoStatus() {
  const value = repo();
  if (value == null) return 'none';
  if (value.isCloning()) return 'clonning';
  return 'ready';
}

export function ActiveRepoProvider(props: ParentProps) {
  const [repo, setRepo] = createSignal(getRepositoryFromUrl());

  window.addEventListener('locationchange', () => {
    return setRepo(getRepositoryFromUrl());
  });

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
