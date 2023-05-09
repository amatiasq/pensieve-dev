import { ParentProps } from 'solid-js';

export function FixedDialog(props: ParentProps<{ header: string }>) {
  return (
    <sl-dialog label={props.header} open on:sl-request-close={preventClose}>
      {props.children}
    </sl-dialog>
  );

  function preventClose(event: any) {
    event.preventDefault();
  }
}
