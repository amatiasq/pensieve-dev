import { css } from '@emotion/css';
import { ParentProps } from 'solid-js';

const styles = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function Center(props: ParentProps<{ fullscreen?: boolean }>) {
  return (
    <div class={styles} style={{ height: props.fullscreen ? '100vh' : '100%' }}>
      {props.children}
    </div>
  );
}
