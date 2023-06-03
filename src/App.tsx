import { Match, Switch } from 'solid-js';
import { Landing } from './Landing';
import { FixedDialog } from './common/FixedDialog';
import { useSetting } from './common/useSetting';
import { EditActiveFile } from './editor/EditActiveFile';
import { Sidebar } from './sidebar/Sidebar';
import { ActiveFileProvider } from './storage/ActiveFileProvider';
import { ActiveRepoProvider, repoStatus } from './storage/ActiveRepoProvider';

export function App() {
  return (
    <ActiveRepoProvider>
      <Switch fallback={<RepositoryEditor />}>
        <Match when={repoStatus() == 'none'}>
          <Landing />
        </Match>
        <Match when={repoStatus() == 'clonning'}>
          <FixedDialog header="Clonning">Git clone in progress...</FixedDialog>
        </Match>
      </Switch>
    </ActiveRepoProvider>
  );
}

function RepositoryEditor() {
  const sidebarWidth = useSetting('sidebarWidth');

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
