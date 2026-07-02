# HR PRD Core Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the core HR modules so list fields, row actions, toolbar actions, form fields, form buttons, status tabs, and mock state changes match `docs/智能办公系统-人力资源模块PRD.md`.

**Architecture:** Extend the current config-driven page system instead of replacing it. Most pages continue through `GenericListPage`; special surfaces such as HR dashboard, employee detail, organization chart, and scheduling get focused components when the generic list shape is not enough.

**Tech Stack:** React 18, TypeScript, Vite, Ant Design 5, local mock data.

---

## File Structure

- Modify `src/types.ts`: add action configs, status tabs, table visibility config, expanded mock record fields, and backwards-compatible `PageConfig` fields.
- Create `src/config/prdCoreConfigs.ts`: define PRD-aligned core module page configs and helpers without further bloating `pageConfigs.ts`.
- Modify `src/config/pageConfigs.ts`: delegate core module paths to `prdCoreConfigs`, keep existing fallback configs for non-core modules.
- Modify `src/mocks/moduleData.ts`: generate status-aware core module mock rows with PRD fields.
- Modify `src/components/FieldSettingsModal.tsx`: support required fields that cannot be unchecked.
- Modify `src/components/TwoColumnFormDrawer.tsx`: accept configurable footer actions and submit labels.
- Modify `src/components/GenericListPage.tsx`: render status tabs, table visibility groups, configured actions, and local state changes.
- Create `src/components/EmployeeDetailPage.tsx`: employee detail layout inspired by the reference image.
- Modify `src/layouts/AppLayout.tsx`: allow employee detail to render as a special view when triggered from employee list.
- Modify `src/components/HrDashboard.tsx`: align dashboard quick actions and metrics with PRD labels.
- Modify `src/styles/global.css`: styles for status tabs, employee detail, and any new table/form surfaces.

## Task 1: Extend Shared Types

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add action, status tab, and table visibility types**

Replace the bottom `PageConfig` block in `src/types.ts` with this extended version, preserving all existing exports above it:

```ts
export type PageType = 'crud' | 'approval' | 'report' | 'dashboard' | 'readonly' | 'special';

export type ActionKind = 'primary' | 'default' | 'danger' | 'link';

export type ActionEffectType =
  | 'message'
  | 'openCreate'
  | 'openEdit'
  | 'openDetail'
  | 'setStatus'
  | 'setField'
  | 'moveStatus'
  | 'delete'
  | 'noop';

export interface ActionEffect {
  type: ActionEffectType;
  status?: string;
  field?: keyof MockRecord | string;
  value?: string | number;
  message?: string;
}

export interface ActionCondition {
  field: keyof MockRecord | string;
  equals?: string | number | Array<string | number>;
  notEquals?: string | number | Array<string | number>;
}

export interface ActionConfig {
  key: string;
  label: string;
  kind?: ActionKind;
  icon?: 'plus' | 'import' | 'export' | 'delete' | 'reload' | 'setting' | 'check' | 'send';
  confirm?: string;
  requiresSelection?: boolean;
  visibleWhen?: ActionCondition;
  enabledWhen?: ActionCondition;
  effect?: ActionEffect;
}

export interface StatusTabConfig {
  key: string;
  label: string;
  statusValues: string[];
}

export interface TableVisibilityConfig {
  columns: ColumnConfig[];
  requiredVisible?: string[];
  defaultVisible?: string[];
  optional?: ColumnConfig[];
}

export interface FormSectionConfig {
  title: string;
  fields: FieldConfig[];
}

export interface PageConfig {
  pageType?: PageType;
  primaryAction?: string;
  rowActions?: string[];
  toolbarActions?: string[];
  pageActions?: ActionConfig[];
  rowActionConfigs?: ActionConfig[];
  formFooterActions?: ActionConfig[];
  statusTabs?: StatusTabConfig[];
  table?: TableVisibilityConfig;
  showCreate?: boolean;
  showImport?: boolean;
  showExport?: boolean;
  showDelete?: boolean;
  showBatchSubmit?: boolean;
  searchFields: FieldConfig[];
  tableColumns: ColumnConfig[];
  formSections: FormSectionConfig[];
  toolbarExtra?: string[];
}
```

- [ ] **Step 2: Expand `MockRecord.status` to accept PRD statuses**

Change `MockRecord.status` from the fixed union to `string`:

```ts
status: string;
```

This is required because PRD pages use many statuses such as `待入职`, `已放弃`, `待面试`, `已锁定`, and `已归档`.

- [ ] **Step 3: Add flexible fields to `MockRecord`**

Add this index signature at the end of `MockRecord`:

```ts
[key: string]: string | number | undefined;
```

- [ ] **Step 4: Build to validate type compatibility**

Run:

```bash
npm run build
```

Expected: TypeScript compile succeeds. Vite may warn about chunk size.

## Task 2: Create PRD Core Config Helpers

**Files:**
- Create: `src/config/prdCoreConfigs.ts`
- Modify: `src/config/pageConfigs.ts`

- [ ] **Step 1: Create `prdCoreConfigs.ts` with reusable helpers**

Create `src/config/prdCoreConfigs.ts`:

```ts
import type { ActionConfig, ColumnConfig, FieldConfig, PageConfig, StatusTabConfig } from '../types';

export const departments = ['总经办', '人力资源部', '生产一部', '生产二部', '质量管理部', '财务部', '技术中心'];
export const employees = ['张红红', '李华', '王敏', '赵强', '陈晓', 'admin'];
export const positions = ['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'];

export const idx: ColumnConfig = { title: '序号', dataIndex: 'index', width: 62, align: 'center' };

export const f = (name: string, label: string, extra: Partial<FieldConfig> = {}): FieldConfig => ({ name, label, ...extra });
export const input = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, extra);
export const select = (name: string, label: string, options: string[], extra: Partial<FieldConfig> = {}) =>
  f(name, label, { type: 'select', options, ...extra });
export const number = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'number', ...extra });
export const date = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'date', ...extra });
export const month = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'month', ...extra });
export const text = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'textarea', span: 24, ...extra });
export const upload = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'upload', span: 24, ...extra });

export const action = (key: string, label: string, extra: Partial<ActionConfig> = {}): ActionConfig => ({ key, label, ...extra });

export const tabs = (...items: Array<[string, string, string[]?]>): StatusTabConfig[] =>
  items.map(([key, label, statusValues]) => ({ key, label, statusValues: statusValues ?? [label] }));

export const createPage = (config: PageConfig): PageConfig => ({
  ...config,
  tableColumns: config.table?.columns ?? config.tableColumns,
  formSections: config.formSections ?? [],
});

export const commonOrgSearch = [
  input('keyword', '关键词'),
  select('department', '所属部门', departments),
  select('status', '状态', ['启用', '停用']),
];
```

- [ ] **Step 2: Wire `pageConfigs.ts` to import PRD configs**

At the top of `src/config/pageConfigs.ts`, add:

```ts
import { prdCorePageConfigs } from './prdCoreConfigs';
```

Update `getPageConfig` to prefer PRD core configs:

```ts
export function getPageConfig(path: string): PageConfig {
  return enhancePageConfig(path, prdCorePageConfigs[path] ?? pageConfigs[path] ?? defaultPageConfig);
}
```

- [ ] **Step 3: Add empty export to keep build green**

At the bottom of `src/config/prdCoreConfigs.ts`, add:

```ts
export const prdCorePageConfigs: Record<string, PageConfig> = {};
```

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 3: Implement Table Visibility and Required Field Settings

**Files:**
- Modify: `src/components/FieldSettingsModal.tsx`
- Modify: `src/components/GenericListPage.tsx`

- [ ] **Step 1: Extend `FieldSettingsModal` props**

Update the interface in `FieldSettingsModal.tsx`:

```ts
interface FieldSettingsModalProps {
  open: boolean;
  columns: ColumnConfig[];
  visibleKeys: string[];
  requiredKeys?: string[];
  onChange: (keys: string[]) => void;
  onClose: () => void;
}
```

- [ ] **Step 2: Prevent unchecking required fields**

Update the component signature and checkbox rendering:

```tsx
export function FieldSettingsModal({ open, columns, visibleKeys, requiredKeys = [], onChange, onClose }: FieldSettingsModalProps) {
  const requiredSet = new Set(requiredKeys);
  const options = columns
    .filter((column) => column.dataIndex !== 'index')
    .map((column) => ({ label: column.title, value: String(column.dataIndex), required: requiredSet.has(String(column.dataIndex)) }));

  return (
    <Modal title="字段设置" open={open} onOk={onClose} onCancel={onClose} width={520}>
      <div className="field-setting-panel">
        <div className="field-setting-tip">勾选后立即影响当前表格显示，带“必显”的字段不可取消。</div>
        <Checkbox.Group
          value={visibleKeys}
          onChange={(values) => {
            const next = Array.from(new Set([...requiredKeys, ...values.map(String)]));
            if (next.length > 0) {
              onChange(next);
            }
          }}
        >
          <Space wrap>
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value} disabled={option.required}>
                {option.label}
                {option.required ? '（必显）' : ''}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: Compute visibility from `pageConfig.table` in `GenericListPage`**

Replace the `allBusinessKeys` and `visibleKeys` initialization with:

```tsx
const tableColumns = pageConfig.table?.columns ?? pageConfig.tableColumns;
const requiredVisibleKeys = useMemo(() => pageConfig.table?.requiredVisible ?? [], [pageConfig.table]);
const defaultVisibleKeys = useMemo(
  () =>
    pageConfig.table?.defaultVisible ??
    tableColumns.filter((column) => column.dataIndex !== 'index').map((column) => String(column.dataIndex)),
  [pageConfig.table, tableColumns],
);
const allBusinessKeys = useMemo(
  () => tableColumns.filter((column) => column.dataIndex !== 'index').map((column) => String(column.dataIndex)),
  [tableColumns],
);
const [visibleKeys, setVisibleKeys] = useState<string[]>(Array.from(new Set([...requiredVisibleKeys, ...defaultVisibleKeys])));
```

Update the effect:

```tsx
useEffect(() => {
  setVisibleKeys(Array.from(new Set([...requiredVisibleKeys, ...defaultVisibleKeys])));
}, [requiredVisibleKeys, defaultVisibleKeys]);
```

- [ ] **Step 4: Replace table column references**

In `GenericListPage.tsx`, replace `pageConfig.tableColumns` usages used for rendering with `tableColumns`.

Specifically:

```tsx
...tableColumns
  .filter((column) => column.dataIndex === 'index' || visibleKeys.includes(String(column.dataIndex)))
