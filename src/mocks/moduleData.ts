import { mockRecords } from './hrData';
import type { MockRecord } from '../types';

const pageNames: Record<string, string[]> = {
  employee: ['员工', '档案', '合同', '登记表'],
  recruitment: ['候选人', '招聘需求', '面试安排', 'Offer'],
  attendance: ['补卡申请', '请假申请', '考勤组', '班次', '排班', '考勤统计'],
  salary: ['薪资批次', '工资条', '薪资明细'],
  performance: ['考核计划', '考核任务', '考核指标'],
  settings: ['流程配置', '角色权限', '字段权限'],
  analytics: ['统计指标', '报表明细', '趋势数据'],
  organization: ['组织', '部门', '岗位'],
  expense: ['费用申请', '借款单', '报销单', '付款单', '发票', '预算'],
  general: ['资产', '会议', '用章', '用品', '文档', '证照'],
};

const statusPools: Record<string, string[]> = {
  '/organization/list': ['启用', '停用'],
  '/organization/position': ['启用', '停用'],
  '/organization/chart': ['启用', '停用'],
  '/employee/list': ['在职', '试用期', '离职'],
  '/employee/archive': ['启用', '停用'],
  '/employee/contract': ['待生效', '生效中', '已到期', '已解除', '已终止'],
  '/recruitment/demand': ['草稿', '已发布', '招聘中', '已关闭', '已取消'],
  '/recruitment/resume': ['待筛选', '已通过', '已淘汰', '已转人才库', '已发起面试'],
  '/recruitment/talent': ['待跟进', '跟进中', '暂不考虑', '已录用', '已淘汰'],
  '/recruitment/interview': ['待安排', '待面试', '已完成', '已取消'],
  '/recruitment/offer': ['草稿', '已发放', '已确认', '已拒绝', '已撤回', '已转入职'],
  '/lifecycle/onboarding': ['待入职', '已入职', '已放弃'],
  '/lifecycle/regularization': ['待转正', '已转正'],
  '/lifecycle/transfer': ['待调动', '待生效', '已调动', '已放弃'],
  '/lifecycle/resignation': ['待离职', '已离职', '已放弃'],
  '/attendance/repair': ['草稿', '审批中', '已通过', '已撤回'],
  '/attendance/leave': ['草稿', '审批中', '已通过', '已撤回'],
  '/attendance/overtime': ['草稿', '审批中', '已通过', '已撤回'],
  '/attendance/out': ['草稿', '审批中', '已通过', '已撤回'],
  '/attendance/trip': ['草稿', '审批中', '已通过', '已撤回'],
  '/attendance/group': ['启用', '停用'],
  '/attendance/shift': ['启用', '停用'],
  '/attendance/schedule': ['启用', '停用'],
  '/attendance/rule': ['启用', '停用'],
  '/attendance/holiday': ['启用', '停用'],
  '/attendance/clock-record': ['正常', '迟到', '早退', '缺卡', '外勤', '异常'],
  '/attendance/daily-stat': ['待计算', '已计算', '已更新', '计算异常', '已锁定'],
  '/attendance/monthly-stat': ['未生成', '已生成', '已确认', '已锁定'],
  '/performance/plan': ['草稿', '已发布', '评分中', '审核中', '已确认', '已关闭', '已终止'],
  '/performance/progress': ['待评分', '评分中', '待审核', '已退回', '待确认', '已确认', '已终止'],
  '/performance/template': ['启用', '停用'],
  '/performance/indicator': ['启用', '停用'],
  '/salary/approval': ['草稿', '审批中', '已通过', '已撤回', '已归档'],
  '/salary/payslip': ['待发放', '已发放', '已查看', '已撤回'],
  '/analytics/roster': ['在职', '试用期', '离职'],
};

const pick = (values: string[], index: number) => values[index % values.length];

function moduleKey(path: string) {
  if (path.startsWith('/expense/')) {
    return 'expense';
  }
  if (path.startsWith('/general/')) {
    return 'general';
  }
  return Object.keys(pageNames).find((key) => path.includes(key)) ?? 'employee';
}

function statusForPath(path: string, index: number): MockRecord['status'] {
  if (path.startsWith('/expense/') || path.startsWith('/general/') || path.startsWith('/settings/message') || path.startsWith('/settings/attachment') || path.startsWith('/settings/dictionary')) {
    return pick(['草稿', '处理中', '已完成', '已关闭'], index);
  }
  const pool = statusPools[path] ?? ['启用', '正常', '审批中', '待处理', '已归档', '停用'];
  return pick(pool, index);
}

