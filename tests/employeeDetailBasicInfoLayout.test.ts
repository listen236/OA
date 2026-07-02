import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const detailSource = readFileSync('src/components/EmployeeDetailPage.tsx', 'utf8');
const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const organizationSource = readFileSync('src/config/organizationOptions.ts', 'utf8');
const baseItemsBlock = detailSource.match(/const baseItems = withSavedValues\('基础信息', \[[\s\S]*?\n  \]\);/)?.[0] ?? '';

assert.ok(detailSource.includes('className="employee-detail-avatar-upload"'), 'employee avatar upload should be in profile header');
assert.ok(!baseItemsBlock.includes("label: '员工头像'"), 'basic info should not show employee avatar field');
assert.ok(configSource.includes("const employeeBaseFields = [\n  input('name', '姓名'"), 'employee base form should not start with avatar upload');
assert.ok(baseItemsBlock.indexOf("label: '出生日期'") < baseItemsBlock.indexOf("label: '年龄'"), 'age should be placed after birth date');
assert.ok(baseItemsBlock.indexOf("label: '年龄'") < baseItemsBlock.indexOf("label: '邮箱'"), 'age should be placed before email');
assert.ok(baseItemsBlock.includes("{ label: '离职日期', value: valueOf(record, 'resignationDate', '-'), editable: false }"), 'resignation date should be readonly in employee detail');
assert.ok(baseItemsBlock.includes("label: '离职原因'") && baseItemsBlock.includes("editable: false"), 'resignation reason should be readonly in employee detail');
assert.ok(organizationSource.includes("filter((organization) => organization.orgType === '公司'"), 'company organizations should be derived from company type records');
assert.ok(detailSource.includes('companyOrganizations'), 'employee detail should import company organization options');
assert.ok(detailSource.includes("合同公司: { type: 'select', options: companyOrganizations }"), 'employee detail contract company should use company organization options');
assert.ok(detailSource.includes("'试用期（月）': { type: 'number', min: 0, precision: 0, step: 1 }"), 'probation months should be a non-negative integer in employee detail');
assert.ok(!baseItemsBlock.includes("label: '是否试用期'"), 'probation flag should be removed from employee detail');
assert.ok(baseItemsBlock.includes("{ label: '试用期结束日期', value: valueOf(record, 'probationDate') }"), 'probation end date should stay visible in employee detail');
assert.ok(!baseItemsBlock.includes("label: '试用期结束日期', value: valueOf(record, 'probationDate'), editable: false"), 'probation end date should be editable in employee detail');
assert.ok(baseItemsBlock.indexOf("label: '试用期（月）'") < baseItemsBlock.indexOf("label: '试用期结束日期'"), 'probation months should be before probation end date in employee detail');
assert.ok(baseItemsBlock.includes("{ label: '转正日期', value: valueOf(record, 'regularizationDate', '-'), editable: false }"), 'regularization date should be readonly in employee detail');
assert.ok(detailSource.includes("'基诺族'"), 'nation options should include the complete nationalities');
assert.ok(configSource.includes("'基诺族'"), 'employee config nation options should include the complete nationalities');

console.log('employee detail basic info layout test passed');
