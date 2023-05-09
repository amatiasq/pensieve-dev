import { Match, Switch } from 'solid-js';
import { FixedDialog } from '../atoms/FixedDialog';
import { ActiveFileProvider } from '../hooks/ActiveFileProvider';
import { ActiveRepoProvider, useActiveRepo } from '../hooks/ActiveRepoProvider';
import { FileTree } from './FileTree';
import { Landing } from './Landing';

export function App() {
  return (
    <ActiveRepoProvider>
      <RepositoryLoader />
    </ActiveRepoProvider>
  );
}

function RepositoryLoader() {
  const repo = useActiveRepo();

  return (
    <Switch fallback={<RepositoryEditor />}>
      <Match when={repo() === null}>
        <Landing />
      </Match>
      <Match when={repo().isCloning()}>
        <FixedDialog header="Clonning">Git clone in progress...</FixedDialog>
      </Match>
    </Switch>
  );
}

function RepositoryEditor() {
  return (
    <ActiveFileProvider>
      <sl-split-panel style="flex: 1">
        <FileTree slot="start" />
        <div slot="end">End</div>
      </sl-split-panel>
    </ActiveFileProvider>
  );
}
