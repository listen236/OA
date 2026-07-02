import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const configSource = readFileSync('src/config/prdCoreConfigs.ts', 'utf8');
const organizationListStart = configSource.indexOf('const organizationList: PageConfig = {');
const organizationListEnd = configSource.indexOf('const organizationChart = createPage({');
const organizationListBlock =
  organizationListStart >= 0 && organizationListEnd > organizationListStart
    ? configSource.slice(organizationListStart, organizationListEnd)
    : '';

assert.ok(organizationListBlock.includes("select('status', '状态', ['启用', '停用'], { initialValue: '启用' })"));

console.log('organization search fields test passed');
