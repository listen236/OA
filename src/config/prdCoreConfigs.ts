import type { ActionConfig, ColumnConfig, FieldConfig, PageConfig, SelectOption, StatusTabConfig } from '../types';
import { companyOrganizations, departmentTreeOptions, employeeOptions } from './organizationOptions';

export const departments = ['总经办', '人力资源部', '生产一部', '生产二部', '质量管理部', '财务部', '技术中心'];
export const employees = [...employeeOptions];
export const positions = ['HR专员', '招聘经理', '生产主管', '质检员', '薪酬专员', '系统管理员'];

export const idx: ColumnConfig = { title: '序号', dataIndex: 'index', width: 62, align: 'center' };

export const f = (name: string, label: string, extra: Partial<FieldConfig> = {}): FieldConfig => ({ name, label, ...extra });
export const input = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, extra);
export const select = (name: string, label: string, options: Array<string | SelectOption>, extra: Partial<FieldConfig> = {}) => {
  const isDepartmentField = options === departments;
  return f(name, label, { type: isDepartmentField ? 'treeSelect' : 'select', options, treeData: isDepartmentField ? [...departmentTreeOptions] : undefined, ...extra });
};
export const number = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'number', ...extra });
export const date = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'date', ...extra });
export const month = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'month', ...extra });
export const radio = (name: string, label: string, options: string[], extra: Partial<FieldConfig> = {}) =>
  f(name, label, { type: 'radio', options, ...extra });
export const text = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'textarea', span: 24, ...extra });
export const upload = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'upload', span: 24, ...extra });

export const action = (key: string, label: string, extra: Partial<ActionConfig> = {}): ActionConfig => ({ key, label, ...extra });

export const tabs = (...items: Array<[string, string, string[]?]>): StatusTabConfig[] =>
  items.map(([key, label, statusValues]) => ({ key, label, statusValues: statusValues ?? [label] }));

export const createPage = (config: PageConfig): PageConfig => ({
  ...config,
  tableColumns: config.table?.columns ?? config.tableColumns,
  formSections: config.formSections ?? [],
});

export const commonOrgSearch = [
  input('keyword', '关键词'),
  select('department', '所属部门', departments),
  select('status', '状态', ['启用', '停用']),
];

const sections = (...items: PageConfig['formSections']): PageConfig['formSections'] => items;

const disabledLegacyButtons = {
  showCreate: false,
  showImport: false,
  showDelete: false,
  showExport: false,
  showBatchSubmit: false,
};

const defaultPageActions = (primaryAction: string): ActionConfig[] => [
  action('create', primaryAction, { kind: 'primary', effect: { type: 'openCreate' } }),
  action('import', '导入', { effect: { type: 'message', message: '导入校验任务已创建' } }),
  action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } }),
];

const defaultFormFooterActions: ActionConfig[] = [
  action('save', '保存'),
  action('submit', '提交', { kind: 'primary' }),
];

const approvalFormFooterActions: ActionConfig[] = [
  action('saveDraft', '保存草稿'),
  action('submitApproval', '提交审批', { kind: 'primary' }),
];

const defaultRowActions: ActionConfig[] = [
  action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
  action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
  action('delete', '删除', { kind: 'danger', confirm: '确认删除该数据？', effect: { type: 'delete' } }),
];

const enableDisableRows: ActionConfig[] = [
  action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
  action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
  action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
  action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
  action('delete', '删除', { kind: 'danger', confirm: '确认删除该数据？', effect: { type: 'delete' } }),
];

const copyEnableDisableRows: ActionConfig[] = [
  action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
  action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
  action('copy', '复制', { kind: 'link', effect: { type: 'message', message: '已复制记录' } }),
  action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
  action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
];

const statusOptions = (statusTabs: StatusTabConfig[]) => Array.from(new Set(statusTabs.flatMap((tab) => tab.statusValues)));
const flowStatuses = ['未发起', '审批中', '审批通过', '审批驳回', '已撤回', '已终止'];
const employmentTypes = ['正式员工', '实习', '劳务', '返聘', '外包', '临时工', '其他'];
const idTypes = ['身份证', '护照', '港澳通行证', '台胞证', '其他'];
const onboardingTypes = ['社招', '校招', '返聘', '实习', '其他'];
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

interface SimplePageOptions {
  primaryAction: string;
  searchFields: FieldConfig[];
  columns: ColumnConfig[];
  requiredVisible: string[];
  defaultVisible: string[];
  formTitle: string;
  formFields: FieldConfig[];
  statusTabs?: StatusTabConfig[];
  rowActions?: ActionConfig[];
  pageActions?: ActionConfig[];
  detailActions?: ActionConfig[];
  formFooterActions?: ActionConfig[];
  detailSections?: PageConfig['detailSections'];
  approvalFlow?: boolean;
  drawerLayout?: PageConfig['drawerLayout'];
  extraSections?: PageConfig['formSections'];
}

const simpleCorePage = ({
  primaryAction,
  searchFields,
  columns,
  requiredVisible,
  defaultVisible,
  formTitle,
  formFields,
  statusTabs,
  rowActions,
  pageActions,
  detailActions,
  formFooterActions,
  detailSections,
  approvalFlow = false,
  drawerLayout = 'auto',
  extraSections = [],
}: SimplePageOptions): PageConfig =>
  createPage({
    ...disabledLegacyButtons,
    primaryAction,
    approvalFlow,
    drawerLayout,
    statusTabs,
    searchFields,
    tableColumns: [],
    table: { columns, requiredVisible, defaultVisible },
    pageActions: pageActions ?? defaultPageActions(primaryAction),
    rowActionConfigs: rowActions ?? defaultRowActions,
    detailActions,
    formFooterActions: formFooterActions ?? defaultFormFooterActions,
    formSections: sections({ title: formTitle, fields: formFields }, ...extraSections),
    detailSections,
  });

const organizationList: PageConfig = {
  ...simpleCorePage({
  primaryAction: '新增组织',
  searchFields: [
    input('orgCode', '组织编码'),
    input('orgName', '组织名称'),
    select('orgType', '组织类型', ['公司', '部门']),
    select('status', '状态', ['启用', '停用'], { initialValue: '启用' }),
  ],
  columns: [
    idx,
    { title: '组织名称', dataIndex: 'name', width: 180 },
    { title: '组织编码', dataIndex: 'code', width: 130 },
    { title: '组织类型', dataIndex: 'orgType', width: 100 },
    { title: '上级组织', dataIndex: 'parentOrg', width: 140 },
    { title: '组织负责人', dataIndex: 'owner', width: 120 },
    { title: '排序号', dataIndex: 'sortNo', width: 90, align: 'right' },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
    { title: '更新时间', dataIndex: 'date', width: 130 },
    { title: '备注', dataIndex: 'remark', width: 180 },
  ],
  requiredVisible: ['name', 'code', 'status'],
  defaultVisible: ['name', 'code', 'orgType', 'parentOrg', 'owner', 'sortNo', 'status', 'date'],
  formTitle: '组织信息',
  formFields: [
    input('code', '组织编码', { readOnly: true }),
    input('name', '组织名称', { required: true }),
    select('orgType', '组织类型', ['公司', '部门'], { required: true }),
    select('parentOrg', '上级组织', departments),
    select('owner', '组织负责人', employees),
    number('sortNo', '排序号'),
    select('status', '组织状态', ['启用', '停用'], { required: true }),
    text('remark', '备注'),
  ],
  pageActions: [
    action('create', '新增组织', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('import', '导入', { effect: { type: 'message', message: '组织导入校验任务已创建' } }),
    action('export', '导出', { effect: { type: 'message', message: '组织导出任务已创建' } }),
  ],
  rowActions: [
    action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
  ],
  }),
  showDelete: true,
};

const organizationChart = createPage({
  ...disabledLegacyButtons,
  primaryAction: '下载架构图',
  searchFields: [
    select('viewType', '视图类型', ['组织视图', '岗位视图', '人员视图']),
    select('rootOrg', '根节点', departments),
    number('expandLevel', '展开层级'),
    select('status', '节点状态', ['启用', '停用']),
  ],
  tableColumns: [],
  table: {
    requiredVisible: ['name', 'owner', 'status'],
    defaultVisible: ['name', 'owner', 'headcount', 'status'],
    columns: [
      idx,
      { title: '节点名称', dataIndex: 'name', width: 180 },
      { title: '负责人', dataIndex: 'owner', width: 120 },
      { title: '节点人数', dataIndex: 'headcount', width: 110, align: 'right' },
      { title: '节点状态', dataIndex: 'status', width: 100, status: true },
    ],
  },
  pageActions: [
    action('expand', '展开', { effect: { type: 'message', message: '已展开组织架构' } }),
    action('collapse', '收起', { effect: { type: 'message', message: '已收起组织架构' } }),
    action('download', '下载架构图', { kind: 'primary', effect: { type: 'message', message: '架构图下载任务已创建' } }),
  ],
  rowActionConfigs: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } })],
  formSections: sections({
    title: '架构图条件',
    fields: [
      select('viewType', '视图类型', ['组织视图', '岗位视图', '人员视图'], { required: true }),
      select('rootOrg', '根节点', departments),
      number('expandLevel', '展开层级'),
    ],
  }),
});

const positionManagement: PageConfig = {
  ...simpleCorePage({
  primaryAction: '新增岗位',
  searchFields: [
    input('positionCode', '岗位编码'),
    input('positionName', '岗位名称'),
    select('department', '所属部门', departments),
    select('status', '状态', ['启用', '停用'], { initialValue: '启用' }),
  ],
  columns: [
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
  requiredVisible: ['code', 'position', 'department', 'status'],
  defaultVisible: ['code', 'position', 'department', 'grade', 'plannedHeadcount', 'headcount', 'status', 'date'],
  formTitle: '岗位信息',
  formFields: [
    input('code', '岗位编码', { readOnly: true }),
    input('position', '岗位名称', { required: true }),
    select('department', '所属部门', departments, { required: true }),
    select('grade', '职级', ['P1', 'P2', 'P3', 'M1', 'M2']),
    number('plannedHeadcount', '编制人数'),
    number('headcount', '在岗人数', { readOnly: true }),
    select('status', '岗位状态', ['启用', '停用'], { required: true }),
    text('positionDesc', '岗位说明'),
  ],
  rowActions: [
    action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
  ],
  }),
  showDelete: true,
};

const employeeStatus = ['在职', '试用期', '离职'];
const employeeSearch = [
  input('employeeNo', '工号'),
  input('name', '姓名'),
  select('department', '所属部门', departments),
  select('position', '岗位', positions),
  select('status', '员工状态', employeeStatus),
  f('dateRange', '入职日期', { type: 'dateRange' }),
];

const employeeColumns: ColumnConfig[] = [
  idx,
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '手机号码', dataIndex: 'phone', width: 130 },
  { title: '证件号', dataIndex: 'idNo', width: 170 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '岗位', dataIndex: 'position', width: 140 },
  { title: '直接上级', dataIndex: 'owner', width: 110 },
  { title: '用工类型', dataIndex: 'employmentType', width: 100 },
  { title: '员工状态', dataIndex: 'status', width: 100, status: true },
  { title: '入职日期', dataIndex: 'date', width: 120 },
];

