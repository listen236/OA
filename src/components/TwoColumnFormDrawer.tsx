import { DeleteOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, InputNumber, Modal, Radio, Row, Select, Space, Tabs, Table, Timeline, TreeSelect, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { ActionConfig, ColumnConfig, FieldConfig, FormSectionConfig, PageConfig, SelectOption } from '../types';
import { calculateProbationEndDate } from '../utils/employeeStatus';
import { cloneTreeSelectData } from '../utils/treeSelect';

interface TwoColumnFormDrawerProps {
  open: boolean;
  title: string;
  sections: PageConfig['formSections'];
  footerActions?: ActionConfig[];
  approvalFlow?: boolean;
  drawerLayout?: PageConfig['drawerLayout'];
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void;
  onClose: () => void;
}

const operationLogColumns: ColumnsType<{ id: string; action: string; operator: string; time: string }> = [
  { title: '操作', dataIndex: 'action', width: 120 },
  { title: '操作人', dataIndex: 'operator', width: 120 },
  { title: '操作时间', dataIndex: 'time', width: 170 },
];

function renderFormControl(field: FieldConfig) {
  const commonProps = {
    disabled: field.disabled || field.readOnly,
  };
  const normalizedOptions = (field.options ?? []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const hasRichLabels = normalizedOptions.some((option) => option.label !== option.value);
  if (field.type === 'select') {
    return (
      <Select {...commonProps} placeholder={field.placeholder ?? '请选择'} optionFilterProp="children" optionLabelProp={hasRichLabels ? 'value' : 'children'} popupClassName={hasRichLabels ? 'erp-rich-select-dropdown' : undefined}>
        {(normalizedOptions as SelectOption[]).map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
  if (field.type === 'treeSelect') {
    return <TreeSelect {...commonProps} treeDefaultExpandAll className="full-control" placeholder={field.placeholder ?? '请选择'} treeData={cloneTreeSelectData(field.treeData)} />;
  }
  if (field.type === 'radio') {
    return <Radio.Group {...commonProps} options={normalizedOptions.map((option) => ({ label: option.label, value: option.value }))} />;
  }
  if (field.type === 'number') {
    return <InputNumber {...commonProps} className="full-control" min={field.min ?? 0} precision={field.precision} step={field.step} placeholder={field.placeholder ?? '请输入'} />;
  }
  if (field.type === 'date') {
    return <DatePicker {...commonProps} className="full-control" />;
  }
  if (field.type === 'month') {
    return <DatePicker {...commonProps} picker="month" className="full-control" />;
  }
  if (field.type === 'time') {
    return <DatePicker {...commonProps} picker="time" className="full-control" />;
  }
  if (field.type === 'textarea') {
    return <Input.TextArea {...commonProps} rows={3} placeholder={field.placeholder ?? '请输入'} />;
  }
  if (field.type === 'upload') {
    if (field.span === 12) {
      return (
        <Upload showUploadList={false} beforeUpload={() => false}>
          <Button icon={<UploadOutlined />} size="small">
            上传
          </Button>
        </Upload>
      );
    }

    return (
      <Upload.Dragger
        disabled={field.disabled || field.readOnly}
        multiple
        beforeUpload={() => false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p className="ant-upload-hint">支持单次或批量上传</p>
      </Upload.Dragger>
    );
  }
  return <Input {...commonProps} readOnly={field.readOnly} placeholder={field.placeholder ?? '请输入'} />;
}

function renderInlineFormControl(field: FieldConfig) {
  if (field.type === 'upload') {
    return (
      <Upload showUploadList={false} beforeUpload={() => false}>
        <Button icon={<UploadOutlined />} size="small">
          上传
        </Button>
      </Upload>
    );
  }

  return renderFormControl(field);
}

function getRequiredMessage(field: FieldConfig) {
  return `${field.type === 'date' || field.type === 'month' || field.type === 'time' || field.type === 'select' || field.type === 'treeSelect' ? '请选择' : '请填写'}${field.label}`;
}

function renderTableValue(value: unknown, column: ColumnConfig) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }
  if (column.money) {
    return `￥${Number(value ?? 0).toLocaleString()}`;
  }
  if (Array.isArray(value)) {
    if (value.every((item) => item && typeof item === 'object')) {
      return value.length ? (
        <div className="drawer-nested-detail-lines">
          {value.map((item, index) => {
            const row = item as Record<string, unknown>;
            const invoiceNo = row.invoiceNo || row.digitalInvoiceNo || `发票${index + 1}`;
            const amount = row.invoiceAmount ? `￥${Number(row.invoiceAmount).toLocaleString()}` : '';
            return (
              <div key={String(row.id ?? index)}>
                {index + 1}. {String(invoiceNo)} {amount}
              </div>
            );
          })}
        </div>
      ) : '-';
    }
    return value.length ? `${value.length} 个文件` : '-';
  }
  if (typeof value === 'object' && 'format' in value && typeof value.format === 'function') {
    return value.format('YYYY-MM-DD');
  }
  return String(value);
}

function buildFormInitialValues(sections: PageConfig['formSections'], initialValues?: Record<string, unknown>) {
  if (!initialValues) {
    return { status: '启用' };
  }

  const dateFields = new Set(
    sections
      .flatMap((section) => section.fields ?? [])
      .filter((field) => field.type === 'date' || field.type === 'month' || field.type === 'time')
      .map((field) => String(field.name)),
  );

  return Object.fromEntries(
    Object.entries({ status: '启用', ...initialValues }).map(([key, value]) => {
      if (dateFields.has(key) && typeof value === 'string' && value) {
        return [key, dayjs(value)];
      }

      return [key, value];
    }),
  );
}

export function TwoColumnFormDrawer({ open, title, sections = [], footerActions, approvalFlow = false, drawerLayout = 'auto', initialValues, onSubmit, onClose }: TwoColumnFormDrawerProps) {
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [nestedDetailForm] = Form.useForm();
  const [activeDetailSection, setActiveDetailSection] = useState<FormSectionConfig | null>(null);
  const [activeNestedSection, setActiveNestedSection] = useState<FormSectionConfig | null>(null);
  const [detailRows, setDetailRows] = useState<Record<string, Array<Record<string, unknown>>>>({});
  const [nestedDetailRows, setNestedDetailRows] = useState<Record<string, Array<Record<string, unknown>>>>({});
  const hireDateValue = Form.useWatch('hireDate', form);
  const probationMonthsValue = Form.useWatch('probationMonths', form);
  const probationDateValue = Form.useWatch('probationDate', form);
  const [lastAutoProbationDate, setLastAutoProbationDate] = useState('');
  const totalFieldCount = sections.reduce((total, section) => total + (section.type === 'detailTable' ? 1 : section.fields?.length ?? 0), 0);
  const isSingleColumn = drawerLayout === 'single' || (drawerLayout === 'auto' && totalFieldCount <= 6);
  const activeDetailTitle = activeDetailSection?.title ?? '';
  const activeDetailFields = activeDetailSection?.fields ?? [];
  const detailTableColumns = useMemo<ColumnConfig[]>(() => {
    if (!activeDetailSection) {
      return [];
    }
    return activeDetailSection.fields.slice(0, 4).map((field) => ({
      title: field.label,
      dataIndex: String(field.name),
      width: 140,
    }));
  }, [activeDetailSection]);

  useEffect(() => {
    if (!open) {
      setActiveDetailSection(null);
      setActiveNestedSection(null);
      setDetailRows({});
      setNestedDetailRows({});
      setLastAutoProbationDate('');
      nestedDetailForm.resetFields();
      detailForm.resetFields();
      form.resetFields();
    }
  }, [detailForm, form, nestedDetailForm, open]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(buildFormInitialValues(sections, initialValues));
    }
  }, [form, initialValues, open, sections]);

  useEffect(() => {
    const hasProbationDate = sections.some((section) => section.fields?.some((field) => field.name === 'probationDate'));
    if (!open || !hasProbationDate) {
      return;
    }

    const normalizedHireDate =
      hireDateValue && typeof hireDateValue === 'object' && 'format' in hireDateValue && typeof hireDateValue.format === 'function'
        ? hireDateValue.format('YYYY-MM-DD')
        : typeof hireDateValue === 'string'
          ? hireDateValue
          : '';
    const normalizedProbationDate =
      probationDateValue && typeof probationDateValue === 'object' && 'format' in probationDateValue && typeof probationDateValue.format === 'function'
        ? probationDateValue.format('YYYY-MM-DD')
        : typeof probationDateValue === 'string'
          ? probationDateValue
          : '';
    const endDate = calculateProbationEndDate(normalizedHireDate, probationMonthsValue as string | number | undefined) || '';

    if (!probationDateValue || normalizedProbationDate === lastAutoProbationDate) {
      form.setFieldValue('probationDate', endDate ? dayjs(endDate) : undefined);
      setLastAutoProbationDate(endDate);
    }
  }, [form, hireDateValue, lastAutoProbationDate, open, probationDateValue, probationMonthsValue, sections]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit?.(values);
    if (!onSubmit) {
      message.success('保存成功');
    }
    onClose();
  };

  const openDetailModal = (section: FormSectionConfig) => {
    setActiveDetailSection(section);
    setActiveNestedSection(null);
    setNestedDetailRows({});
    nestedDetailForm.resetFields();
    detailForm.resetFields();
  };

  const closeDetailModal = () => {
    setActiveDetailSection(null);
    setActiveNestedSection(null);
    setNestedDetailRows({});
    nestedDetailForm.resetFields();
    detailForm.resetFields();
  };

  const handleDetailSubmit = async () => {
    if (!activeDetailSection) {
      return;
    }

    const values = await detailForm.validateFields();
    setDetailRows((rows) => ({
      ...rows,
      [activeDetailSection.title]: [
        ...(rows[activeDetailSection.title] ?? []),
        {
          ...values,
          ...Object.fromEntries(activeDetailSection.nestedSections?.map((section) => [section.title, nestedDetailRows[section.title] ?? []]) ?? []),
          invoiceDetails: nestedDetailRows['发票明细'] ?? [],
          id: `${activeDetailSection.title}-${Date.now()}`,
        },
      ],
    }));
    message.success(`${activeDetailSection.title}已添加`);
    closeDetailModal();
  };

  const openNestedDetailModal = (section: FormSectionConfig) => {
    setActiveNestedSection(section);
    nestedDetailForm.resetFields();
  };

  const handleNestedDetailSubmit = async () => {
    if (!activeNestedSection) {
      return;
    }

    const values = await nestedDetailForm.validateFields();
    setNestedDetailRows((rows) => ({
      ...rows,
      [activeNestedSection.title]: [
        ...(rows[activeNestedSection.title] ?? []),
        {
          ...values,
          id: `${activeNestedSection.title}-${Date.now()}`,
        },
      ],
    }));
    message.success(`${activeNestedSection.title}已添加`);
    setActiveNestedSection(null);
    nestedDetailForm.resetFields();
  };

  const addInlineDetailRow = (section: FormSectionConfig) => {
    setDetailRows((rows) => ({
      ...rows,
      [section.title]: [
        ...(rows[section.title] ?? []),
        {
          id: `${section.title}-${Date.now()}`,
        },
      ],
    }));
  };

  const removeInlineDetailRow = (section: FormSectionConfig, rowId: string) => {
    setDetailRows((rows) => ({
      ...rows,
      [section.title]: (rows[section.title] ?? []).filter((item) => item.id !== rowId),
    }));
  };

  const buildDetailColumns = (section: FormSectionConfig, scope: 'detail' | 'nested' = 'detail'): ColumnsType<Record<string, unknown>> => [
    ...(section.columns ?? detailTableColumns).map((column) => ({
      title: column.title,
      dataIndex: String(column.dataIndex),
      width: column.width,
      align: column.align,
      render: (value: unknown) => renderTableValue(value, column),
    })),
    {
      title: '操作',
      dataIndex: 'actions',
      width: 80,
      fixed: 'right',
      render: (_value: unknown, record: Record<string, unknown>) => (
        <Button
          danger
          size="small"
          type="link"
          onClick={() => {
            const updateRows = scope === 'nested' ? setNestedDetailRows : setDetailRows;
            updateRows((rows) => ({
              ...rows,
              [section.title]: (rows[section.title] ?? []).filter((item) => item.id !== record.id),
            }));
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  const renderFieldSection = (section: FormSectionConfig) => {
    if (section.type === 'detailTable') {
      if (section.displayMode === 'inlineBlocks') {
        const rows = detailRows[section.title] ?? [];

        return (
          <section key={section.title} className="drawer-field-section drawer-inline-detail-section">
            <div className="drawer-inline-section-title">
              <h3>{section.title}</h3>
            </div>
            {rows.map((row) => (
              <div className="drawer-inline-detail-card" key={String(row.id)}>
                <Button
                  className="drawer-inline-detail-delete"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`删除${section.title}`}
                  size="small"
                  type="text"
                  onClick={() => removeInlineDetailRow(section, String(row.id))}
                />
                <Row gutter={16}>
                  {(section.fields ?? []).map((field) => (
                    <Col span={field.span ?? (isSingleColumn ? 24 : 12)} key={String(field.name)}>
                      <Form.Item
                        label={field.label}
                        name={[section.title, String(row.id), String(field.name)]}
                        valuePropName={field.type === 'upload' ? 'fileList' : undefined}
                        getValueFromEvent={field.type === 'upload' ? (event) => event?.fileList : undefined}
                        rules={field.required ? [{ required: true, message: getRequiredMessage(field) }] : undefined}
                      >
                        {renderInlineFormControl(field)}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
            <Button className="drawer-inline-detail-add" block onClick={() => addInlineDetailRow(section)}>
              + {section.addButtonText ?? `添加${section.title}`}
            </Button>
          </section>
        );
      }

      return (
        <section key={section.title} className="drawer-field-section drawer-detail-table-section">
          <div className="drawer-section-head">
            <h3>{section.title}</h3>
            <Button size="small" type="primary" onClick={() => openDetailModal(section)}>
              {section.addButtonText ?? `添加${section.title}`}
            </Button>
          </div>
          <Table
            bordered
            className="drawer-detail-table"
            columns={buildDetailColumns(section)}
            dataSource={detailRows[section.title] ?? []}
            pagination={false}
            rowKey="id"
            scroll={{ x: Math.max(760, (section.columns?.length ?? 4) * 130) }}
            size="small"
          />
        </section>
      );
    }

    return (
      <section key={section.title} className="drawer-field-section">
        <h3>{section.title}</h3>
        <Row gutter={16}>
          {(section.fields ?? []).map((field) => (
            <Col span={field.span ?? (isSingleColumn ? 24 : 12)} key={String(field.name)}>
              <Form.Item
                label={field.label}
                name={String(field.name)}
                valuePropName={field.type === 'upload' ? 'fileList' : undefined}
                getValueFromEvent={field.type === 'upload' ? (event) => event?.fileList : undefined}
                rules={field.required ? [{ required: true, message: getRequiredMessage(field) }] : undefined}
              >
                {renderFormControl(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </section>
    );
  };

  const renderDetailModalSection = (section: FormSectionConfig) => (
    <section key={section.title} className="drawer-field-section drawer-detail-table-section">
      <div className="drawer-section-head">
        <h3>{section.title}</h3>
        <Button size="small" type="primary" onClick={() => openNestedDetailModal(section)}>
          {section.addButtonText ?? `添加${section.title}`}
        </Button>
      </div>
      <Table
        bordered
        className="drawer-detail-table"
        columns={buildDetailColumns(section, 'nested')}
        dataSource={nestedDetailRows[section.title] ?? []}
        pagination={false}
        rowKey="id"
        scroll={{ x: Math.max(620, (section.columns?.length ?? 4) * 130) }}
        size="small"
      />
    </section>
  );

  const renderModalFields = (fields: FieldConfig[], targetForm: typeof detailForm) => (
    <Form form={targetForm} layout="horizontal" labelCol={{ flex: '116px' }}>
      <Row gutter={16}>
        {fields.map((field) => (
          <Col span={field.span ?? 12} key={String(field.name)}>
            <Form.Item
              label={field.label}
              name={String(field.name)}
              valuePropName={field.type === 'upload' ? 'fileList' : undefined}
              getValueFromEvent={field.type === 'upload' ? (event) => event?.fileList : undefined}
              rules={field.required ? [{ required: true, message: getRequiredMessage(field) }] : undefined}
            >
              {renderFormControl(field)}
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Form>
  );

  return (
    <Drawer
      className="erp-drawer"
      title={title}
      width={960}
      open={open}
      onClose={onClose}
      footer={
        <Space className="drawer-footer-actions">
          {(footerActions?.length ? footerActions : [{ key: 'submit', label: '提交', kind: 'primary' as const }]).map((action) => (
            <Button
              key={action.key}
              type={action.kind === 'primary' ? 'primary' : 'default'}
              danger={action.kind === 'danger'}
              onClick={action.key === 'cancel' ? onClose : handleSubmit}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      }
    >
      <Tabs
        className="drawer-tabs"
        items={[
          {
            key: 'fields',
            label: '表单信息',
            children: (
              <Form form={form} layout="horizontal" labelCol={{ flex: '116px' }} initialValues={buildFormInitialValues(sections, initialValues)}>
                {sections.map((section) => renderFieldSection(section))}
                {approvalFlow ? (
                  <section className="drawer-field-section">
                    <h3>审批流程</h3>
                    <Timeline
                      items={[
                        { color: 'blue', children: '提交申请 / 当前用户' },
                        { color: 'gray', children: '直属上级审批' },
                        { color: 'gray', children: '人力资源复核' },
                      ]}
                    />
                  </section>
                ) : null}
              </Form>
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
                columns={operationLogColumns}
                dataSource={[
                  { id: '1', action: '创建草稿', operator: 'admin', time: '2026-06-10 09:30' },
                  { id: '2', action: '更新字段', operator: '张红红', time: '2026-06-11 11:08' },
                ]}
              />
            ),
          },
        ]}
      />
      <Modal
        title={activeDetailSection?.modalTitle ?? `添加${activeDetailTitle}`}
        open={Boolean(activeDetailSection)}
        width={activeDetailSection?.nestedSections?.length ? 860 : 720}
        okText="保存"
        cancelText="取消"
        onOk={handleDetailSubmit}
        onCancel={closeDetailModal}
      >
        {renderModalFields(activeDetailFields, detailForm)}
        {activeDetailSection?.nestedSections?.map((section) => renderDetailModalSection(section))}
      </Modal>
      <Modal
        title={activeNestedSection?.modalTitle ?? `添加${activeNestedSection?.title ?? ''}`}
        open={Boolean(activeNestedSection)}
        width={720}
        okText="保存"
        cancelText="取消"
        onOk={handleNestedDetailSubmit}
        onCancel={() => setActiveNestedSection(null)}
      >
        {renderModalFields(activeNestedSection?.fields ?? [], nestedDetailForm)}
      </Modal>
    </Drawer>
  );
}
