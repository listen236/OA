import { useState } from 'react';
import { Avatar, Button, DatePicker, Descriptions, Input, InputNumber, Select, Space, Switch, Table, Tabs, Tag, TreeSelect, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getEmployeeArchiveTabs } from '../mocks/employeeArchives';
import { companyOrganizations, departmentTreeOptions, employeeOptions } from '../config/organizationOptions';
import { calculateProbationEndDate, deriveEmployeeStatus } from '../utils/employeeStatus';
import { cloneTreeSelectData } from '../utils/treeSelect';
import type { MockRecord, SelectOption, TreeSelectOption } from '../types';

interface EmployeeDetailPageProps {
  record?: MockRecord;
  onBack: () => void;
  onRecordChange?: (patch: Partial<MockRecord>) => void;
}

const statusColor: Record<string, string> = {
  在职: 'green',
  试用期: 'blue',
  试用: 'blue',
  正式: 'green',
  正常: 'green',
  启用: 'green',
  离职中: 'orange',
  已离职: 'red',
  停用: 'red',
};

const fallbackValues: Record<string, string> = {
  idType: '身份证',
  idNo: '330102199001011234',
  employmentType: '正式员工',
  contractCompany: '智能办公系统',
  seniority: '2.3',
  socialWorkDate: '2020-03-01',
  workSeniority: '5.2',
  age: '30',
  email: 'employee@example.com',
  nation: '汉族',
  householdType: '居民户口',
  householdAddress: '浙江省杭州市',
  nativePlace: '浙江杭州',
  address: '杭州市滨江区',
  politicalStatus: '群众',
  maritalStatus: '未婚',
  bloodType: '未知',
  wechat: '-',
  qq: '-',
  bankName: '招商银行',
  bankBranch: '杭州分行',
  bankAccount: '**** **** **** 1234',
  bankAccountName: '员工',
};

const tabLabels = ['员工信息', '工作经历', '教育经历', '家庭成员', '附件存档', '操作记录'];

type DetailRecord = Record<string, string>;
type DetailControlType = 'input' | 'select' | 'treeSelect' | 'date' | 'number' | 'switch' | 'upload' | 'textarea' | 'readonly';
type DetailItem = { label: string; value: string; required?: boolean; type?: DetailControlType; options?: string[]; editable?: boolean };
type FieldMeta = { type: DetailControlType; options?: Array<string | SelectOption>; treeData?: TreeSelectOption[]; editable?: boolean; min?: number; precision?: number; step?: number };

const multiRecordTabs = new Set(['工作经历', '教育经历', '家庭成员', '附件存档']);
const requiredArchiveFields: Record<string, string[]> = {
  工作经历: ['公司名称', '担任职位', '入职日期'],
  教育经历: ['学校名称', '学历', '开始日期'],
  家庭成员: ['姓名', '关系'],
  附件存档: ['附件类型', '附件文件'],
};

const nationOptions = [
  '汉族',
  '蒙古族',
  '回族',
  '藏族',
  '维吾尔族',
  '苗族',
  '彝族',
  '壮族',
  '布依族',
  '朝鲜族',
  '满族',
  '侗族',
  '瑶族',
  '白族',
  '土家族',
  '哈尼族',
  '哈萨克族',
  '傣族',
  '黎族',
  '傈僳族',
  '佤族',
  '畲族',
  '高山族',
  '拉祜族',
  '水族',
  '东乡族',
  '纳西族',
  '景颇族',
  '柯尔克孜族',
  '土族',
  '达斡尔族',
  '仫佬族',
  '羌族',
  '布朗族',
  '撒拉族',
  '毛南族',
  '仡佬族',
  '锡伯族',
  '阿昌族',
  '普米族',
  '塔吉克族',
  '怒族',
  '乌孜别克族',
  '俄罗斯族',
  '鄂温克族',
  '德昂族',
  '保安族',
  '裕固族',
  '京族',
  '塔塔尔族',
  '独龙族',
  '鄂伦春族',
  '赫哲族',
  '门巴族',
  '珞巴族',
  '基诺族',
  '其他',
];