const employeeBaseFields = [
  input('employeeNo', '工号', { readOnly: true }),
  input('name', '姓名', { required: true }),
  select('department', '所属部门', departments, { required: true }),
  select('position', '岗位', positions),
  select('idType', '证件类型', idTypes, { required: true }),
  input('idNo', '证件号', { required: true }),
  upload('idCardFront', '证件照正面', { span: 12 }),
  upload('idCardBack', '证件照反面', { span: 12 }),
  input('phone', '手机号码', { required: true }),
  select('employmentType', '用工类型', employmentTypes, { required: true }),
  date('hireDate', '入职日期', { required: true }),
  date('socialWorkDate', '社会工作日期', { required: true }),
  select('owner', '直接上级', employees),
  select('contractCompany', '合同公司', companyOrganizations),
  date('startDate', '合同开始日期'),
  date('endDate', '合同结束日期'),
  number('probationMonths', '试用期（月）', { min: 0, precision: 0, step: 1 }),
  date('probationDate', '试用期结束日期'),
];

const employeeList: PageConfig = {
  ...simpleCorePage({
  primaryAction: '新增员工',
  searchFields: employeeSearch,
  columns: employeeColumns,
  requiredVisible: ['employeeNo', 'name', 'department', 'status'],
  defaultVisible: ['employeeNo', 'name', 'phone', 'idNo', 'department', 'position', 'owner', 'status', 'employmentType', 'date'],
  formTitle: '基本信息',
  formFields: employeeBaseFields,
  pageActions: [
    action('create', '新增员工', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('import', '导入', { effect: { type: 'message', message: '员工导入校验任务已创建' } }),
    action('export', '导出', { effect: { type: 'message', message: '员工导出任务已创建' } }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
  ],
  formFooterActions: [action('cancel', '取消'), action('save', '保存', { kind: 'primary' })],
  extraSections: [
    { title: '个人信息', fields: [select('gender', '性别', ['男', '女', '未知']), date('birthDate', '出生日期'), input('email', '邮箱'), select('nation', '民族', nationOptions), select('householdType', '户口类型', ['农业户口', '非农业户口', '居民户口', '其他']), input('householdAddress', '户口所在地'), input('nativePlace', '籍贯'), input('address', '居住地址', { span: 24 }), select('education', '最高学历', ['高中及以下', '中专', '大专', '本科', '硕士', '博士', '其他']), select('politicalStatus', '政治面貌', ['群众', '共青团员', '中共党员', '民主党派', '其他']), select('maritalStatus', '婚姻状况', ['未婚', '已婚', '离异', '丧偶', '其他']), select('bloodType', '血型', ['A型', 'B型', 'AB型', 'O型', '其他', '未知']), input('emergencyContact', '紧急联系人'), input('emergencyPhone', '紧急联系人电话'), input('wechat', '微信'), input('qq', 'QQ')] },
    { title: '银行卡信息', fields: [input('bankName', '工资卡开户银行'), input('bankBranch', '工资卡开户支行'), input('bankAccount', '工资卡银行账号'), input('bankAccountName', '工资卡开户名')] },
    { title: '教育经历', type: 'detailTable', displayMode: 'inlineBlocks', addButtonText: '添加教育经历', fields: [input('schoolName', '学校名称', { required: true }), select('education', '学历', ['高中', '大专', '本科', '硕士', '博士'], { required: true }), input('major', '专业'), date('startDate', '开始日期', { required: true }), date('endDate', '结束日期'), select('highestEducation', '是否最高学历', ['是', '否'])] },
    { title: '工作经历', type: 'detailTable', displayMode: 'inlineBlocks', addButtonText: '添加工作经历', fields: [input('companyName', '公司名称', { required: true }), input('jobTitle', '担任职位', { required: true }), date('entryDate', '入职日期', { required: true }), date('leaveDate', '离职日期'), text('jobDescription', '职位描述')] },
    { title: '家庭成员', type: 'detailTable', displayMode: 'inlineBlocks', addButtonText: '添加家庭成员', fields: [input('familyName', '姓名', { required: true }), select('familyRelation', '关系', ['父亲', '母亲', '配偶', '子女', '其他'], { required: true }), input('familyPhone', '联系电话'), select('emergencyFlag', '是否紧急联系人', ['是', '否'])] },
    { title: '附件存档', type: 'detailTable', displayMode: 'inlineBlocks', addButtonText: '添加附件', fields: [select('fileType', '附件类型', ['身份证', '学历证明', '合同附件', '证书', '其他'], { required: true }), upload('files', '附件文件', { required: true }), input('fileRemark', '备注', { span: 24 })] },
  ],
  }),
  showDelete: true,
};

const employeeArchive = simpleCorePage({
  primaryAction: '新增档案',
  searchFields: [
    input('employeeNo', '工号'),
    input('name', '员工姓名'),
    select('archiveType', '档案类型', ['工作经历', '教育经历', '家庭成员', '附件存档']),
    select('department', '所属部门', departments),
  ],
  columns: [
    idx,
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '员工姓名', dataIndex: 'name', width: 120 },
    { title: '档案类型', dataIndex: 'archiveType', width: 120 },
    { title: '档案名称', dataIndex: 'companyName', width: 180 },
    { title: '开始日期', dataIndex: 'startDate', width: 120 },
    { title: '结束日期', dataIndex: 'endDate', width: 120 },
    { title: '更新时间', dataIndex: 'date', width: 130 },
  ],
  requiredVisible: ['employeeNo', 'name', 'archiveType'],
  defaultVisible: ['employeeNo', 'name', 'archiveType', 'companyName', 'startDate', 'endDate', 'date'],
  formTitle: '员工档案',
  formFields: [
    select('employee', '员工', employees, { required: true }),
    select('archiveType', '档案类型', ['工作经历', '教育经历', '家庭成员', '附件存档'], { required: true }),
    input('companyName', '档案名称', { required: true }),
    date('startDate', '开始日期'),
    date('endDate', '结束日期'),
    text('remark', '档案说明'),
    upload('files', '档案附件'),
  ],
});

const employeeContract = simpleCorePage({
  primaryAction: '签订合同',
  searchFields: [
    input('name', '员工姓名'),
    input('employeeNo', '工号'),
    select('contractType', '合同类型', ['劳动合同', '保密协议', '竞业协议', '实习协议', '其他']),
    select('contractStatus', '状态', ['待生效', '生效中', '已到期', '已解除', '已终止']),
    f('dateRange', '到期日期', { type: 'dateRange' }),
  ],
  columns: [
    idx,
    { title: '合同编号', dataIndex: 'code', width: 130 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '员工姓名', dataIndex: 'name', width: 120 },
    { title: '合同类型', dataIndex: 'contractType', width: 120 },
    { title: '合同开始日期', dataIndex: 'startDate', width: 130 },
    { title: '合同结束日期', dataIndex: 'endDate', width: 130 },
    { title: '实际结束日期', dataIndex: 'actualEndDate', width: 130 },
    { title: '合同状态', dataIndex: 'contractStatus', width: 110, status: true },
    { title: '合同签订日期', dataIndex: 'signDate', width: 130 },
    { title: '附件', dataIndex: 'files', width: 110 },
  ],
  requiredVisible: ['code', 'employeeNo', 'name', 'contractStatus'],
  defaultVisible: ['code', 'employeeNo', 'name', 'contractType', 'startDate', 'endDate', 'actualEndDate', 'contractStatus', 'signDate', 'files'],
  formTitle: '合同与协议',
  formFields: [
    input('code', '合同编号', { readOnly: true }),
    select('employee', '员工', employees, { required: true }),
    select('contractType', '合同类型', ['劳动合同', '保密协议', '竞业协议', '实习协议', '其他'], { required: true }),
    radio('termType', '合同期限类型', ['固定期限', '无固定期限', '以完成一定工作任务为期限'], { required: true }),
    date('startDate', '合同开始日期', { required: true }),
    date('endDate', '合同结束日期'),
    date('actualEndDate', '实际结束日期', { readOnly: true }),
    date('signDate', '合同签订日期', { required: true }),
    select('contractStatus', '状态', ['待生效', '生效中', '已到期', '已解除', '已终止'], { readOnly: true }),
    text('reason', '原因', { readOnly: true }),
    upload('files', '合同附件'),
  ],
  pageActions: [
    action('create', '签订合同', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('import', '导入', { effect: { type: 'message', message: '合同导入校验任务已创建' } }),
    action('export', '导出', { effect: { type: 'message', message: '合同导出任务已创建' } }),
  ],
  rowActions: [
    action('detail', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('release', '解除', {
      kind: 'link',
      visibleWhen: { field: 'contractStatus', equals: '生效中' },
      effect: {
        type: 'openProcess',
        drawerTitle: '解除合同',
        formSections: sections({
          title: '解除信息',
          fields: [date('actualEndDate', '实际结束日期', { required: true }), text('reason', '原因', { required: true })],
        }),
        submitEffect: { type: 'setStatus', status: '已解除', message: '已解除合同' },
      },
    }),
    action('terminate', '终止', {
      kind: 'link',
      visibleWhen: { field: 'contractStatus', equals: '生效中' },
      effect: {
        type: 'openProcess',
        drawerTitle: '终止合同',
        formSections: sections({
          title: '终止信息',
          fields: [date('actualEndDate', '实际结束日期', { required: true }), text('reason', '原因', { required: true })],
        }),
        submitEffect: { type: 'setStatus', status: '已终止', message: '已终止合同' },
      },
    }),
  ],
});

const recruitmentDemandTabs = tabs(['draft', '草稿'], ['published', '已发布'], ['recruiting', '招聘中'], ['closed', '已关闭'], ['cancelled', '已取消']);
const recruitmentResumeTabs = tabs(['pending', '待筛选'], ['passed', '已通过'], ['eliminated', '已淘汰'], ['talent', '已转人才库'], ['interview', '已发起面试']);
const recruitmentTalentTabs = tabs(['pending', '待跟进'], ['following', '跟进中'], ['paused', '暂不考虑'], ['hired', '已录用'], ['eliminated', '已淘汰']);
const recruitmentInterviewTabs = tabs(['arranging', '待安排'], ['waiting', '待面试'], ['finished', '已完成'], ['cancelled', '已取消']);
const recruitmentOfferTabs = tabs(['draft', '草稿'], ['sent', '已发放'], ['confirmed', '已确认'], ['rejected', '已拒绝'], ['withdrawn', '已撤回'], ['onboarding', '已转入职']);

const recruitmentDemand = simpleCorePage({
  primaryAction: '新增招聘需求',
  statusTabs: recruitmentDemandTabs,
  searchFields: [input('code', '需求编号'), select('position', '招聘岗位', positions), select('department', '所属部门', departments), select('status', '需求状态', statusOptions(recruitmentDemandTabs)), f('dateRange', '期望到岗日期', { type: 'dateRange' })],
  columns: [
    idx,
    { title: '需求编号', dataIndex: 'code', width: 130 },
    { title: '招聘岗位', dataIndex: 'position', width: 150 },
    { title: '招聘人数', dataIndex: 'headcount', width: 100, align: 'right' },
    { title: '已入职人数', dataIndex: 'joinedCount', width: 110, align: 'right' },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '招聘负责人', dataIndex: 'owner', width: 120 },
    { title: '期望到岗日期', dataIndex: 'expectedDate', width: 130 },
    { title: '需求状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'position', 'status'],
  defaultVisible: ['code', 'position', 'headcount', 'joinedCount', 'department', 'owner', 'expectedDate', 'status'],
  formTitle: '招聘需求',
  formFields: [input('code', '需求编号', { required: true }), select('position', '招聘岗位', positions, { required: true }), number('headcount', '招聘人数', { required: true }), select('department', '所属部门', departments, { required: true }), date('expectedDate', '期望到岗日期'), select('owner', '招聘负责人', employees), select('status', '需求状态', statusOptions(recruitmentDemandTabs)), text('jobDuty', '岗位职责'), text('requirement', '任职要求')],
  formFooterActions: [
    action('saveDraft', '保存草稿'),
    action('savePublish', '保存并发布', { kind: 'primary' }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', notEquals: ['已关闭', '已取消'] }, effect: { type: 'openEdit' } }),
    action('publish', '发布', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '已发布' } }),
    action('close', '关闭', { kind: 'link', visibleWhen: { field: 'status', equals: ['已发布', '招聘中'] }, effect: { type: 'setStatus', status: '已关闭' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该招聘需求？', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('progress', '进度跟进', { kind: 'primary', visibleWhen: { field: 'status', equals: ['已发布', '招聘中'] }, effect: { type: 'message', message: '已打开招聘进度跟进' } }),
    action('cancel', '取消需求', { visibleWhen: { field: 'status', equals: ['草稿', '已发布'] }, effect: { type: 'setStatus', status: '已取消' } }),
  ],
});

const candidateColumns: ColumnConfig[] = [
  idx,
  { title: '候选人编号', dataIndex: 'code', width: 130 },
  { title: '候选人姓名', dataIndex: 'name', width: 130 },
  { title: '手机号', dataIndex: 'phone', width: 130 },
  { title: '意向岗位', dataIndex: 'position', width: 140 },
  { title: '来源', dataIndex: 'source', width: 110 },
  { title: '标签', dataIndex: 'tags', width: 130 },
  { title: '负责人', dataIndex: 'owner', width: 110 },
  { title: '最近跟进时间', dataIndex: 'lastFollowTime', width: 150 },
  { title: '最近跟进人', dataIndex: 'lastFollower', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120, status: true },
];

const recruitmentResume = simpleCorePage({
  primaryAction: '新增简历',
  statusTabs: recruitmentResumeTabs,
  searchFields: [input('name', '候选人姓名'), input('phone', '手机号'), select('position', '意向岗位', positions), select('status', '筛选状态', statusOptions(recruitmentResumeTabs)), select('source', '来源', ['线上投递', '内部推荐', '猎头', '校园招聘', '手工添加', '其他'])],
  columns: candidateColumns,
  requiredVisible: ['code', 'name', 'phone', 'status'],
  defaultVisible: ['name', 'phone', 'position', 'source', 'status', 'lastFollowTime', 'owner'],
  formTitle: '简历信息',
  formFields: [input('name', '姓名', { required: true }), input('phone', '手机号'), input('email', '邮箱'), select('source', '来源', ['线上投递', '内部推荐', '猎头', '校园招聘', '手工添加', '其他']), select('position', '意向岗位', positions), upload('resumeFile', '简历附件'), text('remark', '备注')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', notEquals: ['已发起面试'] }, effect: { type: 'openEdit' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该简历？', effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('pass', '通过筛选', { kind: 'primary', visibleWhen: { field: 'status', equals: ['待筛选', '已淘汰'] }, effect: { type: 'setStatus', status: '已通过' } }),
    action('reject', '淘汰候选人', { kind: 'danger', visibleWhen: { field: 'status', equals: ['待筛选', '已通过'] }, confirm: '确认淘汰该候选人？', effect: { type: 'setStatus', status: '已淘汰' } }),
    action('talent', '转入人才库', { visibleWhen: { field: 'status', equals: ['待筛选', '已通过'] }, effect: { type: 'setStatus', status: '已转人才库' } }),
    action('interview', '发起面试', { kind: 'primary', visibleWhen: { field: 'status', equals: ['已通过', '已转人才库'] }, effect: { type: 'setStatus', status: '已发起面试' } }),
  ],
});

const recruitmentTalent = simpleCorePage({
  primaryAction: '新增人才',
  statusTabs: recruitmentTalentTabs,
  searchFields: [input('name', '候选人姓名'), input('phone', '手机号'), input('tags', '标签'), select('position', '意向岗位', positions), f('dateRange', '最近跟进时间', { type: 'dateRange' })],
  columns: candidateColumns,
  requiredVisible: ['code', 'name', 'phone', 'status'],
  defaultVisible: ['name', 'phone', 'position', 'source', 'tags', 'status', 'lastFollower'],
  formTitle: '人才信息',
  formFields: [input('name', '候选人姓名', { required: true }), input('phone', '手机号'), select('position', '意向岗位', positions), input('tags', '标签'), select('status', '跟进状态', statusOptions(recruitmentTalentTabs)), input('lastFollower', '最近跟进人', { readOnly: true }), text('remark', '跟进记录')],
  rowActions: [
    action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该人才记录？', effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('addFollow', '添加跟进', { kind: 'primary', effect: { type: 'message', message: '已添加跟进记录' } }),
    action('follow', '开始跟进', { visibleWhen: { field: 'status', equals: '待跟进' }, effect: { type: 'setStatus', status: '跟进中' } }),
    action('invite', '发起面试', { kind: 'primary', visibleWhen: { field: 'status', equals: '跟进中' }, effect: { type: 'message', message: '已发起面试' } }),
    action('hire', '标记录用', { visibleWhen: { field: 'status', equals: '跟进中' }, effect: { type: 'setStatus', status: '已录用' } }),
    action('pause', '暂不考虑', { visibleWhen: { field: 'status', equals: ['待跟进', '跟进中'] }, effect: { type: 'setStatus', status: '暂不考虑' } }),
    action('eliminate', '淘汰', { kind: 'danger', confirm: '确认淘汰该人才？', visibleWhen: { field: 'status', notEquals: ['已录用', '已淘汰'] }, effect: { type: 'setStatus', status: '已淘汰' } }),
  ],
});

const recruitmentInterview = simpleCorePage({
  primaryAction: '发起面试',
  statusTabs: recruitmentInterviewTabs,
  searchFields: [input('name', '候选人姓名'), select('position', '面试岗位', positions), select('owner', '面试官', employees), select('status', '面试状态', statusOptions(recruitmentInterviewTabs)), f('dateRange', '面试时间', { type: 'dateRange' })],
  columns: [
    idx,
    { title: '面试编号', dataIndex: 'code', width: 130 },
    { title: '候选人', dataIndex: 'name', width: 130 },
    { title: '面试岗位', dataIndex: 'position', width: 140 },
    { title: '面试官', dataIndex: 'owner', width: 120 },
    { title: '面试时间', dataIndex: 'date', width: 130 },
    { title: '面试方式', dataIndex: 'interviewMode', width: 110 },
    { title: '面试结果', dataIndex: 'interviewResult', width: 110 },
    { title: '面试状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'position', 'status'],
  defaultVisible: ['code', 'name', 'position', 'owner', 'date', 'interviewMode', 'interviewResult', 'status'],
  formTitle: '面试安排',
  formFields: [select('candidate', '候选人', employees, { required: true }), select('position', '面试岗位', positions, { required: true }), select('owner', '面试官', employees, { required: true }), date('interviewTime', '面试时间'), select('interviewMode', '面试方式', ['现场', '电话', '视频']), input('interviewPlace', '面试地点/链接'), text('remark', '备注')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: ['待安排', '待面试'] }, effect: { type: 'openEdit' } }),
    action('cancel', '取消', { kind: 'link', visibleWhen: { field: 'status', equals: ['待安排', '待面试'] }, effect: { type: 'setStatus', status: '已取消' } }),
  ],
  detailActions: [
    action('result', '录入结果', { kind: 'primary', visibleWhen: { field: 'status', equals: '待面试' }, effect: { type: 'setStatus', status: '已完成' } }),
    action('offer', '生成Offer', { kind: 'primary', visibleWhen: { field: 'interviewResult', equals: '通过' }, effect: { type: 'message', message: '已生成Offer草稿' } }),
  ],
});

const recruitmentOffer = simpleCorePage({
  primaryAction: '发放Offer',
  statusTabs: recruitmentOfferTabs,
  searchFields: [input('code', 'Offer编号'), input('name', '候选人'), select('position', '岗位', positions), select('status', 'Offer状态', statusOptions(recruitmentOfferTabs)), f('dateRange', '预计入职日期', { type: 'dateRange' })],
  columns: [
    idx,
    { title: 'Offer编号', dataIndex: 'code', width: 130 },
    { title: '候选人', dataIndex: 'name', width: 130 },
    { title: '岗位', dataIndex: 'position', width: 140 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '薪资约定', dataIndex: 'payrollAmount', width: 120, align: 'right', money: true },
    { title: '预计入职日期', dataIndex: 'expectedDate', width: 130 },
    { title: '负责人', dataIndex: 'owner', width: 110 },
    { title: 'Offer状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'position', 'status'],
  defaultVisible: ['code', 'name', 'position', 'department', 'payrollAmount', 'expectedDate', 'status'],
  formTitle: 'Offer信息',
  formFields: [select('candidate', '候选人', employees, { required: true }), select('position', '岗位', positions, { required: true }), select('department', '所属部门', departments, { required: true }), number('payrollAmount', '薪资约定'), date('expectedDate', '预计入职日期', { required: true }), text('materials', '报到材料'), text('remark', '备注')],
  formFooterActions: [
    action('saveDraft', '保存草稿'),
    action('sendOffer', '发放Offer', { kind: 'primary' }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: ['草稿', '已发放'] }, effect: { type: 'openEdit' } }),
  ],
  detailActions: [
    action('send', '发送Offer', { kind: 'primary', visibleWhen: { field: 'status', equals: ['草稿', '已发放'] }, effect: { type: 'setStatus', status: '已发放' } }),
    action('confirm', '确认Offer', { kind: 'primary', visibleWhen: { field: 'status', equals: '已发放' }, effect: { type: 'setStatus', status: '已确认' } }),
    action('reject', '拒绝Offer', { kind: 'danger', confirm: '确认拒绝该 Offer？', visibleWhen: { field: 'status', equals: '已发放' }, effect: { type: 'setStatus', status: '已拒绝' } }),
    action('withdraw', '撤回Offer', { visibleWhen: { field: 'status', equals: ['已发放', '已确认'] }, effect: { type: 'setStatus', status: '已撤回' } }),
    action('onboarding', '转入职', { kind: 'primary', visibleWhen: { field: 'status', equals: '已确认' }, effect: { type: 'setStatus', status: '已转入职' } }),
  ],
});

const onboardingTabs = tabs(['pending', '待入职'], ['joined', '已入职'], ['giveup', '已放弃']);
const onboarding = simpleCorePage({
  primaryAction: '手动添加',
  statusTabs: onboardingTabs,
  searchFields: [input('name', '姓名'), input('phone', '手机号码'), select('department', '所属部门', departments), select('position', '岗位', positions), f('dateRange', '预计入职日期', { type: 'dateRange' }), select('status', '入职状态', statusOptions(onboardingTabs))],
  columns: [
    idx,
    { title: '入职编号', dataIndex: 'code', width: 130 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '手机号码', dataIndex: 'phone', width: 130 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '岗位', dataIndex: 'position', width: 130 },
    { title: '预计入职日期', dataIndex: 'expectedDate', width: 130 },
    { title: '入职状态', dataIndex: 'status', width: 110, status: true },
    { title: '来源', dataIndex: 'source', width: 130 },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'phone', 'department', 'position', 'expectedDate', 'status', 'source'],
  formTitle: '入职信息',
  formFields: [
    input('name', '姓名', { required: true }),
    select('idType', '证件类型', idTypes, { required: true }),
    input('idNo', '证件号', { required: true }),
    input('phone', '手机号码', { required: true }),
    select('department', '所属部门', departments, { required: true }),
    select('position', '岗位', positions, { required: true }),
    select('owner', '直接上级', employees),
    date('expectedDate', '预计入职日期', { required: true }),
    select('onboardingType', '入职类型', onboardingTypes, { required: true }),
    select('employmentType', '用工类型', employmentTypes, { required: true }),
    text('remark', '备注'),
  ],
  detailSections: sections(
    {
      title: '入职基础信息',
      fields: [
        input('code', '入职编号', { readOnly: true }),
        input('name', '姓名', { required: true }),
        select('idType', '证件类型', idTypes, { required: true }),
        input('idNo', '证件号', { required: true }),
        input('phone', '手机号码', { required: true }),
        select('department', '所属部门', departments, { required: true }),
        select('position', '岗位', positions, { required: true }),
        select('owner', '直接上级', employees),
        date('expectedDate', '预计入职日期', { required: true }),
        select('onboardingType', '入职类型', onboardingTypes, { required: true }),
        select('employmentType', '用工类型', employmentTypes, { required: true }),
        select('source', '来源', ['Offer 转入', '手动添加', '导入', '快速入职窗口'], { readOnly: true }),
        text('remark', '备注'),
      ],
    },
    {
      title: '个人信息',
      fields: [
        upload('avatar', '员工头像'),
        select('gender', '性别', ['男', '女', '未知']),
        date('birthDate', '出生日期'),
        input('email', '邮箱'),
        select('nation', '民族', nationOptions),
        select('householdType', '户口类型', ['农业户口', '非农业户口', '居民户口', '其他']),
        input('householdAddress', '户口所在地'),
        input('nativePlace', '籍贯'),
        input('address', '居住地址', { span: 24 }),
        select('education', '最高学历', ['高中及以下', '中专', '大专', '本科', '硕士', '博士', '其他']),
        select('politicalStatus', '政治面貌', ['群众', '共青团员', '中共党员', '民主党派', '其他']),
        select('maritalStatus', '婚姻状况', ['未婚', '已婚', '离异', '丧偶', '其他']),
        select('bloodType', '血型', ['A型', 'B型', 'AB型', 'O型', '其他', '未知']),
        input('emergencyContact', '紧急联系人'),
        input('emergencyPhone', '紧急联系人电话'),
        input('wechat', '微信'),
        input('qq', 'QQ'),
        input('bankName', '工资卡开户银行'),
        input('bankBranch', '工资卡开户支行'),
        input('bankAccount', '工资卡银行账号'),
        input('bankAccountName', '工资卡开户名'),
      ],
    },
    {
      title: '附件存档',
      fields: [select('attachmentType', '附件类型', ['身份证', '学历证明', '合同附件', '证书', '其他']), upload('files', '附件文件'), input('attachmentRemark', '备注')],
    },
    {
      title: '登记二维码',
      fields: [input('registerQr', '个人登记二维码', { readOnly: true }), input('qrExpireTime', '二维码有效期', { readOnly: true })],
    },
    {
      title: '确认记录',
      fields: [
        select('personalInfoStatus', '个人信息完善状态', ['未完善', '部分完善', '已完善'], { readOnly: true }),
        select('personalConfirmStatus', '个人信息确认状态', ['待确认', '已确认', '需补充'], { readOnly: true }),
        input('confirmUser', '确认人', { readOnly: true }),
        input('confirmTime', '确认时间', { readOnly: true }),
        text('supplementRemark', '需补充说明'),
      ],
    },
  ),
  formFooterActions: [
    action('save', '保存'),
  ],
  pageActions: [
    action('create', '手动添加', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('quickOnboarding', '快速入职', { effect: { type: 'openQuickOnboarding' } }),
    action('import', '导入', { effect: { type: 'message', message: '入职记录导入校验任务已创建' } }),
    action('export', '导出', { effect: { type: 'message', message: '入职记录导出任务已创建' } }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '待入职' }, effect: { type: 'openEdit' } }),
    action('confirm', '确认入职', { kind: 'link', visibleWhen: { field: 'status', equals: '待入职' }, effect: { type: 'setStatus', status: '已入职' } }),
    action('giveup', '放弃入职', { kind: 'link', visibleWhen: { field: 'status', equals: '待入职' }, effect: { type: 'setStatus', status: '已放弃' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该入职记录？', visibleWhen: { field: 'status', equals: ['待入职', '已放弃'] }, effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('sendRegister', '发送登记表', { kind: 'primary', visibleWhen: { field: 'status', equals: '待入职' }, effect: { type: 'openRegisterQr' } }),
    action('downloadQr', '下载个人登记二维码', { visibleWhen: { field: 'status', equals: '待入职' }, effect: { type: 'message', message: '个人登记二维码已下载' } }),
    action('changeDate', '修改预计入职日期', { visibleWhen: { field: 'status', equals: '待入职' }, effect: { type: 'openEdit' } }),
    action('rejoin', '重新入职', { kind: 'primary', visibleWhen: { field: 'status', equals: '已放弃' }, effect: { type: 'setStatus', status: '待入职' } }),
  ],
});

const regularizationTabs = tabs(['pending', '待转正', ['待转正', '审批中']], ['done', '已转正']);
const regularization = simpleCorePage({
  primaryAction: '转正办理',
  approvalFlow: true,
  statusTabs: regularizationTabs,
  searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('department', '所属部门', departments), select('position', '岗位', positions), f('dateRange', '预计转正日期', { type: 'dateRange' }), select('status', '状态', statusOptions(regularizationTabs)), select('flowStatus', '流程状态', flowStatuses)],
  columns: [
    idx,
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '岗位', dataIndex: 'position', width: 130 },
    { title: '试用期开始', dataIndex: 'probationStartDate', width: 120 },
    { title: '预计转正日期', dataIndex: 'expectedRegularDate', width: 130 },
    { title: '实际转正日期', dataIndex: 'actualRegularDate', width: 130 },
    { title: '状态', dataIndex: 'status', width: 110, status: true },
    { title: '流程状态', dataIndex: 'flowStatus', width: 110, status: true },
  ],
  requiredVisible: ['employeeNo', 'name', 'status'],
  defaultVisible: ['employeeNo', 'name', 'department', 'position', 'probationStartDate', 'expectedRegularDate', 'actualRegularDate', 'status', 'flowStatus'],
  formTitle: '转正办理',
  formFields: [
    input('code', '转正编号', { required: true, readOnly: true }),
    input('employeeNo', '工号', { required: true, readOnly: true }),
    input('name', '员工姓名', { required: true, readOnly: true }),
    select('department', '所属部门', departments, { required: true, readOnly: true }),
    select('position', '岗位', positions, { required: true, readOnly: true }),
    date('probationStartDate', '试用期开始', { required: true, readOnly: true }),
    date('expectedRegularDate', '预计转正日期', { required: true }),
    date('actualRegularDate', '实际转正日期'),
    radio('regularizationMode', '转正方式', ['手动办理', '审批办理'], { required: true }),
    select('status', '状态', statusOptions(regularizationTabs), { required: true, readOnly: true }),
    select('flowStatus', '流程状态', flowStatuses, { readOnly: true }),
    text('regularizationComment', '转正评价'),
    text('cancelReason', '取消原因'),
  ],
  pageActions: [action('create', '转正办理', { kind: 'primary', effect: { type: 'openCreate' } })],
  formFooterActions: [action('save', '保存'), action('submitApproval', '发起审批', { kind: 'primary' })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '待转正' }, effect: { type: 'openEdit' } }),
    action('submit', '提交', { kind: 'link', visibleWhen: { field: 'status', equals: '待转正' }, effect: { type: 'setField', field: 'flowStatus', value: '审批中' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该转正记录？', visibleWhen: { field: 'status', equals: '待转正' }, effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('changeDate', '修改转正日期', { visibleWhen: { field: 'status', equals: '待转正' }, effect: { type: 'openEdit' } }),
    action('manual', '手动办理转正', { kind: 'primary', visibleWhen: { field: 'status', equals: '待转正' }, effect: { type: 'setStatus', status: '已转正' } }),
    action('cancel', '取消转正', { kind: 'danger', confirm: '确认取消该转正记录？', visibleWhen: { field: 'status', equals: '已转正' }, effect: { type: 'setStatus', status: '已取消' } }),
  ],
});

const transferTabs = tabs(['pending', '待调动', ['待调动', '审批中', '待生效']], ['done', '已调动'], ['giveup', '已放弃']);
const transfer = simpleCorePage({
  primaryAction: '新增调动',
  approvalFlow: true,
  statusTabs: transferTabs,
  searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('oldDepartment', '调出部门', departments), select('newDepartment', '调入部门', departments), f('dateRange', '生效日期', { type: 'dateRange' }), select('status', '调动状态', statusOptions(transferTabs)), select('flowStatus', '流程状态', flowStatuses)],
  columns: [
    idx,
    { title: '调动编号', dataIndex: 'code', width: 130 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '调出部门/岗位', dataIndex: 'oldOrgPosition', width: 180 },
    { title: '调入部门/岗位', dataIndex: 'newOrgPosition', width: 180 },
    { title: '生效日期', dataIndex: 'effectiveDate', width: 120 },
    { title: '调动状态', dataIndex: 'status', width: 110, status: true },
    { title: '流程状态', dataIndex: 'flowStatus', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'employeeNo', 'name', 'oldOrgPosition', 'newOrgPosition', 'effectiveDate', 'status', 'flowStatus'],
  formTitle: '人员调动',
  formFields: [
    input('code', '调动编号', { required: true, readOnly: true }),
    select('employee', '员工', employees, { required: true }),
    input('employeeNo', '工号', { required: true, readOnly: true }),
    select('oldDepartment', '调出部门', departments, { required: true, readOnly: true }),
    select('oldPosition', '调出岗位', positions, { required: true, readOnly: true }),
    select('oldLeader', '调出直接上级', employees, { readOnly: true }),
    select('newDepartment', '调入部门', departments, { required: true }),
    select('newPosition', '调入岗位', positions, { required: true }),
    select('newLeader', '调入直接上级', employees),
    date('effectiveDate', '生效日期', { required: true }),
    select('transferMode', '调动方式', ['手动办理', '审批办理'], { required: true }),
    select('status', '调动状态', statusOptions(transferTabs), { required: true, readOnly: true }),
    select('flowStatus', '流程状态', flowStatuses, { readOnly: true }),
    text('transferReason', '调动原因', { required: true }),
    text('giveupReason', '放弃原因'),
  ],
  pageActions: [action('create', '新增调动', { kind: 'primary', effect: { type: 'openCreate' } })],
  formFooterActions: [action('save', '保存'), action('submitApproval', '发起审批', { kind: 'primary' })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '待调动' }, effect: { type: 'openEdit' } }),
    action('submit', '提交', { kind: 'link', visibleWhen: { field: 'status', equals: '待调动' }, effect: { type: 'setField', field: 'flowStatus', value: '审批中' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该已放弃调动记录？', visibleWhen: { field: 'status', equals: '已放弃' }, effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('manual', '手动办理调动', { kind: 'primary', visibleWhen: { field: 'status', equals: '待调动' }, effect: { type: 'setStatus', status: '已调动' } }),
    action('giveup', '放弃调动', { kind: 'danger', confirm: '确认放弃该调动？', visibleWhen: { field: 'status', equals: ['待调动', '审批中'] }, effect: { type: 'setStatus', status: '已放弃' } }),
  ],
});

const resignationTabs = tabs(['pending', '待离职'], ['done', '已离职'], ['giveup', '已放弃']);
const resignation = simpleCorePage({
  primaryAction: '新增离职',
  approvalFlow: true,
  statusTabs: resignationTabs,
  searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('department', '所属部门', departments), select('position', '岗位', positions), f('dateRange', '最后工作日', { type: 'dateRange' }), select('status', '离职状态', statusOptions(resignationTabs)), select('flowStatus', '流程状态', flowStatuses)],
  columns: [
    idx,
    { title: '离职编号', dataIndex: 'code', width: 130 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '岗位', dataIndex: 'position', width: 130 },
    { title: '离职原因', dataIndex: 'resignationReason', width: 150 },
    { title: '最后工作日', dataIndex: 'lastWorkDate', width: 120 },
    { title: '交接状态', dataIndex: 'handoverStatus', width: 110 },
    { title: '离职状态', dataIndex: 'status', width: 110, status: true },
    { title: '流程状态', dataIndex: 'flowStatus', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'employeeNo', 'name', 'department', 'position', 'resignationReason', 'lastWorkDate', 'handoverStatus', 'status', 'flowStatus'],
  formTitle: '离职办理',
  formFields: [
    input('code', '离职编号', { required: true, readOnly: true }),
    select('employee', '员工', employees, { required: true }),
    input('employeeNo', '工号', { required: true, readOnly: true }),
    select('department', '所属部门', departments, { required: true, readOnly: true }),
    select('position', '岗位', positions, { required: true, readOnly: true }),
    select('resignationType', '离职类型', ['主动离职', '协商解除', '辞退', '合同到期不续签', '退休', '其他'], { required: true }),
    input('resignationReason', '离职原因', { required: true }),
    date('lastWorkDate', '最后工作日', { required: true }),
    select('handoverPerson', '交接人', employees),
    select('handoverStatus', '交接状态', ['未交接', '交接中', '已交接', '不需要'], { required: true }),
    select('resignationMode', '离职方式', ['手动办理', '审批办理'], { required: true }),
    select('status', '离职状态', statusOptions(resignationTabs), { required: true, readOnly: true }),
    select('flowStatus', '流程状态', flowStatuses, { readOnly: true }),
    text('handoverNote', '交接说明'),
    text('giveupReason', '放弃原因'),
  ],
  pageActions: [action('create', '新增离职', { kind: 'primary', effect: { type: 'openCreate' } })],
  formFooterActions: [action('save', '保存'), action('submitApproval', '发起审批', { kind: 'primary' })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '待离职' }, effect: { type: 'openEdit' } }),
    action('submit', '提交', { kind: 'link', visibleWhen: { field: 'status', equals: '待离职' }, effect: { type: 'setField', field: 'flowStatus', value: '审批中' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该已放弃离职记录？', visibleWhen: { field: 'status', equals: '已放弃' }, effect: { type: 'delete' } }),
  ],
  detailActions: [
    action('manual', '手动办理离职', { kind: 'primary', visibleWhen: { field: 'status', equals: '待离职' }, effect: { type: 'setStatus', status: '已离职' } }),
    action('giveup', '放弃离职', { kind: 'danger', confirm: '确认放弃该离职？', visibleWhen: { field: 'status', equals: '待离职' }, effect: { type: 'setStatus', status: '已放弃' } }),
  ],
});

const attendanceApplyTabs = tabs(['draft', '草稿'], ['approving', '审批中'], ['approved', '已通过'], ['withdrawn', '已撤回']);
const attendanceApplyColumns: ColumnConfig[] = [
  idx,
  { title: '申请编号', dataIndex: 'code', width: 130 },
  { title: '工号', dataIndex: 'employeeNo', width: 120 },
  { title: '申请人', dataIndex: 'name', width: 120 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '开始时间', dataIndex: 'startDate', width: 130 },
  { title: '结束时间', dataIndex: 'endDate', width: 130 },
  { title: '时长', dataIndex: 'duration', width: 90, align: 'right' },
  { title: '审批状态', dataIndex: 'status', width: 110, status: true },
  { title: '当前处理人', dataIndex: 'owner', width: 120 },
];

const attendanceApplyProfile = (type: string) => {
  if (type === '补卡') {
    return {
      dateLabel: '缺卡日期',
      columns: [
        idx,
        { title: '申请编号', dataIndex: 'code', width: 130 },
        { title: '工号', dataIndex: 'employeeNo', width: 120 },
        { title: '员工姓名', dataIndex: 'name', width: 120 },
        { title: '所属部门', dataIndex: 'department', width: 140 },
        { title: '缺卡日期', dataIndex: 'repairDate', width: 120 },
        { title: '补卡时间', dataIndex: 'repairTime', width: 120 },
        { title: '补卡原因', dataIndex: 'reason', width: 180 },
        { title: '审批状态', dataIndex: 'status', width: 110, status: true },
        { title: '提交时间', dataIndex: 'submitTime', width: 150 },
      ] as ColumnConfig[],
      formFields: [select('employee', '员工', employees, { required: true }), date('repairDate', '缺卡日期', { required: true }), f('repairTime', '补卡时间', { type: 'time', required: true }), select('repairType', '补卡类型', ['缺卡', '迟到', '早退', '正常'], { required: true }), text('reason', '补卡原因', { required: true }), upload('files', '附件')],
    };
  }
  if (type === '请假') {
    return {
      dateLabel: '开始时间',
      columns: [
        idx,
        { title: '申请编号', dataIndex: 'code', width: 130 },
        { title: '工号', dataIndex: 'employeeNo', width: 120 },
        { title: '员工姓名', dataIndex: 'name', width: 120 },
        { title: '所属部门', dataIndex: 'department', width: 140 },
        { title: '假期类型', dataIndex: 'leaveType', width: 110 },
        { title: '开始时间', dataIndex: 'startDate', width: 130 },
        { title: '结束时间', dataIndex: 'endDate', width: 130 },
        { title: '请假时长', dataIndex: 'duration', width: 100, align: 'right' },
        { title: '审批状态', dataIndex: 'status', width: 110, status: true },
        { title: '提交时间', dataIndex: 'submitTime', width: 150 },
      ] as ColumnConfig[],
      formFields: [select('employee', '员工', employees, { required: true }), select('leaveType', '假期类型', ['年假', '事假', '病假', '调休假', '婚假', '产假'], { required: true }), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('duration', '请假时长'), text('reason', '事由', { required: true }), upload('files', '附件')],
    };
  }
  if (type === '加班') {
    return {
      dateLabel: '加班日期',
      columns: [
        idx,
        { title: '申请编号', dataIndex: 'code', width: 130 },
        { title: '工号', dataIndex: 'employeeNo', width: 120 },
        { title: '员工姓名', dataIndex: 'name', width: 120 },
        { title: '所属部门', dataIndex: 'department', width: 140 },
        { title: '加班日期', dataIndex: 'overtimeDate', width: 120 },
        { title: '日期类型', dataIndex: 'dateType', width: 100 },
        { title: '开始时间', dataIndex: 'startDate', width: 130 },
        { title: '结束时间', dataIndex: 'endDate', width: 130 },
        { title: '加班时长', dataIndex: 'duration', width: 100, align: 'right' },
        { title: '补偿方式', dataIndex: 'compensationType', width: 110 },
        { title: '审批状态', dataIndex: 'status', width: 110, status: true },
        { title: '提交时间', dataIndex: 'submitTime', width: 150 },
      ] as ColumnConfig[],
      formFields: [select('employee', '员工', employees, { required: true }), date('overtimeDate', '加班日期', { required: true }), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('duration', '加班时长'), select('compensationType', '补偿方式', ['调休', '加班费', '无补偿'], { required: true }), text('reason', '事由', { required: true })],
    };
  }
  if (type === '外出') {
    return {
      dateLabel: '外出时间',
      columns: [
        idx,
        { title: '申请编号', dataIndex: 'code', width: 130 },
        { title: '工号', dataIndex: 'employeeNo', width: 120 },
        { title: '员工姓名', dataIndex: 'name', width: 120 },
        { title: '所属部门', dataIndex: 'department', width: 140 },
        { title: '外出地点', dataIndex: 'destination', width: 140 },
        { title: '开始时间', dataIndex: 'startDate', width: 130 },
        { title: '结束时间', dataIndex: 'endDate', width: 130 },
        { title: '外出时长', dataIndex: 'duration', width: 100, align: 'right' },
        { title: '审批状态', dataIndex: 'status', width: 110, status: true },
        { title: '提交时间', dataIndex: 'submitTime', width: 150 },
      ] as ColumnConfig[],
      formFields: [select('employee', '员工', employees, { required: true }), input('destination', '外出地点', { required: true }), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('duration', '外出时长'), text('reason', '事由', { required: true })],
    };
  }
  return {
    dateLabel: '出差时间',
    columns: [
      idx,
      { title: '申请编号', dataIndex: 'code', width: 130 },
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '员工姓名', dataIndex: 'name', width: 120 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '出差地点', dataIndex: 'destination', width: 140 },
      { title: '开始时间', dataIndex: 'startDate', width: 130 },
      { title: '结束时间', dataIndex: 'endDate', width: 130 },
      { title: '出差天数', dataIndex: 'duration', width: 100, align: 'right' },
      { title: '交通方式', dataIndex: 'transportation', width: 110 },
      { title: '审批状态', dataIndex: 'status', width: 110, status: true },
      { title: '提交时间', dataIndex: 'submitTime', width: 150 },
    ] as ColumnConfig[],
    formFields: [select('employee', '员工', employees, { required: true }), input('destination', '出差地点', { required: true }), date('startDate', '开始时间', { required: true }), date('endDate', '结束时间', { required: true }), number('duration', '出差天数'), select('transportation', '交通方式', ['飞机', '高铁', '火车', '汽车', '自驾', '其他']), text('reason', '事由', { required: true })],
  };
};

const attendanceApplyPage = (type: string): PageConfig => {
  const profile = attendanceApplyProfile(type);
  return simpleCorePage({
    primaryAction: `发起${type}`,
    approvalFlow: true,
    statusTabs: attendanceApplyTabs,
    searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('department', '所属部门', departments), f('dateRange', profile.dateLabel, { type: 'dateRange' }), select('status', '审批状态', statusOptions(attendanceApplyTabs))],
    columns: profile.columns,
    requiredVisible: ['code', 'name', 'status'],
    defaultVisible: profile.columns.filter((column) => column.dataIndex !== 'index').map((column) => String(column.dataIndex)),
    formTitle: `${type}申请`,
    formFields: profile.formFields,
    formFooterActions: approvalFormFooterActions,
    rowActions: [
      action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
      action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'openEdit' } }),
      action('submit', '提交', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '审批中' } }),
      action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: ['草稿', '审批中'] }, effect: { type: 'setStatus', status: '已撤回' } }),
      action('delete', '删除', { kind: 'danger', confirm: '确认删除该申请？', visibleWhen: { field: 'status', equals: ['草稿', '已撤回'] }, effect: { type: 'delete' } }),
    ],
  });
};

