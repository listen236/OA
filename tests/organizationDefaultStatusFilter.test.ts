import assert from 'node:assert/strict';
import { filterRecordsBySearch } from '../src/utils/listSearch.ts';

const organizationRecords = [
  { id: '1', code: 'ORG001', name: '智能办公系统', department: '智能办公系统', owner: 'admin', status: '启用', date: '2026-06-01', orgType: '公司', parentOrg: '', sortNo: 1 },
  { id: '2', code: 'ORG002', name: '总经办', department: '总经办', owner: '张红红', status: '启用', date: '2026-06-02', orgType: '部门', parentOrg: '智能办公系统', sortNo: 1 },
  { id: '3', code: 'ORG003', name: '行政支持组', department: '行政支持组', owner: '王敏', status: '停用', date: '2026-06-03', orgType: '部门', parentOrg: '总经办', sortNo: 2 },
] as const;
const searchFields = [
  { name: 'orgCode', label: '组织编码' },
  { name: 'orgName', label: '组织名称' },
  { name: 'orgType', label: '组织类型', type: 'select' as const },
  { name: 'status', label: '状态', type: 'select' as const, initialValue: '启用' },
];

const filteredRecords = filterRecordsBySearch(organizationRecords, searchFields, { status: '启用' });

assert.equal(filteredRecords.length, 2);
assert.ok(filteredRecords.every((record) => record.status === '启用'));

console.log('organization default status filter test passed');
