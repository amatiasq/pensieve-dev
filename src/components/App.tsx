import { Match, Switch } from 'solid-js';
import { ActiveFileProvider } from '../hooks/ActiveFileProvider';
import { ActiveRepoProvider, hasActiveRepo } from '../hooks/ActiveRepoProvider';
import { useSettingsFile } from '../hooks/useSettingsFile';
import { FileTree } from './FileTree';
import { Homepage } from './Homepage';

export function App() {
  return (
    <ActiveRepoProvider>
      <RepositoryLoader />
    </ActiveRepoProvider>
  );
}

function RepositoryLoader() {
  const state = hasActiveRepo();

  return (
    <Switch>
      <Match when={state() === 'none'}>
        <Homepage />
      </Match>
      <Match when={state() === 'clonning'}>
        <div>Clonning</div>
      </Match>
      <Match when={state() === 'ready'}>
        <ActiveFileProvider>
          <RepositoryEditor />
        </ActiveFileProvider>
      </Match>
    </Switch>
  );
}

function RepositoryEditor() {
  useSettingsFile();

  return (
    <sl-split-panel style="flex: 1">
      <FileTree slot="start" />
      <div slot="end">End</div>
    </sl-split-panel>
  );
}
