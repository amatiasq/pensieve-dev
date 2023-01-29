import { createMemo, Show } from 'solid-js';
import { createTree, PrintTree } from './PrintTree';
import styles from './Sidebar.module.scss';
import { useActiveRepo } from './useActiveRepo';
import { useRepoFiles } from './useRepoFiles';

export function Sidebar() {
  const repo = useActiveRepo();
  const root = () => `${document.baseURI}${repo().path.slice(1)}/#`;

  const files = createMemo(() => useRepoFiles(repo()));
  const tree = createMemo(() => createTree(files(), root()));

  const isLoading = () => files().length == 0 && files().isCloning();

  return (
    <aside class={styles.sidebar}>
      <PrintTree class={styles.tree} root={tree()} />

      <Show when={isLoading()}>Clone in progress...</Show>
    </aside>
  );
}
