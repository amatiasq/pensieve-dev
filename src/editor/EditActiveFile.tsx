import { Match, Switch, batch, createEffect, createSignal } from 'solid-js';
import { useActiveFile } from '../storage/ActiveFileProvider';
import { useActiveRepo } from '../storage/ActiveRepoProvider';
import { MonacoEditor } from './MonacoEditor';

export function EditActiveFile(props: { slot?: string }) {
  const repo = useActiveRepo();
  const file = useActiveFile();

  const [ready, setReady] = createSignal(false);
  const [content, setContent] = createSignal('');

  createEffect(async () => {
    setReady(false);
    const storedContent = await repo().getFileContent(file());

    batch(() => {
      setContent(storedContent!);
      setReady(true);
    });
  });

  return (
    <div id="editor" slot={props.slot}>
      <Switch fallback={<div>loading...</div>}>
        <Match when={ready()}>
          <MonacoEditor
            filename={file()!}
            content={content()}
            onChange={(x) => {
              setContent(x);
              repo().writeFile(file(), x);
            }}
          />
        </Match>
      </Switch>
    </div>
  );
}
