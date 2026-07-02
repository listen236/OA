import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const prdConfigSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const positionManagementStart = prdConfigSource.indexOf('const positionManagement: PageConfig = {');
const positionManagementEnd = prdConfigSource.indexOf('const employeeStatus = [');
const positionManagementBlock =
  positionManagementStart >= 0 && positionManagementEnd > positionManagementStart
    ? prdConfigSource.slice(positionManagementStart, positionManagementEnd)
    : '';

assert.ok(positionManagementBlock.includes("select('status', '状态', ['启用', '停用'], { initialValue: '启用' })"));
assert.ok(!positionManagementBlock.includes('statusTabs:'));

console.log('position search fields test passed');
