import { css } from '@emotion/css';
import { createMemo, Show } from 'solid-js';
import { Center } from './atoms/Center';
import { createTree, PrintTree } from './PrintTree';
import { useActiveRepo } from './useActiveRepo';

export function Sidebar() {
  const repo = useActiveRepo();
  const root = () => `${document.baseURI}${repo().path.slice(1)}/#`;
  const isLoading = () => repo().files().length == 0 && repo().isCloning();
  const tree = createMemo(() => createTree(repo().files(), root()));

  return (
    <aside class={styles}>
      <PrintTree root={tree()} />
      <Show when={isLoading()}>
        <Center>Clone in progress...</Center>
      </Show>
    </aside>
  );
}

const styles = css`
  --depth: 0;
  background-color: #212122;

  ul {
    margin: 0;
    padding: 0;
  }

  summary {
    font-size: 1em;
    cursor: pointer;

    &::marker {
      display: none;
      content: '';
    }

    &::before {
      display: inline-flex;
      content: '▶';
      margin-top: 2px;
      margin-left: -0.3em;
      margin-right: 0.2em;
      transform: none;
      opacity: 0.5;
      color: white;
      transition: transform 0.2s ease-in-out;
    }
  }

  details[open] > summary::before {
    transform: rotate(90deg);
  }

  a {
    text-decoration: none;
  }

  a,
  summary {
    display: flex;
    align-items: center;
    padding-left: calc(calc(var(--depth) * 8px) + 1em);
    padding-right: 1em;

    &:hover {
      background-color: #252829;
    }

    &:focus {
      color: #ffffff;
      background-color: #04395e;
      outline: 1px solid #007fd4;
      outline-offset: -1px;
    }
  }

  h3 {
    display: inline-flex;
    margin: 0;
    font-family: -apple-system, 'system-ui', sans-serif;
    font-weight: 400;
    color: #cccccc;
    cursor: pointer;
    display: inline;
    font-size: 16px;
    forced-color-adjust: none;
    height: auto;
    line-height: 22px;
    text-decoration-thickness: auto;
    user-select: none;
    white-space: pre;
  }
`;
