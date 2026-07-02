import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  TreeSelect,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  DownOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { getPageConfig } from '../config/pageConfigs';
import type { ActionConfig, FieldConfig, MockRecord, PageConfig, SelectOption } from '../types';
import { buildOrganizationTree, getVisibleOrganizationRowIds } from '../utils/organizationTree';
import { AnalyticsChartPage } from './AnalyticsChartPage';
import { DetailDrawer } from './DetailDrawer';
import { EmployeeArchivePage } from './EmployeeArchivePage';
import { EmployeeDetailPage } from './EmployeeDetailPage';
import { FieldSettingsModal } from './FieldSettingsModal';
import { OrganizationChartPage } from './OrganizationChartPage';
import { PageContainer } from './PageContainer';
import { QuickOnboardingModal } from './QuickOnboardingModal';
import { TwoColumnFormDrawer } from './TwoColumnFormDrawer';
import { filterRecordsBySearch } from '../utils/listSearch';
import { getSharedMockRecords, syncContractFromEmployee, syncEmployeeFromContract, updateSharedMockRecords } from '../utils/sharedMockRecords';
import { withDerivedEmployeeFields } from '../utils/employeeStatus';
import { cloneTreeSelectData } from '../utils/treeSelect';

const statusColor: Record<string, string> = {
  启用: 'green',
  正常: 'green',
  在职: 'green',
  试用期: 'blue',
  待入职: 'orange',
  已入职: 'green',
  已放弃: 'default',
  待转正: 'orange',
  已转正: 'green',
  待调动: 'orange',
  待生效: 'blue',
  已调动: 'green',
  待离职: 'orange',
  已离职: 'default',
  离职: 'default',
  待签订: 'orange',
  未生效: 'default',
  生效中: 'green',
  即将到期: 'orange',
  已到期: 'red',
  已解除: 'default',
  未发起: 'default',
  审批通过: 'green',
  审批驳回: 'red',
  已撤回: 'default',
  已终止: 'default',
  已通过: 'green',
  停用: 'red',
  已拒绝: 'red',
  异常: 'red',
  审批中: 'blue',
  处理中: 'blue',
  待处理: 'orange',
  待确认: 'orange',
  已归档: 'purple',
};

const chartAnalyticsPaths = new Set(['/analytics/entry-exit', '/analytics/attendance', '/analytics/salary', '/analytics/hr-dashboard']);

interface GenericListPageProps {
  title: string;
  path: string;
}

function renderSearchControl(field: FieldConfig) {
  const normalizedOptions = (field.options ?? []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const hasRichLabels = normalizedOptions.some((option) => option.label !== option.value);
  if (field.type === 'select') {
    return (
      <Select placeholder={field.placeholder ?? '请选择'} allowClear optionFilterProp="children" optionLabelProp={hasRichLabels ? 'value' : 'children'} popupClassName={hasRichLabels ? 'erp-rich-select-dropdown' : undefined}>
        {(normalizedOptions as SelectOption[]).map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
  if (field.type === 'treeSelect') {
    return <TreeSelect className="full-control" placeholder={field.placeholder ?? '请选择'} allowClear treeDefaultExpandAll treeData={cloneTreeSelectData(field.treeData)} />;
  }
  if (field.type === 'dateRange') {
    return <DatePicker.RangePicker />;
  }
  if (field.type === 'date') {
    return <DatePicker className="full-control" />;
  }
  if (field.type === 'month') {
    return <DatePicker picker="month" className="full-control" />;
  }
  if (field.type === 'time') {
    return <DatePicker picker="time" className="full-control" />;
  }
  if (field.type === 'number') {
    return <InputNumber className="full-control" min={field.min ?? 0} precision={field.precision} step={field.step} placeholder={field.placeholder ?? '请输入'} />;
  }
  return <Input placeholder={field.placeholder ?? '请输入'} allowClear />;
}

function addOrganizationLevels(records: MockRecord[], level = 0): MockRecord[] {
  return records.map((record) => ({
    ...record,
    treeLevel: level,
    children: record.children?.length ? addOrganizationLevels(record.children, level + 1) : undefined,
  }));
}

function getExpandableRowKeys(records: MockRecord[]): React.Key[] {
  return records.flatMap((record) => {
    if (!record.children?.length) {
      return [];
    }

    return [record.id, ...getExpandableRowKeys(record.children)];
  });
}

function normalizeFormValues(values: Record<string, unknown>): Record<string, string | number | undefined> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      if (value === undefined || value === null) {
        return [key, undefined];
      }
      if (typeof value === 'object' && 'format' in value && typeof value.format === 'function') {
        return [key, value.format('YYYY-MM-DD')];
      }
      if (Array.isArray(value)) {
        return [key, value.length ? `${value.length}个附件` : ''];
      }
      if (typeof value === 'number') {
        return [key, value];
      }
      return [key, String(value)];
    }),
  );
}

