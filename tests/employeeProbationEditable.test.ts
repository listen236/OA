import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const drawerSource = readFileSync('src/components/TwoColumnFormDrawer.tsx', 'utf8');
const detailSource = readFileSync('src/components/EmployeeDetailPage.tsx', 'utf8');

assert.ok(configSource.includes("date('probationDate', '试用期结束日期')"), 'employee create form should expose editable probation end date');
assert.ok(!configSource.includes("date('probationDate', '试用期结束日期', { readOnly: true })"), 'employee create form probation end date should no longer be readonly');
assert.ok(drawerSource.includes('const probationDateValue = Form.useWatch(\'probationDate\''), 'drawer should watch probation end date for manual editing fallback');
assert.ok(drawerSource.includes('!probationDateValue || normalizedProbationDate === lastAutoProbationDate'), 'drawer should only auto-fill probation end date when user has not manually edited it');
assert.ok(detailSource.includes("试用期结束日期: { type: 'date' }"), 'employee detail probation end date should be editable');
assert.ok(!detailSource.includes("试用期结束日期: { type: 'date', editable: false }"), 'employee detail probation end date should not remain readonly');
assert.ok(detailSource.includes("label === '试用期结束日期'"), 'employee detail should track manual probation end date edits');
assert.ok(detailSource.includes('nextValues.试用期结束日期 === previousAutoDate') || detailSource.includes('if (!nextDraftValues.试用期结束日期'), 'employee detail should preserve manual probation end date edits when auto-calculating');

console.log('employee probation editable test passed');