```

and:

```tsx
columns={tableColumns}
requiredKeys={requiredVisibleKeys}
```

for `FieldSettingsModal`.

- [ ] **Step 5: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 4: Add Status Tabs and Local Row State

**Files:**
- Modify: `src/components/GenericListPage.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Store data source in component state**

In `GenericListPage.tsx`, replace:

```tsx
const dataSource = useMemo(() => getMockRecords(path, title), [path, title]);
```

with:

```tsx
const initialDataSource = useMemo(() => getMockRecords(path, title), [path, title]);
const [dataSource, setDataSource] = useState<MockRecord[]>(initialDataSource);
const [activeStatusTab, setActiveStatusTab] = useState<string | undefined>(pageConfig.statusTabs?.[0]?.key);

useEffect(() => {
  setDataSource(initialDataSource);
  setSelectedRowKeys([]);
  setActiveStatusTab(pageConfig.statusTabs?.[0]?.key);
}, [initialDataSource, pageConfig.statusTabs]);
```

- [ ] **Step 2: Add filtered data and tab counts**

Add below state:

```tsx
const activeStatusConfig = pageConfig.statusTabs?.find((tab) => tab.key === activeStatusTab);
const filteredDataSource = activeStatusConfig
  ? dataSource.filter((record) => activeStatusConfig.statusValues.includes(String(record.status)))
  : dataSource;

const statusTabItems = pageConfig.statusTabs?.map((tab) => ({
  key: tab.key,
  label: `${tab.label} ${dataSource.filter((record) => tab.statusValues.includes(String(record.status))).length}`,
}));
```

- [ ] **Step 3: Render status tabs above search panel**

Inside `PageContainer`, before `.search-panel`, add:

```tsx
{statusTabItems?.length ? (
  <Tabs
    className="status-tabs"
    activeKey={activeStatusTab}
    items={statusTabItems}
    onChange={(key) => {
      setActiveStatusTab(key);
      setSelectedRowKeys([]);
    }}
  />
) : null}
```

Ensure `Tabs` is imported from `antd`.

- [ ] **Step 4: Use filtered data in table and pagination**

Replace table `dataSource={dataSource}` with:

```tsx
dataSource={filteredDataSource}
```

Replace pagination total:

```tsx
total: filteredDataSource.length,
```

- [ ] **Step 5: Add status tab CSS**

Append to `src/styles/global.css`:

```css
.status-tabs {
  margin-top: 10px;
}

.status-tabs .ant-tabs-nav {
  margin-bottom: 8px;
}

.status-tabs .ant-tabs-tab {
  padding: 8px 12px;
}
```

- [ ] **Step 6: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 5: Configured Actions and Status Effects

**Files:**
- Modify: `src/components/GenericListPage.tsx`

- [ ] **Step 1: Add action helpers**

Inside `GenericListPage`, add:

```tsx
const isActionVisible = (action: ActionConfig, record?: MockRecord) => {
  if (!action.visibleWhen || !record) return true;
  const value = record[action.visibleWhen.field as keyof MockRecord];
  if (Array.isArray(action.visibleWhen.equals)) return action.visibleWhen.equals.includes(String(value));
  if (action.visibleWhen.equals !== undefined) return String(value) === String(action.visibleWhen.equals);
  if (Array.isArray(action.visibleWhen.notEquals)) return !action.visibleWhen.notEquals.includes(String(value));
  if (action.visibleWhen.notEquals !== undefined) return String(value) !== String(action.visibleWhen.notEquals);
  return true;
};

const applyActionEffect = (action: ActionConfig, record?: MockRecord) => {
  if (action.requiresSelection && !selectedRowKeys.length) {
    message.warning('请选择数据');
    return;
  }

  if (action.effect?.type === 'openCreate') {
    setCurrentRecord(undefined);
    setDrawerOpen(true);
    return;
  }
  if (action.effect?.type === 'openEdit') {
    setCurrentRecord(record);
    setDrawerOpen(true);
    return;
  }
  if (action.effect?.type === 'openDetail') {
    setCurrentRecord(record);
    setDetailOpen(true);
    return;
  }
  if (action.effect?.type === 'delete' && record) {
    setDataSource((rows) => rows.filter((item) => item.id !== record.id));
    message.success(action.effect.message ?? `${action.label}完成`);
    return;
  }
  if (action.effect?.type === 'setStatus' && record && action.effect.status) {
    setDataSource((rows) => rows.map((item) => (item.id === record.id ? { ...item, status: action.effect!.status! } : item)));
    message.success(action.effect.message ?? `${action.label}完成`);
    return;
  }
  if (action.effect?.type === 'setField' && record && action.effect.field) {
    setDataSource((rows) => rows.map((item) => (item.id === record.id ? { ...item, [action.effect!.field!]: action.effect!.value } : item)));
    message.success(action.effect.message ?? `${action.label}完成`);
    return;
  }

  message.success(action.effect?.message ?? `${action.label}完成`);
};
```

Also import `ActionConfig` from `../types`.

- [ ] **Step 2: Render configured page actions**

In the toolbar right-side `<Space>`, before legacy `toolbarActions`, render:

```tsx
{(pageConfig.pageActions ?? []).map((action) => (
  <Button
    key={action.key}
    type={action.kind === 'primary' ? 'primary' : 'default'}
    danger={action.kind === 'danger'}
    onClick={() => applyActionEffect(action)}
  >
    {action.label}
  </Button>
))}
```

- [ ] **Step 3: Render configured row actions**

Replace the operation column action source with:

```tsx
const configuredActions =
  pageConfig.rowActionConfigs ??
  (pageConfig.rowActions ?? ['查看', '编辑', '删除']).map((label) => ({
    key: label,
    label,
    kind: 'link' as const,
    effect:
      label === '查看' || label === '钻取'
        ? { type: 'openDetail' as const }
        : label === '编辑'
          ? { type: 'openEdit' as const }
          : label === '删除'
            ? { type: 'delete' as const }
            : { type: 'message' as const },
  }));
const actions = configuredActions.filter((action) => isActionVisible(action, record));
```

Update each row button click:

```tsx
onClick={() => applyActionEffect(action, record)}
```

Use `action.label` for display.

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 6: Core PRD Configs - Organization and Employee

**Files:**
- Modify: `src/config/prdCoreConfigs.ts`

- [ ] **Step 1: Add organization and employee configs**

Add this before the final export:

```ts
const organizationList = createPage({
  searchFields: [input('orgCode', '组织编码'), input('orgName', '组织名称'), select('orgType', '组织类型', ['公司', '部门']), select('status', '组织状态', ['启用', '停用'])],
  tableColumns: [],
  table: {
    requiredVisible: ['code', 'name', 'status'],
    defaultVisible: ['code', 'name', 'orgType', 'parentOrg', 'owner', 'sortNo', 'status', 'date'],
    columns: [
      idx,
      { title: '组织编码', dataIndex: 'code', width: 130 },
      { title: '组织名称', dataIndex: 'name', width: 180 },
      { title: '组织类型', dataIndex: 'orgType', width: 100 },
      { title: '上级组织', dataIndex: 'parentOrg', width: 140 },
      { title: '组织负责人', dataIndex: 'owner', width: 120 },
      { title: '排序号', dataIndex: 'sortNo', width: 90, align: 'right' },
      { title: '状态', dataIndex: 'status', width: 100, status: true },
      { title: '更新时间', dataIndex: 'date', width: 130 },
      { title: '备注', dataIndex: 'remark', width: 180 },
    ],
  },
  pageActions: [
    action('create', '新增组织', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('import', '导入', { effect: { type: 'message', message: '导入模板已打开' } }),
    action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } }),
  ],
  rowActionConfigs: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
    action('delete', '删除', { kind: 'link', confirm: '确认删除该组织？', effect: { type: 'delete' } }),
  ],
  formSections: [
    {
      title: '组织信息',
      fields: [
        input('code', '组织编码', { required: true }),
        input('name', '组织名称', { required: true }),
        select('orgType', '组织类型', ['公司', '部门'], { required: true }),
        select('parentOrg', '上级组织', departments),
        select('owner', '组织负责人', employees),
        number('sortNo', '排序号'),
        select('status', '组织状态', ['启用', '停用'], { required: true }),
        text('remark', '备注'),
      ],
    },
  ],
  formFooterActions: [action('save', '保存', { kind: 'primary', effect: { type: 'message', message: '保存成功' } })],
});

const employeeList = createPage({
  searchFields: [
    input('keyword', '关键词', { placeholder: '工号/姓名/手机号' }),
    input('employeeNo', '工号'),
    input('name', '姓名'),
    select('department', '所属部门', departments),
    select('position', '岗位', positions),
    select('status', '员工状态', ['在职', '离职']),
  ],
  tableColumns: [],
  table: {
    requiredVisible: ['employeeNo', 'name', 'status'],
    defaultVisible: ['employeeNo', 'name', 'phone', 'department', 'position', 'owner', 'status', 'date', 'contractStatus'],
    columns: [
      idx,
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: '手机号码', dataIndex: 'phone', width: 130 },
      { title: '证件号', dataIndex: 'idNo', width: 180 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '岗位', dataIndex: 'position', width: 140 },
      { title: '直接上级', dataIndex: 'owner', width: 110 },
      { title: '员工状态', dataIndex: 'status', width: 100, status: true },
      { title: '用工类型', dataIndex: 'employmentType', width: 100 },
      { title: '入职日期', dataIndex: 'date', width: 120 },
      { title: '转正日期', dataIndex: 'probationDate', width: 120 },
      { title: '合同状态', dataIndex: 'contractStatus', width: 110 },
      { title: '最高学历', dataIndex: 'education', width: 100 },
      { title: '紧急联系人', dataIndex: 'emergencyContact', width: 120 },
    ],
  },
  pageActions: [
    action('create', '新增员工', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('sendRegister', '发送入职登记表', { effect: { type: 'message', message: '入职登记表已发送' } }),
    action('import', '导入', { effect: { type: 'message', message: '导入模板已打开' } }),
    action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } }),
  ],
  rowActionConfigs: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('transfer', '调动', { kind: 'link', effect: { type: 'message', message: '已发起调动' } }),
    action('resign', '离职', { kind: 'link', visibleWhen: { field: 'status', equals: '在职' }, effect: { type: 'setStatus', status: '离职' } }),
    action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
  ],
  formSections: [
    {
      title: '基础信息',
      fields: [
        upload('avatar', '员工头像'),
        input('name', '姓名', { required: true }),
        input('employeeNo', '工号', { required: true }),
        select('idType', '证件类型', ['身份证', '护照', '港澳通行证', '台胞证', '其他'], { required: true }),
        input('idNo', '证件号', { required: true }),
        input('phone', '手机号码', { required: true }),
      ],
    },
    {
      title: '任职信息',
      fields: [
        select('department', '所属部门', departments, { required: true }),
        select('position', '岗位', positions),
        select('owner', '直接上级', employees),
        select('status', '员工状态', ['在职', '离职'], { required: true }),
        select('employmentType', '用工类型', ['全职', '兼职', '实习', '劳务']),
        date('hireDate', '入职日期', { required: true }),
        date('probationDate', '转正日期'),
        select('contractStatus', '合同状态', ['未签订', '已签订', '即将到期', '已终止']),
      ],
    },
    {
      title: '个人信息',
      fields: [
        select('gender', '性别', ['男', '女']),
        date('birthDate', '出生日期'),
        select('education', '最高学历', ['高中', '大专', '本科', '硕士', '博士']),
        select('politicalStatus', '政治面貌', ['群众', '共青团员', '党员']),
        select('maritalStatus', '婚姻状况', ['未婚', '已婚', '离异']),
        input('emergencyContact', '紧急联系人'),
        input('emergencyPhone', '紧急联系人电话'),
        input('address', '居住地址', { span: 24 }),
      ],
    },
    { title: '附件存档', fields: [upload('files', '员工附件')] },
  ],
  formFooterActions: [action('save', '保存', { kind: 'primary', effect: { type: 'message', message: '保存成功' } })],
});
```

