import type { TreeSelectOption } from '../types';

export interface MutableTreeSelectNode {
  title: string;
  value: string;
  children?: MutableTreeSelectNode[];
}

export function cloneTreeSelectData(treeData?: readonly TreeSelectOption[]): MutableTreeSelectNode[] | undefined {
  return treeData?.map((node) => ({
    title: node.title,
    value: node.value,
    children: cloneTreeSelectData(node.children),
  }));
}
