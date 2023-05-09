import { SlInput } from '@shoelace-style/shoelace';

export function Homepage() {
  let input!: SlInput;

  return (
    <sl-dialog
      label="No repository selected Wanna try one?"
      open
      on:sl-request-close={preventClose}
    >
      <nav>
        <a href="amatiasq/pensieve-dev/">
          <sl-menu-item>The source of this app</sl-menu-item>
        </a>
        <a href="amatiasq/amatiasq.com/">
          <sl-menu-item>amatiasq.com</sl-menu-item>
        </a>
        <a href="solidjs/solid/">
          <sl-menu-item>Solid JS</sl-menu-item>
        </a>

        <sl-divider></sl-divider>

        <form onSubmit={submit}>
          <sl-input ref={input}></sl-input>
        </form>
      </nav>
    </sl-dialog>
  );

  function preventClose(event: any) {
    event.preventDefault();
  }

  function submit(event: Event) {
    location.href = input.value;
    event.preventDefault();
  }
}
