import { css } from '@emotion/css';
import { Center } from './atoms/Center';

const style = css`
  font-size: 2rem;

  li {
    list-style: '-  ';
    margin-top: 2rem;
  }
`;

export function Homepage() {
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
      </div>
    </Center>
  );

  return (
    <div
      style={{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        height: '100vh',
        'font-size': '2rem',
      }}
    >
      <div></div>
    </div>
  );
}
