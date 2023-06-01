// import monaco components individually?
//
// import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import * as monaco from 'monaco-editor';
import { createEffect, createMemo, onCleanup, untrack } from 'solid-js';
import { extendMonaco } from './monaco/extendMonaco';
import * as monacoHarcodedConfig from './monaco/monacoConfiguration';

extendMonaco({}, {});

export function MonacoEditor(props: {
  filename: string;
  content?: string;
  readonly?: boolean;
  onChange: (content: string) => void;
}) {
  const content = () => props.content;
  const readonly = () => props.readonly;
  const extension = () => props.filename.split('.').pop() || '.md';
  const language = () => getLanguageFor(`.${extension()}`) || 'markdown';
  const isMarkdown = () => language() === 'markdown';
  const lines = createMemo(() => content()?.split('\n').length ?? 0);
  const outgoing = memory<string>();

  const updateableOptions = () => ({
    minimap: { enabled: lines() > 100 },
    readOnly: readonly(),
  });

  const options = createMemo(() => ({
    value: untrack(content),
    language: language(),
    ...monacoHarcodedConfig,
    'semanticHighlighting.enabled': true,
    // renderIndentGuides,
    // rulers,
    // tabSize,
    wordBasedSuggestions: isMarkdown() ? false : true,
    // wordWrap: wordWrap ? 'on' : 'off',
    ...untrack(updateableOptions),
  }));

  const element = (<div />) as HTMLDivElement;
  let editor: ReturnType<typeof monaco.editor.create>;
  let onChangeSubscription: ReturnType<typeof editor.onDidChangeModelContent>;

  createEditor();
  createEffect(createEditor);
  createEffect(() => editor.updateOptions(updateableOptions()));

  createEffect(() => {
    const val = content();

    if (val && !outgoing.has(val)) {
      return editor.setValue(val || '');
    }
  });

  return element;

  function createEditor() {
    editor?.dispose();
    onChangeSubscription?.dispose();

    editor = monaco.editor.create(element, options());

    onChangeSubscription = editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();

      if (newValue !== untrack(content)) {
        outgoing.add(newValue);
        return props.onChange(newValue);
      }
    });

    onCleanup(() => onChangeSubscription.dispose());
  }
}

function getLanguageFor(ext: string) {
  if (!monaco) return null;
  const list = monaco.languages.getLanguages();
  const lang = list.find((lang: any) => lang.extensions?.includes(ext));
  return lang?.id;
}

function memory<T>(...init: T[]) {
  let memory = [...init];

  return {
    add(value: T) {
      memory = [value, memory[0]]; // ...new Set(memory.slice(0, 5))];
      return memory;
    },
    has(value: T) {
      return memory.includes(value);
    },
  };
}
