import { Match, Switch } from 'solid-js';
import { FixedDialog } from './common/FixedDialog';
import { Landing } from './common/Landing';
import { EditActiveFile } from './editor/EditActiveFile';
import { Sidebar } from './sidebar/Sidebar';
import { ActiveFileProvider } from './storage/ActiveFileProvider';
import { ActiveRepoProvider, repoStatus } from './storage/ActiveRepoProvider';

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
  //   const sidebarWidth = useSetting('sidebarWidth');

  return (
    <ActiveFileProvider>
      <sl-split-panel style="flex: 1">
        <aside slot="start" style={`width: ${300}px`}>
          <sl-input role="search" placeholder="Search"></sl-input>
          <Sidebar />
        </aside>
        <EditActiveFile slot="end" />
      </sl-split-panel>
    </ActiveFileProvider>
  );
}
