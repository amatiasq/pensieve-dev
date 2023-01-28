import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';

const ActiveFileProvider = createContext<Accessor<string | null>>(() => null);

export function useActiveFile() {
  return useContext(ActiveFileProvider);
}

export function ProvideActiveFile(props: ParentProps) {
  const [route, setRoute] = createSignal(location.hash.substring(1));

  window.addEventListener('hashchange', () =>
    setRoute(location.hash.substring(1))
  );

  return (
    <ActiveFileProvider.Provider value={route}>
      {props.children}
    </ActiveFileProvider.Provider>
  );
}
