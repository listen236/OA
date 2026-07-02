import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const employeeDetailSource = readFileSync('src/components/EmployeeDetailPage.tsx', 'utf8');
const archiveSource = readFileSync('src/mocks/employeeArchives.ts', 'utf8');

assert.ok(employeeDetailSource.includes('function MultiRecordPane'));
assert.ok(employeeDetailSource.includes('+ 添加{title}'));
assert.ok(employeeDetailSource.includes("const multiRecordTabs = new Set(['工作经历', '教育经历', '家庭成员', '附件存档'])"));
assert.ok(employeeDetailSource.includes("附件存档: ['附件类型', '附件文件']"));
assert.ok(archiveSource.includes("detailFields: ['公司名称', '担任职位', '入职日期', '离职日期', '职位描述']"));
assert.ok(archiveSource.includes("detailFields: ['附件类型', '附件文件', '备注']"));

console.log('employee detail multi-record style test passed');
