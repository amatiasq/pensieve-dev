import { ParentProps } from 'solid-js';

export function Center(props: ParentProps<{ fullscreen?: boolean }>) {
  return (
    <div class="center" style={{ height: props.fullscreen ? '100vh' : '100%' }}>
      {props.children}
    </div>
  );
}
