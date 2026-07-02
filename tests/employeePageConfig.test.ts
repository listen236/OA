import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const drawerSource = readFileSync('src/components/TwoColumnFormDrawer.tsx', 'utf8');
const organizationSource = readFileSync('src/config/organizationOptions.ts', 'utf8');

const employeeSearch = configSource.match(/const employeeSearch = \[([\s\S]*?)\];/)?.[1] ?? '';
assert.ok(!employeeSearch.includes("input('keyword'"), 'employee search should no longer use generic keyword field');
assert.ok(employeeSearch.includes("input('employeeNo', '工号')"));
assert.ok(employeeSearch.includes("input('name', '姓名')"));

const employeeListBlock = configSource.match(/const employeeList: PageConfig = \{[\s\S]*?\n\};/)?.[0] ?? '';
assert.ok(employeeListBlock.includes('showDelete: true'), 'employee list should keep batch delete in toolbar');
assert.ok(!employeeListBlock.includes("action('delete', '删除'"), 'employee list row actions should not expose delete');

const employeeBaseFields = configSource.match(/const employeeBaseFields = \[([\s\S]*?)\];/)?.[1] ?? '';
assert.ok(configSource.includes("const employeeStatus = ['在职', '试用期', '离职'];"), 'employee status should include probation status');
assert.ok(organizationSource.includes("orgType: '公司'"), 'organization options should define company type records');
assert.ok(organizationSource.includes("filter((organization) => organization.orgType === '公司'"), 'company organizations should be derived from company type records');
assert.ok(configSource.includes('companyOrganizations'), 'employee config should import company organization options');
assert.ok(employeeBaseFields.includes("select('contractCompany', '合同公司', companyOrganizations)"), 'employee create contract company should use company organization options');
assert.ok(!employeeBaseFields.includes("date('probationDate', '转正日期'"), 'employee create form should not show regularization date');
assert.ok(employeeBaseFields.includes("date('socialWorkDate', '社会工作日期'"), 'employee form should use socialWorkDate');
assert.ok(employeeListBlock.includes("formTitle: '基本信息'"), 'employee create section should be named basic info');
assert.ok(!employeeBaseFields.includes("input('employeeNo', '工号'"), 'employee create form should not show employee number');
assert.ok(!employeeBaseFields.includes("select('status', '员工状态'"), 'employee create form should not show employee status');
assert.ok(!employeeBaseFields.includes("number('seniority', '司龄'"), 'employee create form should not show seniority');
assert.ok(!employeeBaseFields.includes("number('workSeniority', '工龄'"), 'employee create form should not show work seniority');
assert.ok(!employeeBaseFields.includes("date('resignationDate', '离职日期'"), 'employee create form should not show resignation date');
assert.ok(!employeeBaseFields.includes("input('resignationReason', '离职原因'"), 'employee create form should not show resignation reason');
assert.ok(!employeeBaseFields.includes("number('age', '年龄'"), 'employee create form should not show age');
assert.ok(!employeeBaseFields.includes("probationFlag"), 'employee create form should not show probation flag');
assert.ok(!employeeBaseFields.includes("regularizationDate"), 'employee create form should not show regularization date');
assert.ok(employeeBaseFields.includes("number('probationMonths', '试用期（月）', { min: 0, precision: 0, step: 1 })"), 'probation months should be non-negative integer');
assert.ok(employeeBaseFields.includes("date('probationDate', '试用期结束日期')"), 'probation end date should stay available in employee create form');
assert.ok(!employeeBaseFields.includes("date('probationDate', '试用期结束日期', { readOnly: true })"), 'probation end date should be editable in employee create form');
assert.ok(employeeBaseFields.indexOf("number('probationMonths'") < employeeBaseFields.indexOf("date('probationDate'"), 'probation months should be before probation end date');
assert.ok(employeeBaseFields.includes("upload('idCardFront', '证件照正面', { span: 12 })"), 'id card front upload should stay in half-row position');
assert.ok(employeeBaseFields.includes("upload('idCardBack', '证件照反面', { span: 12 })"), 'id card back upload should stay in half-row position');
assert.ok(!employeeBaseFields.includes('historicalSeniority'), 'legacy historicalSeniority field should be removed');
assert.ok(employeeListBlock.includes("formFooterActions: [action('cancel', '取消'), action('save', '保存', { kind: 'primary' })]"), 'employee create footer should be cancel and save');

assert.ok(employeeListBlock.includes("title: '教育经历', type: 'detailTable', displayMode: 'inlineBlocks'"), 'employee create form should include education inline block');
assert.ok(employeeListBlock.includes("title: '工作经历', type: 'detailTable', displayMode: 'inlineBlocks'"), 'employee create form should include work experience inline block');
assert.ok(employeeListBlock.includes("title: '家庭成员', type: 'detailTable', displayMode: 'inlineBlocks'"), 'employee create form should include family inline block');
assert.ok(employeeListBlock.includes("title: '附件存档', type: 'detailTable', displayMode: 'inlineBlocks'"), 'employee create form should include attachment inline block');
assert.ok(drawerSource.includes("icon={<DeleteOutlined />}"), 'inline detail delete should use trash icon');
assert.ok(drawerSource.includes('function renderInlineFormControl'), 'inline detail fields should support detail-like controls');
assert.ok(drawerSource.includes('showUploadList={false}'), 'inline attachment upload should use compact button style');
assert.ok(drawerSource.includes('if (field.span === 12)'), 'half-row uploads should render as compact upload buttons');
assert.ok(drawerSource.includes('<Button icon={<UploadOutlined />} size="small">'), 'compact uploads should use the small upload button');

console.log('employee page config test passed');