- [ ] **Step 2: Export organization and employee configs**

Replace the empty export with:

```ts
export const prdCorePageConfigs: Record<string, PageConfig> = {
  '/organization/list': organizationList,
  '/employee/list': employeeList,
};
```

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 7: Core PRD Configs - Recruitment and Lifecycle

**Files:**
- Modify: `src/config/prdCoreConfigs.ts`

- [ ] **Step 1: Add shared recruitment columns and actions**

Add before the export:

```ts
const recruitmentDemand = createPage({
  statusTabs: tabs(['draft', '草稿'], ['published', '已发布'], ['recruiting', '招聘中'], ['closed', '已关闭'], ['cancelled', '已取消']),
  searchFields: [input('code', '需求编号'), select('position', '招聘岗位', positions), select('department', '所属部门', departments), select('status', '需求状态', ['草稿', '已发布', '招聘中', '已关闭', '已取消'])],
  tableColumns: [],
  table: {
    requiredVisible: ['code', 'position', 'status'],
    defaultVisible: ['code', 'position', 'headcount', 'department', 'expectedDate', 'status', 'owner'],
    columns: [
      idx,
      { title: '需求编号', dataIndex: 'code', width: 130 },
      { title: '招聘岗位', dataIndex: 'position', width: 150 },
      { title: '招聘人数', dataIndex: 'headcount', width: 100, align: 'right' },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '期望到岗日期', dataIndex: 'expectedDate', width: 130 },
      { title: '需求状态', dataIndex: 'status', width: 110, status: true },
      { title: '负责人', dataIndex: 'owner', width: 110 },
      { title: '已入职人数', dataIndex: 'joinedCount', width: 110, align: 'right' },
    ],
  },
  pageActions: [action('create', '新增招聘需求', { kind: 'primary', effect: { type: 'openCreate' } })],
  rowActionConfigs: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('publish', '发布', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '已发布' } }),
    action('progress', '进度跟进', { kind: 'link', effect: { type: 'message', message: '已打开招聘进度' } }),
    action('close', '关闭', { kind: 'link', visibleWhen: { field: 'status', notEquals: ['已关闭', '已取消'] }, effect: { type: 'setStatus', status: '已关闭' } }),
    action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
  ],
  formSections: [
    {
      title: '招聘需求',
      fields: [
        input('code', '需求编号', { required: true }),
        select('position', '招聘岗位', positions, { required: true }),
        number('headcount', '招聘人数', { required: true }),
        select('department', '所属部门', departments, { required: true }),
        date('expectedDate', '期望到岗日期'),
        select('owner', '招聘负责人', employees),
        text('jobDuty', '岗位职责'),
        text('requirement', '任职要求'),
      ],
    },
  ],
});
```

- [ ] **Step 2: Add lifecycle pages with status tabs**

Add:

```ts
const lifecycleColumns: ColumnConfig[] = [
  idx,
  { title: '单据编号', dataIndex: 'code', width: 130 },
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '岗位', dataIndex: 'position', width: 140 },
  { title: '生效日期', dataIndex: 'effectiveDate', width: 120 },
  { title: '状态', dataIndex: 'status', width: 110, status: true },
  { title: '当前处理人', dataIndex: 'owner', width: 120 },
];

const lifecyclePage = (primaryAction: string, tabItems: StatusTabConfig[], finalStatus: string): PageConfig =>
  createPage({
    statusTabs: tabItems,
    searchFields: [input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '状态', tabItems.map((item) => item.label))],
    tableColumns: [],
    table: {
      requiredVisible: ['code', 'name', 'status'],
      defaultVisible: ['code', 'employeeNo', 'name', 'department', 'position', 'effectiveDate', 'status', 'owner'],
      columns: lifecycleColumns,
    },
    pageActions: [
      action('create', primaryAction, { kind: 'primary', effect: { type: 'openCreate' } }),
      action('import', '导入', { effect: { type: 'message', message: '导入模板已打开' } }),
      action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } }),
    ],
    rowActionConfigs: [
      action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
      action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
      action('submit', '发起审批', { kind: 'link', visibleWhen: { field: 'status', notEquals: ['审批中', finalStatus] }, effect: { type: 'setStatus', status: '审批中' } }),
      action('manual', '手动办理', { kind: 'link', visibleWhen: { field: 'status', notEquals: ['审批中', finalStatus] }, effect: { type: 'setStatus', status: finalStatus } }),
      action('giveup', '放弃', { kind: 'link', visibleWhen: { field: 'status', notEquals: ['已放弃', finalStatus] }, effect: { type: 'setStatus', status: '已放弃' } }),
      action('exportRow', '导出', { kind: 'link', effect: { type: 'message', message: '导出任务已创建' } }),
    ],
    formSections: [
      {
        title: '员工信息',
        fields: [select('employee', '员工', employees, { required: true }), select('department', '所属部门', departments), select('position', '岗位', positions), date('effectiveDate', '生效日期', { required: true })],
      },
      { title: '审批信息', fields: [select('owner', '当前处理人', employees), text('remark', '备注')] },
    ],
  });
```

- [ ] **Step 3: Add configs to export map**

Extend `prdCorePageConfigs`:

```ts
'/recruitment/demand': recruitmentDemand,
'/lifecycle/onboarding': lifecyclePage('新增入职', tabs(['pending', '待入职'], ['joined', '已入职'], ['giveup', '已放弃']), '已入职'),
'/lifecycle/regularization': lifecyclePage('发起转正', tabs(['pending', '待转正'], ['approving', '审批中'], ['done', '已转正'], ['cancelled', '已取消']), '已转正'),
'/lifecycle/transfer': lifecyclePage('发起调动', tabs(['pending', '待调动'], ['approving', '审批中'], ['effective', '待生效'], ['done', '已调动'], ['giveup', '已放弃']), '已调动'),
'/lifecycle/resignation': lifecyclePage('发起离职', tabs(['pending', '待离职'], ['approving', '审批中'], ['confirming', '待确认'], ['effective', '待生效'], ['done', '已离职'], ['giveup', '已放弃'], ['cancelled', '已撤销']), '已离职'),
```

Remove leading `+` characters when editing.

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 8: Core PRD Configs - Attendance, Performance, Salary

**Files:**
- Modify: `src/config/prdCoreConfigs.ts`

- [ ] **Step 1: Add attendance application factory**

Add:

```ts
const approvalTabs = tabs(['draft', '草稿'], ['approving', '审批中'], ['passed', '已通过'], ['withdrawn', '已撤回']);

const attendanceApplyPage = (type: string): PageConfig =>
  createPage({
    statusTabs: approvalTabs,
    searchFields: [input('code', '申请编号'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '审批状态', ['草稿', '审批中', '已通过', '已撤回'])],
    tableColumns: [],
    table: {
      requiredVisible: ['code', 'name', 'status'],
      defaultVisible: ['code', 'name', 'department', 'businessType', 'startDate', 'endDate', 'duration', 'status', 'owner'],
      columns: [
        idx,
        { title: '申请编号', dataIndex: 'code', width: 130 },
        { title: '申请人', dataIndex: 'name', width: 120 },
        { title: '所属部门', dataIndex: 'department', width: 140 },
        { title: '申请类型', dataIndex: 'businessType', width: 110 },
        { title: '开始时间', dataIndex: 'startDate', width: 130 },
        { title: '结束时间', dataIndex: 'endDate', width: 130 },
        { title: '时长', dataIndex: 'duration', width: 90, align: 'right' },
        { title: '审批状态', dataIndex: 'status', width: 110, status: true },
        { title: '当前处理人', dataIndex: 'owner', width: 120 },
      ],
    },
    pageActions: [action('create', `发起${type}`, { kind: 'primary', effect: { type: 'openCreate' } })],
    rowActionConfigs: [
      action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
      action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'openEdit' } }),
      action('submit', '提交审批', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '审批中' } }),
      action('approve', '审批通过', { kind: 'link', visibleWhen: { field: 'status', equals: '审批中' }, effect: { type: 'setStatus', status: '已通过' } }),
      action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: '审批中' }, effect: { type: 'setStatus', status: '已撤回' } }),
    ],
    formSections: [
      {
        title: `${type}信息`,
        fields: [input('code', '申请编号', { required: true }), select('employee', '申请人', employees, { required: true }), select('department', '所属部门', departments), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('duration', `${type}时长`), text('reason', `${type}原因`, { required: true }), upload('files', '证明附件')],
      },
    ],
  });
```

- [ ] **Step 2: Add salary pages**

Add:

```ts
const salaryApproval = createPage({
  statusTabs: tabs(['draft', '草稿'], ['approving', '审批中'], ['passed', '已通过'], ['withdrawn', '已撤回'], ['archived', '已归档']),
  searchFields: [month('salaryMonth', '薪资月份'), input('code', '批次编号'), select('batchType', '批次类型', ['普通', '补发', '更正', '奖金', '离职结算', '临时工资', '年终奖']), select('department', '所属部门', departments), select('status', '审批状态', ['草稿', '审批中', '已通过', '已撤回', '已归档'])],
  tableColumns: [],
  table: {
    requiredVisible: ['salaryMonth', 'code', 'status'],
    defaultVisible: ['salaryMonth', 'code', 'batchType', 'name', 'department', 'headcount', 'payrollAmount', 'status'],
    columns: [
      idx,
      { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 },
      { title: '批次编号', dataIndex: 'code', width: 140 },
      { title: '批次类型', dataIndex: 'batchType', width: 100 },
      { title: '批次名称', dataIndex: 'name', width: 180 },
      { title: '发薪范围', dataIndex: 'department', width: 140 },
      { title: '总人数', dataIndex: 'headcount', width: 90, align: 'right' },
      { title: '薪资金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true },
      { title: '审批状态', dataIndex: 'status', width: 110, status: true },
    ],
  },
  pageActions: [action('create', '新建薪资批次', { kind: 'primary', effect: { type: 'openCreate' } }), action('import', '导入明细', { effect: { type: 'message', message: '薪资明细导入模板已打开' } })],
  rowActionConfigs: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('submit', '发起审批', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '审批中' } }),
    action('approve', '审批通过', { kind: 'link', visibleWhen: { field: 'status', equals: '审批中' }, effect: { type: 'setStatus', status: '已通过' } }),
    action('archive', '归档', { kind: 'link', visibleWhen: { field: 'status', equals: '已通过' }, effect: { type: 'setStatus', status: '已归档' } }),
    action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: '审批中' }, effect: { type: 'setStatus', status: '已撤回' } }),
  ],
  formSections: [{ title: '薪资批次', fields: [month('salaryMonth', '薪资月份', { required: true }), select('batchType', '批次类型', ['普通', '补发', '更正', '奖金', '离职结算', '临时工资', '年终奖'], { required: true }), input('code', '批次编号', { required: true }), input('name', '批次名称'), select('department', '发薪范围', departments, { required: true }), number('headcount', '总人数'), number('payrollAmount', '薪资金额'), upload('salaryFile', '薪资明细导入文件')] }],
});
```

- [ ] **Step 3: Extend export map for attendance and salary**

Add:

```ts
'/attendance/repair': attendanceApplyPage('补卡'),
'/attendance/leave': attendanceApplyPage('请假'),
'/attendance/overtime': attendanceApplyPage('加班'),
'/attendance/out': attendanceApplyPage('外出'),
'/attendance/trip': attendanceApplyPage('出差'),
'/salary/approval': salaryApproval,
```

Remove leading `+` characters when editing.

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 9: Add Explicit Configs for All Remaining Core Pages

**Files:**
- Modify: `src/config/prdCoreConfigs.ts`

- [ ] **Step 1: Add generic PRD list-page factory**

Add this before `export const prdCorePageConfigs` in `src/config/prdCoreConfigs.ts`:

```ts
const simpleCorePage = (options: {
  primaryAction: string;
  statusTabs?: StatusTabConfig[];
  searchFields: FieldConfig[];
  columns: ColumnConfig[];
  requiredVisible: string[];
  defaultVisible: string[];
  formTitle: string;
  formFields: FieldConfig[];
  pageActions?: ActionConfig[];
  rowActions?: ActionConfig[];
}): PageConfig =>
  createPage({
    statusTabs: options.statusTabs,
    searchFields: options.searchFields,
    tableColumns: [],
    table: {
      requiredVisible: options.requiredVisible,
      defaultVisible: options.defaultVisible,
      columns: options.columns,
    },
    pageActions: [
      action('create', options.primaryAction, { kind: 'primary', effect: { type: 'openCreate' } }),
      ...(options.pageActions ?? []),
    ],
    rowActionConfigs:
      options.rowActions ?? [
        action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
        action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
        action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
      ],
    formSections: [{ title: options.formTitle, fields: options.formFields }],
    formFooterActions: [action('save', '保存', { kind: 'primary', effect: { type: 'message', message: '保存成功' } })],
  });
```

- [ ] **Step 2: Add common PRD column sets**

Add this below `simpleCorePage`:

```ts
const archiveColumns: ColumnConfig[] = [
  idx,
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '员工姓名', dataIndex: 'name', width: 120 },
  { title: '档案类型', dataIndex: 'archiveType', width: 120 },
  { title: '档案名称', dataIndex: 'companyName', width: 180 },
  { title: '开始日期', dataIndex: 'startDate', width: 120 },
  { title: '结束日期', dataIndex: 'endDate', width: 120 },
  { title: '更新时间', dataIndex: 'date', width: 130 },
];

const contractColumns: ColumnConfig[] = [
  idx,
  { title: '合同编号', dataIndex: 'code', width: 130 },
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '员工姓名', dataIndex: 'name', width: 120 },
  { title: '合同类型', dataIndex: 'contractType', width: 120 },
  { title: '签订日期', dataIndex: 'date', width: 120 },
  { title: '开始日期', dataIndex: 'startDate', width: 120 },
  { title: '结束日期', dataIndex: 'endDate', width: 120 },
  { title: '合同状态', dataIndex: 'contractStatus', width: 110 },
];

const candidateColumns: ColumnConfig[] = [
  idx,
  { title: '候选人编号', dataIndex: 'code', width: 130 },
  { title: '候选人姓名', dataIndex: 'name', width: 130 },
  { title: '手机号', dataIndex: 'phone', width: 130 },
  { title: '来源渠道', dataIndex: 'source', width: 110 },
  { title: '意向岗位', dataIndex: 'position', width: 140 },
  { title: '状态', dataIndex: 'status', width: 120, status: true },
  { title: '更新时间', dataIndex: 'date', width: 130 },
];

const attendanceConfigColumns: ColumnConfig[] = [
  idx,
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', dataIndex: 'name', width: 180 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '负责人', dataIndex: 'owner', width: 110 },
  { title: '班次', dataIndex: 'shift', width: 110 },
  { title: '打卡方式', dataIndex: 'clockMode', width: 120 },
  { title: '优先级', dataIndex: 'priority', width: 90, align: 'right' },
  { title: '状态', dataIndex: 'status', width: 100, status: true },
];

const performanceColumns: ColumnConfig[] = [
  idx,
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', dataIndex: 'name', width: 180 },
  { title: '考核周期', dataIndex: 'month', width: 110 },
  { title: '适用部门', dataIndex: 'department', width: 140 },
  { title: '负责人', dataIndex: 'owner', width: 110 },
  { title: '状态', dataIndex: 'status', width: 110, status: true },
  { title: '更新时间', dataIndex: 'date', width: 130 },
];

const payslipColumns: ColumnConfig[] = [
  idx,
  { title: '工资条编号', dataIndex: 'code', width: 140 },
  { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 },
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '员工姓名', dataIndex: 'name', width: 120 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '实发金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true },
  { title: '发放状态', dataIndex: 'status', width: 110, status: true },
  { title: '查看状态', dataIndex: 'viewStatus', width: 110 },
];
```

- [ ] **Step 3: Add explicit core page configs not covered by earlier factories**

Add this below the common column sets:

