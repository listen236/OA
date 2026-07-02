import assert from 'node:assert/strict';
import { buildOrganizationTree, getVisibleOrganizationRowIds } from '../src/utils/organizationTree.ts';

const records = [
  { id: 'company', name: '智能办公系统', parentOrg: '', sortNo: 1 },
  { id: 'hr', name: '人力资源部', parentOrg: '智能办公系统', sortNo: 2 },
  { id: 'recruit', name: '招聘组', parentOrg: '人力资源部', sortNo: 1 },
  { id: 'office', name: '总经办', parentOrg: '智能办公系统', sortNo: 1 },
];

const tree = buildOrganizationTree(records);

assert.equal(tree.length, 1);
assert.equal(tree[0].name, '智能办公系统');
assert.deepEqual(
  tree[0].children?.map((record) => record.name),
  ['总经办', '人力资源部'],
);
assert.deepEqual(tree[0].children?.[1].children?.map((record) => record.name), ['招聘组']);
assert.deepEqual(getVisibleOrganizationRowIds(tree, ['company', 'hr']), ['company', 'office', 'hr', 'recruit']);
assert.deepEqual(getVisibleOrganizationRowIds(tree, ['company']), ['company', 'office', 'hr']);

console.log('organization tree test passed');