const attendanceConfigTabs = tabs(['enabled', '启用'], ['disabled', '停用']);
const attendanceConfigColumns: ColumnConfig[] = [
  idx,
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', dataIndex: 'name', width: 180 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '负责人', dataIndex: 'owner', width: 120 },
  { title: '适用人数', dataIndex: 'headcount', width: 100, align: 'right' },
  { title: '状态', dataIndex: 'status', width: 100, status: true },
  { title: '更新时间', dataIndex: 'date', width: 130 },
  { title: '备注', dataIndex: 'remark', width: 180 },
];

const attendanceConfigPage = (
  primaryAction: string,
  formTitle: string,
  extraFields: FieldConfig[] = [],
  extraOptions: Partial<SimplePageOptions> = {},
): PageConfig =>
  simpleCorePage({
    primaryAction,
    statusTabs: attendanceConfigTabs,
    searchFields: [input('code', '编号'), input('name', '名称'), select('department', '所属部门', departments), select('status', '状态', statusOptions(attendanceConfigTabs))],
    columns: attendanceConfigColumns,
    requiredVisible: ['code', 'name', 'status'],
    defaultVisible: ['code', 'name', 'department', 'owner', 'headcount', 'status', 'date'],
    formTitle,
    formFields: [input('code', '编号', { required: true }), input('name', '名称', { required: true }), select('department', '所属部门', departments), select('owner', '负责人', employees), number('headcount', '适用人数'), select('status', '状态', statusOptions(attendanceConfigTabs), { required: true }), ...extraFields, text('remark', '说明')],
    rowActions: enableDisableRows,
    ...extraOptions,
  });

