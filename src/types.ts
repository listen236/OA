import type { ReactNode } from 'react';

export interface MenuRoute {
  path?: string;
  title: string;
  icon?: ReactNode;
  children?: MenuRoute[];
}

export interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
}

export interface MockRecord {
  id: string;
  code: string;
  name: string;
  department: string;
  owner: string;
  status: string;
  date: string;
  position?: string;
  phone?: string;
  employeeNo?: string;
  contractStatus?: string;
  headcount?: number;
  demandStatus?: string;
  expectedDate?: string;
  attendanceType?: string;
  shift?: string;
  clockMode?: string;
  priority?: number;
  startTime?: string;
  endTime?: string;
  restTime?: string;
  flexibleClock?: string;
  month?: string;
  requiredDays?: number;
  actualDays?: number;
  lateCount?: number;
  earlyCount?: number;
  missingCount?: number;
  leaveHours?: number;
  overtimeHours?: number;
  salaryMonth?: string;
  payrollAmount?: number;
  version?: string;
  businessType?: string;
  remark?: string;
  children?: MockRecord[];
  [key: string]: string | number | MockRecord[] | undefined;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface TreeSelectOption {
  title: string;
  value: string;
  children?: readonly TreeSelectOption[];
}

export type FieldType = 'input' | 'select' | 'treeSelect' | 'radio' | 'date' | 'dateRange' | 'month' | 'time' | 'number' | 'textarea' | 'upload';

export interface FieldConfig {
  name: keyof MockRecord | string;
  label: string;
  type?: FieldType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  options?: readonly (string | SelectOption)[];
  treeData?: readonly TreeSelectOption[];
  placeholder?: string;
  initialValue?: string | number | string[];
  span?: 12 | 24;
  min?: number;
  precision?: number;
  step?: number;
}

export interface FormSectionConfig {
  title: string;
  fields: FieldConfig[];
  type?: 'fields' | 'detailTable';
  displayMode?: 'table' | 'inlineBlocks';
  columns?: ColumnConfig[];
  addButtonText?: string;
  modalTitle?: string;
  nestedSections?: FormSectionConfig[];
}

export interface ColumnConfig {
  title: string;
  dataIndex: keyof MockRecord | string | 'index' | 'actions';
  width?: number;
  align?: 'left' | 'center' | 'right';
  status?: boolean;
  money?: boolean;
}

export type PageType = 'crud' | 'approval' | 'report' | 'dashboard' | 'readonly' | 'special';

export type ActionKind = 'primary' | 'default' | 'danger' | 'link';

export type ActionEffectType =
  | 'message'
  | 'openCreate'
  | 'openEdit'
  | 'openDetail'
  | 'openProcess'
  | 'openRegisterQr'
  | 'openQuickOnboarding'
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
  drawerTitle?: string;
  formSections?: FormSectionConfig[];
  submitEffect?: ActionEffect;
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

export interface PageConfig {
  pageType?: PageType;
  primaryAction?: string;
  approvalFlow?: boolean;
  drawerLayout?: 'single' | 'double' | 'auto';
  rowActions?: string[];
  toolbarActions?: string[];
  pageActions?: ActionConfig[];
  rowActionConfigs?: ActionConfig[];
  detailActions?: ActionConfig[];
  formFooterActions?: ActionConfig[];
  statusTabs?: StatusTabConfig[];
  table?: TableVisibilityConfig;
  detailSections?: FormSectionConfig[];
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
