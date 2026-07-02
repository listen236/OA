import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const archivePageSource = readFileSync('src/components/EmployeeArchivePage.tsx', 'utf8');
const archiveMockSource = readFileSync('src/mocks/employeeArchives.ts', 'utf8');

assert.ok(archivePageSource.includes('Modal'), 'employee archive create action should open a form modal');
assert.ok(archivePageSource.includes('createModalOpen'), 'employee archive page should track create modal state');
assert.ok(archivePageSource.includes('handleOpenCreate'), 'primary archive action should open create interaction');
assert.ok(archivePageSource.includes('handleCreateSubmit'), 'create modal should save new archive records');
assert.ok(archivePageSource.includes('handleCreateOk'), 'create modal save button should read the visible form interaction');
assert.ok(archivePageSource.includes('employee-archive-create-modal'), 'create modal should expose a stable interaction scope');
assert.ok(archivePageSource.includes('setArchiveRowsByTab'), 'saved archive records should update the visible table');
assert.ok(!archivePageSource.includes("message.success(`${tab.primaryAction}完成`)"), 'primary archive action should not only show a toast');
assert.ok(archiveMockSource.includes("primaryAction: '新增工作经历'"), 'work experience create title should remain visible');
assert.ok(archivePageSource.includes("initialValues={{ archiveType: activeTab, employee: employeeOptions[0]?.value, department: '总经办' }}"), 'create form should default archive type and employee context');
assert.ok(archivePageSource.includes('入职日期: dayjs()'), 'work experience create form should default required date');

console.log('employee archive create interaction test passed');