const attendanceGroup = attendanceConfigPage('新增考勤组', '考勤组信息', [
  select('attendanceType', '考勤类型', ['固定班制', '排班制', '自由工时']),
  select('clockMode', '打卡方式', ['考勤机', '移动打卡', '无需打卡']),
], {
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该考勤组？', effect: { type: 'delete' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
    action('maintainMembers', '维护人员', { kind: 'link', effect: { type: 'message', message: '已打开考勤组人员维护' } }),
  ],
});
const attendanceShift = attendanceConfigPage('新增班次', '班次信息', [
  input('startTime', '上班时间'),
  input('endTime', '下班时间'),
  input('restTime', '休息时间'),
  select('flexibleClock', '弹性打卡', ['是', '否']),
], {
  pageActions: [
    action('create', '新增班次', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('export', '导出', { effect: { type: 'message', message: '班次导出任务已创建' } }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('copy', '复制', { kind: 'link', effect: { type: 'message', message: '已复制班次' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该班次？', effect: { type: 'delete' } }),
  ],
});
const attendanceSchedule = attendanceConfigPage('新增排班', '排班信息', [
  month('month', '排班月份'),
  select('shift', '考勤班次', ['白班', '夜班', '两班倒']),
  select('cycleType', '排班周期', ['按周', '按月', '自定义']),
], {
  pageActions: [
    action('shiftAppearance', '班次外观', { effect: { type: 'message', message: '已打开班次外观设置' } }),
    action('attendanceShift', '考勤班次', { effect: { type: 'message', message: '已打开考勤班次维护' } }),
    action('scheduleCycle', '排班周期', { effect: { type: 'message', message: '已打开排班周期设置' } }),
    action('scheduleSetting', '排班设置', { effect: { type: 'message', message: '已打开排班设置' } }),
    action('restDays', '预置休息日', { effect: { type: 'message', message: '已打开预置休息日设置' } }),
    action('excelImport', 'Excel批量排班', { kind: 'primary', effect: { type: 'message', message: '已打开 Excel 批量排班' } }),
    action('export', '导出记录', { effect: { type: 'message', message: '排班导出任务已创建' } }),
    action('headcountStat', '班次人数统计', { effect: { type: 'message', message: '已打开班次人数统计' } }),
  ],
});
const attendanceRule = attendanceConfigPage('新增规则', '考勤规则', [
  number('lateMinutes', '迟到容许分钟'),
  number('earlyMinutes', '早退容许分钟'),
  number('missingCardLimit', '缺卡限制次数'),
  select('overtimeRule', '加班规则', ['审批后计入', '打卡自动计入', '不计入']),
], {
  pageActions: [
    action('create', '新增规则', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('export', '导出', { effect: { type: 'message', message: '考勤规则导出任务已创建' } }),
  ],
  rowActions: copyEnableDisableRows,
});
const attendanceHoliday = attendanceConfigPage('新增假期', '假期信息', [
  select('holidayType', '假期类型', ['法定假', '企业假', '年假', '调休']),
  date('startDate', '开始日期'),
  date('endDate', '结束日期'),
  number('days', '假期天数'),
], {
  pageActions: [
    action('create', '新增假期', { kind: 'primary', effect: { type: 'openCreate' } }),
    action('generateBalance', '批量生成余额', { effect: { type: 'message', message: '假期余额生成任务已创建' } }),
    action('exportBalance', '导出余额', { effect: { type: 'message', message: '假期余额导出任务已创建' } }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
    action('disable', '停用', { kind: 'link', visibleWhen: { field: 'status', equals: '启用' }, effect: { type: 'setStatus', status: '停用' } }),
    action('enable', '启用', { kind: 'link', visibleWhen: { field: 'status', equals: '停用' }, effect: { type: 'setStatus', status: '启用' } }),
    action('adjustBalance', '调整余额', { kind: 'link', effect: { type: 'message', message: '已打开余额调整' } }),
    action('balanceLog', '查看余额日志', { kind: 'link', effect: { type: 'message', message: '已打开余额日志' } }),
  ],
});

const clockRecordTabs = tabs(['normal', '正常'], ['late', '迟到'], ['early', '早退'], ['missing', '缺卡'], ['field', '外勤'], ['abnormal', '异常']);
const clockRecord = simpleCorePage({
  primaryAction: '新增打卡记录',
  statusTabs: clockRecordTabs,
  searchFields: [date('clockDate', '打卡日期'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '打卡状态', statusOptions(clockRecordTabs))],
  columns: [
    idx,
    { title: '打卡编号', dataIndex: 'code', width: 130 },
    { title: '打卡日期', dataIndex: 'date', width: 120 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '打卡时间', dataIndex: 'startTime', width: 120 },
    { title: '打卡地点', dataIndex: 'workLocation', width: 130 },
    { title: '打卡方式', dataIndex: 'clockMode', width: 120 },
    { title: '打卡状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'employeeNo', 'name', 'status'],
  defaultVisible: ['code', 'date', 'employeeNo', 'name', 'department', 'startTime', 'workLocation', 'clockMode', 'status'],
  formTitle: '打卡记录',
  formFields: [input('code', '打卡编号', { required: true }), select('employee', '员工', employees, { required: true }), date('clockDate', '打卡日期', { required: true }), f('clockTime', '打卡时间', { type: 'time', required: true }), select('clockType', '打卡类型', ['上班卡', '下班卡']), select('clockMode', '打卡方式', ['考勤机', '移动打卡', '导入']), input('workLocation', '打卡地点'), select('status', '打卡状态', statusOptions(clockRecordTabs))],
  pageActions: [action('export', '导出', { kind: 'primary', effect: { type: 'message', message: '打卡记录导出任务已创建' } })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('fix', '修正', { kind: 'link', effect: { type: 'openEdit' } }),
  ],
});

const dailyStatTabs = tabs(['pending', '待计算'], ['calculated', '已计算'], ['updated', '已更新'], ['error', '计算异常'], ['locked', '已锁定']);
const dailyStat = simpleCorePage({
  primaryAction: '触发补算',
  statusTabs: dailyStatTabs,
  searchFields: [date('statDate', '统计日期'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '结果状态', statusOptions(dailyStatTabs))],
  columns: [
    idx,
    { title: '统计日期', dataIndex: 'date', width: 120 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '班次', dataIndex: 'shift', width: 110 },
    { title: '出勤时长', dataIndex: 'actualDays', width: 100, align: 'right' },
    { title: '异常类型', dataIndex: 'attendanceType', width: 120 },
    { title: '结果状态', dataIndex: 'status', width: 110, status: true },
    { title: '最后计算时间', dataIndex: 'endTime', width: 130 },
  ],
  requiredVisible: ['employeeNo', 'name', 'status'],
  defaultVisible: ['date', 'employeeNo', 'name', 'department', 'shift', 'actualDays', 'attendanceType', 'status', 'endTime'],
  formTitle: '日考勤统计条件',
  formFields: [date('statDate', '统计日期', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees), select('status', '结果状态', statusOptions(dailyStatTabs))],
  pageActions: [action('calculate', '触发补算', { kind: 'primary', effect: { type: 'message', message: '日考勤补算任务已创建' } }), action('recalculate', '重算', { effect: { type: 'message', message: '日考勤重算任务已创建' } }), action('export', '导出', { effect: { type: 'message', message: '日考勤导出任务已创建' } })],
  rowActions: [
    action('view', '查看明细', { kind: 'link', effect: { type: 'openDetail' } }),
    action('recalculate', '触发重算任务', { kind: 'link', visibleWhen: { field: 'status', notEquals: '已锁定' }, effect: { type: 'message', message: '日考勤重算任务已创建' } }),
  ],
});

const monthlyStatTabs = tabs(['pending', '未生成'], ['generated', '已生成'], ['confirmed', '已确认'], ['locked', '已锁定']);
const monthlyStat = simpleCorePage({
  primaryAction: '生成月报',
  statusTabs: monthlyStatTabs,
  searchFields: [month('month', '月份'), input('employeeNo', '工号'), input('name', '姓名'), select('department', '所属部门', departments), select('status', '状态', statusOptions(monthlyStatTabs))],
  columns: [
    idx,
    { title: '月份', dataIndex: 'month', width: 100 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 110 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '应出勤天数', dataIndex: 'requiredDays', width: 110, align: 'right' },
    { title: '实出勤天数', dataIndex: 'actualDays', width: 110, align: 'right' },
    { title: '迟到次数', dataIndex: 'lateCount', width: 100, align: 'right' },
    { title: '早退次数', dataIndex: 'earlyCount', width: 100, align: 'right' },
    { title: '缺卡次数', dataIndex: 'missingCount', width: 100, align: 'right' },
    { title: '请假时长', dataIndex: 'leaveHours', width: 100, align: 'right' },
    { title: '加班时长', dataIndex: 'overtimeHours', width: 100, align: 'right' },
    { title: '状态', dataIndex: 'status', width: 100, status: true },
  ],
  requiredVisible: ['month', 'employeeNo', 'name', 'status'],
  defaultVisible: ['month', 'employeeNo', 'name', 'department', 'requiredDays', 'actualDays', 'lateCount', 'earlyCount', 'missingCount', 'leaveHours', 'overtimeHours', 'status'],
  formTitle: '月考勤统计条件',
  formFields: [month('month', '月份', { required: true }), select('department', '所属部门', departments), select('employee', '员工', employees), select('status', '状态', statusOptions(monthlyStatTabs))],
  pageActions: [action('generate', '生成', { kind: 'primary', effect: { type: 'message', message: '月考勤生成任务已创建' } }), action('confirm', '确认', { requiresSelection: true, effect: { type: 'setStatus', status: '已确认' } }), action('lock', '锁定', { requiresSelection: true, effect: { type: 'setStatus', status: '已锁定' } }), action('unlock', '解锁', { requiresSelection: true, effect: { type: 'setStatus', status: '已确认' } }), action('export', '导出', { effect: { type: 'message', message: '月考勤导出任务已创建' } })],
  rowActions: [
    action('view', '查看明细', { kind: 'link', effect: { type: 'openDetail' } }),
    action('confirm', '确认', { kind: 'link', visibleWhen: { field: 'status', equals: '已生成' }, effect: { type: 'setStatus', status: '已确认' } }),
    action('lock', '锁定', { kind: 'link', visibleWhen: { field: 'status', equals: '已确认' }, effect: { type: 'setStatus', status: '已锁定' } }),
    action('unlock', '解锁', { kind: 'link', visibleWhen: { field: 'status', equals: '已锁定' }, effect: { type: 'setStatus', status: '已确认' } }),
  ],
});

const performancePlanTabs = tabs(['draft', '草稿'], ['published', '已发布'], ['scoring', '评分中'], ['reviewing', '审核中'], ['confirmed', '已确认'], ['closed', '已关闭'], ['terminated', '已终止']);
const performanceProgressTabs = tabs(['pending', '待评分'], ['scoring', '评分中'], ['reviewing', '待审核'], ['returned', '已退回'], ['confirming', '待确认'], ['confirmed', '已确认'], ['terminated', '已终止']);
const performanceEnabledTabs = tabs(['enabled', '启用'], ['disabled', '停用']);
const performanceColumns: ColumnConfig[] = [
  idx,
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', dataIndex: 'name', width: 180 },
  { title: '所属部门', dataIndex: 'department', width: 140 },
  { title: '负责人', dataIndex: 'owner', width: 120 },
  { title: '周期/月度', dataIndex: 'month', width: 110 },
  { title: '状态', dataIndex: 'status', width: 110, status: true },
  { title: '更新时间', dataIndex: 'date', width: 130 },
];

const performancePlan = simpleCorePage({
  primaryAction: '新增考核计划',
  statusTabs: performancePlanTabs,
  searchFields: [input('code', '计划编号'), input('name', '计划名称'), month('month', '考核周期'), select('department', '考核范围', departments), select('status', '计划状态', statusOptions(performancePlanTabs))],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'department', 'owner', 'month', 'status', 'date'],
  formTitle: '考核计划',
  formFields: [input('code', '计划编号', { required: true }), input('name', '计划名称', { required: true }), month('month', '考核周期', { required: true }), select('department', '考核范围', departments), select('template', '考核模板', ['岗位模板', '部门模板', '通用模板']), date('startDate', '开始日期'), date('endDate', '结束日期'), select('owner', '负责人', employees), select('status', '计划状态', statusOptions(performancePlanTabs)), text('remark', '考核说明')],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'openEdit' } }),
    action('delete', '删除', { kind: 'danger', confirm: '确认删除该考核计划？', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'delete' } }),
    action('start', '发起考核', { kind: 'link', visibleWhen: { field: 'status', equals: '已发布' }, effect: { type: 'setStatus', status: '评分中' } }),
    action('progress', '查看进度', { kind: 'link', effect: { type: 'openDetail' } }),
  ],
  detailActions: [
    action('publish', '发布计划', { kind: 'primary', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '已发布' } }),
    action('review', '提交审核', { visibleWhen: { field: 'status', equals: '评分中' }, effect: { type: 'setStatus', status: '审核中' } }),
    action('confirm', '确认计划', { kind: 'primary', visibleWhen: { field: 'status', equals: '审核中' }, effect: { type: 'setStatus', status: '已确认' } }),
    action('close', '关闭计划', { visibleWhen: { field: 'status', equals: '已确认' }, effect: { type: 'setStatus', status: '已关闭' } }),
    action('terminate', '终止计划', { kind: 'danger', confirm: '确认终止该考核计划？', visibleWhen: { field: 'status', notEquals: ['已关闭', '已终止'] }, effect: { type: 'setStatus', status: '已终止' } }),
  ],
});

const performanceProgress = simpleCorePage({
  primaryAction: '批量提醒',
  statusTabs: performanceProgressTabs,
  searchFields: [input('employeeNo', '工号'), input('name', '员工姓名'), select('department', '所属部门', departments), select('status', '考核状态', statusOptions(performanceProgressTabs))],
  columns: [
    idx,
    { title: '任务编号', dataIndex: 'code', width: 130 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '员工姓名', dataIndex: 'name', width: 120 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '考核计划', dataIndex: 'businessType', width: 150 },
    { title: '评分人', dataIndex: 'owner', width: 110 },
    { title: '评分', dataIndex: 'score', width: 90, align: 'right' },
    { title: '考核状态', dataIndex: 'status', width: 110, status: true },
  ],
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'employeeNo', 'name', 'department', 'businessType', 'owner', 'score', 'status'],
  formTitle: '考核进度',
  formFields: [select('plan', '考核计划', ['2026半年度考核', '月度绩效']), select('employee', '被考核人', employees), select('reviewer', '评分人', employees), number('score', '评分'), select('status', '考核状态', statusOptions(performanceProgressTabs)), text('comment', '评价意见'), upload('files', '评分附件')],
  rowActions: [
    action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
    action('score', '评分', { kind: 'link', visibleWhen: { field: 'status', equals: '待评分' }, effect: { type: 'setStatus', status: '评分中' } }),
    action('submit', '提交审核', { kind: 'link', visibleWhen: { field: 'status', equals: '评分中' }, effect: { type: 'setStatus', status: '待审核' } }),
    action('return', '退回', { kind: 'link', visibleWhen: { field: 'status', equals: '待审核' }, effect: { type: 'setStatus', status: '已退回' } }),
    action('rescore', '重新评分', { kind: 'link', visibleWhen: { field: 'status', equals: '已退回' }, effect: { type: 'setStatus', status: '评分中' } }),
    action('approve', '审核通过', { kind: 'link', visibleWhen: { field: 'status', equals: '待审核' }, effect: { type: 'setStatus', status: '待确认' } }),
    action('confirm', '确认结果', { kind: 'link', visibleWhen: { field: 'status', equals: '待确认' }, effect: { type: 'setStatus', status: '已确认' } }),
  ],
  detailActions: [
    action('terminate', '终止考核', { kind: 'danger', confirm: '确认终止该考核任务？', visibleWhen: { field: 'status', notEquals: ['已确认', '已终止'] }, effect: { type: 'setStatus', status: '已终止' } }),
  ],
});

const performanceTemplate = simpleCorePage({
  primaryAction: '新增模板',
  statusTabs: performanceEnabledTabs,
  searchFields: [input('name', '模板名称'), select('templateType', '模板类型', ['岗位模板', '部门模板', '通用模板']), select('status', '状态', statusOptions(performanceEnabledTabs))],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'department', 'owner', 'status', 'date'],
  formTitle: '考核模板',
  formFields: [input('code', '模板编号', { required: true }), input('name', '模板名称', { required: true }), select('templateType', '模板类型', ['岗位模板', '部门模板', '通用模板']), number('totalWeight', '总权重'), select('status', '状态', statusOptions(performanceEnabledTabs)), text('remark', '模板说明')],
  rowActions: [action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }), action('delete', '删除', { kind: 'danger', confirm: '确认删除该模板？', effect: { type: 'delete' } }), action('config', '配置指标', { kind: 'link', effect: { type: 'message', message: '已打开指标配置' } })],
});

