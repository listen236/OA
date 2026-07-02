import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const contractBlock = configSource.match(/const employeeContract = simpleCorePage\(\{[\s\S]*?\n\}\);/)?.[0] ?? '';

assert.ok(contractBlock.includes("title: '实际结束日期'"), 'contract table should include actual end date');
assert.ok(contractBlock.includes("title: '合同开始日期'"), 'contract table should rename start date');
assert.ok(contractBlock.includes("title: '合同结束日期'"), 'contract table should rename end date');
assert.ok(contractBlock.includes("title: '合同签订日期'"), 'contract table should rename sign date');
assert.ok(contractBlock.includes("input('code', '合同编号', { readOnly: true })"), 'contract code should be read only');
assert.ok(contractBlock.includes("radio('termType', '合同期限类型'"), 'contract term type should use radio options');
assert.ok(!contractBlock.includes('trialEndDate'), 'contract form should not include trial end date');
assert.ok(!contractBlock.includes('试用期结束日期'), 'contract form should remove trial end date label');
assert.ok(!contractBlock.includes("number('reminderDays', '提醒天数')"), 'contract form should not include reminder days');
assert.ok(contractBlock.includes("action('release', '解除'"), 'contract row actions should include release');
assert.ok(contractBlock.includes("action('terminate', '终止'"), 'contract row actions should include terminate');
assert.ok(contractBlock.includes("submitEffect: { type: 'setStatus', status: '已解除'"), 'release flow should write back status');
assert.ok(contractBlock.includes("submitEffect: { type: 'setStatus', status: '已终止'"), 'terminate flow should write back status');

console.log('contract page config test passed');
