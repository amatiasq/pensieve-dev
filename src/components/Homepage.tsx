import { css } from '@emotion/css';
import { Center } from './atoms/Center';

const style = css`
  font-size: 2rem;

  li {
    list-style: '·  ';
    margin-top: 2rem;
    margin-left: -1.3rem;
  }

  input {
    font-size: inherit;
    margin: 20px 0;
    width: 100%;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

export function Homepage() {
  let input: HTMLInputElement;

  return (
    <Center fullscreen>
      <div class={style}>
        No repository selected Wanna try one?
        <ul>
          <li>
            <a href="amatiasq/pensieve-dev/">The source of this app</a>
          </li>
          <li>
            <a href="amatiasq/amatiasq.com/">amatiasq.com</a>
          </li>
          <li>
            <a href="solidjs/solid/">solidjs</a>
          </li>
        </ul>
        <label>Or a repo you have write access to?</label>
        <form onSubmit={submit}>
          <input ref={input} type="text" />
        </form>
      </div>
    </Center>
  );

  function submit(event: Event) {
    location.href = input.value;
    event.preventDefault();
  }
}