```ts
const positionManagement = simpleCorePage({
  primaryAction: '新增岗位',
  searchFields: [input('positionName', '岗位名称'), input('positionCode', '岗位编码'), select('department', '所属部门', departments), select('status', '岗位状态', ['启用', '停用'])],
  columns: [
    idx,
    { title: '岗位编码', dataIndex: 'code', width: 130 },
    { title: '岗位名称', dataIndex: 'position', width: 150 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '职级', dataIndex: 'grade', width: 100 },
    { title: '编制人数', dataIndex: 'plannedHeadcount', width: 100, align: 'right' },
    { title: '在岗人数', dataIndex: 'headcount', width: 100, align: 'right' },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
    { title: '更新时间', dataIndex: 'date', width: 130 },
  ],
  requiredVisible: ['code', 'position', 'status'],
  defaultVisible: ['code', 'position', 'department', 'grade', 'plannedHeadcount', 'headcount', 'status', 'date'],
  formTitle: '岗位信息',
  formFields: [input('code', '岗位编码', { required: true }), input('position', '岗位名称', { required: true }), select('department', '所属部门', departments, { required: true }), select('grade', '职级', ['P1', 'P2', 'P3', 'M1', 'M2']), number('plannedHeadcount', '编制人数'), select('status', '岗位状态', ['启用', '停用'], { required: true })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
  ],
});

const employeeArchive = simpleCorePage({
  primaryAction: '新增档案',
  searchFields: [input('employeeNo', '工号'), input('name', '员工姓名'), select('archiveType', '档案类型', ['工作经历', '教育经历', '家庭成员', '附件存档']), select('department', '所属部门', departments)],
  columns: archiveColumns,
  requiredVisible: ['employeeNo', 'name', 'archiveType'],
  defaultVisible: ['employeeNo', 'name', 'archiveType', 'companyName', 'startDate', 'endDate', 'date'],
  formTitle: '档案信息',
  formFields: [select('archiveType', '档案类型', ['工作经历', '教育经历', '家庭成员', '附件存档'], { required: true }), input('companyName', '档案名称', { required: true }), date('startDate', '开始日期'), date('endDate', '结束日期'), text('remark', '备注'), upload('files', '附件')],
});

const employeeContract = simpleCorePage({
  primaryAction: '签订合同',
  searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('contractType', '合同类型', ['劳动合同', '保密协议', '竞业协议', '实习协议', '其他']), select('contractStatus', '合同状态', ['未生效', '生效中', '即将到期', '已解除', '已终止'])],
  columns: contractColumns,
  requiredVisible: ['code', 'employeeNo', 'name'],
  defaultVisible: ['code', 'employeeNo', 'name', 'contractType', 'startDate', 'endDate', 'contractStatus', 'date'],
  formTitle: '合同信息',
  formFields: [input('code', '合同编号', { required: true }), select('employee', '员工', employees, { required: true }), select('contractType', '合同类型', ['劳动合同', '保密协议', '竞业协议', '实习协议', '其他'], { required: true }), date('startDate', '开始日期', { required: true }), date('endDate', '结束日期'), date('signDate', '签订日期', { required: true }), select('contractStatus', '合同状态', ['未生效', '生效中', '即将到期', '已解除', '已终止']), upload('files', '合同附件')],
  pageActions: [action('renew', '续签合同', { effect: { type: 'message', message: '已创建续签记录' } }), action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('terminate', '终止合同', { kind: 'link', effect: { type: 'setField', field: 'contractStatus', value: '已终止' } }),
    action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
  ],
});

const recruitmentResume = simpleCorePage({
  primaryAction: '新增简历',
  statusTabs: tabs(['pending', '待筛选'], ['passed', '已通过'], ['eliminated', '已淘汰'], ['talent', '已转人才库'], ['interview', '已发起面试']),
  searchFields: [input('name', '候选人姓名'), input('phone', '手机号'), select('position', '应聘岗位', positions), select('status', '筛选状态', ['待筛选', '已通过', '已淘汰', '已转人才库', '已发起面试'])],
  columns: candidateColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'phone', 'source', 'position', 'status', 'date'],
  formTitle: '简历信息',
  formFields: [input('name', '候选人姓名', { required: true }), input('phone', '手机号', { required: true }), input('email', '邮箱'), select('source', '来源渠道', ['招聘网站', '内推', '校园招聘', '人才库']), select('position', '应聘岗位', positions), upload('resumeFile', '简历附件'), text('remark', '筛选备注')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('pass', '通过', { kind: 'link', visibleWhen: { field: 'status', equals: '待筛选' }, effect: { type: 'setStatus', status: '已通过' } }),
    action('talent', '转人才库', { kind: 'link', effect: { type: 'setStatus', status: '已转人才库' } }),
    action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
  ],
});

const recruitmentTalent = simpleCorePage({
  primaryAction: '新增人才',
  statusTabs: tabs(['contactable', '可联系'], ['invited', '已邀约'], ['joined', '已入职'], ['unsuitable', '暂不合适']),
  searchFields: [input('name', '候选人姓名'), input('phone', '手机号'), select('position', '意向岗位', positions), select('status', '人才状态', ['可联系', '已邀约', '已入职', '暂不合适'])],
  columns: candidateColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'phone', 'source', 'position', 'status', 'date'],
  formTitle: '人才信息',
  formFields: [input('name', '候选人姓名', { required: true }), input('phone', '手机号', { required: true }), select('position', '意向岗位', positions), select('source', '来源渠道', ['招聘网站', '内推', '校园招聘', '历史候选人']), text('remark', '跟进记录'), upload('resumeFile', '简历附件')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('interview', '发起面试', { kind: 'link', effect: { type: 'setStatus', status: '已邀约' } }),
    action('delete', '删除', { kind: 'link', effect: { type: 'delete' } }),
  ],
});

const recruitmentInterview = simpleCorePage({
  primaryAction: '发起面试',
  statusTabs: tabs(['arrange', '待安排'], ['waiting', '待面试'], ['done', '已完成'], ['cancelled', '已取消']),
  searchFields: [input('name', '候选人姓名'), select('position', '面试岗位', positions), select('status', '面试状态', ['待安排', '待面试', '已完成', '已取消'])],
  columns: [
    idx,
    { title: '面试编号', dataIndex: 'code', width: 130 },
    { title: '候选人姓名', dataIndex: 'name', width: 130 },
    { title: '面试岗位', dataIndex: 'position', width: 140 },
    { title: '面试官', dataIndex: 'owner', width: 120 },
    { title: '面试时间', dataIndex: 'date', width: 130 },
    { title: '面试方式', dataIndex: 'interviewMode', width: 110 },
    { title: '面试状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'position', 'owner', 'date', 'interviewMode', 'status'],
  formTitle: '面试安排',
  formFields: [select('candidate', '候选人', employees, { required: true }), select('position', '面试岗位', positions), select('owner', '面试官', employees), date('date', '面试时间', { required: true }), select('interviewMode', '面试方式', ['现场', '视频', '电话']), text('remark', '面试说明')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('finish', '完成面试', { kind: 'link', visibleWhen: { field: 'status', equals: '待面试' }, effect: { type: 'setStatus', status: '已完成' } }),
    action('cancel', '取消', { kind: 'link', effect: { type: 'setStatus', status: '已取消' } }),
  ],
});

const recruitmentOffer = simpleCorePage({
  primaryAction: '发放Offer',
  statusTabs: tabs(['draft', '草稿'], ['sent', '已发放'], ['confirmed', '已确认'], ['rejected', '已拒绝'], ['withdrawn', '已撤回'], ['onboarding', '已转入职']),
  searchFields: [input('name', '候选人姓名'), select('position', '岗位', positions), select('status', 'Offer状态', ['草稿', '已发放', '已确认', '已拒绝', '已撤回', '已转入职'])],
  columns: [
    idx,
    { title: 'Offer编号', dataIndex: 'code', width: 130 },
    { title: '候选人姓名', dataIndex: 'name', width: 130 },
    { title: '岗位', dataIndex: 'position', width: 140 },
    { title: '薪资约定', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true },
    { title: '预计入职日期', dataIndex: 'expectedDate', width: 130 },
    { title: 'Offer状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'position', 'payrollAmount', 'expectedDate', 'status'],
  formTitle: 'Offer信息',
  formFields: [input('code', 'Offer编号', { required: true }), select('candidate', '候选人', employees, { required: true }), select('position', '岗位', positions), number('payrollAmount', '薪资约定'), date('expectedDate', '预计入职日期'), upload('offerFile', 'Offer附件')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('send', '发放', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '已发放' } }),
    action('confirm', '确认Offer', { kind: 'link', visibleWhen: { field: 'status', equals: '已发放' }, effect: { type: 'setStatus', status: '已确认' } }),
    action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: '已发放' }, effect: { type: 'setStatus', status: '已撤回' } }),
  ],
});
```

- [ ] **Step 4: Add attendance configuration and statistics pages**

Add this below the recruitment configs:

```ts
const attendanceGroup = simpleCorePage({
  primaryAction: '新增考勤组',
  statusTabs: tabs(['enabled', '启用'], ['disabled', '停用']),
  searchFields: [input('name', '考勤组名称'), select('attendanceType', '考勤类型', ['固定班制', '排班制', '自由工时']), select('status', '状态', ['启用', '停用'])],
  columns: attendanceConfigColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'attendanceType', 'owner', 'shift', 'clockMode', 'priority', 'status'],
  formTitle: '考勤组信息',
  formFields: [input('name', '考勤组名称', { required: true }), select('attendanceType', '考勤类型', ['固定班制', '排班制', '自由工时'], { required: true }), select('participants', '参与考勤人员', employees), select('excludedUsers', '无需考勤人员', employees), select('owner', '负责人', employees), select('shift', '班次', ['白班', '夜班', '两班倒']), select('clockMode', '打卡方式', ['考勤机', '移动打卡', '无需打卡']), number('priority', '优先级'), select('status', '状态', ['启用', '停用'])],
});

const attendanceShift = simpleCorePage({
  primaryAction: '新增班次',
  statusTabs: tabs(['enabled', '启用'], ['disabled', '停用']),
  searchFields: [input('name', '班次名称'), select('status', '状态', ['启用', '停用'])],
  columns: [
    idx,
    { title: '班次编号', dataIndex: 'code', width: 130 },
    { title: '班次名称', dataIndex: 'name', width: 160 },
    { title: '上班时间', dataIndex: 'startTime', width: 110 },
    { title: '下班时间', dataIndex: 'endTime', width: 110 },
    { title: '休息时间', dataIndex: 'restTime', width: 140 },
    { title: '弹性打卡', dataIndex: 'flexibleClock', width: 100 },
    { title: '负责人', dataIndex: 'owner', width: 110 },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'startTime', 'endTime', 'restTime', 'flexibleClock', 'status'],
  formTitle: '班次信息',
  formFields: [input('name', '班次名称', { required: true }), f('startTime', '上班时间', { type: 'time', required: true }), f('endTime', '下班时间', { type: 'time', required: true }), input('restTime', '休息时间'), select('flexibleClock', '弹性打卡', ['是', '否']), select('owner', '负责人', employees), select('status', '状态', ['启用', '停用'])],
});

const attendanceSchedule = simpleCorePage({
  primaryAction: '新增排班',
  searchFields: [month('month', '排班月份'), select('department', '所属部门', departments), select('shift', '班次', ['白班', '夜班', '两班倒'])],
  columns: [
    idx,
    { title: '排班编号', dataIndex: 'code', width: 130 },
    { title: '员工姓名', dataIndex: 'name', width: 120 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '排班月份', dataIndex: 'month', width: 110 },
    { title: '班次', dataIndex: 'shift', width: 110 },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
  ],
  requiredVisible: ['code', 'name', 'shift'],
  defaultVisible: ['code', 'name', 'employeeNo', 'department', 'month', 'shift', 'status'],
  formTitle: '排班设置',
  formFields: [month('month', '排班月份', { required: true }), select('employee', '员工', employees), select('shift', '考勤班次', ['白班', '夜班', '两班倒'], { required: true }), select('cycle', '排班周期', ['按周', '按月', '自定义']), text('restDays', '预置休息日')],
  pageActions: [action('appearance', '班次外观', { effect: { type: 'message', message: '已打开班次外观设置' } }), action('excel', 'Excel批量排班', { effect: { type: 'message', message: '批量排班导入已打开' } }), action('export', '导出记录', { effect: { type: 'message', message: '导出任务已创建' } })],
});

const attendanceRule = simpleCorePage({
  primaryAction: '新增规则',
  statusTabs: tabs(['enabled', '启用'], ['disabled', '停用']),
  searchFields: [input('name', '规则名称'), select('businessType', '规则类型', ['加班', '外出出差', '补卡', '节假日', '其他']), select('status', '状态', ['启用', '停用'])],
  columns: attendanceConfigColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'businessType', 'department', 'priority', 'status'],
  formTitle: '考勤规则',
  formFields: [input('name', '规则名称', { required: true }), select('businessType', '规则类型', ['加班', '外出出差', '补卡', '节假日', '其他'], { required: true }), select('department', '适用范围', departments), number('priority', '优先级'), select('status', '状态', ['启用', '停用']), text('remark', '规则说明')],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }), action('copy', '复制', { kind: 'link', effect: { type: 'message', message: '已复制规则' } }), action('disable', '启停', { kind: 'link', effect: { type: 'setStatus', status: '停用' } })],
});

const attendanceHoliday = simpleCorePage({
  primaryAction: '新增假期',
  statusTabs: tabs(['enabled', '启用'], ['disabled', '停用']),
  searchFields: [input('name', '假期名称'), select('holidayType', '假期类型', ['法定假', '企业假', '年假', '调休']), select('status', '状态', ['启用', '停用'])],
  columns: [
    idx,
    { title: '假期编号', dataIndex: 'code', width: 130 },
    { title: '假期名称', dataIndex: 'name', width: 160 },
    { title: '假期类型', dataIndex: 'holidayType', width: 110 },
    { title: '开始日期', dataIndex: 'startDate', width: 120 },
    { title: '结束日期', dataIndex: 'endDate', width: 120 },
    { title: '假期天数', dataIndex: 'duration', width: 100, align: 'right' },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'holidayType', 'startDate', 'endDate', 'duration', 'status'],
  formTitle: '假期信息',
  formFields: [input('name', '假期名称', { required: true }), select('holidayType', '假期类型', ['法定假', '企业假', '年假', '调休'], { required: true }), date('startDate', '开始日期', { required: true }), date('endDate', '结束日期', { required: true }), number('duration', '假期天数'), select('status', '状态', ['启用', '停用']), text('remark', '说明')],
});

const clockRecord = simpleCorePage({
  primaryAction: '新增打卡记录',
  statusTabs: tabs(['normal', '正常'], ['late', '迟到'], ['early', '早退'], ['missing', '缺卡'], ['out', '外勤'], ['abnormal', '异常']),
  searchFields: [date('clockDate', '打卡日期'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '打卡状态', ['正常', '迟到', '早退', '缺卡', '外勤', '异常'])],
  columns: [
    idx,
    { title: '打卡编号', dataIndex: 'code', width: 130 },
    { title: '打卡日期', dataIndex: 'date', width: 120 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '打卡时间', dataIndex: 'startTime', width: 120 },
    { title: '打卡方式', dataIndex: 'clockMode', width: 120 },
    { title: '打卡状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'employeeNo', 'name', 'status'],
  defaultVisible: ['code', 'date', 'employeeNo', 'name', 'department', 'startTime', 'clockMode', 'status'],
  formTitle: '打卡记录',
  formFields: [select('employee', '员工', employees, { required: true }), date('date', '打卡日期', { required: true }), f('startTime', '打卡时间', { type: 'time', required: true }), select('clockMode', '打卡方式', ['考勤机', '移动打卡', '导入']), select('status', '打卡状态', ['正常', '迟到', '早退', '缺卡', '外勤', '异常'])],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('fix', '修正', { kind: 'link', effect: { type: 'openEdit' } }), action('export', '导出', { kind: 'link', effect: { type: 'message', message: '导出任务已创建' } })],
});

const dailyStat = simpleCorePage({
  primaryAction: '触发补算任务',
  statusTabs: tabs(['pending', '待计算'], ['done', '已计算'], ['updated', '已更新'], ['error', '计算异常'], ['locked', '已锁定']),
  searchFields: [date('statDate', '统计日期'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '结果状态', ['待计算', '已计算', '已更新', '计算异常', '已锁定'])],
  columns: [
    idx,
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '班次', dataIndex: 'shift', width: 110 },
    { title: '出勤时长', dataIndex: 'actualDays', width: 100, align: 'right' },
    { title: '异常类型', dataIndex: 'businessType', width: 130 },
    { title: '结果状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['date', 'employeeNo', 'name', 'status'],
  defaultVisible: ['date', 'employeeNo', 'name', 'shift', 'actualDays', 'businessType', 'status'],
  formTitle: '日考勤统计条件',
  formFields: [date('statDate', '统计日期', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees)],
  pageActions: [action('recalculate', '触发重算任务', { effect: { type: 'message', message: '重算任务已创建' } }), action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } })],
});

const monthlyStat = simpleCorePage({
  primaryAction: '生成',
  statusTabs: tabs(['none', '未生成'], ['generated', '已生成'], ['confirmed', '已确认'], ['locked', '已锁定']),
  searchFields: [month('month', '月份'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '状态', ['未生成', '已生成', '已确认', '已锁定'])],
  columns: [
    idx,
    { title: '月份', dataIndex: 'month', width: 100 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '应出勤天数', dataIndex: 'requiredDays', width: 110, align: 'right' },
    { title: '实出勤天数', dataIndex: 'actualDays', width: 110, align: 'right' },
    { title: '迟到次数', dataIndex: 'lateCount', width: 100, align: 'right' },
    { title: '早退次数', dataIndex: 'earlyCount', width: 100, align: 'right' },
    { title: '缺卡次数', dataIndex: 'missingCount', width: 100, align: 'right' },
    { title: '请假时长', dataIndex: 'leaveHours', width: 100, align: 'right' },
    { title: '加班时长', dataIndex: 'overtimeHours', width: 100, align: 'right' },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
  ],
  requiredVisible: ['month', 'employeeNo', 'name', 'status'],
  defaultVisible: ['month', 'employeeNo', 'name', 'department', 'requiredDays', 'actualDays', 'lateCount', 'missingCount', 'status'],
  formTitle: '月考勤统计条件',
  formFields: [month('month', '月份', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees)],
  pageActions: [action('confirm', '确认', { effect: { type: 'message', message: '已确认所选月报' } }), action('lock', '锁定', { effect: { type: 'message', message: '已锁定所选月报' } }), action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } })],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('confirmRow', '确认', { kind: 'link', visibleWhen: { field: 'status', equals: '已生成' }, effect: { type: 'setStatus', status: '已确认' } }), action('lockRow', '锁定', { kind: 'link', visibleWhen: { field: 'status', equals: '已确认' }, effect: { type: 'setStatus', status: '已锁定' } })],
});
```

- [ ] **Step 5: Add performance and payslip configs**

Add this below the attendance configs:

```ts
const performancePlan = simpleCorePage({
  primaryAction: '新增考核计划',
  statusTabs: tabs(['draft', '草稿'], ['published', '已发布'], ['scoring', '评分中'], ['reviewing', '审核中'], ['confirmed', '已确认'], ['closed', '已关闭'], ['stopped', '已终止']),
  searchFields: [input('name', '计划名称'), select('department', '适用部门', departments), month('month', '考核周期'), select('status', '计划状态', ['草稿', '已发布', '评分中', '审核中', '已确认', '已关闭', '已终止'])],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'month', 'department', 'owner', 'status', 'date'],
  formTitle: '考核计划',
  formFields: [input('code', '计划编号', { required: true }), input('name', '计划名称', { required: true }), month('month', '考核周期'), select('department', '考核范围', departments), select('template', '考核模板', ['岗位模板', '部门模板', '通用模板']), select('owner', '负责人', employees), text('remark', '考核说明')],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }), action('start', '发起考核', { kind: 'link', visibleWhen: { field: 'status', equals: '已发布' }, effect: { type: 'setStatus', status: '评分中' } }), action('progress', '查看进度', { kind: 'link', effect: { type: 'message', message: '已打开考核进度' } }), action('delete', '删除', { kind: 'link', effect: { type: 'delete' } })],
});

const performanceProgress = simpleCorePage({
  primaryAction: '批量提醒',
  statusTabs: tabs(['todo', '待评分'], ['scoring', '评分中'], ['review', '待审核'], ['done', '已完成'], ['stopped', '已终止']),
  searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('department', '所属部门', departments), select('status', '考核状态', ['待评分', '评分中', '待审核', '已完成', '已终止'])],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'month', 'department', 'owner', 'status', 'date'],
  formTitle: '考核任务',
  formFields: [select('plan', '考核计划', ['2026半年度考核', '月度绩效']), select('employee', '被考核人', employees), select('reviewer', '评分人', employees), number('score', '评分'), text('comment', '评价意见'), upload('files', '评分附件')],
  rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), action('score', '评分', { kind: 'link', visibleWhen: { field: 'status', equals: '待评分' }, effect: { type: 'setStatus', status: '评分中' } }), action('finish', '完成', { kind: 'link', visibleWhen: { field: 'status', equals: '评分中' }, effect: { type: 'setStatus', status: '待审核' } }), action('stop', '终止考核', { kind: 'link', effect: { type: 'setStatus', status: '已终止' } })],
});

const performanceTemplate = simpleCorePage({
  primaryAction: '新增模板',
  statusTabs: tabs(['enabled', '启用'], ['disabled', '停用']),
  searchFields: [input('name', '模板名称'), select('templateType', '模板类型', ['岗位模板', '部门模板', '通用模板']), select('status', '状态', ['启用', '停用'])],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'department', 'owner', 'status', 'date'],
  formTitle: '考核模板',
  formFields: [input('code', '模板编号', { required: true }), input('name', '模板名称', { required: true }), select('templateType', '模板类型', ['岗位模板', '部门模板', '通用模板']), number('totalWeight', '总权重'), text('remark', '模板说明')],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }), action('config', '配置指标', { kind: 'link', effect: { type: 'message', message: '已打开指标配置' } }), action('delete', '删除', { kind: 'link', effect: { type: 'delete' } })],
});

const performanceIndicator = simpleCorePage({
  primaryAction: '新增指标',
  statusTabs: tabs(['enabled', '启用'], ['disabled', '停用']),
  searchFields: [input('name', '指标名称'), select('indicatorType', '指标类型', ['定量', '定性']), select('status', '状态', ['启用', '停用'])],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'department', 'owner', 'status', 'date'],
  formTitle: '考核指标',
  formFields: [input('code', '指标编号', { required: true }), input('name', '指标名称', { required: true }), select('indicatorType', '指标类型', ['定量', '定性']), number('weight', '权重'), input('scoreStandard', '评分标准', { span: 24 }), select('status', '状态', ['启用', '停用'])],
});

const salaryPayslip = simpleCorePage({
  primaryAction: '生成工资条',
  statusTabs: tabs(['pending', '待发放'], ['sent', '已发放'], ['viewed', '已查看'], ['withdrawn', '已撤回']),
  searchFields: [month('salaryMonth', '薪资月份'), input('employeeNo', '工号'), input('name', '员工姓名'), select('department', '所属部门', departments), select('status', '发放状态', ['待发放', '已发放', '已查看', '已撤回'])],
  columns: payslipColumns,
  requiredVisible: ['code', 'employeeNo', 'name', 'status'],
  defaultVisible: ['code', 'salaryMonth', 'employeeNo', 'name', 'department', 'payrollAmount', 'status', 'viewStatus'],
  formTitle: '工资条信息',
  formFields: [input('code', '工资条编号', { required: true }), input('batchNo', '批次编号', { required: true }), month('salaryMonth', '薪资月份', { required: true }), select('employee', '员工', employees, { required: true }), number('grossPay', '应发金额'), number('deduction', '扣款项'), number('netPay', '实发金额'), select('status', '发放状态', ['待发放', '已发放', '已撤回']), select('viewStatus', '查看状态', ['未查看', '已查看'])],
  pageActions: [action('sendAll', '批量发放', { effect: { type: 'message', message: '已批量发放工资条' } }), action('withdrawAll', '撤回', { effect: { type: 'message', message: '已撤回所选工资条' } })],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('send', '发放', { kind: 'link', visibleWhen: { field: 'status', equals: '待发放' }, effect: { type: 'setStatus', status: '已发放' } }), action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: '已发放' }, effect: { type: 'setStatus', status: '已撤回' } })],
});
```

- [ ] **Step 6: Add every core page mapping to `prdCorePageConfigs`**

Ensure `prdCorePageConfigs` contains these exact path mappings:

```ts
export const prdCorePageConfigs: Record<string, PageConfig> = {
  '/organization/list': organizationList,
  '/organization/position': positionManagement,
  '/employee/list': employeeList,
  '/employee/archive': employeeArchive,
  '/employee/contract': employeeContract,
  '/recruitment/demand': recruitmentDemand,
  '/recruitment/resume': recruitmentResume,
  '/recruitment/talent': recruitmentTalent,
  '/recruitment/interview': recruitmentInterview,
  '/recruitment/offer': recruitmentOffer,
  '/lifecycle/onboarding': lifecyclePage('新增入职', tabs(['pending', '待入职'], ['joined', '已入职'], ['giveup', '已放弃']), '已入职'),
  '/lifecycle/regularization': lifecyclePage('发起转正', tabs(['pending', '待转正'], ['approving', '审批中'], ['done', '已转正'], ['cancelled', '已取消']), '已转正'),
  '/lifecycle/transfer': lifecyclePage('发起调动', tabs(['pending', '待调动'], ['approving', '审批中'], ['effective', '待生效'], ['done', '已调动'], ['giveup', '已放弃']), '已调动'),
  '/lifecycle/resignation': lifecyclePage('发起离职', tabs(['pending', '待离职'], ['approving', '审批中'], ['confirming', '待确认'], ['effective', '待生效'], ['done', '已离职'], ['giveup', '已放弃'], ['cancelled', '已撤销']), '已离职'),
  '/attendance/repair': attendanceApplyPage('补卡'),
  '/attendance/leave': attendanceApplyPage('请假'),
  '/attendance/overtime': attendanceApplyPage('加班'),
  '/attendance/out': attendanceApplyPage('外出'),
  '/attendance/trip': attendanceApplyPage('出差'),
  '/attendance/group': attendanceGroup,
  '/attendance/shift': attendanceShift,
  '/attendance/schedule': attendanceSchedule,
  '/attendance/rule': attendanceRule,
  '/attendance/holiday': attendanceHoliday,
  '/attendance/clock-record': clockRecord,
  '/attendance/daily-stat': dailyStat,
  '/attendance/monthly-stat': monthlyStat,
  '/performance/plan': performancePlan,
  '/performance/progress': performanceProgress,
  '/performance/template': performanceTemplate,
  '/performance/indicator': performanceIndicator,
  '/salary/approval': salaryApproval,
  '/salary/payslip': salaryPayslip,
};
```

- [ ] **Step 7: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 10: Add Employee Detail Special Component

