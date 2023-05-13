import { emitter } from '@amatiasq/emitter';
import { Scheduler } from '@amatiasq/scheduler';
import { debounceTime, map, mergeWith } from 'rxjs/operators';
import {
  batch,
  createEffect,
  createSignal,
  onCleanup,
  untrack,
} from 'solid-js';
import { useStack } from '../hooks/useStack';
import { Router } from '../tools/Router';
import { onPageActive } from '../tools/page-lifecycle';
import { fromEmitter } from '../tools/rxjs-extensions';
import { setPageTitle } from '../tools/usePageTitle';
import { MonacoEditor } from './MonacoEditor';

interface BaseEditorProps {
  key: string;
  title: string;
  content: string;
  ext?: string;
  gap?: string;
}

type ReadonlyEditorProps = BaseEditorProps & { readonly: true };
type EditableEditorProps = BaseEditorProps & {
  saveOnNavigation?: boolean;
  onChange?(unsaved: string): void;
  onSave(newValue: string, options: { urgent: boolean }): void;
};

export type EditorProps = ReadonlyEditorProps | EditableEditorProps;

function useWindowListener<T extends keyof WindowEventMap>(
  event: T,
  listener: (this: Window, ev: WindowEventMap[T]) => any
) {
  window.addEventListener(event, listener);
  onCleanup(() => window.removeEventListener(event, listener));
}

export function Editor(props: EditorProps) {
  const requestSave = emitter<void>();
  const requestUrgentSave = emitter<void>();

  const [saved, addSaved] = useStack(5, props.content);
  const [value, setValue] = createSignal(props.content);
  const [hasUnsavedChanges, setHasUnsavedChanged] = createSignal(false);
  // TODO:
  const autosave = 5 as number; // useSetting('autosave')[0] || 0;

  const readonly = () => isReadonly(props) || false;
  const content = () => props.content;

  createEffect(() => setPageTitle(props.title));

  const scheduler = new Scheduler(autosave * 1000, () => {
    if (autosave !== 0) {
      requestSave();
    }
  });

  const router = new Router();
  router.onNavigate(stopScheduler);
  onCleanup(() => router.clearListeners());

  // useShortcut('save', forceSave);

  if (isEditable(props) && props.saveOnNavigation) {
    useWindowListener('popstate', () => requestSave());
  }

  createEffect(() => {
    if (!untrack(saved).includes(content())) {
      batch(() => {
        setHasUnsavedChanged(false);
        setValue(content);
      });
    }
  });

  const userIdleSubscription = onPageActive.subscribe((active) => {
    if (!active) requestUrgentSave();
  });
  onCleanup(() => userIdleSubscription.unsubscribe());

  const urgent = fromEmitter(requestUrgentSave).pipe(
    map(() => ({ urgent: true }))
  );

  const saveSubscription = fromEmitter(requestSave)
    .pipe(debounceTime(100), mergeWith(urgent))
    .subscribe((options) => hasUnsavedChanges() && forceSave(options || {}));

  onCleanup(() => saveSubscription.unsubscribe());

  return (
    <div>
      <MonacoEditor
        ext={props.ext}
        gap={props.gap}
        value={value()}
        readonly={readonly()}
        onChange={onEditorChange}
      />
      {/* <BusinessIndicator /> */}
    </div>
  );

  function stopScheduler() {
    // Stop the scheduler when unmounting
    if (scheduler.isRunning) {
      scheduler.stop();
      if (hasUnsavedChanges()) {
        forceSave();
      }
    }
  }

  function onEditorChange(value = '') {
    if (!isEditable(props)) wtf();

    batch(() => {
      setHasUnsavedChanged(value !== content());
      setValue(value);
      props.onChange && props.onChange(value);
      scheduler.restart();
    });
  }

  function forceSave({ urgent = false } = {}) {
    if (!hasUnsavedChanges) {
      console.warn('Possibly creating an empty commit!');
    }

    if (!isEditable(props)) wtf();

    batch(() => {
      scheduler.stop();
      addSaved(value());
      const formatted = format(value());
      addSaved(formatted);
      setHasUnsavedChanged(false);
      props.onSave(formatted, { urgent });
    });
  }
}

function format(value: string) {
  const trimmed = value.replace(/ +\n| +$/g, '\n');

  if (trimmed[trimmed.length - 1] === '\n') {
    return trimmed;
  }

  return `${trimmed}\n`;
}

function isReadonly(props: EditorProps): props is ReadonlyEditorProps {
  return 'readonly' in props;
}

function isEditable(props: EditorProps): props is EditableEditorProps {
  return 'onSave' in props;
}

function wtf(): never {
  throw new Error('How the fuck did you get here???');
}
