import { SlInput } from '@shoelace-style/shoelace';
import { FixedDialog } from '../atoms/FixedDialog';

export function Landing() {
  let input!: SlInput;

  return (
    <FixedDialog header="No repository selected Wanna try one?">
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
          <sl-input
            ref={input}
            label="Or type a Github username/repository below:"
          ></sl-input>
        </form>
      </nav>
    </FixedDialog>
  );

  function submit(event: Event) {
    location.href = input.value;
    event.preventDefault();
  }
}
