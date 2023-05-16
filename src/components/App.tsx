import { Match, Switch } from 'solid-js';
import { FixedDialog } from '../atoms/FixedDialog';
import { ActiveFileProvider } from '../hooks/ActiveFileProvider';
import { ActiveRepoProvider, repoStatus } from '../hooks/ActiveRepoProvider';
import { useSetting } from '../hooks/useSettingsFile';
import { EditActiveFile } from './EditActiveFile';
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
  const sidebarWidth = useSetting('sidebarWidth');

  return (
    <ActiveFileProvider>
      <sl-split-panel style="flex: 1">
        <aside slot="start" style={`width: ${sidebarWidth}px`}>
          <sl-input role="search" placeholder="Search"></sl-input>
          <FileTree />
        </aside>
        <EditActiveFile slot="end" />
      </sl-split-panel>
    </ActiveFileProvider>
  );
}
