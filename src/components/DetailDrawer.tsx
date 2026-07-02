import { Button, Descriptions, Drawer, Popconfirm, Space, Table, Tabs, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ActionConfig, FieldConfig, MockRecord, PageConfig } from '../types';

interface DetailDrawerProps {
  open: boolean;
  title: string;
  record?: MockRecord;
  pageConfig: PageConfig;
  onAction?: (action: ActionConfig, record?: MockRecord) => void;
  onClose: () => void;
}

const logColumns: ColumnsType<{ id: string; action: string; operator: string; time: string }> = [
  { title: '操作', dataIndex: 'action', width: 120 },
  { title: '操作人', dataIndex: 'operator', width: 120 },
  { title: '操作时间', dataIndex: 'time', width: 170 },
];

function renderValue(record: MockRecord | undefined, field: FieldConfig) {
  if (!record) {
    return '-';
  }
  const value = record[field.name as keyof MockRecord];
  if (Array.isArray(value)) {
    return value.length ? `${value.length} 个下级组织` : '-';
  }
  if ((field.name === 'status' || String(field.name).includes('Status')) && typeof value === 'string') {
    return <Tag color={value.includes('停') || value.includes('拒') || value.includes('异常') ? 'red' : 'blue'}>{value}</Tag>;
  }
  return value ?? '-';
}

function matchesActionCondition(action: ActionConfig, record: MockRecord | undefined, mode: 'visibleWhen' | 'enabledWhen') {
  const condition = action[mode];
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
}

export function DetailDrawer({ open, title, record, pageConfig, onAction, onClose }: DetailDrawerProps) {
  const configuredDetailSections = pageConfig.detailSections ?? pageConfig.formSections;
  const visibleDetailActions = (pageConfig.detailActions ?? []).filter((action) => matchesActionCondition(action, record, 'visibleWhen'));
  const detailSections = configuredDetailSections.length
    ? configuredDetailSections
    : [
        {
          title,
          fields: pageConfig.tableColumns
            .filter((column) => column.dataIndex !== 'index')
            .map((column) => ({ name: String(column.dataIndex), label: column.title })),
        },
      ];
  const totalFieldCount = detailSections.reduce((total, section) => total + section.fields.length, 0);
  const isSingleColumn = pageConfig.drawerLayout === 'single' || (pageConfig.drawerLayout !== 'double' && totalFieldCount <= 6);

  return (
    <Drawer
      className="erp-drawer"
      title={`${title}详情`}
      width={920}
      open={open}
      onClose={onClose}
      extra={
        visibleDetailActions.length ? (
          <Space>
            {visibleDetailActions.map((action) => {
              const enabled = matchesActionCondition(action, record, 'enabledWhen');
              const button = (
                <Button
                  key={action.key}
                  type={action.kind === 'primary' ? 'primary' : 'default'}
                  danger={action.kind === 'danger'}
                  disabled={!enabled}
                  onClick={action.confirm ? undefined : () => onAction?.(action, record)}
                >
                  {action.label}
                </Button>
              );

              return action.confirm ? (
                <Popconfirm key={action.key} title={action.confirm} onConfirm={() => onAction?.(action, record)}>
                  {button}
                </Popconfirm>
              ) : (
                button
              );
            })}
          </Space>
        ) : undefined
      }
    >
      <Tabs
        className="drawer-tabs"
        items={[
          {
            key: 'detail',
            label: '字段信息',
            children: (
              <>
                {detailSections.map((section) => (
                  <section className="drawer-field-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <Descriptions bordered size="small" column={isSingleColumn ? 1 : 2}>
                      {section.fields.map((field) => (
                        <Descriptions.Item key={String(field.name)} label={field.label}>
                          {renderValue(record, field)}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </section>
                ))}
                {pageConfig.approvalFlow ? (
                  <section className="drawer-field-section">
                    <h3>审批流程</h3>
                    <Timeline
                      items={[
                        { color: 'blue', children: '提交申请 / admin / 2026-06-10 09:30' },
                        { color: 'green', children: '部门负责人审批通过 / 张红红 / 2026-06-10 14:20' },
                        { color: 'gray', children: '等待 HR 复核' },
                      ]}
                    />
                  </section>
                ) : null}
              </>
            ),
          },
          {
            key: 'operationLog',
            label: '操作日志',
            children: (
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                columns={logColumns}
                dataSource={[
                  { id: '1', action: '新增', operator: 'admin', time: '2026-06-10 09:30' },
                  { id: '2', action: '编辑', operator: '张红红', time: '2026-06-11 11:08' },
                ]}
              />
            ),
          },
        ]}
      />
    </Drawer>
  );
}
