import { Match, Switch, batch, createEffect, createSignal } from 'solid-js';
import { useActiveFile } from '../hooks/ActiveFileProvider';
import { useActiveRepo } from '../hooks/ActiveRepoProvider';
import { MonacoEditor } from './MonacoEditor';

export function EditActiveFile(props: { slot?: string }) {
  const repo = useActiveRepo();
  const file = useActiveFile();

  const [ready, setReady] = createSignal(false);
  const [content, setContent] = createSignal('');

  createEffect(async () => {
    setReady(false);
    const storedContent = await repo().getFileContent(file()!);

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
            onChange={(x) => console.log('AAAA', x)}
          />
        </Match>
      </Switch>
    </div>
  );
}
