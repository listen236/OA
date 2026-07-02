import { useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IdcardOutlined, PlusOutlined } from '@ant-design/icons';
import type { MockRecord } from '../types';

interface QuickOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (records: MockRecord[]) => void;
}

const departments = ['总经办', '人力资源部', '生产一部', '生产二部', '质量管理部', '财务部', '技术中心'];
const positions = ['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'];
const employmentTypes = ['正式员工', '实习', '劳务', '返聘', '外包', '临时工', '其他'];

const defaultRows: MockRecord[] = [
  {
    id: 'quick-1',
    code: 'QONB202606001',
    name: '张小一',
    idNo: '110101199601011234',
    phone: '13810001001',
    gender: '女',
    department: '生产一部',
    position: '生产主管',
    date: '2026-06-15',
    employmentType: '正式员工',
    bankName: '招商银行',
    bankBranch: '杭州分行',
    bankAccount: '6222 0200 0000 1001',
    bankAccountName: '张小一',
    birthDate: '1996-01-01',
    nation: '汉族',
    householdAddress: '浙江省杭州市',
    validationStatus: '通过',
    owner: '张红红',
    status: '待入职',
  },
  {
    id: 'quick-2',
    code: 'QONB202606002',
    name: '李小二',
    idNo: '110101199802021234',
    phone: '',
    gender: '男',
    department: '生产一部',
    position: '质检员',
    date: '2026-06-15',
    employmentType: '正式员工',
    bankName: '',
    bankBranch: '',
    bankAccount: '',
    bankAccountName: '李小二',
    birthDate: '1998-02-02',
    nation: '汉族',
    householdAddress: '江苏省苏州市',
    validationStatus: '失败',
    remark: '手机号必填',
    owner: '张红红',
    status: '待入职',
  },
];

