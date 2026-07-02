import assert from 'node:assert/strict';
import { filterRecordsBySearch } from '../src/utils/listSearch.ts';

const positionRecords = [
  { id: '1', code: 'POS001', name: 'HR专员', position: 'HR专员', department: '人力资源部', owner: '张红红', status: '启用', date: '2026-06-01' },
  { id: '2', code: 'POS002', name: '招聘经理', position: '招聘经理', department: '人力资源部', owner: '李华', status: '停用', date: '2026-06-02' },
  { id: '3', code: 'POS003', name: '生产主管', position: '生产主管', department: '生产一部', owner: '王敏', status: '启用', date: '2026-06-03' },
];

const searchFields = [
  { name: 'positionCode', label: '岗位编码' },
  { name: 'positionName', label: '岗位名称' },
  { name: 'department', label: '所属部门', type: 'select' as const },
  { name: 'status', label: '状态', type: 'select' as const, initialValue: '启用' },
];

const filteredRecords = filterRecordsBySearch(positionRecords, searchFields, { status: '启用' });

assert.equal(filteredRecords.length, 2);
assert.ok(filteredRecords.every((record) => record.status === '启用'));

console.log('position default status filter test passed');
