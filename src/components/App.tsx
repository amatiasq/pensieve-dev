import { Match, Switch } from 'solid-js';
import styles from './App.module.css';
import { Editor } from './Editor';
import { Homepage } from './Homepage';
import { Sidebar } from './Sidebar';
import { ProvideActiveFile } from './useActiveFile';
import { hasActiveRepo, ProvideActiveRepo } from './useActiveRepo';

export function App() {
  return (
    <ProvideActiveRepo>
      <RepositoryEditor />
    </ProvideActiveRepo>
  );
}

function RepositoryEditor() {
  return (
    <Switch>
      <Match when={!hasActiveRepo()}>
        <Homepage />
      </Match>
      <Match when={hasActiveRepo()}>
        <ProvideActiveFile>
          <div class={styles.root}>
            <Sidebar />
            <Editor />
          </div>
        </ProvideActiveFile>
      </Match>
    </Switch>
  );
}
