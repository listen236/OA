import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const listPageSource = readFileSync('src/components/GenericListPage.tsx', 'utf8');
const archivePageSource = readFileSync('src/components/EmployeeArchivePage.tsx', 'utf8');

assert.ok(
  listPageSource.includes('pageConfig.showDelete && selectedRowKeys.length > 0'),
  'generic list delete button should only show after rows are selected',
);
assert.ok(
  listPageSource.includes('submitEffect') && listPageSource.includes('contractStatus: nextStatus'),
  'generic list page should support process drawers writing back contract status',
);
assert.ok(
  archivePageSource.includes("tab.key !== '附件存档' && activeTab === tab.key && activeSelectedRowKeys.length > 0"),
  'employee archive delete button should only show for selected non-attachment rows',
);

console.log('batch delete visibility test passed');
