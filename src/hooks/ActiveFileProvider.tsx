import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';

const provider = createContext<Accessor<string | null>>(() => null);

export function useActiveFile() {
  return useContext(provider) as Accessor<string>;
}

export function ActiveFileProvider(props: ParentProps) {
  const [route, setRoute] = createSignal(location.hash.substring(1));

  window.addEventListener('hashchange', () =>
    setRoute(location.hash.substring(1))
  );

  return <provider.Provider value={route}>{props.children}</provider.Provider>;
}