export function QuickOnboardingModal({ open, onClose, onConfirm }: QuickOnboardingModalProps) {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<MockRecord[]>(defaultRows);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['quick-1']);

  const updateRecord = (id: string, field: string, value: string) => {
    setRecords((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const inputCell = (record: MockRecord, field: string, placeholder = '请输入') => (
    <Input
      size="small"
      value={String(record[field] ?? '')}
      placeholder={placeholder}
      onChange={(event) => updateRecord(record.id, field, event.target.value)}
    />
  );

  const selectCell = (record: MockRecord, field: string, options: string[]) => (
    <Select
      size="small"
      className="full-control"
      value={record[field] ? String(record[field]) : undefined}
      placeholder="请选择"
      options={options.map((value) => ({ value }))}
      onChange={(value) => updateRecord(record.id, field, value)}
    />
  );

  const columns: ColumnsType<MockRecord> = useMemo(
    () => [
      { title: '姓名', dataIndex: 'name', width: 120, fixed: 'left', render: (_value, record) => inputCell(record, 'name') },
      { title: '身份证号', dataIndex: 'idNo', width: 190, render: (_value, record) => inputCell(record, 'idNo') },
      { title: '手机号', dataIndex: 'phone', width: 140, render: (_value, record) => inputCell(record, 'phone') },
      { title: '性别', dataIndex: 'gender', width: 90, render: (_value, record) => selectCell(record, 'gender', ['男', '女', '未知']) },
      { title: '部门', dataIndex: 'department', width: 150, render: (_value, record) => selectCell(record, 'department', departments) },
      { title: '岗位', dataIndex: 'position', width: 140, render: (_value, record) => selectCell(record, 'position', positions) },
      { title: '入职日期', dataIndex: 'date', width: 130, render: (_value, record) => inputCell(record, 'date', 'YYYY-MM-DD') },
      { title: '用工类型', dataIndex: 'employmentType', width: 130, render: (_value, record) => selectCell(record, 'employmentType', employmentTypes) },
      { title: '工资卡开户银行', dataIndex: 'bankName', width: 160, render: (_value, record) => inputCell(record, 'bankName') },
      { title: '工资卡开户支行', dataIndex: 'bankBranch', width: 160, render: (_value, record) => inputCell(record, 'bankBranch') },
      { title: '工资卡银行账号', dataIndex: 'bankAccount', width: 180, render: (_value, record) => inputCell(record, 'bankAccount') },
      { title: '工资卡开户名', dataIndex: 'bankAccountName', width: 140, render: (_value, record) => inputCell(record, 'bankAccountName') },
      { title: '出生日期', dataIndex: 'birthDate', width: 130, render: (_value, record) => inputCell(record, 'birthDate', 'YYYY-MM-DD') },
      { title: '民族', dataIndex: 'nation', width: 100, render: (_value, record) => inputCell(record, 'nation') },
      { title: '户口所在地', dataIndex: 'householdAddress', width: 180, render: (_value, record) => inputCell(record, 'householdAddress') },
      {
        title: '校验状态',
        dataIndex: 'validationStatus',
        width: 100,
        fixed: 'right',
        render: (value) => <Tag color={value === '通过' ? 'green' : value === '失败' ? 'red' : 'orange'}>{String(value)}</Tag>,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 90,
        render: (_value, record) => (
          <Button type="link" size="small" onClick={() => setRecords((items) => items.filter((item) => item.id !== record.id))}>
            删除
          </Button>
        ),
      },
    ],
    [records],
  );

  const addManualRow = () => {
    const defaults = form.getFieldsValue();
    const nextIndex = records.length + 1;
    setRecords((items) => [
      ...items,
      {
        id: `quick-${Date.now()}`,
        code: `QONB202606${String(nextIndex).padStart(3, '0')}`,
        name: `待补录${nextIndex}`,
        idNo: '',
        phone: '',
        gender: '',
        department: defaults.department ?? '',
        position: defaults.position ?? '',
        date: defaults.entryDate?.format?.('YYYY-MM-DD') ?? '',
        employmentType: defaults.employmentType ?? '',
        bankName: '',
        bankBranch: '',
        bankAccount: '',
        bankAccountName: '',
        birthDate: '',
        nation: '',
        householdAddress: '',
        validationStatus: '失败',
        remark: '姓名、身份证号、手机号必填',
        owner: '',
        status: '待入职',
      },
    ]);
  };

  const addIdCardRow = () => {
    const defaults = form.getFieldsValue();
    const nextIndex = records.length + 1;
    const name = `识别员工${nextIndex}`;
    setRecords((items) => [
      ...items,
      {
        id: `quick-ocr-${Date.now()}`,
        code: `QONB202606${String(nextIndex).padStart(3, '0')}`,
        name,
        idNo: `110101199${nextIndex % 10}0303${String(1200 + nextIndex)}`,
        phone: '',
        gender: nextIndex % 2 ? '男' : '女',
        department: defaults.department ?? '',
        position: defaults.position ?? '',
        date: defaults.entryDate?.format?.('YYYY-MM-DD') ?? '',
        employmentType: defaults.employmentType ?? '',
        bankName: '',
        bankBranch: '',
        bankAccount: '',
        bankAccountName: name,
        birthDate: `199${nextIndex % 10}-03-03`,
        nation: '汉族',
        householdAddress: '身份证识别地址',
        validationStatus: defaults.department && defaults.position && defaults.entryDate && defaults.employmentType ? '失败' : '提醒',
        remark: '请补充手机号并执行校验',
        owner: '',
        status: '待入职',
      },
    ]);
    message.success('身份证识别成功，已追加员工记录');
  };

  const confirmRecords = () => {
    const passedRecords = records.filter((record) => record.validationStatus === '通过');
    if (!passedRecords.length) {
      message.warning('没有校验通过的员工记录');
      return;
    }
    onConfirm(passedRecords);
    message.success(`已确认入职 ${passedRecords.length} 人，失败记录保留在窗口中`);
    onClose();
  };

  return (
    <Modal
      title="快速入职"
      open={open}
      width={1180}
      className="quick-onboarding-modal"
      okText="批量确认入职"
      cancelText="取消"
      onOk={confirmRecords}
      onCancel={onClose}
      footer={[
        <Button key="draft" onClick={() => message.success('快速入职草稿已保存')}>
          保存草稿
        </Button>,
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="confirm" type="primary" onClick={confirmRecords}>
          批量确认入职
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <div className="quick-onboarding-defaults">
          <Form.Item label="所属部门" name="department" rules={[{ required: true, message: '请选择所属部门' }]}>
            <Select placeholder="请选择" options={departments.map((value) => ({ value }))} />
          </Form.Item>
          <Form.Item label="岗位" name="position" rules={[{ required: true, message: '请选择岗位' }]}>
            <Select placeholder="请选择" options={positions.map((value) => ({ value }))} />
          </Form.Item>
          <Form.Item label="入职日期" name="entryDate" rules={[{ required: true, message: '请选择入职日期' }]}>
            <DatePicker className="full-control" />
          </Form.Item>
          <Form.Item label="用工类型" name="employmentType" rules={[{ required: true, message: '请选择用工类型' }]}>
            <Select placeholder="请选择" options={employmentTypes.map((value) => ({ value }))} />
          </Form.Item>
        </div>
      </Form>

      <div className="quick-onboarding-actions">
        <Space>
          <Button icon={<IdcardOutlined />} onClick={addIdCardRow}>
            身份证识别
          </Button>
          <Button icon={<PlusOutlined />} onClick={addManualRow}>
            手动新增
          </Button>
        </Space>
        <span>手机号和银行卡字段在列表中直接补录；校验通过后生成已入职记录和员工主档。</span>
      </div>

      <Table
        rowKey="id"
        size="small"
        bordered
        columns={columns}
        dataSource={records}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 1960, y: 300 }}
        pagination={false}
      />
    </Modal>
  );
}