function buildCreatedRecord(path: string, title: string, values: Record<string, string | number | undefined>, index: number): MockRecord {
  const employeeName = String(values.employee ?? values.name ?? `新增${title}`);
  const defaultStatus = path === '/employee/contract' ? '生效中' : path === '/employee/list' ? '在职' : path.startsWith('/expense/') ? '草稿' : '启用';
  const status = String(values.status ?? values.contractStatus ?? defaultStatus);
  const record = {
    id: `${path}-${Date.now()}`,
    code: String(values.code ?? (path === '/employee/contract' ? `CON${Date.now()}` : `NEW${Date.now()}`)),
    name: employeeName,
    department: String(values.department ?? ''),
    owner: String(values.owner ?? ''),
    status,
    date: String(values.signDate ?? values.date ?? values.hireDate ?? values.startDate ?? ''),
    index: index + 1,
    ...values,
    ...(path === '/employee/contract'
      ? {
          employee: employeeName,
          contractStatus: String(values.contractStatus ?? status),
          actualEndDate: String(values.actualEndDate ?? values.endDate ?? ''),
          reminderDays: 30,
        }
      : {}),
  };
  return path === '/employee/list' ? withDerivedEmployeeFields(record) : record;
}

function buildNextEmployeeNo(records: MockRecord[]) {
  const maxEmployeeNo = records.reduce((max, record) => {
    const matchedNumber = String(record.employeeNo ?? '').match(/(\d+)$/)?.[1];
    const nextValue = matchedNumber ? Number(matchedNumber) : NaN;
    return Number.isFinite(nextValue) ? Math.max(max, nextValue) : max;
  }, 1000);

  return `AIF${String(maxEmployeeNo + 1)}`;
}

