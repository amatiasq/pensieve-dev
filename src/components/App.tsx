import { Match, Switch } from 'solid-js';
import { FixedDialog } from '../atoms/FixedDialog';
import { ActiveFileProvider } from '../hooks/ActiveFileProvider';
import { ActiveRepoProvider, repoStatus } from '../hooks/ActiveRepoProvider';
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
  const status = repoStatus();

  return (
    <Switch fallback={<RepositoryEditor />}>
      <Match when={status() == 'none'}>
        <Landing />
      </Match>
      <Match when={status() == 'clonning'}>
        <FixedDialog header="Clonning">Git clone in progress...</FixedDialog>
      </Match>
    </Switch>
  );
}

function RepositoryEditor() {
  return (
    <ActiveFileProvider>
      <sl-split-panel style="flex: 1">
        <aside slot="start">
          <sl-input role="search" placeholder="Search"></sl-input>
          <FileTree />
        </aside>
        <div slot="end">End</div>
      </sl-split-panel>
    </ActiveFileProvider>
  );
}
