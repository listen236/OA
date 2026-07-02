import assert from 'node:assert/strict';
import { calculateProbationEndDate, deriveEmployeeStatus, withDerivedEmployeeFields } from '../src/utils/employeeStatus.ts';

assert.equal(calculateProbationEndDate('2026-07-01', 3), '2026-10-01');
assert.equal(calculateProbationEndDate('2026-07-01', 0), '2026-07-01');
assert.equal(calculateProbationEndDate('2026-07-01', -1), '');
assert.equal(calculateProbationEndDate('2026-07-01', 1.5), '');

assert.equal(deriveEmployeeStatus({ id: '1', code: 'A', name: '员工1', department: '人力资源部', owner: '张红红', status: '在职', date: '2026-07-01', probationDate: '2026-07-02' }, '2026-07-01'), '试用期');
assert.equal(deriveEmployeeStatus({ id: '2', code: 'A', name: '员工2', department: '人力资源部', owner: '张红红', status: '试用期', date: '2026-07-01', probationDate: '2026-07-01' }, '2026-07-01'), '在职');
assert.equal(deriveEmployeeStatus({ id: '3', code: 'A', name: '员工3', department: '人力资源部', owner: '张红红', status: '试用期', date: '2026-07-01', probationDate: '2026-12-01', regularizationDate: '2026-07-01' }, '2026-07-01'), '在职');
assert.equal(deriveEmployeeStatus({ id: '4', code: 'A', name: '员工4', department: '人力资源部', owner: '张红红', status: '离职', date: '2026-07-01', probationDate: '2026-12-01' }, '2026-07-01'), '离职');

const derivedRecord = withDerivedEmployeeFields({ id: '5', code: 'A', name: '员工5', department: '人力资源部', owner: '张红红', status: '在职', date: '2026-07-01', hireDate: '2026-07-01', probationMonths: 3 }, '2026-07-01');
assert.equal(derivedRecord.probationDate, '2026-10-01');
assert.equal(derivedRecord.status, '试用期');

console.log('employee probation status test passed');
