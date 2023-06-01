import { Match, Switch, batch, createEffect, createSignal } from 'solid-js';
import { useActiveFilePath } from '../storage/ActiveFileProvider';
import { useActiveRepo } from '../storage/ActiveRepoProvider';
import { FileContent } from '../storage/types';
import { MonacoEditor } from './MonacoEditor';

export function EditActiveFile(props: { slot?: string }) {
  const repo = useActiveRepo();
  const filePath = useActiveFilePath();
  const file = () => repo().getFile(filePath());

  const [ready, setReady] = createSignal(false);
  const [content, setContent] = createSignal('');

  createEffect(async () => {
    setReady(false);
    const storedContent = await file().getContent();

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
            filename={filePath()!}
            content={content()}
            onChange={(x) => {
              setContent(x);
              file().setDraft(x as FileContent);
            }}
          />
        </Match>
      </Switch>
    </div>
  );
}
