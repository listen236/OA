import type { ColumnConfig, FieldConfig, PageConfig, SelectOption } from '../types';
import { oaExpansionPageConfigs } from './oaExpansionConfigs';
import { prdCorePageConfigs } from './prdCoreConfigs';
import { departmentTreeOptions, employeeOptions } from './organizationOptions';

const departments = ['总经办', '人力资源部', '生产一部', '生产二部', '质量管理部', '财务部', '技术中心'];
const statuses = ['启用', '停用', '草稿', '待提交', '审批中', '待处理', '已通过', '已拒绝', '已归档', '正常', '异常'];
const employees = [...employeeOptions];
const positions = ['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'];

const f = (name: string, label: string, extra: Partial<FieldConfig> = {}): FieldConfig => ({ name, label, ...extra });
const input = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, extra);
const select = (name: string, label: string, options: Array<string | SelectOption>, extra: Partial<FieldConfig> = {}) => {
  const isDepartmentField = options === departments;
  return f(name, label, { type: isDepartmentField ? 'treeSelect' : 'select', options, treeData: isDepartmentField ? [...departmentTreeOptions] : undefined, ...extra });
};
const number = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'number', ...extra });
const date = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'date', ...extra });
const month = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'month', ...extra });
const text = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'textarea', span: 24, ...extra });
const upload = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'upload', span: 24, ...extra });

const idx: ColumnConfig = { title: '序号', dataIndex: 'index', width: 62, align: 'center' };
const actionBase = ['查看', '编辑', '删除'];

const commonSearch: FieldConfig[] = [
  input('keyword', '关键词', { placeholder: '请输入关键词' }),
  input('code', '编号'),
  input('name', '名称'),
  select('department', '所属部门', departments),
  select('status', '状态', statuses),
  f('dateRange', '日期范围', { type: 'dateRange' }),
];

const defaultColumns: ColumnConfig[] = [
  idx,
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', dataIndex: 'name', width: 180 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '负责人', dataIndex: 'owner', width: 110 },
  { title: '状态', dataIndex: 'status', width: 100, status: true },
  { title: '时间', dataIndex: 'date', width: 130 },
  { title: '备注', dataIndex: 'remark', width: 220 },
];

const sections = (...items: PageConfig['formSections']): PageConfig['formSections'] => items;
const cfg = (
  searchFields: FieldConfig[],
  tableColumns: ColumnConfig[],
  formSections: PageConfig['formSections'],
  toolbarExtra?: string[],
): PageConfig => ({ searchFields, tableColumns, formSections, toolbarExtra });

const defaultPageConfig: PageConfig = cfg(
  commonSearch,
  defaultColumns,
  sections(
    {
      title: '基础信息',
      fields: [
        input('code', '编号', { required: true }),
        input('name', '名称', { required: true }),
        select('department', '所属部门', departments, { required: true }),
        select('owner', '负责人', employees),
      ],
    },
    { title: '更多信息', fields: [select('status', '状态', statuses), input('phone', '联系电话'), text('remark', '备注')] },
    { title: '附件信息', fields: [upload('files', '上传附件')] },
  ),
);

const employeeSearch = [
  input('keyword', '关键词', { placeholder: '请输入工号/姓名/手机号' }),
  input('employeeNo', '工号'),
  input('name', '姓名'),
  select('department', '所属部门', departments),
  select('position', '岗位', positions),
  select('status', '员工状态', ['试用', '正式', '离职中', '已离职']),
  f('dateRange', '入职日期', { type: 'dateRange' }),
];

const employeeColumns: ColumnConfig[] = [
  idx,
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '手机号码', dataIndex: 'phone', width: 130 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '岗位', dataIndex: 'position', width: 140 },
  { title: '直接上级', dataIndex: 'owner', width: 110 },
  { title: '员工状态', dataIndex: 'status', width: 100, status: true },
  { title: '入职日期', dataIndex: 'date', width: 120 },
  { title: '合同状态', dataIndex: 'contractStatus', width: 110 },
];

const employeeForm = sections(
  {
    title: '基础信息',
    fields: [
      upload('avatar', '员工头像'),
      input('employeeNo', '工号', { readOnly: true }),
      input('name', '姓名', { required: true }),
      select('idType', '证件类型', ['身份证', '护照', '港澳通行证', '台胞证', '其他'], { required: true }),
      input('idNo', '证件号', { required: true }),
      input('phone', '手机号码', { required: true }),
    ],
  },
  {
    title: '任职信息',
    fields: [
      select('department', '所属部门', departments, { required: true }),
      select('position', '岗位', positions),
      select('owner', '直接上级', employees),
      select('status', '员工状态', ['试用', '正式', '离职中', '已离职'], { required: true }),
      date('hireDate', '入职日期', { required: true }),
      date('probationDate', '转正日期'),
      select('contractStatus', '合同状态', ['未签订', '已签订', '即将到期', '已终止']),
    ],
  },
  {
    title: '个人信息',
    fields: [
      select('gender', '性别', ['男', '女']),
      date('birthDate', '出生日期'),
      select('education', '最高学历', ['高中', '大专', '本科', '硕士', '博士']),
      input('emergencyContact', '紧急联系人'),
      input('emergencyPhone', '紧急联系人电话'),
      input('address', '居住地址', { span: 24 }),
    ],
  },
  { title: '附件存档', fields: [upload('files', '员工附件')] },
);

const recruitmentColumns: ColumnConfig[] = [
  idx,
  { title: '需求编号', dataIndex: 'code', width: 130 },
  { title: '招聘岗位', dataIndex: 'position', width: 150 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '招聘人数', dataIndex: 'headcount', width: 100, align: 'right' },
  { title: '负责人', dataIndex: 'owner', width: 110 },
  { title: '需求状态', dataIndex: 'demandStatus', width: 110 },
  { title: '期望到岗日期', dataIndex: 'expectedDate', width: 130 },
];