const performanceIndicator = simpleCorePage({
  primaryAction: '新增指标',
  statusTabs: performanceEnabledTabs,
  searchFields: [input('name', '指标名称'), select('indicatorType', '指标类型', ['定量', '定性']), select('status', '状态', statusOptions(performanceEnabledTabs))],
  columns: performanceColumns,
  requiredVisible: ['code', 'name', 'status'],
  defaultVisible: ['code', 'name', 'department', 'owner', 'status', 'date'],
  formTitle: '考核指标',
  formFields: [input('code', '指标编号', { required: true }), input('name', '指标名称', { required: true }), select('indicatorType', '指标类型', ['定量', '定性']), number('weight', '权重'), input('scoreStandard', '评分标准', { span: 24 }), select('status', '状态', statusOptions(performanceEnabledTabs))],
  rowActions: defaultRowActions,
});

const salaryApprovalTabs = tabs(['draft', '草稿'], ['approving', '审批中'], ['approved', '已通过'], ['withdrawn', '已撤回'], ['archived', '已归档']);
const salaryApproval = simpleCorePage({
  primaryAction: '新建薪资批次',
  approvalFlow: true,
  statusTabs: salaryApprovalTabs,
  searchFields: [month('salaryMonth', '薪资月份'), input('code', '批次编号'), select('batchType', '批次类型', ['普通', '补发', '更正', '奖金', '离职结算', '临时工资', '年终奖']), select('status', '审批状态', statusOptions(salaryApprovalTabs)), select('owner', '创建人', employees)],
  columns: [
    idx,
    { title: '批次编号', dataIndex: 'code', width: 140 },
    { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 },
    { title: '批次类型', dataIndex: 'batchType', width: 100 },
    { title: '发薪范围', dataIndex: 'department', width: 140 },
    { title: '总人数', dataIndex: 'headcount', width: 90, align: 'right' },
    { title: '总金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true },
    { title: '审批状态', dataIndex: 'status', width: 110, status: true },
    { title: '创建时间', dataIndex: 'date', width: 130 },
  ],
  requiredVisible: ['salaryMonth', 'code', 'status'],
  defaultVisible: ['code', 'salaryMonth', 'batchType', 'department', 'headcount', 'payrollAmount', 'status', 'date'],
  formTitle: '薪资批次',
  formFields: [input('code', '批次编号', { required: true }), month('salaryMonth', '薪资月份', { required: true }), select('batchType', '批次类型', ['普通', '补发', '更正', '奖金', '离职结算', '临时工资', '年终奖'], { required: true }), input('sourceBatch', '关联原批次'), input('name', '批次名称'), select('payRange', '发薪范围', departments, { required: true }), number('headcount', '总人数', { readOnly: true }), number('payrollAmount', '总金额', { readOnly: true }), select('status', '审批状态', statusOptions(salaryApprovalTabs), { readOnly: true }), select('importMode', '导入方式', ['覆盖导入', '追加导入']), upload('salaryFile', '导入文件')],
  formFooterActions: [
    action('saveDraft', '保存草稿'),
    action('submitApproval', '发起审批', { kind: 'primary' }),
  ],
  pageActions: [
    action('create', '新建薪资批次', { kind: 'primary', effect: { type: 'openCreate' } }),
  ],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'openEdit' } }),
    action('importDetail', '导入明细', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'message', message: '薪资明细导入任务已创建' } }),
    action('submit', '发起审批', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '审批中' } }),
    action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: ['草稿', '审批中'] }, effect: { type: 'setStatus', status: '已撤回' } }),
    action('archive', '归档', { kind: 'link', visibleWhen: { field: 'status', equals: '已通过' }, effect: { type: 'setStatus', status: '已归档' } }),
  ],
  detailActions: [
    action('deleteDetail', '批量删除明细', { kind: 'danger', confirm: '确认删除所选薪资明细？', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'message', message: '已删除所选薪资明细' } }),
  ],
});

