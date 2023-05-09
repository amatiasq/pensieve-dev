export function FileTree(props: { slot?: string }) {
  return (
    <sl-tree slot={props.slot} selection="leaf">
      <sl-tree-item>
        Item 1
        <sl-tree-item>
          <span>Item A</span>
          <sl-tree-item>Item Z</sl-tree-item>
          <sl-tree-item>Item Y</sl-tree-item>
          <sl-tree-item>Item X</sl-tree-item>
        </sl-tree-item>
        <sl-tree-item>Item B</sl-tree-item>
        <sl-tree-item>Item C</sl-tree-item>
      </sl-tree-item>
      <sl-tree-item>Item 2</sl-tree-item>
      <sl-tree-item>Item 3</sl-tree-item>
    </sl-tree>
  );
}
