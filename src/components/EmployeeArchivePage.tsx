import { Button, DatePicker, Form, Input, Modal, Select, Space, Table, Tabs, Tag, TreeSelect, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getEmployeeArchiveTabs, type EmployeeArchiveRecord, type EmployeeArchiveTabKey } from '../mocks/employeeArchives';
import { departmentTreeOptions, employeeNoByName, employeeOptions } from '../config/organizationOptions';
import { PageContainer } from './PageContainer';
import { cloneTreeSelectData } from '../utils/treeSelect';

const archiveTypeFields: Record<EmployeeArchiveTabKey, Array<{ name: string; label: string; type?: 'input' | 'select' | 'date' | 'textarea'; options?: string[]; required?: boolean }>> = {
  工作经历: [
    { name: '公司名称', label: '公司名称', required: true },
    { name: '担任职位', label: '担任职位', required: true },
    { name: '入职日期', label: '入职日期', type: 'date', required: true },
    { name: '离职日期', label: '离职日期', type: 'date' },
    { name: '职位描述', label: '职位描述', type: 'textarea' },
  ],
  教育经历: [
    { name: '学校名称', label: '学校名称', required: true },
    { name: '学历', label: '学历', type: 'select', options: ['高中', '大专', '本科', '硕士', '博士'], required: true },
    { name: '专业', label: '专业' },
    { name: '开始日期', label: '开始日期', type: 'date', required: true },
    { name: '结束日期', label: '结束日期', type: 'date' },
    { name: '是否最高学历', label: '是否最高学历', type: 'select', options: ['是', '否'] },
  ],
  家庭成员: [
    { name: '姓名', label: '姓名', required: true },
    { name: '关系', label: '关系', type: 'select', options: ['父亲', '母亲', '配偶', '子女', '其他'], required: true },
    { name: '联系电话', label: '联系电话' },
    { name: '是否紧急联系人', label: '是否紧急联系人', type: 'select', options: ['是', '否'] },
  ],
  附件存档: [
    { name: '附件类型', label: '附件类型', type: 'select', options: ['身份证', '学历证明', '合同附件', '证书', '其他'], required: true },
    { name: '附件文件', label: '附件文件', required: true },
    { name: '备注', label: '备注', type: 'textarea' },
  ],
};

function normalizeArchiveValues(values: Record<string, unknown>): EmployeeArchiveRecord {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      if (value === undefined || value === null) {
        return [key, ''];
      }
      if (typeof value === 'object' && 'format' in value && typeof value.format === 'function') {
        return [key, value.format('YYYY-MM-DD')];
      }
      return [key, String(value)];
    }),
  );
}