const payslipTabs = tabs(['pending', '待发放'], ['sent', '已发放'], ['viewed', '已查看'], ['withdrawn', '已撤回']);
const salaryPayslip = simpleCorePage({
  primaryAction: '生成工资条',
  statusTabs: payslipTabs,
  searchFields: [month('salaryMonth', '薪资月份'), input('employeeNo', '工号'), input('name', '员工姓名'), select('department', '所属部门', departments), select('status', '发放状态', statusOptions(payslipTabs)), select('viewStatus', '查看状态', ['未查看', '已查看'])],
  columns: [
    idx,
    { title: '工资条编号', dataIndex: 'code', width: 140 },
    { title: '批次编号', dataIndex: 'batchNo', width: 130 },
    { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 },
    { title: '工号', dataIndex: 'employeeNo', width: 120 },
    { title: '员工姓名', dataIndex: 'name', width: 120 },
    { title: '所属部门', dataIndex: 'department', width: 140 },
    { title: '实发金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true },
    { title: '发放状态', dataIndex: 'status', width: 110, status: true },
    { title: '查看状态', dataIndex: 'viewStatus', width: 110 },
  ],
  requiredVisible: ['code', 'employeeNo', 'name', 'status'],
  defaultVisible: ['code', 'batchNo', 'salaryMonth', 'employeeNo', 'name', 'department', 'payrollAmount', 'status', 'viewStatus'],
  formTitle: '工资条信息',
  formFields: [input('code', '工资条编号', { required: true }), input('batchNo', '批次编号', { required: true }), month('salaryMonth', '薪资月份', { required: true }), select('employee', '员工', employees, { required: true }), number('grossPay', '应发金额'), number('deduction', '扣款项'), number('netPay', '实发金额'), select('status', '发放状态', statusOptions(payslipTabs)), select('viewStatus', '查看状态', ['未查看', '已查看'])],
  formFooterActions: [
    action('save', '保存'),
    action('send', '发放', { kind: 'primary' }),
  ],
  pageActions: [action('generate', '生成工资条', { kind: 'primary', effect: { type: 'message', message: '工资条生成任务已创建' } }), action('sendAll', '批量发放', { requiresSelection: true, effect: { type: 'message', message: '已批量发放工资条' } }), action('withdrawAll', '撤回', { requiresSelection: true, effect: { type: 'message', message: '已撤回所选工资条' } })],
  rowActions: [
    action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
    action('send', '发放', { kind: 'link', visibleWhen: { field: 'status', equals: '待发放' }, effect: { type: 'setStatus', status: '已发放' } }),
    action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: ['已发放', '已查看'] }, effect: { type: 'setStatus', status: '已撤回' } }),
  ],
});