const fieldMetaMap: Record<string, FieldMeta> = {
  姓名: { type: 'input' },
  所属部门: { type: 'treeSelect', treeData: [...departmentTreeOptions] },
  岗位: { type: 'select', options: ['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'] },
  工号: { type: 'readonly', editable: false },
  证件类型: { type: 'select', options: ['身份证', '护照', '港澳通行证', '台胞证', '其他'] },
  证件号: { type: 'input' },
  证件照正面: { type: 'upload' },
  证件照反面: { type: 'upload' },
  手机号码: { type: 'input' },
  用工类型: { type: 'select', options: ['正式员工', '实习', '劳务', '返聘', '外包', '临时工', '其他'] },
  员工状态: { type: 'readonly', editable: false },
  入职日期: { type: 'date' },
  社会工作日期: { type: 'date' },
  司龄: { type: 'readonly', editable: false },
  工龄: { type: 'readonly', editable: false },
  直接上级: { type: 'select', options: [...employeeOptions] },
  性别: { type: 'select', options: ['男', '女', '未知'] },
  出生日期: { type: 'date' },
  年龄: { type: 'readonly', editable: false },
  邮箱: { type: 'input' },
  合同公司: { type: 'select', options: companyOrganizations },
  合同开始日期: { type: 'date' },
  合同结束日期: { type: 'date' },
  试用期结束日期: { type: 'date' },
  '试用期（月）': { type: 'number', min: 0, precision: 0, step: 1 },
  转正日期: { type: 'date', editable: false },
  离职日期: { type: 'date' },
  离职原因: { type: 'select', options: ['主动离职', '协商解除', '辞退', '合同到期不续签', '退休', '其他'] },
  民族: { type: 'select', options: nationOptions },
  户口类型: { type: 'select', options: ['农业户口', '非农业户口', '居民户口', '其他'] },
  户口所在地: { type: 'input' },
  籍贯: { type: 'input' },
  居住地址: { type: 'input' },
  最高学历: { type: 'select', options: ['高中及以下', '中专', '大专', '本科', '硕士', '博士', '其他'] },
  政治面貌: { type: 'select', options: ['群众', '共青团员', '中共党员', '民主党派', '其他'] },
  婚姻状况: { type: 'select', options: ['未婚', '已婚', '离异', '丧偶', '其他'] },
  血型: { type: 'select', options: ['A型', 'B型', 'AB型', 'O型', '其他', '未知'] },
  紧急联系人: { type: 'input' },
  紧急联系人电话: { type: 'input' },
  微信: { type: 'input' },
  QQ: { type: 'input' },
  工资卡开户银行: { type: 'input' },
  工资卡开户支行: { type: 'input' },
  工资卡银行账号: { type: 'input' },
  工资卡开户名: { type: 'input' },
  公司名称: { type: 'input' },
  担任职位: { type: 'input' },
  入职日期档案: { type: 'date' },
  离职日期档案: { type: 'date' },
  职位描述: { type: 'textarea' },
  学校名称: { type: 'input' },
  学历: { type: 'select', options: ['高中', '大专', '本科', '硕士', '博士'] },
  专业: { type: 'input' },
  开始日期: { type: 'date' },
  结束日期: { type: 'date' },
  是否最高学历: { type: 'switch' },
  关系: { type: 'select', options: ['父亲', '母亲', '配偶', '子女', '其他'] },
  联系电话: { type: 'input' },
  是否紧急联系人: { type: 'switch' },
  附件类型: { type: 'select', options: ['身份证', '学历证明', '合同附件', '证书', '其他'] },
  附件文件: { type: 'upload' },
};

function getFieldMeta(field: string): FieldMeta {
  if (field === '入职日期') {
    return fieldMetaMap.入职日期档案;
  }
  if (field === '离职日期') {
    return fieldMetaMap.离职日期档案;
  }
  return fieldMetaMap[field] ?? { type: 'input' };
}

function valueOf(record: MockRecord | undefined, key: string, fallback = '-') {
  const value = record?.[key];
  return value === undefined || value === '' ? fallback : String(value);
}

function formatYearValue(value: unknown, fallback = '-') {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toFixed(1);
  }

  const normalizedValue = String(value).trim();
  if (!normalizedValue) {
    return fallback;
  }

  const numericValue = Number(normalizedValue);
  if (Number.isFinite(numericValue)) {
    return numericValue.toFixed(1);
  }

  const chineseDurationMatch = normalizedValue.match(/^(?:(\d+(?:\.\d+)?)年)?(?:(\d+(?:\.\d+)?)个?月)?$/);
  if (chineseDurationMatch) {
    const years = Number(chineseDurationMatch[1] ?? 0);
    const months = Number(chineseDurationMatch[2] ?? 0);
    return (years + months / 12).toFixed(1);
  }

  return normalizedValue;
}

