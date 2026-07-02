import type { ColumnsType } from 'antd/es/table';
import type { MockRecord } from '../types';

export type EmployeeArchiveTabKey = '工作经历' | '教育经历' | '家庭成员' | '附件存档';
export type EmployeeArchiveRecord = Record<string, string>;

export interface EmployeeArchiveTabConfig {
  key: EmployeeArchiveTabKey;
  label: EmployeeArchiveTabKey;
  primaryAction: string;
  toolbarActions: string[];
  rowActions: string[];
  columns: ColumnsType<EmployeeArchiveRecord>;
  detailFields: string[];
  rows: EmployeeArchiveRecord[];
}

const employeeRows = [
  { employeeNo: 'AIF1001', name: '员工1', department: '总经办', position: 'HR专员' },
  { employeeNo: 'AIF1002', name: '员工2', department: '人力资源部', position: '招聘经理' },
  { employeeNo: 'AIF1003', name: '员工3', department: '生产一部', position: '生产主管' },
  { employeeNo: 'AIF1004', name: '员工4', department: '质量管理部', position: '质检员' },
  { employeeNo: 'AIF1005', name: '员工5', department: '财务部', position: '薪酬专员' },
  { employeeNo: 'AIF1006', name: '员工6', department: '技术中心', position: '系统管理员' },
];

function valueOf(record: MockRecord | undefined, key: string, fallback = '-') {
  const value = record?.[key];
  return value === undefined || value === '' ? fallback : String(value);
}

function withEmployeeBase(row: EmployeeArchiveRecord, index: number, record?: MockRecord): EmployeeArchiveRecord {
  const employee = employeeRows[index % employeeRows.length];
  return {
    id: row.id,
    工号: valueOf(record, 'employeeNo', valueOf(record, 'code', employee.employeeNo)),
    员工姓名: valueOf(record, 'name', employee.name),
    所属部门: valueOf(record, 'department', employee.department),
    ...row,
  };
}

function archiveColumns(fields: string[], rowActions: string[]): ColumnsType<EmployeeArchiveRecord> {
  return [
    { title: '序号', dataIndex: 'index', width: 62, align: 'center', render: (_value, _record, index) => index + 1 },
    ...fields.map((field) => ({
      title: field,
      dataIndex: field,
      key: field,
      width: field.includes('日期') ? 120 : 140,
    })),
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: rowActions.length > 2 ? 150 : 110,
      render: () => rowActions.join('  '),
    },
  ];
}

export function getEmployeeArchiveTabs(record?: MockRecord): EmployeeArchiveTabConfig[] {
  const workRows = [
    withEmployeeBase(
      {
        id: 'work-1',
        公司名称: valueOf(record, 'companyName', '智能办公系统'),
        担任职位: valueOf(record, 'position', 'HR专员'),
        入职日期: valueOf(record, 'startDate', '2026-06-01'),
        离职日期: valueOf(record, 'endDate', '2027-06-01'),
        职位描述: valueOf(record, 'resignationReason', '负责人力资源日常工作'),
      },
      0,
      record,
    ),
    withEmployeeBase(
      { id: 'work-2', 公司名称: '星河制造', 担任职位: '人事专员', 入职日期: '2022-03-01', 离职日期: '2025-12-31', 职位描述: '负责员工关系与档案维护' },
      1,
    ),
  ];
  const educationRows = [
    withEmployeeBase(
      {
        id: 'education-1',
        学校名称: '浙江大学',
        学历: valueOf(record, 'education', '本科'),
        专业: '人力资源管理',
        开始日期: '2018-09-01',
        结束日期: '2022-06-30',
        是否最高学历: '是',
      },
      0,
      record,
    ),
    withEmployeeBase({ id: 'education-2', 学校名称: '杭州职业技术学院', 学历: '大专', 专业: '工商管理', 开始日期: '2015-09-01', 结束日期: '2018-06-30', 是否最高学历: '否' }, 2),
  ];
  const familyRows = [
    withEmployeeBase(
      {
        id: 'family-1',
        姓名: valueOf(record, 'emergencyContact', '王芳'),
        关系: '配偶',
        联系电话: valueOf(record, 'emergencyPhone', '13920000000'),
        是否紧急联系人: '是',
      },
      0,
      record,
    ),
    withEmployeeBase({ id: 'family-2', 姓名: '刘洋', 关系: '父亲', 联系电话: '13800001111', 是否紧急联系人: '否' }, 3),
  ];
  const attachmentRows = [
    withEmployeeBase(
      {
        id: 'attachment-1',
        附件类型: '身份证',
        附件文件: valueOf(record, 'idCardFront', '身份证正面1.jpg'),
        备注: '入职材料',
      },
      0,
      record,
    ),
    withEmployeeBase({ id: 'attachment-2', 附件类型: '学历证明', 附件文件: '学历证明.pdf', 备注: '-' }, 4),
  ];

  return [
    {
      key: '工作经历',
      label: '工作经历',
      primaryAction: '新增工作经历',
      toolbarActions: ['导入', '导出'],
      rowActions: ['编辑'],
      detailFields: ['公司名称', '担任职位', '入职日期', '离职日期', '职位描述'],
      columns: archiveColumns(['工号', '员工姓名', '公司名称', '担任职位', '入职日期', '离职日期', '职位描述'], ['编辑']),
      rows: workRows,
    },
    {
      key: '教育经历',
      label: '教育经历',
      primaryAction: '新增教育经历',
      toolbarActions: ['导入', '导出'],
      rowActions: ['编辑'],
      detailFields: ['学校名称', '学历', '专业', '开始日期', '结束日期', '是否最高学历'],
      columns: archiveColumns(['工号', '员工姓名', '学校名称', '学历', '专业', '开始日期', '结束日期', '是否最高学历'], ['编辑']),
      rows: educationRows,
    },
    {
      key: '家庭成员',
      label: '家庭成员',
      primaryAction: '新增家庭成员',
      toolbarActions: ['导入', '导出'],
      rowActions: ['编辑'],
      detailFields: ['姓名', '关系', '联系电话', '是否紧急联系人'],
      columns: archiveColumns(['工号', '员工姓名', '姓名', '关系', '联系电话', '是否紧急联系人'], ['编辑']),
      rows: familyRows,
    },
    {
      key: '附件存档',
      label: '附件存档',
      primaryAction: '上传附件',
      toolbarActions: ['导入', '导出'],
      rowActions: ['预览', '下载', '删除'],
      detailFields: ['附件类型', '附件文件', '备注'],
      columns: archiveColumns(['工号', '员工姓名', '附件类型', '附件文件', '备注'], ['预览', '下载', '删除']),
      rows: attachmentRows,
    },
  ];
}