**Files:**
- Create: `src/components/EmployeeDetailPage.tsx`
- Modify: `src/components/GenericListPage.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create employee detail component**

Create `src/components/EmployeeDetailPage.tsx`:

```tsx
import { Avatar, Button, Card, Descriptions, Space, Tabs, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { MockRecord } from '../types';

interface EmployeeDetailPageProps {
  record?: MockRecord;
  onBack: () => void;
  onEdit: () => void;
}

const baseItems = [
  ['姓名', 'name'],
  ['部门', 'department'],
  ['职位', 'position'],
  ['职务', 'jobTitle'],
  ['职级', 'grade'],
  ['工号', 'employeeNo'],
  ['证件类型', 'idType'],
  ['证件号', 'idNo'],
  ['手机号码', 'phone'],
  ['合同类型', 'contractType'],
  ['员工类型', 'employmentType'],
  ['入职日期', 'date'],
  ['合同公司', 'contractCompany'],
  ['生日类型', 'birthdayType'],
  ['工作地点', 'workLocation'],
  ['司龄', 'seniority'],
  ['国籍', 'nationality'],
  ['工时制度', 'workHourSystem'],
];

export function EmployeeDetailPage({ record, onBack, onEdit }: EmployeeDetailPageProps) {
  const safeRecord = record ?? {
    name: '员工',
    status: '在职',
    department: '-',
    position: '-',
    employeeNo: '-',
    date: '-',
  };

  return (
    <section className="employee-detail-page">
      <div className="employee-hero">
        <Space size={18}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Space>
              <h2>{safeRecord.name}</h2>
              <Tag color="green">{safeRecord.status}</Tag>
            </Space>
            <div className="employee-hero-meta">
              部门：{safeRecord.department}　岗位：{safeRecord.position}　入职日期：{safeRecord.date}　司龄：{safeRecord.seniority ?? '0.16'}
            </div>
          </div>
        </Space>
        <Space>
          <Button onClick={onBack}>返回列表</Button>
          <Button type="primary" onClick={onEdit}>编辑</Button>
        </Space>
      </div>

      <Tabs
        className="employee-info-tabs"
        items={[
          {
            key: 'base',
            label: '基础信息',
            children: (
              <Card size="small" title="基础信息">
                <Descriptions bordered size="small" column={2}>
                  {baseItems.map(([label, key]) => (
                    <Descriptions.Item label={label} key={key}>
                      {safeRecord[key] ?? '-'}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            ),
          },
          { key: 'education', label: '教育经历', children: <Card size="small">暂无教育经历</Card> },
          { key: 'work', label: '工作经历', children: <Card size="small">暂无工作经历</Card> },
          { key: 'family', label: '家庭成员', children: <Card size="small">暂无家庭成员</Card> },
          { key: 'certificate', label: '员工证书', children: <Card size="small">暂无员工证书</Card> },
          { key: 'attachment', label: '附件', children: <Card size="small">暂无附件</Card> },
          { key: 'leader', label: '直属领导', children: <Card size="small">直属领导：{safeRecord.owner ?? '-'}</Card> },
          { key: 'growth', label: '成长记录', children: <Card size="small">暂无成长记录</Card> },
          { key: 'tax', label: '个税申报', children: <Card size="small">暂无个税申报信息</Card> },
        ]}
      />
    </section>
  );
}
```

- [ ] **Step 2: Render employee detail from `GenericListPage`**

Import component:

```tsx
import { EmployeeDetailPage } from './EmployeeDetailPage';
```

Add state:

```tsx
const [employeeDetailMode, setEmployeeDetailMode] = useState(false);
```

In `applyActionEffect`, before generic `openDetail`, add:

```tsx
if (action.effect?.type === 'openDetail' && path === '/employee/list') {
  setCurrentRecord(record);
  setEmployeeDetailMode(true);
  return;
}
```

At the top of return, before `return (` for normal page:

```tsx
if (employeeDetailMode) {
  return (
    <EmployeeDetailPage
      record={currentRecord}
      onBack={() => setEmployeeDetailMode(false)}
      onEdit={() => {
        setEmployeeDetailMode(false);
        setDrawerOpen(true);
      }}
    />
  );
}
```

- [ ] **Step 3: Add styles**

Append:

```css
.employee-detail-page {
  min-width: 980px;
}

.employee-hero {
  min-height: 118px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #f7fbff 0%, #e8f7f5 100%);
  border: 1px solid #edf0f5;
}

.employee-hero h2 {
  margin: 0;
  font-size: 18px;
}

.employee-hero-meta {
  margin-top: 10px;
  color: #4b5563;
}

.employee-info-tabs {
  margin-top: 10px;
}
```

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 11: Improve Mock Data for Status Tabs

**Files:**
- Modify: `src/mocks/moduleData.ts`

- [ ] **Step 1: Add status pools by path**

Add near top:

```ts
const statusPools: Array<[string, string[]]> = [
  ['/recruitment/demand', ['草稿', '已发布', '招聘中', '已关闭', '已取消']],
  ['/recruitment/resume', ['待筛选', '已通过', '已淘汰', '已转人才库', '已发起面试']],
  ['/recruitment/talent', ['可联系', '已邀约', '已入职', '暂不合适']],
  ['/recruitment/interview', ['待安排', '待面试', '已完成', '已取消']],
  ['/recruitment/offer', ['草稿', '已发放', '已确认', '已拒绝', '已撤回', '已转入职']],
  ['/lifecycle/onboarding', ['待入职', '已入职', '已放弃']],
  ['/lifecycle/regularization', ['待转正', '审批中', '已转正', '已取消']],
  ['/lifecycle/transfer', ['待调动', '审批中', '待生效', '已调动', '已放弃']],
  ['/lifecycle/resignation', ['待离职', '审批中', '待确认', '待生效', '已离职', '已放弃', '已撤销']],
  ['/attendance/repair', ['草稿', '审批中', '已通过', '已撤回']],
  ['/attendance/leave', ['草稿', '审批中', '已通过', '已撤回']],
  ['/attendance/overtime', ['草稿', '审批中', '已通过', '已撤回']],
  ['/attendance/out', ['草稿', '审批中', '已通过', '已撤回']],
  ['/attendance/trip', ['草稿', '审批中', '已通过', '已撤回']],
  ['/attendance/group', ['启用', '停用']],
  ['/attendance/shift', ['启用', '停用']],
  ['/attendance/schedule', ['启用', '停用']],
  ['/attendance/rule', ['启用', '停用']],
  ['/attendance/holiday', ['启用', '停用']],
  ['/attendance/clock-record', ['正常', '迟到', '早退', '缺卡', '外勤', '异常']],
  ['/attendance/daily-stat', ['待计算', '已计算', '已更新', '计算异常', '已锁定']],
  ['/attendance/monthly-stat', ['未生成', '已生成', '已确认', '已锁定']],
  ['/performance/plan', ['草稿', '已发布', '评分中', '审核中', '已确认', '已关闭', '已终止']],
  ['/performance/progress', ['待评分', '评分中', '待审核', '已完成', '已终止']],
  ['/performance/template', ['启用', '停用']],
  ['/performance/indicator', ['启用', '停用']],
  ['/salary/approval', ['草稿', '审批中', '已通过', '已撤回', '已归档']],
  ['/salary/payslip', ['待发放', '已发放', '已查看', '已撤回']],
];

function statusForPath(path: string, index: number) {
  const pool = statusPools.find(([prefix]) => path.includes(prefix))?.[1];
  return pool ? pool[index % pool.length] : ['启用', '正常', '审批中', '待处理', '已归档', '停用'][index % 6];
}
```

- [ ] **Step 2: Use path-aware status and add PRD fields**

In returned object, replace status assignment:

```ts
status: statusForPath(path, index),
```

Add fields:

```ts
idNo: `41152219991216${String(1000 + index)}`,
employmentType: ['全职', '兼职', '实习', '劳务'][index % 4],
probationDate: `2026-09-${String((index % 24) + 1).padStart(2, '0')}`,
education: ['高中', '大专', '本科', '硕士'][index % 4],
emergencyContact: ['王芳', '刘敏', '陈强', '赵丽'][index % 4],
emergencyPhone: `139${String(10000000 + index * 2468).slice(0, 8)}`,
effectiveDate: `2026-07-${String((index % 24) + 1).padStart(2, '0')}`,
startDate: `2026-06-${String((index % 24) + 1).padStart(2, '0')}`,
endDate: `2026-06-${String((index % 24) + 2).padStart(2, '0')}`,
duration: (index % 4) + 1,
batchType: ['普通', '补发', '更正', '奖金'][index % 4],
joinedCount: index % 3,
seniority: '0.16',
contractCompany: '智能办公系统',
birthdayType: '农历',
workLocation: ['总部', '一号厂区', '二号厂区'][index % 3],
workHourSystem: ['标准工时', '综合工时', '不定时'][index % 3],
nationality: '中国',
archiveType: ['工作经历', '教育经历', '家庭成员', '附件存档'][index % 4],
companyName: ['工作经历', '教育经历', '家庭成员', '附件'][index % 4] + `${index + 1}`,
contractType: ['劳动合同', '保密协议', '竞业协议', '实习协议'][index % 4],
source: ['招聘网站', '内推', '校园招聘', '人才库'][index % 4],
interviewMode: ['现场', '视频', '电话'][index % 3],
viewStatus: ['未查看', '已查看'][index % 2],
holidayType: ['法定假', '企业假', '年假', '调休'][index % 4],
plannedHeadcount: 8 + (index % 6),
grade: ['P1', 'P2', 'P3', 'M1', 'M2'][index % 5],
```

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 12: Form Footer Actions

**Files:**
- Modify: `src/components/TwoColumnFormDrawer.tsx`
- Modify: `src/components/GenericListPage.tsx`

- [ ] **Step 1: Extend drawer props**

Add import:

```ts
import type { ActionConfig, PageConfig, FieldConfig } from '../types';
```

Update props:

```ts
interface TwoColumnFormDrawerProps {
  open: boolean;
  title: string;
  sections: PageConfig['formSections'];
  footerActions?: ActionConfig[];
  onClose: () => void;
}
```

- [ ] **Step 2: Render configurable footer**

Update function signature:

```tsx
export function TwoColumnFormDrawer({ open, title, sections = [], footerActions, onClose }: TwoColumnFormDrawerProps) {
```

Replace footer content with:

```tsx
footer={
  <Space className="drawer-footer-actions">
    <Button onClick={() => form.resetFields()}>重置</Button>
    {(footerActions?.length ? footerActions : [{ key: 'submit', label: '提交', kind: 'primary' as const }]).map((action) => (
      <Button key={action.key} type={action.kind === 'primary' ? 'primary' : 'default'} danger={action.kind === 'danger'} onClick={handleSubmit}>
        {action.label}
      </Button>
    ))}
  </Space>
}
```

- [ ] **Step 3: Pass footer actions from `GenericListPage`**

Update drawer usage:

```tsx
footerActions={pageConfig.formFooterActions}
```

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: PASS.

## Task 13: Browser Verification Pass

**Files:**
- No source changes unless verification finds a defect.

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite serves `http://127.0.0.1:5173/`. If port is busy, use the displayed alternate port.

- [ ] **Step 2: Verify status tab page**

Open:

```text
http://127.0.0.1:5173/#/lifecycle/onboarding
```

Expected:

- Status tabs show `待入职`, `已入职`, `已放弃` with numbers.
- Clicking a tab filters rows.
- Clicking `确认入职` or `手动办理` changes row status and counts.

- [ ] **Step 3: Verify employee detail**

Open:

```text
http://127.0.0.1:5173/#/employee/list
```

Expected:

- Table shows core employee fields.
- Field settings includes optional PRD fields.
- Clicking row `查看` opens employee detail layout with hero and horizontal tabs.

- [ ] **Step 4: Verify recruitment**

Open:

```text
http://127.0.0.1:5173/#/recruitment/demand
```

Expected:

- Status tabs show PRD statuses.
- `发布` changes `草稿` row to `已发布`.
- `关闭` changes an allowed row to `已关闭`.

- [ ] **Step 5: Verify attendance and performance pages**

Open these pages:

```text
http://127.0.0.1:5173/#/attendance/group
http://127.0.0.1:5173/#/attendance/monthly-stat
http://127.0.0.1:5173/#/performance/plan
```

Expected:

- Attendance group shows `启用` and `停用` tabs.
- Monthly stat shows `未生成`, `已生成`, `已确认`, `已锁定` tabs.
- Performance plan shows PRD plan statuses and row actions.

- [ ] **Step 6: Verify salary**

Open:

```text
http://127.0.0.1:5173/#/salary/approval
```

Expected:

- Status tabs show `草稿`, `审批中`, `已通过`, `已撤回`, `已归档`.
- `发起审批`, `审批通过`, and `归档` update status.

- [ ] **Step 7: Final build**

Run:

```bash
npm run build
```

Expected: PASS.

## Self-Review Checklist

- Spec coverage: The plan covers config model, field visibility, status tabs, action simulation, employee detail, mock data, form buttons, and verification.
- Known implementation boundary: The plan explicitly maps every core module route selected in the design to `prdCorePageConfigs`. Data analysis and system settings remain outside this implementation scope.
- Placeholder scan: No task uses TBD/TODO/fill-in language.
- Type consistency: `ActionConfig`, `StatusTabConfig`, `TableVisibilityConfig`, and `formFooterActions` are defined before use.