function codeForPath(path: string, key: string, index: number) {
  if (path.startsWith('/expense/')) {
    return `EXP${String(202606000 + index + 1)}`;
  }
  if (path.startsWith('/general/asset')) {
    return `AST${String(202606000 + index + 1)}`;
  }
  if (path.startsWith('/general/meeting')) {
    return `MTG${String(202606000 + index + 1)}`;
  }
  if (path.startsWith('/general/seal')) {
    return `SEL${String(202606000 + index + 1)}`;
  }
  if (path.startsWith('/general/supply')) {
    return `SUP${String(202606000 + index + 1)}`;
  }
  if (path.startsWith('/general/document')) {
    return `DOC${String(202606000 + index + 1)}`;
  }
  if (path.startsWith('/general/license')) {
    return `LIC${String(202606000 + index + 1)}`;
  }
  if (path === '/lifecycle/onboarding') {
    return `ONB${String(202606000 + index + 1)}`;
  }
  if (path === '/lifecycle/regularization') {
    return `REG${String(202606000 + index + 1)}`;
  }
  if (path === '/lifecycle/transfer') {
    return `TRA${String(202606000 + index + 1)}`;
  }
  if (path === '/lifecycle/resignation') {
    return `RES${String(202606000 + index + 1)}`;
  }
  return key === 'employee'
    ? `AIF${String(1000 + index + 1)}`
    : `${key.toUpperCase().slice(0, 3)}${String(202606000 + index + 1)}`;
}

function getOrganizationRecords(title: string): MockRecord[] {
  const orgNodes = [
    { name: '智能办公系统', orgType: '公司', parentOrg: '', owner: 'admin', sortNo: 1, status: '启用' },
    { name: '总经办', orgType: '部门', parentOrg: '智能办公系统', owner: '张红红', sortNo: 1, status: '启用' },
    { name: '经营管理组', orgType: '部门', parentOrg: '总经办', owner: '李华', sortNo: 1, status: '启用' },
    { name: '行政支持组', orgType: '部门', parentOrg: '总经办', owner: '王敏', sortNo: 2, status: '停用' },
    { name: '人力资源部', orgType: '部门', parentOrg: '智能办公系统', owner: '王敏', sortNo: 2, status: '启用' },
    { name: '招聘组', orgType: '部门', parentOrg: '人力资源部', owner: '赵强', sortNo: 1, status: '启用' },
    { name: '薪酬绩效组', orgType: '部门', parentOrg: '人力资源部', owner: '陈晓', sortNo: 2, status: '启用' },
    { name: '员工关系组', orgType: '部门', parentOrg: '人力资源部', owner: '张红红', sortNo: 3, status: '停用' },
    { name: '生产一部', orgType: '部门', parentOrg: '智能办公系统', owner: '赵强', sortNo: 3, status: '启用' },
    { name: '一车间', orgType: '部门', parentOrg: '生产一部', owner: '李华', sortNo: 1, status: '启用' },
    { name: '二车间', orgType: '部门', parentOrg: '生产一部', owner: '王敏', sortNo: 2, status: '启用' },
    { name: '生产二部', orgType: '部门', parentOrg: '智能办公系统', owner: '陈晓', sortNo: 4, status: '启用' },
    { name: '装配组', orgType: '部门', parentOrg: '生产二部', owner: '赵强', sortNo: 1, status: '启用' },
    { name: '包装组', orgType: '部门', parentOrg: '生产二部', owner: '王敏', sortNo: 2, status: '停用' },
    { name: '质量管理部', orgType: '部门', parentOrg: '智能办公系统', owner: '李华', sortNo: 5, status: '启用' },
    { name: '来料检验组', orgType: '部门', parentOrg: '质量管理部', owner: '陈晓', sortNo: 1, status: '启用' },
    { name: '过程质量组', orgType: '部门', parentOrg: '质量管理部', owner: '张红红', sortNo: 2, status: '启用' },
    { name: '财务部', orgType: '部门', parentOrg: '智能办公系统', owner: '王敏', sortNo: 6, status: '启用' },
    { name: '会计核算组', orgType: '部门', parentOrg: '财务部', owner: '李华', sortNo: 1, status: '启用' },
    { name: '资金管理组', orgType: '部门', parentOrg: '财务部', owner: '赵强', sortNo: 2, status: '停用' },
    { name: '技术中心', orgType: '部门', parentOrg: '智能办公系统', owner: 'admin', sortNo: 7, status: '启用' },
    { name: '平台研发组', orgType: '部门', parentOrg: '技术中心', owner: '陈晓', sortNo: 1, status: '启用' },
    { name: '数据应用组', orgType: '部门', parentOrg: '技术中心', owner: '张红红', sortNo: 2, status: '启用' },
  ];

  return orgNodes.map((node, index) => ({
    id: `org-${index + 1}`,
    code: `ORG${String(202606000 + index + 1)}`,
    name: node.name,
    department: node.name,
    owner: node.owner,
    status: node.status,
    date: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    businessType: title,
    orgType: node.orgType,
    parentOrg: node.parentOrg,
    sortNo: node.sortNo,
    remark: node.parentOrg ? `${node.parentOrg}下级组织` : '公司根组织',
  }));
}