const reportRowActions: ActionConfig[] = [
  action('view', '查看', { kind: 'link', effect: { type: 'openDetail' } }),
  action('drill', '钻取', { kind: 'link', effect: { type: 'message', message: '已跳转来源明细' } }),
];

const reportExportAction = action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } });

const employeeRoster = createPage({
  ...disabledLegacyButtons,
  primaryAction: '字段配置',
  drawerLayout: 'double',
  searchFields: [input('name', '员工姓名'), input('employeeNo', '工号'), select('department', '所属部门', departments), select('position', '岗位', positions), select('status', '员工状态', employeeStatus), f('dateRange', '入职日期', { type: 'dateRange' })],
  tableColumns: [],
  table: {
    columns: [
      idx,
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '岗位', dataIndex: 'position', width: 130 },
      { title: '直接上级', dataIndex: 'owner', width: 110 },
      { title: '员工状态', dataIndex: 'status', width: 100, status: true },
      { title: '用工类型', dataIndex: 'employmentType', width: 100 },
      { title: '入职日期', dataIndex: 'date', width: 120 },
      { title: '民族', dataIndex: 'nation', width: 90 },
      { title: '户口类型', dataIndex: 'householdType', width: 110 },
      { title: '籍贯', dataIndex: 'nativePlace', width: 110 },
      { title: '居住地址', dataIndex: 'householdAddress', width: 180 },
      { title: '最高学历', dataIndex: 'education', width: 100 },
      { title: '政治面貌', dataIndex: 'politicalStatus', width: 110 },
      { title: '婚姻状况', dataIndex: 'maritalStatus', width: 100 },
      { title: '紧急联系人', dataIndex: 'emergencyContact', width: 120 },
      { title: '紧急联系人电话', dataIndex: 'emergencyPhone', width: 140 },
      { title: '合同公司', dataIndex: 'contractCompany', width: 140 },
      { title: '合同结束日期', dataIndex: 'endDate', width: 120 },
    ],
    requiredVisible: ['employeeNo', 'name', 'department'],
    defaultVisible: ['employeeNo', 'name', 'department', 'position', 'owner', 'status', 'employmentType', 'date', 'education', 'emergencyContact', 'contractCompany', 'endDate'],
  },
  pageActions: [
    action('fieldConfig', '字段配置', { kind: 'primary', effect: { type: 'message', message: '已打开员工花名册字段配置' } }),
    action('export', '导出', { effect: { type: 'message', message: '员工花名册导出任务已创建' } }),
  ],
  rowActionConfigs: [],
  formSections: sections({
    title: '字段配置',
    fields: [
      input('name', '员工姓名'),
      input('employeeNo', '工号'),
      select('department', '所属部门', departments),
      select('status', '员工状态', employeeStatus),
      select('personalFields', '个人信息字段', ['民族', '户口类型', '户口所在地', '籍贯', '居住地址', '最高学历', '政治面貌', '婚姻状况', '血型', '紧急联系人', '紧急联系人电话', '微信', 'QQ']),
      select('fieldConfig', '字段配置', ['基础信息', '任职信息', '个人信息', '合同摘要'], { required: true }),
    ],
  }),
});

