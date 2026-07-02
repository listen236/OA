import type { MockRecord } from '../types';

const departments = ['总经办', '人力资源部', '生产一部', '质量管理部', '财务部', '技术中心'];
const owners = ['张红红', '李华', '王敏', '赵强', '陈晓', 'admin'];
const statuses: MockRecord['status'][] = ['启用', '正常', '审批中', '待处理', '已归档', '停用'];

export const mockRecords: MockRecord[] = Array.from({ length: 38 }, (_, index) => {
  const no = index + 1;
  return {
    id: String(no),
    code: `HR${String(202606000 + no)}`,
    name: ['员工信息', '招聘需求', '考勤组', '薪资批次', '考核计划', '流程配置'][index % 6] + no,
    department: departments[index % departments.length],
    owner: owners[index % owners.length],
    status: statuses[index % statuses.length],
    date: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    employeeNo: `AIF${String(1000 + no)}`,
    phone: `138${String(10000000 + index * 3579).slice(0, 8)}`,
    position: ['HR专员', '生产主管', '质检员', '招聘经理', '薪酬专员', '系统管理员'][index % 6],
    contractStatus: ['未签订', '已签订', '即将到期', '已终止'][index % 4],
    headcount: (index % 5) + 1,
    demandStatus: ['草稿', '招聘中', '已关闭'][index % 3],
    expectedDate: `2026-07-${String((index % 24) + 1).padStart(2, '0')}`,
    attendanceType: ['固定班制', '排班制', '自由工时'][index % 3],
    shift: ['白班', '夜班', '两班倒'][index % 3],
    clockMode: ['考勤机', '移动打卡', '无需打卡'][index % 3],
    priority: (index % 9) + 1,
    startTime: ['08:00', '09:00', '20:00'][index % 3],
    endTime: ['17:00', '18:00', '08:00'][index % 3],
    restTime: ['12:00-13:00', '12:00-13:30', '00:00-01:00'][index % 3],
    flexibleClock: index % 2 === 0 ? '是' : '否',
    month: '2026-06',
    requiredDays: 22,
    actualDays: 20 + (index % 3),
    lateCount: index % 4,
    earlyCount: index % 3,
    missingCount: index % 2,
    leaveHours: (index % 5) * 2,
    overtimeHours: (index % 6) * 1.5,
    salaryMonth: '2026-06',
    payrollAmount: 6500 + index * 320,
    version: `V${(index % 3) + 1}`,
    businessType: ['招聘需求', 'Offer', '入职', '转正', '调动', '离职', '请假', '薪资'][index % 8],
    remark: index % 3 === 0 ? '来自 Mock 数据，后续接入接口替换。' : undefined,
  };
});

export const organizationTree = [
  {
    title: '智能办公系统',
    key: 'company',
    children: departments.map((department, index) => ({
      title: department,
      key: `dept-${index}`,
      children: [
        { title: `${department}一组`, key: `dept-${index}-1` },
        { title: `${department}二组`, key: `dept-${index}-2` },
      ],
    })),
  },
];
