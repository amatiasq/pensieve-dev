import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';

import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
  createEffect,
  createMemo,
  getOwner,
  runWithOwner,
  untrack,
} from 'solid-js';

export function MonacoEditor(props: {
  filename: string;
  content?: string | null;
  readonly?: boolean;
  onChange: (content: string) => void;
}) {
  const language = createMemo(() => {
    const extension = props.filename.split('.').pop()!;
    return getLanguageFor(`.${extension}`) || 'markdown';
  });

  const element = (<div />) as HTMLDivElement;
  let memory = [] as string[];
  let editor: editor.IStandaloneCodeEditor | null = null;

  createEffect(
    () => {
      if (editor) editor.dispose();
      editor = initializeMonaco();

      editor.getModel()?.onDidChangeContent(reportChangeInContent);
    },
    { defer: true }
  );

  const owner = getOwner();

  function reportChangeInContent() {
    memory = [
      // multiline, prettier don't inline this, thanks
      props.content ?? '',
      ...new Set(memory.slice(0, 5)),
    ];

    runWithOwner(owner!, () => {
      props.onChange?.(editor!.getValue());
    });
  }

  createEffect(() => {
    console.log('[MonacoEditor.recived]', props.content);

    if (!editor) return;

    if (props.content !== editor.getValue())
      editor.setValue(props.content || '');
  });

  return element;

  function initializeMonaco() {
    return monaco.editor.create(element, {
      value: untrack(() => props.content) || '',
      theme: 'vs-dark',
      readOnly: props.readonly || false,
      wordBasedSuggestions: language() === 'markdown' ? false : true,
      language: language(),
      rulers: [80, 120],
      tabSize: 2,
      'semanticHighlighting.enabled': true,
      wordWrap: true ? 'on' : 'off',
    });
  }
}

function getLanguageFor(ext: string) {
  if (!monaco) return null;
  const list = monaco.languages.getLanguages();
  const lang = list.find((lang: any) => lang.extensions?.includes(ext));
  return lang?.id;
}
