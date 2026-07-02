import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const organizationListActions = configSource.match(/const organizationList: PageConfig = \{[\s\S]*?rowActions: \[([\s\S]*?)\],\n  \],/)?.[1] ?? '';
const organizationPageActions = configSource.match(/const organizationList: PageConfig = \{[\s\S]*?pageActions: \[([\s\S]*?)\],\n  rowActions:/)?.[1] ?? '';

assert.ok(!organizationListActions.includes("'调整排序'"));
assert.ok(!organizationPageActions.includes("'调整排序'"));

console.log('organization row actions test passed');
