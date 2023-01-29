import { css } from '@emotion/css';
import { Match, Switch } from 'solid-js';
import { Editor } from './Editor';
import { Homepage } from './Homepage';
import { Sidebar } from './Sidebar';
import { ProvideActiveFile } from './useActiveFile';
import { hasActiveRepo, ProvideActiveRepo } from './useActiveRepo';

const styles = css`
  height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  background-color: #1c1c1c;
`;

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
          <div class={styles}>
            <Sidebar />
            <Editor />
          </div>
        </ProvideActiveFile>
      </Match>
    </Switch>
  );
}
