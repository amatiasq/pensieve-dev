import { createEffect } from 'solid-js';
import { activeFile } from '../storage/activeFile';
import { MonacoEditor } from './MonacoEditor';

export function EditActiveFile(props: { slot?: string }) {
  createEffect(() => activeFile()?.fetchContent());

  return (
    <div id="editor" slot={props.slot}>
      <MonacoEditor
        filename={activeFile()?.path ?? ''}
        content={activeFile()?.content ?? ''}
        onChange={handleChange}
      />
    </div>
  );

  function handleChange(newContent: string) {
    const currentFile = activeFile();

    if (currentFile) {
      currentFile.content = newContent;
    }
  }
}
