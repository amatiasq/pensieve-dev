import { createMemo } from 'solid-js';
import { createTree, PrintTree } from './PrintTree';
import styles from './Sidebar.module.scss';
import { useActiveRepo } from './useActiveRepo';
import { useRepoFiles } from './useRepoFiles';

export function Sidebar() {
  const repo = useActiveRepo();
  const files = createMemo(() => useRepoFiles(repo()));
  const tree = createMemo(() => createTree(files(), '#'));

  return (
    <aside class={styles.sidebar}>
      <PrintTree class={styles.tree} root={tree()} />
    </aside>
  );
}