export function GenericListPage({ title, path }: GenericListPageProps) {
  if (chartAnalyticsPaths.has(path)) {
    return <AnalyticsChartPage title={title} path={path} />;
  }

  if (path === '/employee/archive') {
    return <EmployeeArchivePage />;
  }

  if (path === '/organization/chart') {
    return <OrganizationChartPage />;
  }

  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [employeeDetailMode, setEmployeeDetailMode] = useState(false);
  const [fieldSettingOpen, setFieldSettingOpen] = useState(false);
  const [registerQrOpen, setRegisterQrOpen] = useState(false);
  const [quickOnboardingOpen, setQuickOnboardingOpen] = useState(false);
  const [drawerContext, setDrawerContext] = useState<{
    title?: string;
    sections?: PageConfig['formSections'];
    submitEffect?: ActionConfig['effect'];
    sourceRecord?: MockRecord;
  }>();
  const [currentRecord, setCurrentRecord] = useState<MockRecord | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const pageConfig = useMemo(() => getPageConfig(path), [path]);
  const searchInitialValues = useMemo(
    () =>
      Object.fromEntries(
        pageConfig.searchFields
          .filter((field) => field.initialValue !== undefined)
          .map((field) => [String(field.name), field.initialValue]),
      ),
    [pageConfig.searchFields],
  );
  const [appliedSearchValues, setAppliedSearchValues] = useState<Record<string, unknown>>(searchInitialValues);
  const tableColumns = useMemo(() => pageConfig.table?.columns ?? pageConfig.tableColumns, [pageConfig.table?.columns, pageConfig.tableColumns]);
  const requiredVisibleKeys = useMemo(() => pageConfig.table?.requiredVisible ?? [], [pageConfig.table?.requiredVisible]);
  const allBusinessKeys = useMemo(
    () => tableColumns.filter((column) => column.dataIndex !== 'index').map((column) => String(column.dataIndex)),
    [tableColumns],
  );
  const defaultVisibleKeys = useMemo(
    () => pageConfig.table?.defaultVisible ?? allBusinessKeys,
    [pageConfig.table?.defaultVisible, allBusinessKeys],
  );
  const initialVisibleKeys = useMemo(
    () => Array.from(new Set([...requiredVisibleKeys, ...defaultVisibleKeys])),
    [requiredVisibleKeys, defaultVisibleKeys],
  );
  const [visibleKeys, setVisibleKeys] = useState<string[]>(initialVisibleKeys);
  const initialVisibleKeySignature = initialVisibleKeys.join('|');

  useEffect(() => {
    setVisibleKeys(initialVisibleKeys);
  }, [initialVisibleKeySignature]);

  useEffect(() => {
    form.setFieldsValue(searchInitialValues);
  }, [form, searchInitialValues]);

  useEffect(() => {
    setAppliedSearchValues(searchInitialValues);
  }, [searchInitialValues]);

  const initialDataSource = useMemo(() => getSharedMockRecords(path, title), [path, title]);
  const [dataSource, setDataSource] = useState<MockRecord[]>(initialDataSource);
  const [activeStatusTab, setActiveStatusTab] = useState<string | undefined>(pageConfig.statusTabs?.[0]?.key);
  const statusTabSignature = useMemo(
    () => pageConfig.statusTabs?.map((tab) => `${tab.key}:${tab.statusValues.join(',')}`).join('|') ?? '',
    [pageConfig.statusTabs],
  );

  useEffect(() => {
    setDataSource(initialDataSource);
    setSelectedRowKeys([]);
    setActiveStatusTab(pageConfig.statusTabs?.[0]?.key);
    setEmployeeDetailMode(false);
  }, [initialDataSource, statusTabSignature]);

  const commitDataSource = (updater: (records: MockRecord[]) => MockRecord[]) => {
    setDataSource((records) => {
      const nextRecords = updater(records);
      updateSharedMockRecords(path, () => nextRecords);
      return nextRecords;
    });
  };

  const activeStatusConfig = pageConfig.statusTabs?.find((tab) => tab.key === activeStatusTab);
  const searchFilteredDataSource = useMemo(
    () => filterRecordsBySearch(dataSource, pageConfig.searchFields, appliedSearchValues),
    [appliedSearchValues, dataSource, pageConfig.searchFields],
  );
  const filteredDataSource = useMemo(
    () =>
      activeStatusConfig
        ? searchFilteredDataSource.filter((record) => activeStatusConfig.statusValues.includes(String(record.status)))
        : searchFilteredDataSource,
    [activeStatusConfig, searchFilteredDataSource],
  );
  const drawerInitialValues = currentRecord ?? (!currentRecord && path === '/employee/list' ? { employeeNo: buildNextEmployeeNo(dataSource) } : undefined);
  const statusTabItems = pageConfig.statusTabs?.map((tab) => ({
    key: tab.key,
    label: `${tab.label} ${searchFilteredDataSource.filter((record) => tab.statusValues.includes(String(record.status))).length}`,
  }));
  const tableDataSource = useMemo(
    () => (path === '/organization/list' ? addOrganizationLevels(buildOrganizationTree(filteredDataSource)) : filteredDataSource),
    [filteredDataSource, path],
  );
  const organizationRowIndexMap = useMemo(() => {
    if (path !== '/organization/list') {
      return new Map<string, number>();
    }

    return new Map(getVisibleOrganizationRowIds(tableDataSource, expandedRowKeys).map((id, index) => [id, index + 1]));
  }, [expandedRowKeys, path, tableDataSource]);
  const visibleTableColumns = useMemo(
    () => tableColumns.filter((column) => column.dataIndex === 'index' || visibleKeys.includes(String(column.dataIndex))),
    [tableColumns, visibleKeys],
  );
  const tableExpandable =
    path === '/organization/list'
      ? {
          expandedRowKeys,
          indentSize: 0,
          onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedRowKeys([...keys]),
          showExpandColumn: false,
        }
      : undefined;

  useEffect(() => {
    if (path === '/organization/list') {
      setExpandedRowKeys(getExpandableRowKeys(tableDataSource));
      return;
    }

    setExpandedRowKeys([]);
  }, [path, tableDataSource]);

  const handleToolbarAction = (action: string) => {
    if (['批量提交', '确认', '锁定', '撤回', '发布', '停用', '授权'].some((key) => action.includes(key)) && !selectedRowKeys.length) {
      message.warning('请选择数据');
      return;
    }
    message.success(`${action}完成`);
  };

  const isActionVisible = (action: ActionConfig, record?: MockRecord) => {
    const condition = action.visibleWhen;
    if (!condition || !record) {
      return true;
    }

    const value = String(record[condition.field] ?? '');
    const equalsValues = Array.isArray(condition.equals) ? condition.equals : condition.equals === undefined ? undefined : [condition.equals];
    const notEqualsValues = Array.isArray(condition.notEquals) ? condition.notEquals : condition.notEquals === undefined ? undefined : [condition.notEquals];

    if (equalsValues && !equalsValues.map(String).includes(value)) {
      return false;
    }
    if (notEqualsValues && notEqualsValues.map(String).includes(value)) {
      return false;
    }
    return true;
  };

  const isActionEnabled = (action: ActionConfig, record?: MockRecord) => {
    const condition = action.enabledWhen;
    if (!condition || !record) {
      return true;
    }

    const value = String(record[condition.field] ?? '');
    const equalsValues = Array.isArray(condition.equals) ? condition.equals : condition.equals === undefined ? undefined : [condition.equals];
    const notEqualsValues = Array.isArray(condition.notEquals) ? condition.notEquals : condition.notEquals === undefined ? undefined : [condition.notEquals];

    if (equalsValues && !equalsValues.map(String).includes(value)) {
      return false;
    }
    if (notEqualsValues && notEqualsValues.map(String).includes(value)) {
      return false;
    }
    return true;
  };

  const applyActionEffect = (action: ActionConfig, record?: MockRecord) => {
    if (action.requiresSelection && !selectedRowKeys.length) {
      message.warning('请选择数据');
      return;
    }

    const effect = action.effect;
    switch (effect?.type) {
      case 'openCreate':
        setCurrentRecord(undefined);
        setDrawerContext(undefined);
        setDrawerOpen(true);
        return;
      case 'openEdit':
        setCurrentRecord(record);
        setDrawerContext(undefined);
        setDrawerOpen(true);
        return;
      case 'openProcess':
        setCurrentRecord(record);
        setDrawerContext({
          title: effect.drawerTitle ?? action.label,
          sections: effect.formSections,
          submitEffect: effect.submitEffect,
          sourceRecord: record,
        });
        setDrawerOpen(true);
        return;
      case 'openDetail':
        setCurrentRecord(record);
        if (path === '/employee/list') {
          setEmployeeDetailMode(true);
          setDetailOpen(false);
          return;
        }
        setDetailOpen(true);
        return;
      case 'openRegisterQr':
        setCurrentRecord(record);
        setRegisterQrOpen(true);
        return;
      case 'openQuickOnboarding':
        setQuickOnboardingOpen(true);
        return;
      case 'delete':
        if (record) {
          commitDataSource((records) => records.filter((item) => item.id !== record.id));
          message.success(effect.message ?? `${action.label}完成`);
        }
        return;
      case 'moveStatus':
      case 'setStatus':
        if (record && effect.status) {
          const status = effect.status;
          commitDataSource((records) => records.map((item) => (item.id === record.id ? { ...item, status } : item)));
          setCurrentRecord((item) => (item?.id === record.id ? { ...item, status } : item));
          message.success(effect.message ?? `${action.label}完成`);
        } else if (effect.status && selectedRowKeys.length) {
          const status = effect.status;
          const selectedKeys = new Set(selectedRowKeys.map(String));
          commitDataSource((records) => records.map((item) => (selectedKeys.has(String(item.id)) ? { ...item, status } : item)));
          setSelectedRowKeys([]);
          message.success(effect.message ?? `${action.label}完成`);
        }
        return;
      case 'setField':
        if (record && effect.field) {
          commitDataSource((records) => records.map((item) => (item.id === record.id ? { ...item, [effect.field as string]: effect.value } : item)));
          setCurrentRecord((item) => (item?.id === record.id ? { ...item, [effect.field as string]: effect.value } : item));
          message.success(effect.message ?? `${action.label}完成`);
        }
        return;
      case 'message':
      case 'noop':
      default:
        message.success(effect?.message ?? `${action.label}完成`);
    }
  };

  const handleDrawerSubmit = (values: Record<string, unknown>) => {
    const normalizedValues = normalizeFormValues(values);
    const submitEffect = drawerContext?.submitEffect;
    const sourceRecord = drawerContext?.sourceRecord;

    if (!submitEffect || !sourceRecord) {
      if (currentRecord) {
        const updatedRecord = path === '/employee/list' ? withDerivedEmployeeFields({ ...currentRecord, ...normalizedValues }) : { ...currentRecord, ...normalizedValues };
        commitDataSource((records) => records.map((item) => (item.id === currentRecord.id ? updatedRecord : item)));
        setCurrentRecord(updatedRecord);
        if (path === '/employee/contract') {
          syncEmployeeFromContract(updatedRecord);
        }
        if (path === '/employee/list') {
          syncContractFromEmployee(updatedRecord);
        }
        message.success('保存成功');
        return;
      }

      const createValues =
        path === '/employee/list' && !normalizedValues.employeeNo
          ? { ...normalizedValues, employeeNo: buildNextEmployeeNo(dataSource) }
          : normalizedValues;
      const createdRecord = buildCreatedRecord(path, title, createValues, dataSource.length);
      commitDataSource((records) => [createdRecord, ...records]);
      setCurrentRecord(createdRecord);
      if (path === '/employee/contract') {
        syncEmployeeFromContract(createdRecord);
      }
      if (path === '/employee/list') {
        syncContractFromEmployee(createdRecord);
      }
      message.success('保存成功');
      return;
    }

    const nextStatus = submitEffect.status;
    const nextField = submitEffect.field;
    const nextValue = submitEffect.value;

    const updatedSourceRecord = {
      ...sourceRecord,
      ...normalizedValues,
      ...(nextStatus ? { status: nextStatus, contractStatus: nextStatus } : {}),
      ...(nextField ? { [nextField as string]: nextValue } : {}),
    };

    commitDataSource((records) => records.map((item) => (item.id === sourceRecord.id ? updatedSourceRecord : item)));
    setCurrentRecord((item) =>
      item?.id === sourceRecord.id
        ? {
            ...item,
            ...normalizedValues,
            ...(nextStatus ? { status: nextStatus, contractStatus: nextStatus } : {}),
            ...(nextField ? { [nextField as string]: nextValue } : {}),
          }
        : item,
    );
    if (path === '/employee/contract') {
      syncEmployeeFromContract(updatedSourceRecord);
    }
    if (submitEffect.message) {
      message.success(submitEffect.message);
    }
  };

  const handleEmployeeRecordChange = (patch: Partial<MockRecord>) => {
    if (!currentRecord) {
      return;
    }

    const normalizedPatch = {
      ...patch,
      ...(patch.contractStartDate ? { startDate: patch.contractStartDate } : {}),
      ...(patch.contractEndDate ? { endDate: patch.contractEndDate } : {}),
    };
    const updatedRecord = withDerivedEmployeeFields({ ...currentRecord, ...normalizedPatch });
    setCurrentRecord(updatedRecord);
    commitDataSource((records) => records.map((item) => (item.id === updatedRecord.id ? updatedRecord : item)));
    syncContractFromEmployee(updatedRecord);
  };

  const getLegacyRowActionConfig = (action: string): ActionConfig => {
    if (action === '查看' || action === '钻取') {
      return { key: action, label: action, kind: 'link', effect: { type: 'openDetail' } };
    }
    if (action === '编辑') {
      return { key: action, label: action, kind: 'link', effect: { type: 'openEdit' } };
    }
    if (action === '删除') {
      return { key: action, label: action, kind: 'danger', confirm: '确认删除该数据？', effect: { type: 'delete' } };
    }
    return { key: action, label: action, kind: 'link', effect: { type: 'message' } };
  };

  const toggleOrganizationRow = (rowKey: React.Key) => {
    setExpandedRowKeys((keys) => (keys.includes(rowKey) ? keys.filter((key) => key !== rowKey) : [...keys, rowKey]));
  };

  const renderOrganizationName = (name: string, record: MockRecord) => {
    const hasChildren = Boolean(record.children?.length);
    const isExpanded = expandedRowKeys.includes(record.id);
    const treeLevel = Number(record.treeLevel ?? 0);

    return (
      <span className="organization-name-cell" style={{ paddingLeft: treeLevel * 24 }}>
        {hasChildren ? (
          <Button
            aria-label={isExpanded ? '收起组织' : '展开组织'}
            className="organization-expand-button"
            icon={isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
            size="small"
            type="text"
            onClick={(event) => {
              event.stopPropagation();
              toggleOrganizationRow(record.id);
            }}
          />
        ) : (
          <span className="organization-expand-spacer" />
        )}
        <span>{name}</span>
      </span>
    );
  };

  const configuredRowActions = pageConfig.rowActionConfigs ?? (pageConfig.rowActions ?? ['查看', '编辑', '删除']).map(getLegacyRowActionConfig);
  const columns: ColumnsType<MockRecord> = [
    ...visibleTableColumns
      .map((column) => ({
        title: column.title,
        dataIndex: column.dataIndex === 'index' ? undefined : column.dataIndex,
        width: column.width,
        align: column.align,
        render:
          column.dataIndex === 'index'
            ? (_value: unknown, record: MockRecord, index: number) =>
                path === '/organization/list' ? organizationRowIndexMap.get(record.id) : index + 1
            : path === '/organization/list' && column.dataIndex === 'name'
              ? (name: string, record: MockRecord) => renderOrganizationName(name, record)
              : column.status
              ? (status: string) => <Tag color={statusColor[status] ?? 'default'}>{status}</Tag>
              : column.money
                ? (value: number) => `￥${Number(value ?? 0).toLocaleString()}`
                : undefined,
      })),
    ...(configuredRowActions.length
      ? [{
          title: '操作',
          fixed: 'right' as const,
          width: configuredRowActions.length > 5 ? 240 : Math.max(120, configuredRowActions.length * 42 + 20),
          render: (_value: unknown, record: MockRecord) => {
        const configuredActions = configuredRowActions;
        const actions = configuredActions.filter((action) => isActionVisible(action, record));
        const primaryActions = actions.length <= 5 ? actions : actions.slice(0, 5);
        const moreActions =
          actions.length <= 5
            ? []
            : actions
                .filter((_action, index) => index >= 5)
                .map((action) => ({ key: action.key, label: action.label, disabled: !isActionEnabled(action, record) }));

        return (
          <Space size={4}>
            {primaryActions.map((action) => {
              const enabled = isActionEnabled(action, record);
              const button = (
                <Button
                  key={action.key}
                  type="link"
                  size="small"
                  danger={action.kind === 'danger'}
                  disabled={!enabled}
                  onClick={action.confirm ? undefined : () => applyActionEffect(action, record)}
                >
                  {action.label}
                </Button>
              );

              return action.confirm ? (
                <Popconfirm key={action.key} title={action.confirm} onConfirm={() => applyActionEffect(action, record)}>
                  {button}
                </Popconfirm>
              ) : (
                button
              );
            })}
            {moreActions.length > 0 && (
              <Dropdown
                trigger={['click']}
                menu={{
                  items: moreActions,
                  onClick: ({ key }) => {
                    const action = actions.find((item) => item.key === key);
                    if (action) {
                      applyActionEffect(action, record);
                    }
                  },
                }}
              >
                <Button type="link" size="small">
                  更多
                </Button>
              </Dropdown>
            )}
          </Space>
        );
          },
        }]
      : []),
  ];

  if (employeeDetailMode) {
    return (
      <EmployeeDetailPage
        record={currentRecord}
        onRecordChange={handleEmployeeRecordChange}
        onBack={() => setEmployeeDetailMode(false)}
      />
    );
  }

  return (
    <PageContainer title={title}>
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

      <div className="search-panel">
        <Form form={form} layout="vertical" initialValues={searchInitialValues} onFinish={(values) => {
          setAppliedSearchValues(values);
          message.success('查询完成');
        }}>
          <div className="search-row">
            {pageConfig.searchFields.map((field) => (
              <Form.Item label={field.label} name={String(field.name)} key={String(field.name)}>
                {renderSearchControl(field)}
              </Form.Item>
            ))}
            <Space className="search-actions">
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button>
                展开 <DownOutlined />
              </Button>
            </Space>
          </div>
        </Form>
        <div className="selected-filters">
          <span>筛选条件：</span>
          <Tag>当前页面：{title}</Tag>
          <Tag>字段方案：{visibleKeys.length} 列</Tag>
        </div>
      </div>

      <div className="table-toolbar">
        <Space>
          <Button
            onClick={() => {
              form.resetFields();
              form.setFieldsValue(searchInitialValues);
              setAppliedSearchValues(searchInitialValues);
            }}
          >
            重置
          </Button>
          <Tooltip title="字段设置">
            <Button icon={<SettingOutlined />} onClick={() => setFieldSettingOpen(true)} />
          </Tooltip>
          <Tooltip title="刷新">
            <Button icon={<ReloadOutlined />} onClick={() => message.success('刷新成功')} />
          </Tooltip>
        </Space>
        <Space>
          {(pageConfig.pageActions ?? [])
            .filter((action) => isActionVisible(action))
            .map((action) => (
              <Button key={action.key} type={action.kind === 'primary' ? 'primary' : 'default'} danger={action.kind === 'danger'} onClick={() => applyActionEffect(action)}>
                {action.label}
              </Button>
            ))}
          {(pageConfig.toolbarActions ?? []).map((action) => (
            <Button key={action} onClick={() => handleToolbarAction(action)}>
              {action}
            </Button>
          ))}
          {pageConfig.showBatchSubmit && <Button onClick={() => handleToolbarAction('批量提交')}>批量提交</Button>}
          {pageConfig.showExport && (
            <Button icon={<ExportOutlined />} onClick={() => message.success('导出任务已创建')}>
              导出
            </Button>
          )}
          {pageConfig.showImport && (
            <Button icon={<ImportOutlined />} onClick={() => message.success('导入校验任务已创建')}>
              导入
            </Button>
          )}
          {pageConfig.showDelete && selectedRowKeys.length > 0 && (
            <Popconfirm title="确认删除选中的数据？" onConfirm={() => handleToolbarAction('删除')}>
              <Button danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
          {pageConfig.showCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentRecord(undefined);
                setDrawerContext(undefined);
                setDrawerOpen(true);
              }}
            >
              {pageConfig.primaryAction ?? '新建'}
            </Button>
          )}
        </Space>
      </div>

      <Table
        bordered
        size="small"
        rowKey="id"
        className="erp-table"
        columns={columns}
        dataSource={tableDataSource}
        expandable={tableExpandable}
        scroll={{ x: 1280, y: 'calc(100vh - 355px)' }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={{
          total: filteredDataSource.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 20,
        }}
      />

      <TwoColumnFormDrawer
        open={drawerOpen}
        title={drawerContext?.title ?? (currentRecord ? `编辑${title}` : pageConfig.primaryAction ?? `新增${title}`)}
        sections={drawerContext?.sections ?? pageConfig.formSections}
        footerActions={pageConfig.formFooterActions}
        approvalFlow={pageConfig.approvalFlow}
        drawerLayout={pageConfig.drawerLayout}
        initialValues={drawerInitialValues}
        onSubmit={handleDrawerSubmit}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerContext(undefined);
        }}
      />
      <DetailDrawer
        open={detailOpen}
        title={title}
        record={currentRecord}
        pageConfig={pageConfig}
        onAction={applyActionEffect}
        onClose={() => setDetailOpen(false)}
      />
      <Modal
        title="发送登记二维码"
        open={registerQrOpen}
        width={580}
        okText="确定"
        cancelText="取消"
        onOk={() => {
          message.success(`登记二维码已发送至${currentRecord?.name ?? '入职人'}的短信或邮箱`);
          setRegisterQrOpen(false);
        }}
        onCancel={() => setRegisterQrOpen(false)}
      >
        <div className="register-qr-modal">
          <div className="register-qr-row">
            <span className="register-qr-label">通知方式：</span>
            <div className="register-qr-content">
              <Checkbox defaultChecked>邮件</Checkbox>
              <span className="register-qr-tip">入职登记表填写链接将通过邮件发送，请确保公司邮箱设置已配置</span>
              <div className="register-qr-sms">
                <Checkbox>短信</Checkbox>
                <span className="register-qr-tip">短信还剩余0条</span>
              </div>
              <div className="register-qr-muted">入职登记表填写通知将通过短信发送，需确保短信余额充足</div>
            </div>
          </div>
          <div className="register-qr-row register-qr-code-row">
            <span className="register-qr-label">入职二维码：</span>
            <div className="register-qr-content">
              <div className="register-qr-muted">HR 可发送下方二维码，员工扫码即可填写提交入职登记表。</div>
              <div className="register-qr-code" aria-label="入职二维码">
                <div className="register-qr-grid" />
                <span>入职</span>
              </div>
              <Button>下载二维码</Button>
            </div>
          </div>
        </div>
      </Modal>
      <FieldSettingsModal
        open={fieldSettingOpen}
        columns={tableColumns}
        visibleKeys={visibleKeys}
        requiredKeys={requiredVisibleKeys}
        onChange={setVisibleKeys}
        onClose={() => setFieldSettingOpen(false)}
      />
      <QuickOnboardingModal
        open={quickOnboardingOpen}
        onClose={() => setQuickOnboardingOpen(false)}
        onConfirm={(records) => {
          const confirmedRecords = records.map((record, index) => ({
            ...record,
            id: `joined-${Date.now()}-${index}`,
            status: '已入职',
            source: '快速入职窗口',
            expectedDate: record.date,
          }));
          commitDataSource((items) => [...confirmedRecords, ...items]);
        }}
      />
    </PageContainer>
  );
}
