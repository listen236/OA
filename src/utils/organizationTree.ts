type OrganizationTreeRecord = {
  id: string;
  name?: string;
  parentOrg?: string;
  sortNo?: number;
  children?: OrganizationTreeRecord[];
};

function compareTreeRecords(left: OrganizationTreeRecord, right: OrganizationTreeRecord) {
  const leftSort = Number(left.sortNo ?? 0);
  const rightSort = Number(right.sortNo ?? 0);

  if (leftSort !== rightSort) {
    return leftSort - rightSort;
  }

  return String(left.name ?? '').localeCompare(String(right.name ?? ''), 'zh-Hans-CN');
}

function sortTree(records: OrganizationTreeRecord[]) {
  records.sort(compareTreeRecords);
  records.forEach((record) => {
    if (record.children?.length) {
      sortTree(record.children);
    } else {
      delete record.children;
    }
  });
}

export function buildOrganizationTree<T extends OrganizationTreeRecord>(records: T[]): T[] {
  const nodes = records.map((record) => ({ ...record, children: [] as T[] }));
  const nodesByName = new Map(nodes.map((record) => [record.name, record]));
  const roots: Array<T & { children?: T[] }> = [];

  nodes.forEach((record) => {
    const parent = record.parentOrg ? nodesByName.get(record.parentOrg) : undefined;

    if (parent && parent.id !== record.id) {
      parent.children?.push(record);
      return;
    }

    roots.push(record);
  });

  sortTree(roots);
  return roots as T[];
}

export function getVisibleOrganizationRowIds<T extends OrganizationTreeRecord>(records: T[], expandedRowIds: Array<string | number | bigint>): string[] {
  const expandedIdSet = new Set(expandedRowIds.map(String));

  return records.flatMap((record) => {
    const visibleIds = [record.id];
    if (record.children?.length && expandedIdSet.has(String(record.id))) {
      visibleIds.push(...getVisibleOrganizationRowIds(record.children, expandedRowIds));
    }

    return visibleIds;
  });
}
