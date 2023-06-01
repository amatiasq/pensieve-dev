export interface INode {
  id: string;
  href: string;
  name: string;
  children: INode[];
}

export function useFileTree(files: string[], root: string) {
  const tree = [] as INode[];

  for (const file of files) {
    let node = tree;
    let path = '';

    for (const part of file.split('/')) {
      let child = node.find((n) => n.name === part);

      if (!child) {
        child = {
          id: `${path}/${part}`,
          name: part,
          href: `${root}${path}/${part}`,
          children: [],
        };

        node.push(child);
      }

      node = child.children;
      path += `/${part}`;
    }
  }

  return tree;
}

export function isLeaf(node: INode) {
  //: node is ILeaf {
  return node.children.length == 0;
}
