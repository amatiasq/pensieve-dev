import { Match, Switch } from 'solid-js';
import { Landing } from './Landing';
import { FixedDialog } from './common/FixedDialog';
import { useSetting } from './common/useSetting';
import { EditActiveFile } from './editor/EditActiveFile';
import { Sidebar } from './sidebar/Sidebar';
import { repoStatus } from './storage/activeRepo';

export function App() {
  return (
    <Switch fallback={<RepositoryEditor />}>
      <Match when={repoStatus() == 'none'}>
        <Landing />
      </Match>
      <Match when={repoStatus() == 'clonning'}>
        <FixedDialog header="Clonning">Git clone in progress...</FixedDialog>
      </Match>
    </Switch>
  );
}

function RepositoryEditor() {
  const [sidebarWidth, setSidebarWidth] = useSetting('sidebarWidth');

  function handleReposition(event: CustomEvent<{ position: number }>) {
    const el = event.target as Element | null;
    const newWidth = el?.firstElementChild?.clientWidth;

    // this event is fired when the sidebar loads
    if (!newWidth) return;

    setSidebarWidth(newWidth);
  }

  return (
    <sl-split-panel
      style="flex: 1"
      positionInPixels={sidebarWidth()}
      on:sl-reposition={handleReposition}
    >
      <aside slot="start">
        <sl-input role="search" placeholder="Search"></sl-input>
        <Sidebar />
      </aside>
      <EditActiveFile slot="end" />
    </sl-split-panel>
  );
}