export function EmployeeArchivePage() {
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const archiveTabs = useMemo(() => getEmployeeArchiveTabs(), []);
  const [archiveRowsByTab, setArchiveRowsByTab] = useState<Record<string, EmployeeArchiveRecord[]>>(() =>
    Object.fromEntries(archiveTabs.map((tab) => [tab.key, tab.rows])),
  );
  const [activeTab, setActiveTab] = useState(archiveTabs[0]?.key ?? '工作经历');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRowKeysByTab, setSelectedRowKeysByTab] = useState<Record<string, Key[]>>({});
  const activeSelectedRowKeys = useMemo(() => selectedRowKeysByTab[activeTab] ?? [], [activeTab, selectedRowKeysByTab]);
  const activeArchiveTab = archiveTabs.find((tab) => tab.key === activeTab) ?? archiveTabs[0];
  const activeCreateFields = archiveTypeFields[activeTab as EmployeeArchiveTabKey] ?? archiveTypeFields.工作经历;

  useEffect(() => {
    if (!createModalOpen) {
      return;
    }

    createForm.setFieldsValue({
      archiveType: activeTab,
      employee: employeeOptions[0]?.value,
      department: '总经办',
      入职日期: dayjs(),
      开始日期: dayjs(),
    });
  }, [activeTab, createForm, createModalOpen]);

  const handleOpenCreate = () => {
    createForm.resetFields();
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = (values: Record<string, unknown>) => {
    const normalizedValues = normalizeArchiveValues(values);
    const employeeName = String(normalizedValues.employee ?? employeeOptions[0]?.value ?? '');
    const archiveType = String(normalizedValues.archiveType ?? activeTab) as EmployeeArchiveTabKey;
    const nextRecord: EmployeeArchiveRecord = {
      id: `${archiveType}-${Date.now()}`,
      工号: employeeNoByName[employeeName] ?? '',
      员工姓名: employeeName,
      所属部门: String(normalizedValues.department ?? ''),
      ...normalizedValues,
    };
    delete nextRecord.employee;
    delete nextRecord.department;
    delete nextRecord.archiveType;

    setArchiveRowsByTab((current) => ({
      ...current,
      [archiveType]: [nextRecord, ...(current[archiveType] ?? [])],
    }));
    setCreateModalOpen(false);
    createForm.resetFields();
    message.success(`${archiveType}已新增`);
  };

  const handleCreateOk = () => {
    const formValues = createForm.getFieldsValue();
    const formItems = Array.from(document.querySelectorAll<HTMLElement>('.employee-archive-create-modal .ant-form-item'));
    const fallbackValues: Record<string, unknown> = {
      archiveType: activeTab,
      employee: String((formValues.employee ?? formItems[0]?.querySelector('.ant-select-selection-item')?.textContent?.trim()) || employeeOptions[0]?.value || ''),
      department: String((formValues.department ?? formItems[1]?.querySelector('.ant-select-selection-item')?.textContent?.trim()) || '总经办'),
    };

    activeCreateFields.forEach((field, index) => {
      const input = formItems[index + 3]?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
      const fallbackValue = input?.value || (field.type === 'date' && field.required ? dayjs().format('YYYY-MM-DD') : '');
      fallbackValues[field.name] = formValues[field.name] || fallbackValue;
    });

    const filledFormValues = Object.fromEntries(Object.entries(formValues).filter(([, value]) => value !== undefined && value !== ''));
    const nextValues: Record<string, unknown> = { ...fallbackValues, ...filledFormValues, archiveType: activeTab };
    const missingField = activeCreateFields.find((field) => field.required && !String(nextValues[field.name] ?? '').trim());
    if (missingField) {
      message.warning(`请填写${missingField.label}`);
      return;
    }
    handleCreateSubmit(nextValues);
  };

  const tabItems = archiveTabs.map((tab) => ({
    key: tab.key,
    label: `${tab.label} ${(archiveRowsByTab[tab.key] ?? tab.rows).length}`,
    children: (
      <>
        <div className="table-toolbar archive-tab-toolbar">
          <Space>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
          <Space>
            <Button type="primary" onClick={handleOpenCreate}>
              {tab.primaryAction}
            </Button>
            {tab.toolbarActions.map((action) => (
              <Button key={action} onClick={() => message.success(`${tab.label}${action}任务已创建`)}>
                {action}
              </Button>
            ))}
            {tab.key !== '附件存档' && activeTab === tab.key && activeSelectedRowKeys.length > 0 ? (
              <Button
                danger
                onClick={() => {
                  message.success(`已删除 ${activeSelectedRowKeys.length} 条${tab.label}记录`);
                  setSelectedRowKeysByTab((current) => ({ ...current, [tab.key]: [] }));
                }}
              >
                删除
              </Button>
            ) : null}
          </Space>
        </div>
        <Table
          bordered
          size="small"
          rowKey="id"
          className="erp-table"
          columns={tab.columns}
          dataSource={archiveRowsByTab[tab.key] ?? tab.rows}
          scroll={{ x: 1100, y: 'calc(100vh - 405px)' }}
          rowSelection={{
            selectedRowKeys: selectedRowKeysByTab[tab.key] ?? [],
            onChange: (keys) => setSelectedRowKeysByTab((current) => ({ ...current, [tab.key]: keys })),
          }}
          pagination={{
            total: tab.rows.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 20,
          }}
        />
      </>
    ),
  }));

  return (
    <PageContainer title="员工档案">
      <div className="search-panel">
        <Form form={form} layout="vertical">
          <div className="search-row archive-search-row">
            <Form.Item label="工号" name="employeeNo">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="员工姓名" name="name">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="所属部门" name="department">
              <TreeSelect placeholder="请选择" allowClear treeDefaultExpandAll treeData={cloneTreeSelectData(departmentTreeOptions)} />
            </Form.Item>
            <Space className="search-actions">
              <Button type="primary" onClick={() => message.success('查询完成')}>
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
          <Tag>当前页面：员工档案</Tag>
          <Tag>按页签维护多条档案记录</Tag>
        </div>
      </div>
      <Tabs className="status-tabs archive-type-tabs" activeKey={activeTab} items={tabItems} onChange={(key) => setActiveTab(key as typeof activeTab)} />
      <Modal
        className="employee-archive-create-modal"
        title={activeArchiveTab?.primaryAction}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreateOk}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" initialValues={{ archiveType: activeTab, employee: employeeOptions[0]?.value, department: '总经办' }} onFinish={handleCreateSubmit}>
          <Form.Item label="员工" name="employee" rules={[{ required: true, message: '请选择员工' }]}>
            <Select placeholder="请选择" optionFilterProp="children" optionLabelProp="value" popupClassName="erp-rich-select-dropdown">
              {employeeOptions.map(({ value, label }) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="所属部门" name="department" rules={[{ required: true, message: '请选择所属部门' }]}>
            <TreeSelect placeholder="请选择" treeDefaultExpandAll treeData={cloneTreeSelectData(departmentTreeOptions)} />
          </Form.Item>
          <Form.Item label="档案类型" name="archiveType" hidden>
            <Input />
          </Form.Item>
          {activeCreateFields.map((field) => (
            <Form.Item key={field.name} label={field.label} name={field.name} rules={field.required ? [{ required: true, message: `请填写${field.label}` }] : undefined}>
              {field.type === 'select' ? (
                <Select placeholder="请选择" options={(field.options ?? []).map((value) => ({ value }))} />
              ) : field.type === 'date' ? (
                <DatePicker className="full-control" />
              ) : field.type === 'textarea' ? (
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="请输入" />
              ) : (
                <Input placeholder="请输入" />
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </PageContainer>
  );
}
