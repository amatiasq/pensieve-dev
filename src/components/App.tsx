import { Match, Switch } from 'solid-js';
import { FixedDialog } from '../atoms/FixedDialog';
import { ActiveFileProvider, useActiveFile } from '../hooks/ActiveFileProvider';
import { ActiveRepoProvider, repoStatus } from '../hooks/ActiveRepoProvider';
import { FileTree } from './FileTree';
import { Landing } from './Landing';
import { MonacoEditor } from './MonacoEditor';

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
        <EditActiveFile slot="end" />
      </sl-split-panel>
    </ActiveFileProvider>
  );
}

function EditActiveFile(props: { slot?: string }) {
  const file = useActiveFile();
  return (
    <MonacoEditor filename={file()!} onChange={(x) => console.log('AAAA', x)} />
  );
}
//   const file = useActiveFile();
//   const router = new Router();

//   // const [note, { loading, draft }] = useNote(noteId);
//   // const [content, setContent] = useNoteContent(noteId);

//   // if (loading) {
//   //   return <Loader />;
//   // }

//   if (!file()) {
//     console.error(`Note ${file} not found`);
//     router.goRoot();
//     return null;
//   }

//   return (
//     <Editor
//       key={file()!}
//       title={file()!}
//       content={file()!}
//       saveOnNavigation
//       onChange={(x) => console.log('CHANGE', x)}
//       onSave={(x) => console.log('SAVE', x)}
//       // key={note.id}
//       // title={note.title}
//       // content={content}
//       // saveOnNavigation
//       // onChange={draft}
//       // onSave={setContent}
//     />
//   );
// }