const approvalSearch = [
  input('keyword', '关键词'),
  input('employeeNo', '工号'),
  input('name', '姓名'),
  select('department', '所属部门', departments),
  select('status', '审批状态', statuses),
  f('dateRange', '申请日期', { type: 'dateRange' }),
];

const approvalColumns: ColumnConfig[] = [
  idx,
  { title: '单据编号', dataIndex: 'code', width: 130 },
  { title: '申请人', dataIndex: 'name', width: 120 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '业务类型', dataIndex: 'businessType', width: 130 },
  { title: '申请日期', dataIndex: 'date', width: 120 },
  { title: '审批状态', dataIndex: 'status', width: 110, status: true },
  { title: '当前处理人', dataIndex: 'owner', width: 120 },
];

const attendanceApplySections = (type: string) =>
  sections({
    title: `${type}信息`,
    fields: [
      input('code', '申请编号', { required: true }),
      select('employee', '申请人', employees, { required: true }),
      select('department', '所属部门', departments),
      date('startDate', '开始时间', { required: true }),
      date('endDate', '结束时间', { required: true }),
      number('duration', `${type}时长`),
      text('reason', `${type}原因`, { required: true }),
      upload('files', '证明附件'),
    ],
  });

export const pageConfigs: Record<string, PageConfig> = {
  '/dashboard/hr': cfg(
    [date('statDate', '统计日期'), select('dataScope', '数据范围', departments)],
    [
      idx,
      { title: '待办类型', dataIndex: 'businessType', width: 130 },
      { title: '单据编号', dataIndex: 'code', width: 130 },
      { title: '申请人', dataIndex: 'name', width: 120 },
      { title: '当前节点', dataIndex: 'status', width: 110, status: true },
      { title: '提交时间', dataIndex: 'date', width: 130 },
      { title: '处理人', dataIndex: 'owner', width: 110 },
    ],
    sections({
      title: '快捷新建',
      fields: [
        select('quickType', '入口类型', ['新增员工', '招聘需求', '入职办理', '假勤审批', '薪资审批'], { required: true }),
        select('department', '数据范围', departments),
        text('remark', '备注'),
      ],
    }),
    ['处理待办', '忽略预警'],
  ),

  '/organization/list': cfg(
    [input('orgName', '组织名称'), input('orgCode', '组织编码'), select('orgType', '组织类型', ['公司', '部门'])],
    [
      idx,
      { title: '组织名称', dataIndex: 'name', width: 180 },
      { title: '组织编码', dataIndex: 'code', width: 130 },
      { title: '组织类型', dataIndex: 'orgType', width: 100 },
      { title: '上级组织', dataIndex: 'parentOrg', width: 140 },
      { title: '组织负责人', dataIndex: 'owner', width: 120 },
      { title: '排序号', dataIndex: 'sortNo', width: 90, align: 'right' },
      { title: '状态', dataIndex: 'status', width: 100, status: true },
      { title: '更新时间', dataIndex: 'date', width: 130 },
    ],
    sections({
      title: '组织信息',
      fields: [
        input('orgCode', '组织编码', { required: true }),
        input('orgName', '组织名称', { required: true }),
        select('orgType', '组织类型', ['公司', '部门'], { required: true }),
        select('parentOrg', '上级组织', departments),
        select('orgOwner', '组织负责人', employees),
        number('sortNo', '排序号'),
        select('status', '组织状态', ['启用', '停用'], { required: true }),
      ],
    }),
  ),

  '/organization/chart': cfg(
    [select('viewType', '视图类型', ['组织视图', '岗位视图', '人员视图']), select('rootOrg', '根节点', departments), number('expandLevel', '展开层级')],
    [
      idx,
      { title: '节点名称', dataIndex: 'name', width: 180 },
      { title: '负责人', dataIndex: 'owner', width: 110 },
      { title: '节点统计', dataIndex: 'headcount', width: 110, align: 'right' },
      { title: '状态', dataIndex: 'status', width: 100, status: true },
    ],
    sections({
      title: '架构图条件',
      fields: [select('viewType', '视图类型', ['组织视图', '岗位视图', '人员视图'], { required: true }), select('rootOrg', '根节点', departments), number('expandLevel', '展开层级')],
    }),
    ['展开', '收起', '下载架构图'],
  ),

  '/organization/position': cfg(
    [input('positionName', '岗位名称'), input('positionCode', '岗位编码'), select('department', '所属部门', departments)],
    [
      idx,
      { title: '岗位编码', dataIndex: 'code', width: 130 },
      { title: '岗位名称', dataIndex: 'position', width: 150 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '职级', dataIndex: 'grade', width: 100 },
      { title: '编制人数', dataIndex: 'plannedHeadcount', width: 100, align: 'right' },
      { title: '在岗人数', dataIndex: 'headcount', width: 100, align: 'right' },
      { title: '状态', dataIndex: 'status', width: 100, status: true },
      { title: '更新时间', dataIndex: 'date', width: 130 },
    ],
    sections({
      title: '岗位信息',
      fields: [
        input('positionCode', '岗位编码', { required: true }),
        input('positionName', '岗位名称', { required: true }),
        select('department', '所属部门', departments, { required: true }),
        select('grade', '职级', ['P1', 'P2', 'P3', 'M1', 'M2']),
        number('plannedHeadcount', '编制人数'),
        number('activeHeadcount', '在岗人数'),
        select('status', '岗位状态', ['启用', '停用'], { required: true }),
      ],
    }),
  ),

  '/employee/list': cfg(employeeSearch, employeeColumns, employeeForm, ['发送入职登记表']),
  '/employee/archive': cfg(
    [input('employeeNo', '工号'), input('name', '员工姓名'), select('archiveType', '档案类型', ['工作经历', '教育经历', '家庭成员', '附件存档']), select('department', '所属部门', departments)],
    [
      idx,
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '员工姓名', dataIndex: 'name', width: 120 },
      { title: '档案类型', dataIndex: 'archiveType', width: 120 },
      { title: '档案名称', dataIndex: 'companyName', width: 180 },
      { title: '开始日期', dataIndex: 'startDate', width: 120 },
      { title: '结束日期', dataIndex: 'endDate', width: 120 },
      { title: '更新时间', dataIndex: 'date', width: 130 },
    ],
    sections(
      { title: '工作经历', fields: [input('companyName', '公司名称', { required: true }), input('workPosition', '职位', { required: true }), date('startDate', '开始日期', { required: true }), date('endDate', '结束日期'), text('leaveReason', '离职原因')] },
      { title: '教育经历', fields: [input('schoolName', '学校名称', { required: true }), select('education', '学历', ['高中', '大专', '本科', '硕士', '博士'], { required: true }), input('major', '专业'), date('eduStartDate', '开始日期'), date('eduEndDate', '结束日期'), select('highestEducation', '是否最高学历', ['是', '否'])] },
      { title: '家庭成员', fields: [input('memberName', '姓名'), select('relation', '关系', ['父母', '配偶', '子女', '其他']), input('memberPhone', '联系电话'), select('emergencyFlag', '是否紧急联系人', ['是', '否'])] },
      { title: '附件存档', fields: [upload('files', '档案附件')] },
    ),
  ),
  '/employee/contract': cfg(
    [input('name', '员工姓名'), input('employeeNo', '工号'), select('contractType', '合同类型', ['劳动合同', '保密协议', '竞业协议', '实习协议', '其他']), select('contractStatus', '合同状态', ['未生效', '生效中', '即将到期', '已解除', '已终止']), f('dateRange', '到期日期', { type: 'dateRange' })],
    [
      idx,
      { title: '合同编号', dataIndex: 'code', width: 130 },
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '员工姓名', dataIndex: 'name', width: 120 },
      { title: '合同类型', dataIndex: 'contractType', width: 120 },
      { title: '开始日期', dataIndex: 'startDate', width: 120 },
      { title: '结束日期', dataIndex: 'endDate', width: 120 },
      { title: '合同状态', dataIndex: 'contractStatus', width: 110 },
      { title: '签订日期', dataIndex: 'date', width: 120 },
    ],
    sections({
      title: '合同信息',
      fields: [
        input('contractNo', '合同编号', { required: true }),
        select('employee', '员工', employees, { required: true }),
        select('contractType', '合同类型', ['劳动合同', '保密协议', '竞业协议', '实习协议', '其他'], { required: true }),
        select('termType', '合同期限类型', ['固定期限', '无固定期限', '以完成一定工作任务为期限'], { required: true }),
        date('startDate', '开始日期', { required: true }),
        date('endDate', '结束日期'),
        date('signDate', '签订日期', { required: true }),
        select('contractStatus', '合同状态', ['未生效', '生效中', '即将到期', '已解除', '已终止']),
        upload('files', '合同附件'),
      ],
    }),
    ['签订合同', '续签合同'],
  ),

  '/recruitment/demand': cfg(
    [input('code', '需求编号'), select('position', '招聘岗位', positions), select('department', '所属部门', departments), select('demandStatus', '需求状态', ['草稿', '招聘中', '已关闭']), f('dateRange', '期望到岗日期', { type: 'dateRange' })],
    recruitmentColumns,
    sections({
      title: '招聘需求',
      fields: [
        input('code', '需求编号', { required: true }),
        select('position', '招聘岗位', positions, { required: true }),
        select('department', '所属部门', departments, { required: true }),
        number('headcount', '招聘人数', { required: true }),
        number('joinedCount', '已入职人数'),
        date('expectedDate', '期望到岗日期'),
        select('owner', '招聘负责人', employees),
        text('jobDuty', '岗位职责'),
        text('requirement', '任职要求'),
      ],
    }),
    ['发布', '关闭需求'],
  ),
  '/recruitment/resume': cfg(
    [input('candidateName', '候选人姓名'), input('phone', '手机号'), select('position', '应聘岗位', positions), select('resumeStatus', '筛选状态', ['待筛选', '通过', '不合适', '转人才库'])],
    [idx, { title: '候选人姓名', dataIndex: 'name', width: 130 }, { title: '手机号', dataIndex: 'phone', width: 130 }, { title: '应聘岗位', dataIndex: 'position', width: 140 }, { title: '来源渠道', dataIndex: 'source', width: 110 }, { title: '筛选状态', dataIndex: 'status', width: 110, status: true }, { title: '更新时间', dataIndex: 'date', width: 130 }],
    sections({ title: '简历信息', fields: [input('candidateName', '候选人姓名', { required: true }), input('phone', '手机号', { required: true }), input('email', '邮箱'), select('source', '来源渠道', ['招聘网站', '内推', '校园招聘', '人才库']), select('position', '应聘岗位', positions), select('resumeStatus', '筛选状态', ['待筛选', '通过', '不合适', '转人才库']), upload('resumeFile', '简历附件'), text('remark', '筛选备注')] }),
    ['转入人才库'],
  ),
  '/recruitment/talent': cfg(
    [input('candidateName', '候选人姓名'), input('phone', '手机号'), select('position', '意向岗位', positions), select('talentStatus', '人才状态', ['可联系', '已邀约', '已入职', '暂不合适'])],
    [idx, { title: '候选人姓名', dataIndex: 'name', width: 130 }, { title: '手机号', dataIndex: 'phone', width: 130 }, { title: '意向岗位', dataIndex: 'position', width: 140 }, { title: '来源渠道', dataIndex: 'source', width: 110 }, { title: '人才状态', dataIndex: 'status', width: 110, status: true }, { title: '更新时间', dataIndex: 'date', width: 130 }],
    sections({ title: '人才信息', fields: [input('candidateName', '候选人姓名', { required: true }), input('phone', '手机号', { required: true }), select('position', '意向岗位', positions), select('source', '来源渠道', ['招聘网站', '内推', '校园招聘', '历史候选人']), select('talentStatus', '人才状态', ['可联系', '已邀约', '已入职', '暂不合适']), text('remark', '跟进记录'), upload('resumeFile', '简历附件')] }),
    ['发起面试'],
  ),
  '/recruitment/interview': cfg(
    [input('candidateName', '候选人姓名'), select('position', '面试岗位', positions), select('interviewStatus', '面试状态', ['待安排', '待面试', '已通过', '未通过', '已取消']), f('dateRange', '面试时间', { type: 'dateRange' })],
    [idx, { title: '候选人姓名', dataIndex: 'name', width: 130 }, { title: '面试岗位', dataIndex: 'position', width: 140 }, { title: '面试官', dataIndex: 'owner', width: 120 }, { title: '面试时间', dataIndex: 'date', width: 130 }, { title: '面试方式', dataIndex: 'interviewMode', width: 110 }, { title: '面试状态', dataIndex: 'status', width: 110, status: true }],
    sections({ title: '面试安排', fields: [select('candidate', '候选人', employees, { required: true }), select('position', '面试岗位', positions, { required: true }), select('interviewer', '面试官', employees, { required: true }), date('interviewTime', '面试时间', { required: true }), select('interviewMode', '面试方式', ['现场', '电话', '视频']), input('location', '面试地点/链接'), text('remark', '面试备注')] }),
  ),
  '/recruitment/offer': cfg(
    [input('candidateName', '候选人姓名'), select('position', '录用岗位', positions), select('offerStatus', 'Offer状态', ['草稿', '待确认', '已接受', '已拒绝', '已失效'])],
    [idx, { title: 'Offer编号', dataIndex: 'code', width: 130 }, { title: '候选人姓名', dataIndex: 'name', width: 130 }, { title: '录用岗位', dataIndex: 'position', width: 140 }, { title: '薪资方案', dataIndex: 'payrollAmount', width: 120, money: true }, { title: '预计入职日期', dataIndex: 'expectedDate', width: 130 }, { title: 'Offer状态', dataIndex: 'status', width: 110, status: true }],
    sections({ title: 'Offer信息', fields: [input('offerNo', 'Offer编号', { required: true }), select('candidate', '候选人', employees, { required: true }), select('position', '录用岗位', positions, { required: true }), select('department', '所属部门', departments), number('salaryAmount', '薪资方案'), date('expectedDate', '预计入职日期'), select('offerStatus', 'Offer状态', ['草稿', '待确认', '已接受', '已拒绝', '已失效']), upload('offerFile', 'Offer附件')] }),
    ['确认Offer'],
  ),

  '/lifecycle/onboarding': cfg(approvalSearch, approvalColumns, sections({ title: '入职信息', fields: [input('entryNo', '入职编号', { required: true }), select('employee', '员工/候选人', employees, { required: true }), select('department', '入职部门', departments, { required: true }), select('position', '入职岗位', positions), date('expectedEntryDate', '预计入职日期'), date('actualEntryDate', '实际入职日期'), select('entryStatus', '入职状态', ['待入职', '已入职', '已放弃']), upload('files', '入职材料')] }), ['确认入职', '放弃入职', '发送登记表']),
  '/lifecycle/regularization': cfg(approvalSearch, approvalColumns, sections({ title: '转正信息', fields: [input('regularNo', '转正编号', { required: true }), select('employee', '员工', employees, { required: true }), date('probationStartDate', '试用开始日期'), date('plannedRegularDate', '预计转正日期'), date('actualRegularDate', '实际转正日期'), select('regularResult', '转正结果', ['通过', '延期', '不通过']), text('evaluation', '试用期评价')] }), ['发起审批']),
  '/lifecycle/transfer': cfg(approvalSearch, approvalColumns, sections({ title: '调动信息', fields: [input('transferNo', '调动编号', { required: true }), select('employee', '员工', employees, { required: true }), select('oldDepartment', '原部门', departments), select('oldPosition', '原岗位', positions), select('newDepartment', '新部门', departments, { required: true }), select('newPosition', '新岗位', positions), date('effectiveDate', '生效日期', { required: true }), text('transferReason', '调动原因')] }), ['发起审批']),
  '/lifecycle/resignation': cfg(approvalSearch, approvalColumns, sections({ title: '离职信息', fields: [input('resignNo', '离职编号', { required: true }), select('employee', '员工', employees, { required: true }), select('resignType', '离职类型', ['主动离职', '协商解除', '辞退', '退休']), date('applyDate', '申请日期'), date('lastWorkDate', '最后工作日', { required: true }), select('handoverStatus', '交接状态', ['未开始', '进行中', '已完成']), text('resignReason', '离职原因')] }), ['确认离职', '撤销']),

  '/attendance/repair': cfg(approvalSearch, approvalColumns, sections({ title: '补卡信息', fields: [input('repairNo', '补卡编号', { required: true }), select('employee', '申请人', employees, { required: true }), date('repairDate', '补卡日期', { required: true }), select('clockType', '打卡类型', ['上班卡', '下班卡']), f('repairTime', '补卡时间', { type: 'time' }), text('reason', '补卡原因', { required: true }), upload('files', '证明附件')] }), ['发起审批', '撤回']),
  '/attendance/leave': cfg(approvalSearch, approvalColumns, sections({ title: '请假信息', fields: [input('leaveNo', '请假编号', { required: true }), select('employee', '申请人', employees, { required: true }), select('leaveType', '假期类型', ['年假', '事假', '病假', '调休假', '婚假', '产假']), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('leaveHours', '请假时长'), text('reason', '请假原因', { required: true }), upload('files', '证明附件')] }), ['发起审批', '撤回']),
  '/attendance/overtime': cfg(approvalSearch, approvalColumns, attendanceApplySections('加班'), ['发起审批', '撤回']),
  '/attendance/out': cfg(approvalSearch, approvalColumns, attendanceApplySections('外出'), ['发起审批', '撤回']),
  '/attendance/trip': cfg(approvalSearch, approvalColumns, sections({ title: '出差信息', fields: [input('tripNo', '出差编号', { required: true }), select('employee', '申请人', employees, { required: true }), input('destination', '出差地点', { required: true }), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('tripDays', '出差天数'), text('reason', '出差事由', { required: true }), upload('files', '附件')] }), ['发起审批', '撤回']),
  '/attendance/group': cfg([input('name', '考勤组名称'), select('attendanceType', '考勤类型', ['固定班制', '排班制', '自由工时']), select('owner', '负责人', employees), select('shift', '班次', ['白班', '夜班', '两班倒']), select('status', '状态', statuses)], [idx, { title: '考勤组名称', dataIndex: 'name', width: 160 }, { title: '考勤类型', dataIndex: 'attendanceType', width: 120 }, { title: '参与考勤人员', dataIndex: 'employeeCount', width: 120, align: 'right' }, { title: '负责人', dataIndex: 'owner', width: 110 }, { title: '班次', dataIndex: 'shift', width: 130 }, { title: '打卡方式', dataIndex: 'clockMode', width: 130 }, { title: '优先级', dataIndex: 'priority', width: 90, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], sections({ title: '考勤组信息', fields: [input('name', '考勤组名称', { required: true }), select('attendanceType', '考勤类型', ['固定班制', '排班制', '自由工时'], { required: true }), select('participants', '参与考勤人员', employees), select('excludedEmployees', '无需考勤人员', employees), select('owner', '负责人', employees), select('shift', '班次', ['白班', '夜班', '两班倒']), select('clockMode', '打卡方式', ['考勤机', '移动打卡', '无需打卡']), number('priority', '优先级'), select('status', '状态', statuses)] })),
  '/attendance/shift': cfg([input('name', '班次名称'), select('status', '状态', statuses)], [idx, { title: '班次名称', dataIndex: 'name', width: 160 }, { title: '上班时间', dataIndex: 'startTime', width: 120 }, { title: '下班时间', dataIndex: 'endTime', width: 120 }, { title: '休息时间', dataIndex: 'restTime', width: 160 }, { title: '弹性打卡', dataIndex: 'flexibleClock', width: 110 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], sections({ title: '班次信息', fields: [input('name', '班次名称', { required: true }), f('startTime', '上班时间', { type: 'time', required: true }), f('endTime', '下班时间', { type: 'time', required: true }), input('restTime', '休息时间'), select('flexibleClock', '弹性打卡', ['是', '否']), select('status', '状态', statuses)] })),
  '/attendance/schedule': cfg([month('month', '月份'), select('department', '所属部门', departments), input('employeeNo', '工号'), input('name', '姓名')], [idx, { title: '日期', dataIndex: 'date', width: 120 }, { title: '工号', dataIndex: 'employeeNo', width: 120 }, { title: '姓名', dataIndex: 'name', width: 110 }, { title: '所属部门', dataIndex: 'department', width: 140 }, { title: '班次', dataIndex: 'shift', width: 130 }, { title: '排班状态', dataIndex: 'status', width: 110, status: true }], sections({ title: '排班信息', fields: [month('month', '月份', { required: true }), select('employee', '员工', employees, { required: true }), select('department', '所属部门', departments), select('shift', '班次', ['白班', '夜班', '休息']), date('scheduleDate', '排班日期', { required: true }), select('status', '排班状态', statuses)] }), ['生成排班', '复制排班']),
  '/attendance/rule': cfg([input('name', '规则名称'), select('status', '状态', statuses)], defaultColumns, sections({ title: '考勤规则', fields: [input('name', '规则名称', { required: true }), number('lateMinutes', '迟到容许分钟'), number('earlyMinutes', '早退容许分钟'), number('missingCardLimit', '缺卡限制次数'), select('overtimeRule', '加班规则', ['审批后计入', '打卡自动计入', '不计入']), select('status', '状态', statuses), text('remark', '规则说明')] })),
  '/attendance/holiday': cfg([input('name', '假期名称'), select('holidayType', '假期类型', ['法定假', '企业假', '年假', '调休']), select('status', '状态', statuses)], defaultColumns, sections({ title: '假期信息', fields: [input('name', '假期名称', { required: true }), select('holidayType', '假期类型', ['法定假', '企业假', '年假', '调休'], { required: true }), date('startDate', '开始日期', { required: true }), date('endDate', '结束日期', { required: true }), number('days', '假期天数'), select('status', '状态', statuses), text('remark', '说明')] })),
  '/attendance/clock-record': cfg([date('clockDate', '打卡日期'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('clockStatus', '打卡状态', ['正常', '迟到', '早退', '缺卡', '异常'])], [idx, { title: '打卡日期', dataIndex: 'date', width: 120 }, { title: '工号', dataIndex: 'employeeNo', width: 120 }, { title: '姓名', dataIndex: 'name', width: 110 }, { title: '所属部门', dataIndex: 'department', width: 140 }, { title: '打卡时间', dataIndex: 'startTime', width: 120 }, { title: '打卡方式', dataIndex: 'clockMode', width: 120 }, { title: '打卡状态', dataIndex: 'status', width: 110, status: true }], sections({ title: '打卡记录', fields: [select('employee', '员工', employees, { required: true }), date('clockDate', '打卡日期', { required: true }), f('clockTime', '打卡时间', { type: 'time', required: true }), select('clockType', '打卡类型', ['上班卡', '下班卡']), select('clockMode', '打卡方式', ['考勤机', '移动打卡', '导入']), select('clockStatus', '打卡状态', ['正常', '迟到', '早退', '缺卡', '异常'])] }), ['导入记录']),
  '/attendance/daily-stat': cfg([date('statDate', '统计日期'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '状态', statuses)], approvalColumns, sections({ title: '日考勤统计条件', fields: [date('statDate', '统计日期', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees), select('status', '确认状态', statuses)] }), ['生成', '重算', '确认']),
  '/attendance/monthly-stat': cfg([month('month', '月份'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '状态', statuses)], [idx, { title: '月份', dataIndex: 'month', width: 100 }, { title: '工号', dataIndex: 'employeeNo', width: 120 }, { title: '姓名', dataIndex: 'name', width: 110 }, { title: '所属部门', dataIndex: 'department', width: 140 }, { title: '应出勤天数', dataIndex: 'requiredDays', width: 110, align: 'right' }, { title: '实出勤天数', dataIndex: 'actualDays', width: 110, align: 'right' }, { title: '迟到次数', dataIndex: 'lateCount', width: 100, align: 'right' }, { title: '早退次数', dataIndex: 'earlyCount', width: 100, align: 'right' }, { title: '缺卡次数', dataIndex: 'missingCount', width: 100, align: 'right' }, { title: '请假时长', dataIndex: 'leaveHours', width: 100, align: 'right' }, { title: '加班时长', dataIndex: 'overtimeHours', width: 100, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], sections({ title: '月考勤统计条件', fields: [month('month', '月份', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees), select('status', '确认状态', statuses)] }), ['生成', '重算', '确认', '锁定']),

  '/performance/plan': cfg(commonSearch, defaultColumns, sections({ title: '考核计划', fields: [input('code', '计划编号', { required: true }), input('name', '计划名称', { required: true }), select('department', '适用部门', departments), month('period', '考核周期', { required: true }), date('startDate', '开始日期'), date('endDate', '结束日期'), select('owner', '负责人', employees), select('status', '计划状态', statuses), text('remark', '考核说明')] }), ['发布计划']),
  '/performance/progress': cfg([input('name', '员工姓名'), input('employeeNo', '工号'), select('department', '所属部门', departments), select('status', '考核状态', statuses)], approvalColumns, sections({ title: '考核进度', fields: [select('plan', '考核计划', ['2026半年度考核', '月度绩效']), select('employee', '被考核人', employees), select('reviewer', '评分人', employees), number('score', '评分'), select('status', '考核状态', statuses), text('comment', '评价意见')] }), ['批量提醒']),
  '/performance/template': cfg(commonSearch, defaultColumns, sections({ title: '考核模板', fields: [input('code', '模板编号', { required: true }), input('name', '模板名称', { required: true }), select('templateType', '模板类型', ['岗位模板', '部门模板', '通用模板']), number('totalWeight', '总权重'), select('status', '状态', statuses), text('remark', '模板说明')] }), ['复制模板']),
  '/performance/indicator': cfg(commonSearch, defaultColumns, sections({ title: '考核指标', fields: [input('code', '指标编号', { required: true }), input('name', '指标名称', { required: true }), select('indicatorType', '指标类型', ['定量', '定性']), number('weight', '权重'), input('scoreStandard', '评分标准', { span: 24 }), select('status', '状态', statuses)] })),

  '/salary/approval': cfg([month('salaryMonth', '薪资月份'), input('code', '批次编号'), select('batchType', '批次类型', ['普通', '补发', '更正']), select('department', '所属部门', departments), select('status', '审批状态', statuses)], [idx, { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 }, { title: '批次编号', dataIndex: 'code', width: 140 }, { title: '批次类型', dataIndex: 'batchType', width: 100 }, { title: '批次名称', dataIndex: 'name', width: 180 }, { title: '发薪范围', dataIndex: 'department', width: 140 }, { title: '总人数', dataIndex: 'headcount', width: 90, align: 'right' }, { title: '薪资金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true }, { title: '审批状态', dataIndex: 'status', width: 110, status: true }], sections({ title: '薪资批次', fields: [month('salaryMonth', '薪资月份', { required: true }), select('batchType', '批次类型', ['普通', '补发', '更正'], { required: true }), input('code', '批次编号', { required: true }), input('name', '批次名称'), select('payRange', '发薪范围', departments, { required: true }), number('headcount', '总人数'), number('payrollAmount', '薪资金额'), select('status', '审批状态', statuses), upload('salaryFile', '薪资明细导入文件')] }), ['发起审批', '撤回']),
  '/salary/payslip': cfg([month('salaryMonth', '薪资月份'), input('employeeNo', '工号'), input('name', '员工姓名'), select('department', '所属部门', departments), select('sendStatus', '发放状态', ['待发放', '已发放', '已撤回']), select('viewStatus', '查看状态', ['未查看', '已查看'])], [idx, { title: '工资条编号', dataIndex: 'code', width: 140 }, { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 }, { title: '工号', dataIndex: 'employeeNo', width: 120 }, { title: '员工姓名', dataIndex: 'name', width: 120 }, { title: '实发金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true }, { title: '发放状态', dataIndex: 'status', width: 110, status: true }, { title: '查看状态', dataIndex: 'viewStatus', width: 110 }], sections({ title: '工资条信息', fields: [input('payslipNo', '工资条编号', { required: true }), input('batchNo', '批次编号', { required: true }), month('salaryMonth', '薪资月份', { required: true }), select('employee', '员工', employees, { required: true }), number('grossPay', '应发金额'), number('deduction', '扣款项'), number('netPay', '实发金额'), select('sendStatus', '发放状态', ['待发放', '已发放', '已撤回']), select('viewStatus', '查看状态', ['未查看', '已查看'])] }), ['生成工资条', '批量发放', '撤回']),

  '/analytics/roster': cfg(employeeSearch, [...employeeColumns, { title: '最高学历', dataIndex: 'education', width: 100 }, { title: '紧急联系人', dataIndex: 'emergencyContact', width: 120 }], employeeForm, ['字段配置']),
  '/analytics/entry-exit': cfg([f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments), select('position', '岗位', positions), select('changeType', '变动类型', ['入职', '离职'])], approvalColumns, sections({ title: '统计条件', fields: [f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments), select('position', '岗位', positions), select('changeType', '变动类型', ['入职', '离职'])] }), ['导出报表']),
  '/analytics/attendance': cfg([month('month', '月份', { required: true }), select('department', '所属部门', departments), input('name', '员工姓名'), input('employeeNo', '工号')], pageConfigsPlaceholderMonthly(), sections({ title: '考勤汇总条件', fields: [month('month', '月份', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees)] }), ['钻取明细']),
  '/analytics/salary': cfg([month('salaryMonth', '薪资月份', { required: true }), select('department', '所属部门', departments), select('batchType', '批次类型', ['普通', '补发', '更正'])], [idx, { title: '批次编号', dataIndex: 'code', width: 140 }, { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 }, { title: '批次类型', dataIndex: 'batchType', width: 100 }, { title: '所属部门', dataIndex: 'department', width: 140 }, { title: '人数', dataIndex: 'headcount', width: 90, align: 'right' }, { title: '总金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true }, { title: '归档时间', dataIndex: 'date', width: 130 }], sections({ title: '薪资统计条件', fields: [month('salaryMonth', '薪资月份', { required: true }), select('department', '所属部门', departments), select('batchType', '批次类型', ['普通', '补发', '更正'])] }), ['钻取批次']),
  '/analytics/hr-dashboard': cfg([f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments)], [idx, { title: '指标名称', dataIndex: 'name', width: 180 }, { title: '指标值', dataIndex: 'headcount', width: 120, align: 'right' }, { title: '来源模块', dataIndex: 'businessType', width: 130 }, { title: '更新时间', dataIndex: 'date', width: 130 }], sections({ title: '看板条件', fields: [f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments)] }), ['钻取']),

  '/settings/workflow': cfg([input('name', '流程名称'), select('businessType', '业务类型', ['招聘需求', 'Offer', '入职', '转正', '调动', '离职', '补卡', '请假', '加班', '外出', '出差', '绩效', '薪资']), select('status', '启用状态', statuses)], [idx, { title: '流程编号', dataIndex: 'code', width: 130 }, { title: '流程名称', dataIndex: 'name', width: 180 }, { title: '业务类型', dataIndex: 'businessType', width: 150 }, { title: '版本号', dataIndex: 'version', width: 90 }, { title: '启用状态', dataIndex: 'status', width: 110, status: true }, { title: '更新时间', dataIndex: 'date', width: 130 }], sections({ title: '流程基础信息', fields: [input('code', '流程编号', { required: true }), input('name', '流程名称', { required: true }), select('businessType', '业务类型', ['招聘需求', 'Offer', '入职', '转正', '调动', '离职', '补卡', '请假', '加班', '外出', '出差', '绩效', '薪资'], { required: true }), input('version', '版本号'), select('status', '启用状态', statuses)] }, { title: '节点配置', fields: [input('nodeName', '节点名称', { required: true }), select('approverRule', '审批人规则', ['直接上级', '部门负责人', '指定人员', '角色', '发起人自选'], { required: true }), select('ccRule', '抄送人规则', ['指定人员', '角色', '发起人直接上级']), text('formPermission', '表单权限'), text('passAction', '通过动作'), text('rejectAction', '驳回动作')] }), ['发布', '停用', '复制流程']),
  '/settings/role': cfg([input('roleName', '角色名称'), select('roleStatus', '角色状态', ['启用', '停用'])], [idx, { title: '角色名称', dataIndex: 'name', width: 160 }, { title: '角色说明', dataIndex: 'remark', width: 240 }, { title: '用户数', dataIndex: 'headcount', width: 90, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }, { title: '更新时间', dataIndex: 'date', width: 130 }], sections({ title: '角色信息', fields: [input('roleName', '角色名称', { required: true }), text('roleDesc', '角色说明'), select('roleStatus', '角色状态', ['启用', '停用'], { required: true }), select('users', '分配用户', employees)] }, { title: '授权配置', fields: [select('pagePermission', '页面权限', ['全模块', '组织架构', '员工管理', '考勤管理', '薪酬管理']), select('buttonPermission', '按钮权限', ['新增', '编辑', '删除', '导入', '导出', '审批']), select('dataPermission', '数据权限', ['本人', '本所属部门', '本所属部门及下级', '指定所属部门', '全公司'], { required: true }), select('fieldPermission', '字段权限', ['可见', '脱敏', '隐藏', '可编辑'])] }), ['分配用户', '授权']),
  '/settings/permission': cfg([select('role', '角色', ['HR管理员', '人资专员', '部门经理']), select('user', '用户', employees), select('departmentScope', '所属部门范围', departments)], [idx, { title: '授权对象', dataIndex: 'name', width: 160 }, { title: '页面权限', dataIndex: 'pagePermission', width: 160 }, { title: '按钮权限', dataIndex: 'buttonPermission', width: 160 }, { title: '数据权限', dataIndex: 'dataPermission', width: 160 }, { title: '字段权限', dataIndex: 'fieldPermission', width: 160 }, { title: '更新时间', dataIndex: 'date', width: 130 }], sections({ title: '权限配置', fields: [select('role', '角色', ['HR管理员', '人资专员', '部门经理']), select('user', '用户', employees), select('pagePermission', '页面权限', ['全模块', '组织架构', '员工管理', '考勤管理', '薪酬管理']), select('buttonPermission', '按钮权限', ['新增', '编辑', '删除', '导入', '导出', '审批']), select('dataPermission', '数据权限', ['本人', '本所属部门', '本所属部门及下级', '指定所属部门', '全公司'], { required: true }), select('departmentScope', '指定所属部门', departments), select('fieldPermission', '字段权限', ['可见', '脱敏', '隐藏', '可编辑']), select('effectMode', '权限生效方式', ['实时生效', '重新登录生效'])] }), ['授权', '回收', '复制权限']),
};

function pageConfigsPlaceholderMonthly(): ColumnConfig[] {
  return [
    idx,
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '出勤天数', dataIndex: 'actualDays', width: 100, align: 'right' },
    { title: '异常次数', dataIndex: 'missingCount', width: 100, align: 'right' },
    { title: '请假时长', dataIndex: 'leaveHours', width: 100, align: 'right' },
    { title: '加班时长', dataIndex: 'overtimeHours', width: 100, align: 'right' },
    { title: 'HR确认状态', dataIndex: 'status', width: 110, status: true },
  ];
}

const reportPaths = new Set([
  '/dashboard/hr',
  '/attendance/daily-stat',
  '/attendance/monthly-stat',
  '/analytics/roster',
  '/analytics/entry-exit',
  '/analytics/attendance',
  '/analytics/salary',
  '/analytics/hr-dashboard',
]);

const readonlyFieldNames = new Set([
  'code',
  'employeeNo',
  'joinedCount',
  'activeHeadcount',
  'headcount',
  'version',
  'payrollAmount',
  'grossPay',
  'deduction',
  'netPay',
]);

const primaryActionMap: Record<string, string> = {
  '/organization/list': '新增组织',
  '/organization/position': '新增岗位',
  '/employee/list': '新增员工',
  '/employee/archive': '新增档案',
  '/employee/contract': '签订合同',
  '/recruitment/demand': '新增招聘需求',
  '/recruitment/resume': '新增简历',
  '/recruitment/talent': '新增人才',
  '/recruitment/interview': '发起面试',
  '/recruitment/offer': '发放Offer',
  '/lifecycle/onboarding': '手动添加',
  '/lifecycle/regularization': '转正办理',
  '/lifecycle/transfer': '新增调动',
  '/lifecycle/resignation': '新增离职',
  '/attendance/repair': '发起补卡',
  '/attendance/leave': '发起请假',
  '/attendance/overtime': '发起加班',
  '/attendance/out': '发起外出',
  '/attendance/trip': '发起出差',
  '/attendance/group': '新增考勤组',
  '/attendance/shift': '新增班次',
  '/attendance/schedule': '新增排班',
  '/attendance/rule': '新增规则',
  '/attendance/holiday': '新增假期',
  '/attendance/clock-record': '新增打卡记录',
  '/performance/plan': '新增考核计划',
  '/performance/template': '新增模板',
  '/performance/indicator': '新增指标',
  '/salary/approval': '新建薪资批次',
  '/salary/payslip': '生成工资条',
  '/settings/workflow': '新增流程',
  '/settings/role': '新增角色',
  '/settings/permission': '新增权限',
};

const settingsRowActionOverrides: Record<string, PageConfig['rowActions']> = {
  '/settings/workflow': ['查看', '编辑', '发布', '停用', '复制'],
  '/settings/role': ['查看', '编辑', '停用', '分配用户', '授权'],
  '/settings/permission': ['查看权限', '授权', '回收', '复制权限'],
};

function markReadonlyFields(config: PageConfig): PageConfig {
  return {
    ...config,
    formSections: config.formSections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => ({
        ...field,
        readOnly:
          field.readOnly ||
          readonlyFieldNames.has(String(field.name)) ||
          /系统生成|只读|已入职人数|在岗人数|总人数|实发金额|应发金额|扣款项/.test(field.label),
      })),
    })),
  };
}

function enhancePageConfig(path: string, config: PageConfig): PageConfig {
  const isReport = reportPaths.has(path);
  const inferredApproval =
    (path.includes('/lifecycle/') && path !== '/lifecycle/onboarding') ||
    ['/attendance/repair', '/attendance/leave', '/attendance/overtime', '/attendance/out', '/attendance/trip', '/salary/approval'].includes(path);
  const isApproval = config.approvalFlow ?? inferredApproval;
  const isReadonly = path === '/organization/chart';

  return markReadonlyFields({
    ...config,
    approvalFlow: isApproval,
    pageType: isReport ? 'report' : isApproval ? 'approval' : isReadonly ? 'readonly' : config.pageType ?? 'crud',
    primaryAction: primaryActionMap[path] ?? config.primaryAction ?? '新建',
    rowActions: settingsRowActionOverrides[path] ?? (isReport || isReadonly ? ['查看', '钻取'] : isApproval ? ['查看', '编辑', '撤回', '审批'] : ['查看', '编辑', '删除']),
    toolbarActions: config.toolbarExtra,
    showCreate: !isReport && !isReadonly && config.showCreate !== false,
    showImport: !isReport && !isReadonly && !isApproval && config.showImport !== false,
    showDelete: !isReport && !isReadonly && config.showDelete !== false,
    showBatchSubmit: config.showBatchSubmit ?? (isApproval || path.includes('/performance/') || path.includes('/salary/approval')),
    showExport: config.showExport !== false,
  });
}

export function getPageConfig(path: string): PageConfig {
  return enhancePageConfig(path, prdCorePageConfigs[path] ?? oaExpansionPageConfigs[path] ?? pageConfigs[path] ?? defaultPageConfig);
}
