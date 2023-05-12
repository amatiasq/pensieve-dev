import { useActiveRepo } from '../hooks/ActiveRepoProvider';
import { INode, isLeaf, useFileTree } from '../hooks/useFileTree';
import { useSettingsFile } from '../hooks/useSettingsFile';

export function FileTree(props: {}) {
  const repo = useActiveRepo();
  const settings = useSettingsFile();
  const root = () => `${document.baseURI}${repo().path.slice(1)}/#`;
  const tree = () => useFileTree(repo().files(), root());

  console.log('FileTree', repo().files(), tree());

  return <sl-tree selection="leaf">{tree().map(TreeItem)}</sl-tree>;
}

function TreeItem(item: INode) {
  let link!: HTMLAnchorElement;

  return (
    <sl-tree-item
      selected={location.href == item.href}
      expanded={isOpen[item.href]}
      on:sl-expand={() => setOpen(item, true)}
      on:sl-collapse={() => setOpen(item, false)}
      onclick={() => link?.click()}
    >
      {isLeaf(item) ? (
        <a ref={link} href={item.href}>
          {item.name}
        </a>
      ) : (
        <span>{item.name}</span>
      )}
      {item.children.map(TreeItem)}
    </sl-tree-item>
  );
}

const isOpen = JSON.parse(localStorage.getItem('file-tree-open') || '{}');

function setOpen(item: INode, open: boolean) {
  isOpen[item.href] = open;
  localStorage.setItem('file-tree-open', JSON.stringify(isOpen));
}
