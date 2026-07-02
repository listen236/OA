import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const optionSource = readFileSync('src/config/organizationOptions.ts', 'utf8');
const typeSource = readFileSync('src/types.ts', 'utf8');
const prdConfigSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const drawerSource = readFileSync('src/components/TwoColumnFormDrawer.tsx', 'utf8');
const listSource = readFileSync('src/components/GenericListPage.tsx', 'utf8');
const detailSource = readFileSync('src/components/EmployeeDetailPage.tsx', 'utf8');
const archiveSource = readFileSync('src/components/EmployeeArchivePage.tsx', 'utf8');

assert.ok(optionSource.includes('export const employeeOptions = ['), 'should define shared employee selector options');
assert.ok(optionSource.includes('张红红(AIF1001)'), 'employee selector labels should include name and employee number');
assert.ok(optionSource.includes("部门名称: '人力资源部'") || optionSource.includes("department: '人力资源部'"), 'employee selector options should carry department information');
assert.ok(optionSource.includes('export const departmentTreeOptions = ['), 'should define shared department tree options');
assert.ok(optionSource.includes('children:'), 'department tree options should include child nodes');

assert.ok(typeSource.includes("| 'treeSelect'"), 'field type should support tree select');
assert.ok(typeSource.includes('options?: readonly (string | SelectOption)[];'), 'field options should support labeled option objects');

assert.ok(prdConfigSource.includes("type: isDepartmentField ? 'treeSelect' : 'select'"), 'department fields should use tree select in page config');
assert.ok(prdConfigSource.includes('export const employees = [...employeeOptions];'), 'employee fields should use shared employee options in page config');

assert.ok(drawerSource.includes("field.type === 'treeSelect'"), 'drawer form should render tree select fields');
assert.ok(drawerSource.includes('treeData='), 'drawer tree select should bind tree data');
assert.ok(drawerSource.includes("optionLabelProp={hasRichLabels ? 'value' : 'children'}"), 'drawer employee selectors should show name only after selection');
assert.ok(listSource.includes("field.type === 'treeSelect'"), 'list search should render tree select fields');
assert.ok(listSource.includes("optionLabelProp={hasRichLabels ? 'value' : 'children'}"), 'list employee selectors should show name only after selection');
assert.ok(detailSource.includes('options: [...employeeOptions]'), 'employee detail should render shared employee labels');
assert.ok(detailSource.includes("optionLabelProp={hasRichLabels ? 'value' : 'children'}"), 'employee detail employee selectors should show name only after selection');
assert.ok(archiveSource.includes('employeeOptions'), 'employee archive page should use shared employee options');
assert.ok(archiveSource.includes('departmentTreeOptions'), 'employee archive page should use shared department tree options');
assert.ok(archiveSource.includes("optionLabelProp=\"value\""), 'employee archive employee selector should show name only after selection');

console.log('employee selector display test passed');