const entryExitAnalytics = createPage({
  ...disabledLegacyButtons,
  primaryAction: '导出',
  drawerLayout: 'single',
  searchFields: [f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments), select('position', '岗位', positions), select('changeType', '变动类型', ['入职', '离职'])],
  tableColumns: [],
  table: {
    columns: [
      idx,
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '岗位', dataIndex: 'position', width: 130 },
      { title: '变动类型', dataIndex: 'changeType', width: 100 },
      { title: '变动日期', dataIndex: 'changeDate', width: 120 },
      { title: '来源单据', dataIndex: 'sourceBill', width: 140 },
    ],
    requiredVisible: ['employeeNo', 'name', 'changeType', 'changeDate'],
    defaultVisible: ['employeeNo', 'name', 'department', 'position', 'changeType', 'changeDate', 'sourceBill'],
  },
  pageActions: [reportExportAction],
  rowActionConfigs: [
    action('drillEntry', '钻取入职明细', { kind: 'link', visibleWhen: { field: 'changeType', equals: '入职' }, effect: { type: 'message', message: '已跳转入职管理' } }),
    action('drillExit', '钻取离职明细', { kind: 'link', visibleWhen: { field: 'changeType', equals: '离职' }, effect: { type: 'message', message: '已跳转离职管理' } }),
  ],
  formSections: sections({ title: '统计条件', fields: [f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments), select('position', '岗位', positions), select('changeType', '变动类型', ['入职', '离职'])] }),
});

const attendanceAnalytics = createPage({
  ...disabledLegacyButtons,
  primaryAction: '钻取',
  drawerLayout: 'single',
  searchFields: [month('month', '月份', { required: true }), select('department', '所属部门', departments), input('name', '员工姓名'), input('employeeNo', '工号')],
  tableColumns: [],
  table: {
    columns: [
      idx,
      { title: '工号', dataIndex: 'employeeNo', width: 120 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '出勤天数', dataIndex: 'actualDays', width: 100, align: 'right' },
      { title: '异常次数', dataIndex: 'missingCount', width: 100, align: 'right' },
      { title: '请假时长', dataIndex: 'leaveHours', width: 100, align: 'right' },
      { title: '加班时长', dataIndex: 'overtimeHours', width: 100, align: 'right' },
      { title: 'HR确认状态', dataIndex: 'hrConfirmStatus', width: 110, status: true },
    ],
    requiredVisible: ['employeeNo', 'name', 'department'],
    defaultVisible: ['employeeNo', 'name', 'department', 'actualDays', 'missingCount', 'leaveHours', 'overtimeHours', 'hrConfirmStatus'],
  },
  pageActions: [action('drill', '钻取', { effect: { type: 'message', message: '已钻取考勤明细' } }), reportExportAction],
  rowActionConfigs: [action('drillException', '钻取异常', { kind: 'link', effect: { type: 'message', message: '已跳转日考勤统计或打卡记录' } })],
  formSections: sections({ title: '考勤汇总条件', fields: [month('month', '月份', { required: true }), select('department', '所属部门', departments), input('name', '员工姓名'), input('employeeNo', '工号')] }),
});

const salaryAnalytics = createPage({
  ...disabledLegacyButtons,
  primaryAction: '钻取',
  drawerLayout: 'single',
  searchFields: [month('salaryMonth', '薪资月份', { required: true }), select('department', '所属部门', departments), select('batchType', '批次类型', ['普通', '补发', '更正', '奖金', '离职结算', '临时工资', '年终奖'])],
  tableColumns: [],
  table: {
    columns: [
      idx,
      { title: '批次编号', dataIndex: 'code', width: 140 },
      { title: '薪资月份', dataIndex: 'salaryMonth', width: 110 },
      { title: '批次类型', dataIndex: 'batchType', width: 110 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '人数', dataIndex: 'headcount', width: 90, align: 'right' },
      { title: '总金额', dataIndex: 'payrollAmount', width: 130, align: 'right', money: true },
      { title: '归档时间', dataIndex: 'archiveTime', width: 140 },
    ],
    requiredVisible: ['code', 'salaryMonth', 'payrollAmount'],
    defaultVisible: ['code', 'salaryMonth', 'batchType', 'department', 'headcount', 'payrollAmount', 'archiveTime'],
  },
  pageActions: [action('drill', '钻取', { effect: { type: 'message', message: '已钻取薪资审批批次' } }), reportExportAction],
  rowActionConfigs: [action('drillBatch', '钻取批次', { kind: 'link', effect: { type: 'message', message: '已跳转薪资审批页面' } })],
  formSections: sections({ title: '薪资统计条件', fields: [month('salaryMonth', '薪资月份', { required: true }), select('department', '所属部门', departments), select('batchType', '批次类型', ['普通', '补发', '更正', '奖金', '离职结算', '临时工资', '年终奖'])] }),
});

const hrDashboardAnalytics = createPage({
  ...disabledLegacyButtons,
  primaryAction: '钻取',
  drawerLayout: 'single',
  searchFields: [f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments)],
  tableColumns: [],
  table: {
    columns: [
      idx,
      { title: '指标名称', dataIndex: 'metricName', width: 180 },
      { title: '指标值', dataIndex: 'metricValue', width: 120, align: 'right' },
      { title: '来源模块', dataIndex: 'sourceModule', width: 130 },
      { title: '更新时间', dataIndex: 'updateTime', width: 140 },
      { title: '预警等级', dataIndex: 'warningLevel', width: 100, status: true },
    ],
    requiredVisible: ['metricName', 'metricValue', 'sourceModule'],
    defaultVisible: ['metricName', 'metricValue', 'sourceModule', 'updateTime', 'warningLevel'],
  },
  pageActions: [action('drill', '钻取', { effect: { type: 'message', message: '已钻取来源模块' } })],
  rowActionConfigs: [
    action('drillMetric', '钻取指标', { kind: 'link', effect: { type: 'message', message: '已跳转指标来源模块' } }),
    action('viewWarning', '查看预警', { kind: 'link', effect: { type: 'message', message: '已打开预警对象' } }),
  ],
  formSections: sections({ title: '看板条件', fields: [f('dateRange', '时间范围', { type: 'dateRange', required: true }), select('department', '所属部门', departments), number('metricValue', '指标值', { readOnly: true })] }),
});

export const prdCorePageConfigs: Record<string, PageConfig> = {
  '/organization/list': organizationList,
  '/organization/chart': organizationChart,
  '/organization/position': positionManagement,
  '/employee/list': employeeList,
  '/employee/archive': employeeArchive,
  '/employee/contract': employeeContract,
  '/recruitment/demand': recruitmentDemand,
  '/recruitment/resume': recruitmentResume,
  '/recruitment/talent': recruitmentTalent,
  '/recruitment/interview': recruitmentInterview,
  '/recruitment/offer': recruitmentOffer,
  '/lifecycle/onboarding': onboarding,
  '/lifecycle/regularization': regularization,
  '/lifecycle/transfer': transfer,
  '/lifecycle/resignation': resignation,
  '/attendance/repair': attendanceApplyPage('补卡'),
  '/attendance/leave': attendanceApplyPage('请假'),
  '/attendance/overtime': attendanceApplyPage('加班'),
  '/attendance/out': attendanceApplyPage('外出'),
  '/attendance/trip': attendanceApplyPage('出差'),
  '/attendance/group': attendanceGroup,
  '/attendance/shift': attendanceShift,
  '/attendance/schedule': attendanceSchedule,
  '/attendance/rule': attendanceRule,
  '/attendance/holiday': attendanceHoliday,
  '/attendance/clock-record': clockRecord,
  '/attendance/daily-stat': dailyStat,
  '/attendance/monthly-stat': monthlyStat,
  '/performance/plan': performancePlan,
  '/performance/progress': performanceProgress,
  '/performance/template': performanceTemplate,
  '/performance/indicator': performanceIndicator,
  '/salary/approval': salaryApproval,
  '/salary/payslip': salaryPayslip,
  '/analytics/roster': employeeRoster,
  '/analytics/entry-exit': entryExitAnalytics,
  '/analytics/attendance': attendanceAnalytics,
  '/analytics/salary': salaryAnalytics,
  '/analytics/hr-dashboard': hrDashboardAnalytics,
};
