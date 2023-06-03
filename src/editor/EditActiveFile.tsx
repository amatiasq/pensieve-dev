import { Match, Switch, createResource } from 'solid-js';
import { activeFilePath } from '../storage/ActiveFileProvider';
import { activeRepo } from '../storage/ActiveRepoProvider';
import { MonacoEditor } from './MonacoEditor';

export function EditActiveFile(props: { slot?: string }) {
  const [content] = createResource(() => file()?.getContent());

  return (
    <div id="editor" slot={props.slot}>
      <Switch fallback={<div>loading...</div>}>
        <Match when={!content.loading}>
          <MonacoEditor
            filename={activeFilePath()!}
            content={content()}
            onChange={handleChange}
          />
        </Match>
      </Switch>
    </div>
  );

  function file() {
    const filePath = activeFilePath();
    return filePath && activeRepo().file(filePath);
  }

  function handleChange(newContent: string) {
    const currentFile = file();

    if (currentFile) {
      currentFile.content = newContent;
    }
  }
}
