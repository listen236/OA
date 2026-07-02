import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const organizationListColumns = configSource.match(/const organizationList: PageConfig = \{[\s\S]*?columns: \[([\s\S]*?)\],/)?.[1] ?? '';
const nameColumnIndex = organizationListColumns.indexOf("dataIndex: 'name'");
const codeColumnIndex = organizationListColumns.indexOf("dataIndex: 'code'");

assert.ok(nameColumnIndex >= 0);
assert.ok(codeColumnIndex >= 0);
assert.ok(nameColumnIndex < codeColumnIndex);

console.log('organization column order test passed');