function tableColumns(fields: string[], actions: string[]): ColumnsType<DetailRecord> {
  return [
    ...fields.map((field) => ({
      title: field,
      dataIndex: field,
      key: field,
    })),
    {
      title: '操作',
      key: 'actions',
      width: actions.length > 3 ? 180 : 128,
      render: () => (
        <Space size={6}>
          {actions.map((action) => (
            <Button key={action} type="link" size="small">
              {action}
            </Button>
          ))}
        </Space>
      ),
    },
  ];
}

function renderEditorControl({
  label,
  value,
  meta,
  onChange,
}: {
  label: string;
  value: string;
  meta: FieldMeta;
  onChange: (value: string) => void;
}) {
  if (meta.editable === false || meta.type === 'readonly') {
    return <span className="employee-detail-readonly">{value || '-'}</span>;
  }

  const normalizedOptions = (meta.options ?? []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const hasRichLabels = normalizedOptions.some((option) => option.label !== option.value);

  if (meta.type === 'select') {
    return (
      <Select
        size="small"
        value={value && value !== '-' ? value : undefined}
        placeholder={`请选择${label}`}
        optionFilterProp="children"
        optionLabelProp={hasRichLabels ? 'value' : 'children'}
        popupClassName={hasRichLabels ? 'erp-rich-select-dropdown' : undefined}
        onChange={onChange}
      >
        {(normalizedOptions as SelectOption[]).map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    );
  }

  if (meta.type === 'treeSelect') {
    return <TreeSelect size="small" value={value && value !== '-' ? value : undefined} placeholder={`请选择${label}`} treeDefaultExpandAll treeData={cloneTreeSelectData(meta.treeData)} onChange={(nextValue) => onChange(String(nextValue ?? ''))} />;
  }

  if (meta.type === 'date') {
    return <DatePicker className="employee-detail-control" size="small" value={value && value !== '-' ? dayjs(value) : null} placeholder={`请选择${label}`} onChange={(_date, dateString) => onChange(Array.isArray(dateString) ? dateString[0] : dateString)} />;
  }

  if (meta.type === 'number') {
    return <InputNumber className="employee-detail-control" size="small" min={meta.min ?? 0} precision={meta.precision} step={meta.step} value={Number.isFinite(Number(value)) ? Number(value) : undefined} placeholder={`请输入${label}`} onChange={(nextValue) => onChange(nextValue === null ? '' : String(nextValue))} />;
  }

  if (meta.type === 'switch') {
    return <Switch size="small" checked={value === '是'} checkedChildren="是" unCheckedChildren="否" onChange={(checked) => onChange(checked ? '是' : '否')} />;
  }

  if (meta.type === 'upload') {
    return (
      <Upload showUploadList={false} beforeUpload={() => false}>
        <Button icon={<UploadOutlined />} size="small">
          上传
        </Button>
      </Upload>
    );
  }

  if (meta.type === 'textarea') {
    return <Input.TextArea size="small" autoSize={{ minRows: 1, maxRows: 3 }} value={value === '-' ? '' : value} placeholder={`请输入${label}`} onChange={(event) => onChange(event.target.value)} />;
  }

  return <Input size="small" value={value === '-' ? '' : value} placeholder={`请输入${label}`} onChange={(event) => onChange(event.target.value)} />;
}

function ArchivePane({
  title,
  toolbar,
  fields,
  rows,
  actions,
}: {
  title: string;
  toolbar: string[];
  fields: string[];
  rows: DetailRecord[];
  actions: string[];
}) {
  return (
    <div className="employee-detail-section">
      <div className="employee-detail-table-head">
        <h3>{title}</h3>
        <Space size={8} wrap>
          {toolbar.map((action, index) => (
            <Button key={action} type={index === 0 ? 'primary' : 'default'} size="small">
              {action}
            </Button>
          ))}
        </Space>
      </div>
      <Table
        size="small"
        rowKey="id"
        columns={tableColumns(fields, actions)}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

function MultiRecordPane({
  title,
  fields,
  rows,
  editing,
  onEdit,
  onCancel,
  onSave,
  onAdd,
  onRemove,
  onChange,
}: {
  title: string;
  fields: string[];
  rows: DetailRecord[];
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onAdd: () => void;
  onRemove: (rowId: string) => void;
  onChange: (rowId: string, field: string, value: string) => void;
}) {
  const requiredFields = requiredArchiveFields[title] ?? [];

  return (
    <div className="employee-detail-section employee-multi-section">
      <div className="employee-detail-section-head">
        <h3>{title}</h3>
        {editing ? (
          <Space size={8}>
            <Button size="small" onClick={onCancel}>
              取消
            </Button>
            <Button size="small" type="primary" onClick={onSave}>
              保存
            </Button>
          </Space>
        ) : (
          <Button size="small" onClick={onEdit}>
            编辑
          </Button>
        )}
      </div>
      <div className="employee-multi-records">
        {rows.map((row) => (
          <div className="employee-multi-record" key={row.id}>
            {editing && rows.length > 1 ? (
              <Button
                aria-label={`删除${title}`}
                className="employee-multi-delete"
                icon={<DeleteOutlined />}
                size="small"
                type="text"
                onClick={() => onRemove(row.id)}
              />
            ) : null}
            <div className="employee-multi-form-grid">
              {fields.map((field) => {
                const required = requiredFields.includes(field);
                const meta = getFieldMeta(field);
                const value = row[field] ?? '';
                return (
                  <label className="employee-multi-field" key={field}>
                    <span className={editing && required ? 'employee-detail-required-label' : undefined}>{field}：</span>
                    {editing ? (
                      renderEditorControl({
                        label: field,
                        value,
                        meta,
                        onChange: (nextValue) => onChange(row.id, field, nextValue),
                      })
                    ) : (
                      <strong>{value || '-'}</strong>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {editing ? (
        <Button className="employee-multi-add" block onClick={onAdd}>
          + 添加{title}
        </Button>
      ) : null}
    </div>
  );
}

function DetailSection({
  title,
  items,
  editing,
  draftValues,
  onEdit,
  onDraftChange,
  onSave,
  onCancel,
}: {
  title: string;
  items: DetailItem[];
  editing: boolean;
  draftValues: Record<string, string>;
  onEdit: () => void;
  onDraftChange: (label: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <section className="employee-detail-info-block">
      <div className="employee-detail-section-head">
        <h3>{title}</h3>
        {editing ? (
          <Space size={8}>
            <Button size="small" onClick={onCancel}>
              取消
            </Button>
            <Button size="small" type="primary" onClick={onSave}>
              保存
            </Button>
          </Space>
        ) : (
          <Button size="small" onClick={onEdit}>
            编辑
          </Button>
        )}
      </div>
      <Descriptions bordered size="small" column={2}>
        {items.map((item) => (
          <Descriptions.Item
            key={item.label}
            label={
              editing && item.required ? (
                <span className="employee-detail-required-label">{item.label}</span>
              ) : (
                item.label
              )
            }
          >
            {editing ? (
              renderEditorControl({
                label: item.label,
                value: draftValues[item.label] ?? item.value,
                meta: { ...getFieldMeta(item.label), type: item.type ?? getFieldMeta(item.label).type, options: item.options ?? getFieldMeta(item.label).options, editable: item.editable ?? getFieldMeta(item.label).editable },
                onChange: (value) => onDraftChange(item.label, value),
              })
            ) : (
              item.value
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </section>
  );
}

const detailLabelToRecordKey: Record<string, string> = {
  合同公司: 'contractCompany',
  合同开始日期: 'contractStartDate',
  合同结束日期: 'contractEndDate',
  入职日期: 'hireDate',
  '试用期（月）': 'probationMonths',
  试用期结束日期: 'probationDate',
  转正日期: 'regularizationDate',
};

export function EmployeeDetailPage({ record, onBack, onRecordChange }: EmployeeDetailPageProps) {
  const [editingSection, setEditingSection] = useState<string>();
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [savedValues, setSavedValues] = useState<Record<string, Record<string, string>>>({});
  const archiveTabConfigs = getEmployeeArchiveTabs(record);
  const [editingArchive, setEditingArchive] = useState<string>();
  const [archiveRows, setArchiveRows] = useState<Record<string, DetailRecord[]>>(() =>
    Object.fromEntries(archiveTabConfigs.map((tab) => [tab.key, tab.rows])),
  );
  const [archiveDraftRows, setArchiveDraftRows] = useState<Record<string, DetailRecord[]>>({});
  const employeeName = valueOf(record, 'name', '未选择员工');
  const status = record ? deriveEmployeeStatus(record) : '在职';
  const hireDate = valueOf(record, 'hireDate', valueOf(record, 'date'));
  const seniority = formatYearValue(record?.seniority, fallbackValues.seniority);
  const workSeniority = formatYearValue(record?.workSeniority, fallbackValues.workSeniority);

  const withSavedValues = (section: string, items: DetailItem[]) =>
    items.map((item) => ({ ...item, value: savedValues[section]?.[item.label] ?? item.value }));

  const startSectionEdit = (section: string, items: DetailItem[]) => {
    setEditingSection(section);
    setDraftValues(Object.fromEntries(items.map((item) => [item.label, item.value])));
  };

  const updateDraftValue = (label: string, value: string) => {
    setDraftValues((values) => {
      const nextValues = { ...values, [label]: value };
      if (label === '试用期结束日期') {
        return nextValues;
      }
      if (label === '入职日期' || label === '试用期（月）') {
        const previousAutoDate = calculateProbationEndDate(values.入职日期, values['试用期（月）']) || '';
        const endDate = calculateProbationEndDate(nextValues.入职日期, nextValues['试用期（月）']) || '';
        if (!nextValues.试用期结束日期 || nextValues.试用期结束日期 === previousAutoDate) {
          nextValues.试用期结束日期 = endDate;
        }
      }
      return nextValues;
    });
  };

  const saveSectionEdit = (section: string, items: DetailItem[]) => {
    const missingItem = items.find((item) => item.required && !(draftValues[item.label] ?? '').trim());
    if (missingItem) {
      message.warning(`请填写${missingItem.label}`);
      return;
    }
    const nextDraftValues = { ...draftValues };
    if (!nextDraftValues.试用期结束日期) {
      const calculatedEndDate = calculateProbationEndDate(nextDraftValues.入职日期, nextDraftValues['试用期（月）']);
      if (calculatedEndDate) {
        nextDraftValues.试用期结束日期 = calculatedEndDate;
      }
    }
    setSavedValues((values) => ({ ...values, [section]: { ...nextDraftValues } }));
    const recordPatch = Object.fromEntries(
      Object.entries(nextDraftValues)
        .filter(([label]) => detailLabelToRecordKey[label])
        .map(([label, value]) => [detailLabelToRecordKey[label], value]),
    );
    if (Object.keys(recordPatch).length > 0) {
      onRecordChange?.(recordPatch);
    }
    setEditingSection(undefined);
    setDraftValues({});
    message.success(`${section}已保存`);
  };

  const cancelSectionEdit = () => {
    setEditingSection(undefined);
    setDraftValues({});
  };

  const startArchiveEdit = (title: string) => {
    setEditingArchive(title);
    setArchiveDraftRows((rows) => ({ ...rows, [title]: (archiveRows[title] ?? []).map((row) => ({ ...row })) }));
  };

  const cancelArchiveEdit = () => {
    setEditingArchive(undefined);
    setArchiveDraftRows({});
  };

  const saveArchiveEdit = (title: string) => {
    const rows = archiveDraftRows[title] ?? [];
    const missingField = requiredArchiveFields[title]?.find((field) => rows.some((row) => !(row[field] ?? '').trim()));
    if (missingField) {
      message.warning(`请填写${missingField}`);
      return;
    }

    setArchiveRows((currentRows) => ({ ...currentRows, [title]: rows }));
    setEditingArchive(undefined);
    setArchiveDraftRows({});
    message.success(`${title}已保存`);
  };

  const addArchiveRow = (title: string, fields: string[]) => {
    setArchiveDraftRows((rows) => ({
      ...rows,
      [title]: [
        ...(rows[title] ?? []),
        {
          id: `${title}-${Date.now()}`,
          ...Object.fromEntries(fields.map((field) => [field, ''])),
        },
      ],
    }));
  };

  const removeArchiveRow = (title: string, rowId: string) => {
    setArchiveDraftRows((rows) => ({ ...rows, [title]: (rows[title] ?? []).filter((row) => row.id !== rowId) }));
  };

  const changeArchiveValue = (title: string, rowId: string, field: string, value: string) => {
    setArchiveDraftRows((rows) => ({
      ...rows,
      [title]: (rows[title] ?? []).map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    }));
  };

  const handleAvatarUpload = () => {
    message.success('员工头像已上传');
    return false;
  };

  const baseItems = withSavedValues('基础信息', [
    { label: '姓名', value: employeeName, required: true },
    { label: '所属部门', value: valueOf(record, 'department'), required: true },
    { label: '岗位', value: valueOf(record, 'position') },
    { label: '工号', value: valueOf(record, 'employeeNo', valueOf(record, 'code')), editable: false },
    { label: '证件类型', value: valueOf(record, 'idType', fallbackValues.idType), required: true },
    { label: '证件号', value: valueOf(record, 'idNo', fallbackValues.idNo), required: true },
    { label: '证件照正面', value: valueOf(record, 'idCardFront', '-'), type: 'upload' },
    { label: '证件照反面', value: valueOf(record, 'idCardBack', '-'), type: 'upload' },
    { label: '手机号码', value: valueOf(record, 'phone'), required: true },
    { label: '用工类型', value: valueOf(record, 'employmentType', fallbackValues.employmentType), required: true },
    { label: '员工状态', value: status, editable: false },
    { label: '入职日期', value: hireDate, required: true },
    { label: '社会工作日期', value: valueOf(record, 'socialWorkDate', fallbackValues.socialWorkDate), required: true },
    { label: '司龄', value: seniority, editable: false },
    { label: '工龄', value: workSeniority, editable: false },
    { label: '直接上级', value: valueOf(record, 'owner') },
    { label: '性别', value: valueOf(record, 'gender', '-') },
    { label: '出生日期', value: valueOf(record, 'birthDate', '-'), required: true },
    { label: '年龄', value: valueOf(record, 'age', fallbackValues.age), editable: false },
    { label: '邮箱', value: valueOf(record, 'email', fallbackValues.email) },
    { label: '合同公司', value: valueOf(record, 'contractCompany', fallbackValues.contractCompany) },
    { label: '合同开始日期', value: valueOf(record, 'contractStartDate', valueOf(record, 'startDate')) },
    { label: '合同结束日期', value: valueOf(record, 'contractEndDate', valueOf(record, 'endDate')) },
    { label: '试用期（月）', value: valueOf(record, 'probationMonths', '-') },
    { label: '试用期结束日期', value: valueOf(record, 'probationDate') },
    { label: '转正日期', value: valueOf(record, 'regularizationDate', '-'), editable: false },
    { label: '离职日期', value: valueOf(record, 'resignationDate', '-'), editable: false },
    { label: '离职原因', value: valueOf(record, 'resignationReason', '-'), required: status.includes('离职'), editable: false },
  ]);

  const personalItems = withSavedValues('个人信息', [
    { label: '民族', value: valueOf(record, 'nation', fallbackValues.nation) },
    { label: '户口类型', value: valueOf(record, 'householdType', fallbackValues.householdType) },
    { label: '户口所在地', value: valueOf(record, 'householdAddress', fallbackValues.householdAddress) },
    { label: '籍贯', value: valueOf(record, 'nativePlace', fallbackValues.nativePlace) },
    { label: '居住地址', value: valueOf(record, 'address', fallbackValues.address) },
    { label: '最高学历', value: valueOf(record, 'education') },
    { label: '政治面貌', value: valueOf(record, 'politicalStatus', fallbackValues.politicalStatus) },
    { label: '婚姻状况', value: valueOf(record, 'maritalStatus', fallbackValues.maritalStatus) },
    { label: '血型', value: valueOf(record, 'bloodType', fallbackValues.bloodType) },
    { label: '紧急联系人', value: valueOf(record, 'emergencyContact') },
    { label: '紧急联系人电话', value: valueOf(record, 'emergencyPhone') },
    { label: '微信', value: valueOf(record, 'wechat', fallbackValues.wechat) },
    { label: 'QQ', value: valueOf(record, 'qq', fallbackValues.qq) },
  ]);

  const bankItems = withSavedValues('银行卡信息', [
    { label: '工资卡开户银行', value: valueOf(record, 'bankName', fallbackValues.bankName) },
    { label: '工资卡开户支行', value: valueOf(record, 'bankBranch', fallbackValues.bankBranch) },
    { label: '工资卡银行账号', value: valueOf(record, 'bankAccount', fallbackValues.bankAccount) },
    { label: '工资卡开户名', value: valueOf(record, 'bankAccountName', employeeName || fallbackValues.bankAccountName) },
  ]);

  const archivePanes: Record<string, { toolbar: string[]; fields: string[]; rows: DetailRecord[]; actions: string[] }> = {
    ...Object.fromEntries(
      archiveTabConfigs.map((tab) => [
        tab.key,
        {
          toolbar: [tab.primaryAction, ...tab.toolbarActions],
          fields: tab.detailFields,
          rows: archiveRows[tab.key] ?? tab.rows,
          actions: tab.rowActions,
        },
      ]),
    ),
    操作记录: {
      toolbar: [],
      fields: ['操作时间', '操作人', '变更字段', '变更前', '变更后'],
      rows: [
        {
          id: 'log-1',
          操作时间: '2026-06-14 09:30',
          操作人: 'admin',
          变更字段: '员工状态',
          变更前: '-',
          变更后: status,
        },
        {
          id: 'log-2',
          操作时间: '2026-06-14 09:35',
          操作人: 'admin',
          变更字段: '所属部门',
          变更前: '-',
          变更后: valueOf(record, 'department'),
        },
      ],
      actions: ['查看'],
    },
  };

  const tabs = tabLabels.map((label) => ({
    key: label,
    label,
    children:
      label === '员工信息' ? (
        <div className="employee-detail-section">
          <DetailSection
            title="基础信息"
            items={baseItems}
            editing={editingSection === '基础信息'}
            draftValues={draftValues}
            onEdit={() => startSectionEdit('基础信息', baseItems)}
            onDraftChange={updateDraftValue}
            onSave={() => saveSectionEdit('基础信息', baseItems)}
            onCancel={cancelSectionEdit}
          />
          <DetailSection
            title="个人信息"
            items={personalItems}
            editing={editingSection === '个人信息'}
            draftValues={draftValues}
            onEdit={() => startSectionEdit('个人信息', personalItems)}
            onDraftChange={(label, value) => setDraftValues((values) => ({ ...values, [label]: value }))}
            onSave={() => saveSectionEdit('个人信息', personalItems)}
            onCancel={cancelSectionEdit}
          />
          <DetailSection
            title="银行卡信息"
            items={bankItems}
            editing={editingSection === '银行卡信息'}
            draftValues={draftValues}
            onEdit={() => startSectionEdit('银行卡信息', bankItems)}
            onDraftChange={(label, value) => setDraftValues((values) => ({ ...values, [label]: value }))}
            onSave={() => saveSectionEdit('银行卡信息', bankItems)}
            onCancel={cancelSectionEdit}
          />
        </div>
      ) : archivePanes[label] && multiRecordTabs.has(label) ? (
        <MultiRecordPane
          title={label}
          fields={archivePanes[label].fields}
          rows={editingArchive === label ? (archiveDraftRows[label] ?? []) : archivePanes[label].rows}
          editing={editingArchive === label}
          onEdit={() => startArchiveEdit(label)}
          onCancel={cancelArchiveEdit}
          onSave={() => saveArchiveEdit(label)}
          onAdd={() => addArchiveRow(label, archivePanes[label].fields)}
          onRemove={(rowId) => removeArchiveRow(label, rowId)}
          onChange={(rowId, field, value) => changeArchiveValue(label, rowId, field, value)}
        />
      ) : archivePanes[label] ? (
        <ArchivePane title={label} {...archivePanes[label]} />
      ) : null,
  }));

  return (
    <div className="employee-detail-page">
      <div className="employee-detail-hero">
        <div className="employee-detail-profile">
          <Upload showUploadList={false} beforeUpload={handleAvatarUpload} accept="image/png,image/jpeg">
            <button className="employee-detail-avatar-upload" type="button" aria-label="上传员工头像">
              <Avatar size={72} icon={<UserOutlined />} className="employee-detail-avatar" />
              <span className="employee-detail-avatar-mask">上传头像</span>
            </button>
          </Upload>
          <div className="employee-detail-main">
            <Space size={8} align="center" wrap>
              <h2>{employeeName}</h2>
              <Tag color={statusColor[status] ?? 'default'}>{status}</Tag>
            </Space>
            <div className="employee-detail-meta">
              <span>{valueOf(record, 'department')}</span>
              <span>{valueOf(record, 'position')}</span>
              <span>入职 {hireDate}</span>
              <span>司龄 {seniority}</span>
            </div>
          </div>
        </div>
        <Space className="employee-detail-actions">
          <Button onClick={onBack}>返回列表</Button>
        </Space>
      </div>
      <Tabs className="employee-detail-tabs" items={tabs} />
    </div>
  );
}
