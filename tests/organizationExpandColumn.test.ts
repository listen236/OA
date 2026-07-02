import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const listPageSource = readFileSync('src/components/GenericListPage.tsx', 'utf8');

assert.ok(listPageSource.includes('renderOrganizationName'));
assert.ok(listPageSource.includes('showExpandColumn: false'));
assert.ok(listPageSource.includes('organization-name-cell'));
assert.ok(!listPageSource.includes('expandIconColumnIndex'));

console.log('organization expand column test passed');