export function getMockRecords(path: string, title: string): MockRecord[] {
  if (path === '/organization/list') {
    return getOrganizationRecords(title);
  }

  const key = moduleKey(path);
  const names = pageNames[key];

  return mockRecords.map((item, index) => ({
    ...item,
    code: codeForPath(path, key, index),
    name:
      path.includes('/employee/list') || path.includes('/lifecycle/') || path === '/analytics/roster'
        ? `员工${index + 1}`
        : path.startsWith('/general/meeting')
          ? `生产例会${index + 1}`
          : path.startsWith('/general/policy')
            ? `制度文件${index + 1}`
            : `${names[index % names.length]}${index + 1}`,
    businessType: title,
    department: ['总经办', '人力资源部', '生产一部', '质量管理部', '财务部', '技术中心'][index % 6],
    owner: ['张红红', '李华', '王敏', '赵强', '陈晓', 'admin'][index % 6],
    status: statusForPath(path, index),
    position: ['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'][index % 6],
    contractStatus:
      path === '/employee/contract'
        ? pick(['待生效', '生效中', '已到期', '已解除', '已终止'], index)
        : pick(['未签订', '已签订', '即将到期', '已终止'], index),
    demandStatus: ['草稿', '招聘中', '已关闭'][index % 3],
    attendanceType: ['固定班制', '排班制', '自由工时'][index % 3],
    clockMode: ['考勤机', '移动打卡', '无需打卡'][index % 3],
    shift: ['白班', '夜班', '两班倒'][index % 3],
    flexibleClock: index % 2 === 0 ? '是' : '否',
    idType: pick(['身份证', '护照', '港澳通行证', '台胞证'], index),
    idNo: `110101199${index % 10}0101${String(1000 + index)}`,
    employmentType: pick(['正式员工', '实习', '劳务', '返聘', '外包', '临时工', '其他'], index),
    baseInfoStatus: pick(['已完善', '需补充'], index),
    bankInfoStatus: pick(['已维护', '未维护', '需核对'], index),
    operationSummary: pick(['新增', '编辑', '流程写回', '导入'], index),
    flowStatus: pick(['未发起', '审批中', '审批通过', '审批驳回', '已撤回', '已终止'], index),
    personalConfirmStatus: pick(['待确认', '已确认', '需补充'], index),
    validationStatus: pick(['待校验', '通过', '失败', '提醒'], index),
    age: 24 + (index % 18),
    probationDate: `2026-09-${String((index % 26) + 1).padStart(2, '0')}`,
    education: pick(['高中', '大专', '本科', '硕士', '博士'], index),
    gender: pick(['男', '女', '未知'], index),
    birthDate: `199${index % 10}-01-${String((index % 26) + 1).padStart(2, '0')}`,
    email: `employee${index + 1}@example.com`,
    socialWorkDate: `2020-03-${String((index % 26) + 1).padStart(2, '0')}`,
    workSeniority: 5 + (index % 10),
    probationMonths: pick(['0', '3', '6'], index),
    regularizationDate: `2026-12-${String((index % 26) + 1).padStart(2, '0')}`,
    probationStartDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    expectedRegularDate: `2026-09-${String((index % 26) + 1).padStart(2, '0')}`,
    actualRegularDate: ['已转正', '已取消'].includes(statusForPath(path, index)) ? `2026-09-${String((index % 26) + 2).padStart(2, '0')}` : '',
    regularizationMode: pick(['手动办理', '审批办理'], index),
    regularizationComment: pick(['试用期表现稳定，建议按期转正', '专业能力符合岗位要求', '需补充直属上级评价'], index),
    resignationDate: '',
    resignationType: pick(['主动离职', '协商解除', '辞退', '合同到期不续签', '退休', '其他'], index),
    resignationReason: pick(['个人发展', '家庭原因', '合同到期', '岗位调整', '其他'], index),
    lastWorkDate: `2026-08-${String((index % 26) + 1).padStart(2, '0')}`,
    handoverPerson: pick(['张红红', '李华', '王敏', '赵强', '陈晓', 'admin'], index + 1),
    handoverStatus: pick(['未交接', '交接中', '已交接', '不需要'], index),
    resignationMode: pick(['手动办理', '审批办理'], index),
    handoverNote: pick(['交接客户资料和系统权限', '交接部门文件与固定资产', '无需特殊交接'], index),
    giveupReason: pick(['员工申请取消', '业务计划变化', '审批终止'], index),
    cancelReason: pick(['误操作撤销', '业务更正', '审批终止'], index),
    nation: pick(['汉族', '回族', '满族', '壮族'], index),
    householdType: pick(['农业户口', '非农业户口', '居民户口', '其他'], index),
    householdAddress: pick(['浙江省杭州市', '江苏省苏州市', '上海市浦东新区', '广东省深圳市'], index),
    nativePlace: pick(['浙江杭州', '江苏苏州', '上海', '广东深圳'], index),
    politicalStatus: pick(['群众', '共青团员', '中共党员', '其他'], index),
    maritalStatus: pick(['未婚', '已婚', '离异', '其他'], index),
    bloodType: pick(['A型', 'B型', 'AB型', 'O型', '未知'], index),
    wechat: `wx_employee_${index + 1}`,
    qq: String(100000 + index * 17),
    bankName: pick(['招商银行', '工商银行', '建设银行', '农业银行'], index),
    bankBranch: pick(['杭州分行', '苏州分行', '上海分行', '深圳分行'], index),
    bankAccount: `**** **** **** ${String(1000 + index)}`,
    bankAccountName: path.includes('/employee/list') ? `员工${index + 1}` : `${names[index % names.length]}${index + 1}`,
    idCardFront: `身份证正面${index + 1}.jpg`,
    idCardBack: `身份证反面${index + 1}.jpg`,
    emergencyContact: pick(['王芳', '刘洋', '周静', '陈杰', '赵琳'], index),
    emergencyPhone: `139${String(20000000 + index * 2468).slice(0, 8)}`,
    effectiveDate: `2026-07-${String((index % 26) + 1).padStart(2, '0')}`,
    oldDepartment: pick(['总经办', '人力资源部', '生产一部', '质量管理部', '财务部', '技术中心'], index),
    oldPosition: pick(['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'], index),
    oldLeader: pick(['张红红', '李华', '王敏', '赵强', '陈晓', 'admin'], index),
    newDepartment: pick(['技术中心', '财务部', '质量管理部', '生产二部', '人力资源部', '总经办'], index),
    newPosition: pick(['系统管理员', '薪酬专员', '质检员', '生产主管', '招聘经理', 'HR专员'], index),
    newLeader: pick(['admin', '陈晓', '赵强', '王敏', '李华', '张红红'], index),
    oldOrgPosition: `${pick(['总经办', '人力资源部', '生产一部', '质量管理部', '财务部', '技术中心'], index)} / ${pick(['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'], index)}`,
    newOrgPosition: `${pick(['技术中心', '财务部', '质量管理部', '生产二部', '人力资源部', '总经办'], index)} / ${pick(['系统管理员', '薪酬专员', '质检员', '生产主管', '招聘经理', 'HR专员'], index)}`,
    transferMode: pick(['手动办理', '审批办理'], index),
    transferReason: pick(['组织调整', '岗位发展需要', '项目调配', '员工申请'], index),
    startDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    endDate: `2027-06-${String((index % 26) + 1).padStart(2, '0')}`,
    actualEndDate: path === '/employee/contract' ? `2027-06-${String((index % 26) + 1).padStart(2, '0')}` : '',
    duration: 1 + (index % 5),
    batchType: pick(['普通', '补发', '更正', '奖金'], index),
    joinedCount: index % 4,
    seniority: 1 + (index % 12),
    contractCompany: pick(['智能办公系统', '未来制造科技', '云智人力服务'], index),
    birthdayType: pick(['阳历', '农历'], index),
    workLocation: pick(['上海', '苏州', '杭州', '深圳', '北京'], index),
    workHourSystem: pick(['标准工时', '综合工时', '不定时工时'], index),
    nationality: pick(['中国', '美国', '日本', '新加坡'], index),
    archiveType: pick(['工作经历', '教育经历', '家庭成员', '附件存档'], index),
    companyName: pick(['智能办公系统', '星河制造', '蓝海科技', '远航咨询'], index),
    contractType: pick(['劳动合同', '保密协议', '竞业协议', '实习协议', '其他'], index),
    source: path === '/lifecycle/onboarding' ? pick(['Offer 转入', '手动添加', '导入', '快速入职二维码'], index) : pick(['招聘网站', '内部推荐', '猎头推荐', '校园招聘', '人才库'], index),
    tags: pick(['高潜', '技术岗', '管理岗', '储备人才', '急需跟进'], index),
    lastFollowTime: `2026-06-${String((index % 26) + 1).padStart(2, '0')} 10:00`,
    lastFollower: pick(['张红红', '李华', '王敏', '赵强'], index),
    interviewMode: pick(['现场面试', '视频面试', '电话面试'], index),
    interviewResult: pick(['通过', '未通过', '待定'], index),
    interviewPlace: pick(['总部 3F 会议室', 'https://meeting.example.com/hr', '电话会议'], index),
    viewStatus: pick(['未查看', '已查看'], index),
    materials: pick(['身份证、学历证明、银行卡', '身份证、离职证明', '身份证、体检报告'], index),
    onboardingType: pick(['社招', '校招', '返聘', '实习', '其他'], index),
    personalInfoStatus: pick(['未完善', '部分完善', '已完善'], index),
    submitTime: `2026-06-${String((index % 26) + 1).padStart(2, '0')} 09:30`,
    repairDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    repairTime: `${String(8 + (index % 4)).padStart(2, '0')}:30`,
    repairType: pick(['缺卡', '迟到', '早退', '正常'], index),
    leaveType: pick(['年假', '事假', '病假', '调休假', '婚假', '产假'], index),
    overtimeDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    dateType: pick(['工作日', '休息日', '节假日'], index),
    compensationType: pick(['调休', '加班费', '无补偿'], index),
    destination: pick(['上海客户现场', '苏州园区', '杭州分公司', '北京总部'], index),
    transportation: pick(['飞机', '高铁', '火车', '汽车', '自驾', '其他'], index),
    sourceBatch: `PAY${String(20260500 + index + 1)}`,
    importMode: pick(['覆盖导入', '追加导入'], index),
    holidayType: pick(['法定节假日', '公司福利假', '调休工作日'], index),
    plannedHeadcount: 3 + (index % 8),
    grade: pick(['P1', 'P2', 'P3', 'M1', 'M2'], index),
    orgType: pick(['公司', '部门'], index),
    parentOrg: pick(['智能办公系统', '总经办', '人力资源部', '生产一部', '技术中心'], index),
    sortNo: index + 1,
    files: `${title || '业务'}附件${index + 1}.pdf`,
    batchNo: `PAY${String(20260600 + index + 1)}`,
    score: 70 + (index % 31),
    totalWeight: 100,
    templateType: pick(['岗位模板', '部门模板', '通用模板'], index),
    indicatorType: pick(['定量', '定性'], index),
    scoreStandard: pick(['达成率折算', '等级评分', '主管评定'], index),
    payRange: pick(['总经办', '人力资源部', '生产一部', '质量管理部', '财务部', '技术中心'], index),
    grossPay: 7800 + index * 260,
    deduction: 500 + (index % 5) * 80,
    netPay: 7300 + index * 220,
    termType: pick(['固定期限', '无固定期限', '以完成一定工作任务为期限'], index),
    signDate: `2026-05-${String((index % 26) + 1).padStart(2, '0')}`,
    trialEndDate: `2026-09-${String((index % 26) + 1).padStart(2, '0')}`,
    reason: path === '/employee/contract' && ['已解除', '已终止'].includes(pick(['待生效', '生效中', '已到期', '已解除', '已终止'], index)) ? pick(['协商解除', '业务调整终止', '合同条款变更'], index) : '',
    reminderDays: 30,
    clockType: pick(['上班打卡', '下班打卡', '外勤打卡'], index),
    clockStatus: pick(['正常', '迟到', '早退', '缺卡', '外勤', '异常'], index),
    days: 1 + (index % 22),
    period: path === '/expense/standard' ? pick(['单次', '每日', '每月', '每年'], index) : pick(['2026-06', '2026-Q2', '2026上半年'], index),
    remark: item.remark ?? '',
    amount: 1200 + index * 360,
    reimburseDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    auditStatus: pick(['草稿', '处理中', '已完成', '已关闭'], index + 1),
    paymentStatus: pick(['草稿', '处理中', '已完成', '已关闭'], index + 2),
    relatedExpenseApply: `EXP${String(202606000 + index + 1)}`,
    relatedLoanBill: `LOAN${String(202606000 + index + 1)}`,
    receiptAccount: `**** **** **** ${String(6000 + index)}`,
    reimburseReason: pick(['差旅费用报销', '客户招待报销', '培训费用报销', '维修费用报销'], index),
    expenseDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    expenseDesc: 1 + (index % 4),
    hasInvoice: pick(['是', '否'], index),
    relatedInvoice: `INV${String(33010000 + index)}`,
    invoiceFile: `发票${index + 1}.pdf`,
    invoiceAmount: 1000 + index * 320,
    invoiceCode: `FPDM${String(100000 + index)}`,
    digitalInvoiceNo: `SD${String(800000 + index)}`,
    buyerName: '智能办公系统',
    taxExcludedAmount: 900 + index * 300,
    taxAmount: 100 + index * 20,
    invoiceRecognizeStatus: pick(['待识别', '识别成功', '识别失败', '已人工修正'], index),
    invoiceSyncStatus: pick(['未同步', '已同步', '同步失败'], index),
    overStandardReason: pick(['客户临时到访', '项目现场加急处理', '跨城交通价格上涨'], index),
    reimburseTotalAmount: 1200 + index * 360,
    invoiceTotalAmount: 1000 + index * 320,
    loanOffsetAmount: index % 3 === 0 ? 300 + index * 20 : 0,
    employeeRefundAmount: index % 4 === 0 ? 120 : 0,
    companyPayableAmount: 900 + index * 300,
    approvedAmount: 900 + index * 300,
    deductionReason: pick(['票据金额不一致', '超标准部分核减', '无核减'], index),
    financeAuditComment: pick(['票据齐全，同意报销', '需补充说明后再提交', '核定金额后通过'], index),
    paymentMethod: pick(['银行转账', '现金', '网银', '支票'], index),
    paymentVoucher: `付款凭证${index + 1}.pdf`,
    applyAmount: 8000 + index * 1200,
    reimburseAmount: 5600 + index * 900,
    paymentAmount: 10000 + index * 1500,
    pendingPaymentAmount: 3000 + index * 500,
    actualPaymentAmount: 7200 + index * 800,
    loanBalance: 1500 + index * 300,
    budgetBalance: 30000 - index * 900,
    budgetAmount: 50000 + index * 2000,
    occupiedAmount: 9000 + index * 600,
    usedAmount: 11000 + index * 700,
    riskInvoiceCount: index % 4,
    expenseType: pick(['差旅费', '招待费', '培训费', '维修费', '办公费', '通讯费'], index),
    payee: pick(['华东设备有限公司', '远航咨询服务', '星河供应链', '蓝海物业'], index),
    invoiceNo: `INV${String(33010000 + index)}`,
    invoiceType: pick(['增值税专票', '增值税普票', '电子发票', 'OFD发票'], index),
    invoiceDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    sellerName: pick(['华东设备有限公司', '远航咨询服务', '星河供应链', '蓝海物业'], index),
    budgetYear: pick(['2026', '2027'], index),
    standardAmount: 200 + index * 50,
    scope: pick(['全公司', '财务部', '生产一部', '技术中心'], index),
    assetNo: `ZC${String(10000 + index)}`,
    assetName: pick(['笔记本电脑', '会议桌', '数控设备', '检测仪', '叉车'], index),
    assetCategory: pick(['电脑设备', '办公家具', '生产设备', '检测设备', '车辆'], index),
    model: pick(['ThinkPad T14', 'M-1800', 'CNC-500', 'QC-20', 'V-2T'], index),
    quantity: 1 + (index % 6),
    supplier: pick(['华东设备有限公司', '星河供应链', '蓝海物业'], index),
    inboundDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    oldOwner: pick(['张红红', '李华', '王敏', '赵强'], index),
    borrowDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    expectedReturnDate: `2026-07-${String((index % 26) + 1).padStart(2, '0')}`,
    faultDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    planDate: `2026-07-${String((index % 26) + 1).padStart(2, '0')}`,
    disposalType: pick(['报废', '报损', '出售'], index),
    categoryCode: `CAT${String(100 + index)}`,
    parentCategory: pick(['一级分类', '行政类', '生产类', '证照类'], index),
    meetingRoom: pick(['一号会议室', '二号会议室', '培训室', '董事会议室'], index),
    meetingTime: `2026-06-${String((index % 26) + 1).padStart(2, '0')} 14:00-15:00`,
    host: pick(['张红红', '李华', '王敏', '赵强'], index),
    myRole: pick(['发起人', '参会人', '主持人'], index),
    requiredCount: 8 + index,
    signedCount: 6 + index,
    capacity: 12 + index * 4,
    equipment: pick(['投影、白板', '视频会议', '音响、投屏', '白板'], index),
    openTime: '09:00-18:00',
    location: pick(['总部3F', '总部5F', '生产区A栋', '仓库'], index),
    sealName: pick(['公司公章', '合同专用章', '财务专用章', '法人章'], index),
    sealType: pick(['公章', '合同章', '财务章', '法人章'], index),
    sealNo: `SEAL${String(1000 + index)}`,
    fileName: pick(['采购合同', '授权委托书', '证明文件', '报价文件'], index),
    supplyCode: `BG${String(10000 + index)}`,
    supplyName: pick(['A4复印纸', '签字笔', '文件夹', '劳保手套'], index),
    supplyCategory: pick(['纸品', '文具', '文件收纳', '劳保用品'], index),
    unit: pick(['包', '盒', '个', '双'], index),
    kindCount: 1 + (index % 4),
    inboundType: pick(['采购入库', '退回入库', '盘盈入库'], index),
    outboundType: pick(['报损', '报废', '批量发放', '其他出库'], index),
    receiver: path.startsWith('/settings/message') ? pick(['申请人', '当前审批人', '管理员', '业务负责人'], index) : pick(['总经办', '生产一部', '质量管理部', '技术中心'], index),
    outboundDate: `2026-06-${String((index % 26) + 1).padStart(2, '0')}`,
    stockQty: 100 + index * 20,
    availableQty: 80 + index * 18,
    inQty: index % 2 === 0 ? 20 + index : 0,
    outQty: index % 2 === 1 ? 10 + index : 0,
    documentCategory: pick(['制度规范', '操作手册', '培训资料', '常见问题'], index),
    noticeCategory: pick(['行政通知', '人事通知', '生产通知', '安全通知'], index),
    newsCategory: pick(['公司新闻', '文化活动', '荣誉资质', '员工风采'], index),
    policyNo: `POL${String(202600 + index)}`,
    policyCategory: pick(['行政制度', '人事制度', '财务制度', '生产制度'], index),
    documentNo: `DOC-${String(2026)}-${String(index + 1).padStart(3, '0')}`,
    documentType: pick(['通知', '决定', '函', '报告'], index),
    incomingUnit: pick(['集团总部', '园区管委会', '客户单位', '供应商'], index),
    publishTime: `2026-06-${String((index % 26) + 1).padStart(2, '0')} 10:00`,
    cover: `封面${index + 1}.png`,
    licenseName: pick(['营业执照', '生产许可证', '员工资格证', '排污许可证'], index),
    licenseNo: `LIC-NO-${String(9000 + index)}`,
    licenseCategory: pick(['企业证照', '生产许可', '人员证照', '行政许可'], index),
    holder: pick(['智能办公系统', '生产一部', '张红红', '质量管理部'], index),
    expireDate: `2027-06-${String((index % 26) + 1).padStart(2, '0')}`,
    needAnnualReview: pick(['是', '否'], index),
    allowBorrow: pick(['是', '否'], index),
    remindDays: 30 + index,
    scene: pick(['审批待办', '审批结果', '到期提醒', '任务失败'], index),
    sizeLimit: pick(['10MB', '20MB', '50MB'], index),
    retentionTime: pick(['180天', '1年', '长期'], index),
    operator: pick(['admin', '张红红', '李华', '王敏'], index),
    dictValue: pick(['启用/停用', '草稿/处理中/已完成/已关闭', '是/否'], index),
  }));
}
