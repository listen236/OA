import type { ActionConfig, ColumnConfig, FieldConfig, FormSectionConfig, PageConfig, StatusTabConfig } from '../types';

const departments = ['总经办', '人力资源部', '生产一部', '生产二部', '质量管理部', '财务部', '技术中心'];
const employees = ['张红红', '李华', '王敏', '赵强', '陈晓', 'admin'];
const statuses = ['草稿', '处理中', '已完成', '已关闭'];
const expenseTypes = ['差旅费', '招待费', '培训费', '维修费', '办公费', '通讯费'];
const expensePaymentTypes = ['对公付款', '对私付款', '个人垫款'];
const invoiceTypes = ['增值税专用发票', '增值税普通发票', '电子发票', '数电发票', '其他'];
const invoiceUseStatuses = ['未使用', '部分使用', '已使用'];
const invoiceDuplicateStatuses = ['正常', '疑似重复', '已确认重复'];
const expenseTypeGroups = ['差旅交通', '业务招待', '办公行政', '培训发展', '资产维修'];
const assetCategories = ['电脑设备', '办公家具', '生产设备', '检测设备', '车辆'];

const idx: ColumnConfig = { title: '序号', dataIndex: 'index', width: 62, align: 'center' };
const f = (name: string, label: string, extra: Partial<FieldConfig> = {}): FieldConfig => ({ name, label, ...extra });
const input = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, extra);
const select = (name: string, label: string, options: string[], extra: Partial<FieldConfig> = {}) =>
  f(name, label, { type: 'select', options, ...extra });
const number = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'number', ...extra });
const date = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'date', ...extra });
const text = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'textarea', span: 24, ...extra });
const upload = (name: string, label: string, extra: Partial<FieldConfig> = {}) => f(name, label, { type: 'upload', span: 24, ...extra });

const section = (title: string, fields: FieldConfig[]): FormSectionConfig => ({ title, fields });
const detailSection = (
  title: string,
  fields: FieldConfig[],
  columns: ColumnConfig[],
  addButtonText: string,
  nestedSections?: FormSectionConfig[],
): FormSectionConfig => ({
  title,
  fields,
  columns,
  addButtonText,
  modalTitle: addButtonText,
  nestedSections,
  type: 'detailTable',
});
const tabs = (...items: Array<[string, string[]]>): StatusTabConfig[] => items.map(([label, statusValues]) => ({ key: label, label, statusValues }));
const action = (key: string, label: string, extra: Partial<ActionConfig> = {}): ActionConfig => ({ key, label, kind: 'default', ...extra });
const openProcess = (key: string, label: string, fields: FieldConfig[], extra: Partial<ActionConfig> = {}): ActionConfig =>
  action(key, label, {
    kind: 'link',
    effect: { type: 'openProcess', drawerTitle: label, formSections: [section('基本信息', fields)] },
    ...extra,
  });

const statusTabs = tabs(['草稿', ['草稿']], ['处理中', ['处理中']], ['已完成', ['已完成']], ['已关闭', ['已关闭']]);
const processFooterActions = [action('save', '保存'), action('submit', '提交', { kind: 'primary' })];
const finishFooterActions = [action('save', '保存', { kind: 'primary' })];

function moneyColumn(title: string, dataIndex: string): ColumnConfig {
  return { title, dataIndex, width: 130, align: 'right', money: true };
}

function commonPage(options: {
  primaryAction?: string;
  searchFields: FieldConfig[];
  columns: ColumnConfig[];
  formTitle: string;
  formFields: FieldConfig[];
  formSections?: FormSectionConfig[];
  pageActions?: ActionConfig[];
  rowActions?: ActionConfig[];
  detailActions?: ActionConfig[];
  formFooterActions?: ActionConfig[];
  approvalFlow?: boolean;
  readonly?: boolean;
  statusTabs?: StatusTabConfig[];
}): PageConfig {
  return {
    pageType: options.readonly ? 'report' : options.approvalFlow ? 'approval' : 'crud',
    primaryAction: options.primaryAction,
    approvalFlow: options.approvalFlow,
    statusTabs: options.statusTabs ?? (options.readonly ? undefined : statusTabs),
    searchFields: options.searchFields,
    tableColumns: [],
    table: { columns: options.columns, requiredVisible: ['code', 'name'], defaultVisible: options.columns.map((column) => String(column.dataIndex)) },
    formSections: options.formSections ?? [section(options.formTitle, options.formFields)],
    formFooterActions: options.formFooterActions ?? (options.approvalFlow ? processFooterActions : finishFooterActions),
    pageActions:
      options.pageActions ??
      (options.readonly
        ? [action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } })]
        : [
            action('create', options.primaryAction ?? '新增', { kind: 'primary', effect: { type: 'openCreate' } }),
            action('export', '导出', { effect: { type: 'message', message: '导出任务已创建' } }),
          ]),
    rowActionConfigs:
      options.rowActions ??
      (options.readonly
        ? [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } })]
        : [
            action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
            action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
            action('delete', '删除', { kind: 'danger', confirm: '确认删除该数据？', effect: { type: 'delete' } }),
          ]),
    detailActions: options.detailActions,
    showCreate: false,
    showImport: false,
    showExport: false,
    showDelete: false,
  };
}

const expenseSearch = [
  input('code', '单据编号'),
  input('name', '标题/名称'),
  select('department', '部门', departments),
  select('expenseType', '费用类型', expenseTypes),
  select('status', '状态', statuses),
  f('dateRange', '日期范围', { type: 'dateRange' }),
];

const expenseColumns = (codeTitle: string, titleName: string, amountTitle = '金额'): ColumnConfig[] => [
  idx,
  { title: codeTitle, dataIndex: 'code', width: 140 },
  { title: titleName, dataIndex: 'name', width: 180 },
  { title: '申请人', dataIndex: 'owner', width: 110 },
  { title: '申请部门', dataIndex: 'department', width: 140 },
  { title: '费用类型', dataIndex: 'expenseType', width: 120 },
  moneyColumn(amountTitle, 'amount'),
  { title: '状态', dataIndex: 'status', width: 100, status: true },
  { title: '申请日期', dataIndex: 'date', width: 120 },
];

const expenseForm = (codeLabel: string, titleLabel: string, amountLabel: string): FieldConfig[] => [
  input('code', codeLabel, { required: true, readOnly: true }),
  input('name', titleLabel, { required: true }),
  select('owner', '申请人', employees, { required: true }),
  select('department', '申请部门', departments, { required: true }),
  select('expenseType', '费用类型', expenseTypes, { required: true }),
  number('amount', amountLabel, { required: true }),
  select('status', '状态', statuses, { required: true }),
  text('remark', '说明'),
  upload('files', '附件'),
];

const financeAuditFields = [
  select('auditResult', '审核结果', ['通过', '驳回'], { required: true }),
  text('auditComment', '审核意见'),
];
const paymentMethods = ['银行转账', '现金', '网银', '支票'];
const paymentRegisterFields = [
  date('paymentDate', '付款日期', { required: true }),
  number('paymentAmount', '付款金额', { required: true }),
  input('paymentAccount', '付款账户'),
  input('paymentNo', '付款流水号'),
  text('remark', '备注'),
];
const reimburseAuditFields = [
  select('auditResult', '审核结果', ['通过', '驳回'], { required: true }),
  number('approvedAmount', '核定报销金额', { required: true }),
  text('deductionReason', '核减原因'),
  number('loanOffsetAmount', '冲借款金额'),
  text('financeAuditComment', '财务审核意见'),
];
const reimbursePaymentFields = [
  number('paymentAmount', '本次付款金额', { required: true }),
  date('paymentDate', '付款日期', { required: true }),
  select('paymentMethod', '付款方式', paymentMethods, { required: true }),
  input('paymentNo', '银行流水号'),
  upload('paymentVoucher', '付款凭证'),
  text('remark', '备注'),
];
const reimburseExpenseDetailFields = [
  select('expenseType', '费用类型', expenseTypes, { required: true }),
  date('expenseDate', '费用发生日期', { required: true }),
  text('expenseDesc', '费用说明', { required: true }),
  number('amount', '报销金额', { required: true }),
  select('hasInvoice', '是否有发票', ['是', '否'], { required: true }),
];
const reimburseInvoiceDetailFields = [
  input('invoiceNo', '发票号码', { required: true }),
  input('digitalInvoiceNo', '数电发票号码'),
  select('invoiceType', '发票类型', invoiceTypes, { required: true }),
  date('invoiceDate', '开票日期'),
  input('invoiceFolderRef', '发票夹来源', { required: true }),
  input('sellerName', '销售方名称', { required: true }),
  number('invoiceAmount', '引用金额', { required: true }),
  select('duplicateCheckResult', '重复校验结果', ['未校验', '通过', '疑似重复'], { readOnly: true }),
];
const reimburseFormSections = [
  section('基本信息', [
    input('code', '报销单编号', { readOnly: true }),
    input('name', '报销标题', { required: true }),
    select('owner', '报销人', employees, { required: true }),
    select('department', '所属部门', departments, { required: true }),
    input('relatedExpenseApply', '关联费用申请单'),
    input('receiptAccount', '收款账户', { required: true }),
    date('reimburseDate', '报销日期', { required: true }),
    text('reimburseReason', '报销事由', { required: true }),
  ]),
  detailSection('报销明细', reimburseExpenseDetailFields, [
    { title: '费用类型', dataIndex: 'expenseType', width: 120 },
    { title: '费用发生日期', dataIndex: 'expenseDate', width: 130 },
    { title: '费用说明', dataIndex: 'expenseDesc', width: 180 },
    moneyColumn('报销金额', 'amount'),
    { title: '是否关联发票', dataIndex: 'hasInvoice', width: 120 },
    { title: '引用发票', dataIndex: 'invoiceDetails', width: 220 },
  ], '添加报销明细', [
    detailSection('引用发票', reimburseInvoiceDetailFields, [
      { title: '发票号码', dataIndex: 'invoiceNo', width: 150 },
      { title: '数电发票号码', dataIndex: 'digitalInvoiceNo', width: 160 },
      { title: '发票类型', dataIndex: 'invoiceType', width: 140 },
      { title: '销售方名称', dataIndex: 'sellerName', width: 160 },
      moneyColumn('引用金额', 'invoiceAmount'),
      { title: '重复校验结果', dataIndex: 'duplicateCheckResult', width: 140 },
    ], '添加引用发票'),
  ]),
  section('金额汇总', [
    number('reimburseTotalAmount', '报销总金额', { readOnly: true }),
    number('invoiceTotalAmount', '引用发票金额', { readOnly: true }),
    number('payableAmount', '应付金额', { readOnly: true }),
  ]),
  section('补充信息', [
    upload('files', '附件'),
    text('remark', '备注'),
  ]),
];

export const oaExpansionPageConfigs: Record<string, PageConfig> = {
  '/expense/apply': commonPage({
    primaryAction: '费用申请',
    approvalFlow: true,
    searchFields: [
      input('code', '申请单编号'),
      input('name', '申请标题'),
      select('owner', '申请人', employees),
      select('department', '申请部门', departments),
      select('expenseType', '费用类型', expenseTypes),
      select('paymentType', '付款方式', expensePaymentTypes),
      select('status', '单据状态', statuses),
      f('dateRange', '申请日期', { type: 'dateRange' }),
    ],
    columns: [
      idx,
      { title: '申请单编号', dataIndex: 'code', width: 140 },
      { title: '申请标题', dataIndex: 'name', width: 180 },
      { title: '申请人', dataIndex: 'owner', width: 110 },
      { title: '申请部门', dataIndex: 'department', width: 140 },
      { title: '费用类型', dataIndex: 'expenseType', width: 120 },
      { title: '付款方式', dataIndex: 'paymentType', width: 120 },
      moneyColumn('申请金额', 'amount'),
      { title: '单据状态', dataIndex: 'status', width: 100, status: true },
      { title: '申请日期', dataIndex: 'date', width: 120 },
    ],
    formTitle: '费用申请',
    formFields: [],
    formSections: [
      section('基本信息', [
        input('code', '申请单编号', { readOnly: true }),
        input('name', '申请标题', { required: true }),
        select('owner', '申请人', employees, { required: true }),
        select('department', '申请部门', departments, { required: true }),
        select('expenseType', '费用类型', expenseTypes, { required: true }),
        select('paymentType', '付款方式', expensePaymentTypes, { required: true }),
        date('date', '申请日期', { required: true }),
        number('amount', '申请金额', { required: true }),
        input('payeeName', '收款对象', { required: true }),
        input('receiptAccount', '收款账户'),
        input('receiptBank', '收款银行'),
        text('applyReason', '申请事由', { required: true }),
      ]),
      section('补充信息', [upload('files', '附件'), text('remark', '备注')]),
    ],
    rowActions: [
      action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
      action('edit', '编辑', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'openEdit' } }),
      action('submit', '提交', { kind: 'link', visibleWhen: { field: 'status', equals: '草稿' }, effect: { type: 'setStatus', status: '处理中' } }),
      action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: '处理中' }, effect: { type: 'setStatus', status: '草稿' } }),
      openProcess('pay', '财务打款', reimbursePaymentFields, { visibleWhen: { field: 'paymentType', notEquals: '个人垫款' } }),
      action('reimburse', '发起报销', { kind: 'link', visibleWhen: { field: 'paymentType', equals: '个人垫款' }, effect: { type: 'message', message: '个人垫款申请通过后，请到费用报销页面发起报销' } }),
    ],
  }),
  '/expense/reimburse': commonPage({
    primaryAction: '报销申请',
    approvalFlow: true,
    searchFields: [
      input('code', '报销单编号'),
      input('owner', '报销人'),
      select('department', '所属部门', departments),
      select('expenseType', '费用类型', expenseTypes),
      input('relatedExpenseApply', '关联费用申请单'),
      date('reimburseDate', '报销日期'),
      select('status', '单据状态', statuses),
    ],
    columns: [
      idx,
      { title: '报销单编号', dataIndex: 'code', width: 140 },
      { title: '报销标题', dataIndex: 'name', width: 180 },
      { title: '报销人', dataIndex: 'owner', width: 110 },
      { title: '所属部门', dataIndex: 'department', width: 140 },
      { title: '关联费用申请单', dataIndex: 'relatedExpenseApply', width: 160 },
      { title: '费用类型', dataIndex: 'expenseType', width: 120 },
      { title: '报销日期', dataIndex: 'reimburseDate', width: 120 },
      { title: '财务审核状态', dataIndex: 'auditStatus', width: 120, status: true },
      { title: '付款状态', dataIndex: 'paymentStatus', width: 100, status: true },
      { title: '单据状态', dataIndex: 'status', width: 100, status: true },
      moneyColumn('报销金额', 'amount'),
      moneyColumn('引用发票金额', 'invoiceTotalAmount'),
      moneyColumn('应付金额', 'payableAmount'),
    ],
    formTitle: '报销申请',
    formFields: [],
    formSections: reimburseFormSections,
    rowActions: [
      action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
      openProcess('audit', '财务审核', reimburseAuditFields, { visibleWhen: { field: 'auditStatus', equals: '处理中' } }),
      openProcess('pay', '付款登记', reimbursePaymentFields, { visibleWhen: { field: 'paymentStatus', equals: '处理中' } }),
      action('withdraw', '撤回', { kind: 'link', visibleWhen: { field: 'status', equals: '处理中' }, effect: { type: 'setStatus', status: '草稿' } }),
    ],
    formFooterActions: processFooterActions,
  }),
  '/expense/invoice': commonPage({
    primaryAction: '新增发票',
    statusTabs: [],
    searchFields: [
      input('invoiceNo', '发票号码'),
      select('invoiceType', '发票类型', invoiceTypes),
      input('sellerName', '销售方名称'),
      select('useStatus', '使用状态', invoiceUseStatuses),
      select('duplicateStatus', '重复状态', invoiceDuplicateStatuses),
    ],
    columns: [
      idx,
      { title: '发票号码', dataIndex: 'invoiceNo', width: 140 },
      { title: '发票类型', dataIndex: 'invoiceType', width: 120 },
      { title: '开票日期', dataIndex: 'invoiceDate', width: 120 },
      { title: '销售方名称', dataIndex: 'sellerName', width: 180 },
      { title: '来源类型', dataIndex: 'sourceType', width: 120 },
      moneyColumn('发票金额', 'amount'),
      { title: '使用状态', dataIndex: 'useStatus', width: 110 },
      { title: '重复状态', dataIndex: 'duplicateStatus', width: 110 },
      { title: '识别状态', dataIndex: 'recognizeStatus', width: 120, status: true },
      { title: '查验状态', dataIndex: 'verifyStatus', width: 120, status: true },
    ],
    formTitle: '发票维护',
    formFields: [
      select('sourceType', '来源类型', ['上传发票', '手工录入'], { required: true }),
      upload('files', '发票文件'),
      select('invoiceType', '发票类型', invoiceTypes, { required: true }),
      input('invoiceCode', '发票代码'),
      input('invoiceNo', '发票号码', { required: true }),
      input('digitalInvoiceNo', '数电发票号码'),
      date('invoiceDate', '开票日期', { required: true }),
      input('buyerName', '购买方名称'),
      input('sellerName', '销售方名称', { required: true }),
      number('taxExcludedAmount', '不含税金额'),
      number('taxAmount', '税额'),
      number('amount', '价税合计', { required: true }),
      select('useStatus', '使用状态', invoiceUseStatuses),
      select('duplicateStatus', '重复状态', invoiceDuplicateStatuses),
      select('recognizeStatus', '识别状态', ['待识别', '识别成功', '识别失败', '已人工修正'], { readOnly: true }),
      select('verifyStatus', '查验状态', ['未查验', '查验通过', '查验异常'], { readOnly: true }),
      text('remark', '备注'),
    ],
    rowActions: [
      action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }),
      action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }),
      action('recognize', '识别发票', { kind: 'link', effect: { type: 'setField', field: 'recognizeStatus', value: '识别成功', message: '已完成发票识别' } }),
      action('verify', '查验发票', { kind: 'link', effect: { type: 'setField', field: 'verifyStatus', value: '查验通过', message: '已完成发票查验' } }),
    ],
  }),
  '/expense/budget': commonPage({
    primaryAction: '预算设置',
    statusTabs: [],
    searchFields: [input('budgetYear', '预算年度'), select('department', '部门', departments), select('expenseType', '费用类型', expenseTypes), select('status', '状态', ['启用', '停用'])],
    columns: [idx, { title: '预算年度', dataIndex: 'budgetYear', width: 100 }, { title: '部门', dataIndex: 'department', width: 140 }, { title: '费用类型', dataIndex: 'expenseType', width: 120 }, moneyColumn('预算金额', 'budgetAmount'), moneyColumn('已申请金额', 'appliedAmount'), moneyColumn('已报销金额', 'reimbursedAmount'), moneyColumn('剩余金额', 'remainingAmount'), { title: '状态', dataIndex: 'status', width: 100, status: true }],
    formTitle: '预算设置',
    formFields: [input('budgetYear', '预算年度', { required: true }), select('department', '部门', departments, { required: true }), select('expenseType', '费用类型', expenseTypes, { required: true }), number('budgetAmount', '预算金额', { required: true }), number('warningRatio', '预警比例'), select('overBudgetRule', '超预算处理方式', ['提醒', '增加审批', '禁止提交'], { required: true }), select('status', '状态', ['启用', '停用'], { required: true }), text('remark', '说明')],
    rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('adjust', '预算调整', [number('adjustAmount', '调整金额', { required: true }), text('adjustReason', '调整原因', { required: true }), upload('files', '附件')]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })],
  }),
  '/expense/type': commonPage({
    primaryAction: '费用类型维护',
    statusTabs: [],
    searchFields: [input('groupName', '费用分组'), input('name', '费用类型'), select('status', '状态', ['启用', '停用'])],
    columns: [idx, { title: '类型编码', dataIndex: 'typeCode', width: 120 }, { title: '费用分组', dataIndex: 'groupName', width: 130 }, { title: '费用类型', dataIndex: 'name', width: 180 }, { title: '需事前申请', dataIndex: 'needAdvanceApply', width: 120 }, { title: '必须上传发票', dataIndex: 'needInvoice', width: 120 }, { title: '启用预算', dataIndex: 'budgetEnabled', width: 100 }, { title: '状态', dataIndex: 'status', width: 100, status: true }],
    formTitle: '费用类型维护',
    formFields: [input('typeCode', '类型编码', { required: true }), input('name', '费用类型', { required: true }), select('groupName', '费用分组', expenseTypeGroups, { required: true }), select('parentType', '上级分类', expenseTypes), select('needAdvanceApply', '是否需要事前申请', ['是', '否'], { required: true }), select('needInvoice', '是否必须上传发票', ['是', '否'], { required: true }), select('allowNoInvoice', '是否允许无票', ['是', '否'], { required: true }), select('budgetEnabled', '是否启用预算', ['是', '否'], { required: true }), select('status', '状态', ['启用', '停用'], { required: true }), text('remark', '备注')],
  }),
};

const assetCommonFields = [select('assetCategory', '资产分类', assetCategories, { required: true }), input('assetName', '资产名称', { required: true }), select('department', '部门', departments), select('owner', '使用人', employees), select('status', '状态', statuses, { required: true })];

Object.assign(oaExpansionPageConfigs, {
  '/general/asset/ledger': commonPage({ primaryAction: '资产档案维护', searchFields: [input('assetNo', '资产编号'), input('assetName', '资产名称'), select('assetCategory', '资产分类', assetCategories), select('status', '状态', statuses)], columns: [idx, { title: '资产编号', dataIndex: 'assetNo', width: 140 }, { title: '资产名称', dataIndex: 'assetName', width: 160 }, { title: '资产分类', dataIndex: 'assetCategory', width: 120 }, { title: '规格型号', dataIndex: 'model', width: 120 }, moneyColumn('资产原值', 'amount'), { title: '使用人', dataIndex: 'owner', width: 110 }, { title: '部门', dataIndex: 'department', width: 140 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '资产档案维护', formFields: [input('assetNo', '资产编号', { required: true, readOnly: true }), ...assetCommonFields, input('model', '规格型号'), number('amount', '资产原值', { required: true })] }),
  '/general/asset/inbound': commonPage({ primaryAction: '入库登记', searchFields: [input('code', '入库单编号'), date('inboundDate', '入库日期'), input('supplier', '供应商')], columns: [idx, { title: '入库单编号', dataIndex: 'code', width: 140 }, { title: '入库日期', dataIndex: 'inboundDate', width: 120 }, { title: '供应商', dataIndex: 'supplier', width: 160 }, { title: '资产数量', dataIndex: 'quantity', width: 100, align: 'right' }, moneyColumn('入库金额', 'amount'), { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '入库登记', formFields: [input('code', '入库单编号', { required: true, readOnly: true }), date('inboundDate', '入库日期', { required: true }), input('supplier', '供应商'), number('quantity', '资产数量', { required: true }), number('amount', '入库金额', { required: true })] }),
  '/general/asset/claim': commonPage({ primaryAction: '领用申请', approvalFlow: true, searchFields: [input('code', '领用单编号'), select('owner', '申请人', employees), select('department', '申请部门', departments)], columns: [idx, { title: '领用单编号', dataIndex: 'code', width: 140 }, { title: '申请人', dataIndex: 'owner', width: 110 }, { title: '申请部门', dataIndex: 'department', width: 140 }, { title: '领用资产', dataIndex: 'assetName', width: 160 }, { title: '申请日期', dataIndex: 'date', width: 120 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '领用申请', formFields: [input('code', '领用单编号', { required: true, readOnly: true }), select('owner', '申请人', employees, { required: true }), select('department', '申请部门', departments, { required: true }), input('assetName', '领用资产', { required: true }), date('date', '申请日期', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('issue', '发放登记', [date('issueDate', '发放日期', { required: true }), select('owner', '发放人', employees, { required: true }), text('remark', '备注')]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })] }),
  '/general/asset/transfer': commonPage({ primaryAction: '调拨申请', approvalFlow: true, searchFields: [input('code', '调拨单编号'), input('assetName', '资产名称'), select('department', '新使用部门', departments)], columns: [idx, { title: '调拨单编号', dataIndex: 'code', width: 140 }, { title: '资产名称', dataIndex: 'assetName', width: 160 }, { title: '原使用部门', dataIndex: 'oldDepartment', width: 140 }, { title: '新使用部门', dataIndex: 'newDepartment', width: 140 }, { title: '原使用人', dataIndex: 'oldOwner', width: 110 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '调拨申请', formFields: [input('code', '调拨单编号', { required: true, readOnly: true }), input('assetName', '资产名称', { required: true }), select('oldDepartment', '原使用部门', departments), select('newDepartment', '新使用部门', departments, { required: true }), select('oldOwner', '原使用人', employees), select('owner', '新使用人', employees)] }),
  '/general/asset/borrow': commonPage({ primaryAction: '借用申请', approvalFlow: true, searchFields: [input('code', '借用单编号'), select('owner', '借用人', employees), input('assetName', '借用资产')], columns: [idx, { title: '借用单编号', dataIndex: 'code', width: 140 }, { title: '借用人', dataIndex: 'owner', width: 110 }, { title: '借用资产', dataIndex: 'assetName', width: 160 }, { title: '借用日期', dataIndex: 'borrowDate', width: 120 }, { title: '预计归还日期', dataIndex: 'expectedReturnDate', width: 130 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '借用申请', formFields: [input('code', '借用单编号', { required: true, readOnly: true }), select('owner', '借用人', employees, { required: true }), input('assetName', '借用资产', { required: true }), date('borrowDate', '借用日期', { required: true }), date('expectedReturnDate', '预计归还日期', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('return', '归还登记', [date('returnDate', '实际归还日期', { required: true }), select('status', '资产状态', statuses, { required: true }), text('remark', '备注')]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })] }),
  '/general/asset/repair': commonPage({ primaryAction: '维修申请', approvalFlow: true, searchFields: [input('code', '维修单编号'), input('assetName', '资产名称'), select('owner', '申请人', employees)], columns: [idx, { title: '维修单编号', dataIndex: 'code', width: 140 }, { title: '资产名称', dataIndex: 'assetName', width: 160 }, { title: '申请人', dataIndex: 'owner', width: 110 }, { title: '故障日期', dataIndex: 'faultDate', width: 120 }, { title: '故障说明', dataIndex: 'remark', width: 220 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '维修申请', formFields: [input('code', '维修单编号', { required: true, readOnly: true }), input('assetName', '资产名称', { required: true }), select('owner', '申请人', employees, { required: true }), date('faultDate', '故障日期', { required: true }), text('remark', '故障说明', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('result', '维修结果', [date('finishDate', '维修完成日期', { required: true }), number('repairCost', '维修费用'), text('remark', '维修结果', { required: true })]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })] }),
  '/general/asset/check': commonPage({ primaryAction: '盘点任务创建', searchFields: [input('code', '盘点任务编号'), input('name', '盘点任务名称'), select('owner', '盘点负责人', employees)], columns: [idx, { title: '盘点任务编号', dataIndex: 'code', width: 140 }, { title: '盘点任务名称', dataIndex: 'name', width: 180 }, { title: '盘点范围', dataIndex: 'scope', width: 160 }, { title: '盘点负责人', dataIndex: 'owner', width: 120 }, { title: '计划盘点日期', dataIndex: 'planDate', width: 130 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '盘点任务创建', formFields: [input('code', '盘点任务编号', { required: true, readOnly: true }), input('name', '盘点任务名称', { required: true }), input('scope', '盘点范围', { required: true }), select('owner', '盘点负责人', employees, { required: true }), date('planDate', '计划盘点日期', { required: true })] }),
  '/general/asset/disposal': commonPage({ primaryAction: '处置申请', approvalFlow: true, searchFields: [input('code', '处置单编号'), input('assetName', '资产名称'), select('disposalType', '处置类型', ['报废', '报损', '出售'])], columns: [idx, { title: '处置单编号', dataIndex: 'code', width: 140 }, { title: '资产名称', dataIndex: 'assetName', width: 160 }, { title: '处置类型', dataIndex: 'disposalType', width: 110 }, { title: '申请人', dataIndex: 'owner', width: 110 }, { title: '申请日期', dataIndex: 'date', width: 120 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '处置申请', formFields: [input('code', '处置单编号', { required: true, readOnly: true }), input('assetName', '资产名称', { required: true }), select('disposalType', '处置类型', ['报废', '报损', '出售'], { required: true }), select('owner', '申请人', employees, { required: true }), date('date', '申请日期', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('result', '处置结果', [date('finishDate', '处置日期', { required: true }), number('amount', '处置金额'), text('remark', '处置结果', { required: true })]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })] }),
  '/general/asset/category': commonPage({ primaryAction: '资产分类维护', searchFields: [input('categoryCode', '分类编码'), input('name', '分类名称'), select('status', '状态', statuses)], columns: [idx, { title: '分类编码', dataIndex: 'categoryCode', width: 120 }, { title: '分类名称', dataIndex: 'name', width: 160 }, { title: '上级分类', dataIndex: 'parentCategory', width: 140 }, { title: '资产数量', dataIndex: 'quantity', width: 100, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '资产分类维护', formFields: [input('categoryCode', '分类编码', { required: true }), input('name', '分类名称', { required: true }), input('parentCategory', '上级分类'), select('status', '状态', statuses, { required: true })] }),
});

const contentCategoryPage = (path: string, primaryAction: string, nameLabel: string, countLabel: string, extraFields: FieldConfig[] = []) =>
  (oaExpansionPageConfigs[path] = commonPage({
    primaryAction,
    searchFields: [input('name', nameLabel), select('status', '状态', statuses)],
    columns: [idx, { title: nameLabel, dataIndex: 'name', width: 180 }, { title: '上级分类', dataIndex: 'parentCategory', width: 140 }, { title: countLabel, dataIndex: 'quantity', width: 110, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }],
    formTitle: primaryAction,
    formFields: [input('name', nameLabel, { required: true }), input('parentCategory', '上级分类'), ...extraFields, select('status', '状态', statuses, { required: true })],
  }));

Object.assign(oaExpansionPageConfigs, {
  '/general/meeting/reserve': commonPage({ primaryAction: '会议预约', searchFields: [input('name', '会议主题'), input('meetingRoom', '会议室'), f('dateRange', '会议时间', { type: 'dateRange' })], columns: [idx, { title: '会议主题', dataIndex: 'name', width: 180 }, { title: '会议室', dataIndex: 'meetingRoom', width: 120 }, { title: '会议时间', dataIndex: 'meetingTime', width: 160 }, { title: '预约人', dataIndex: 'owner', width: 110 }, { title: '主持人', dataIndex: 'host', width: 110 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '会议预约', formFields: [input('name', '会议主题', { required: true }), input('meetingRoom', '会议室', { required: true }), date('meetingDate', '会议日期', { required: true }), select('owner', '预约人', employees, { required: true }), select('host', '主持人', employees, { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '修改', { kind: 'link', effect: { type: 'openEdit' } }), action('cancel', '取消会议', { kind: 'link', effect: { type: 'setStatus', status: '已关闭' } })] }),
  '/general/meeting/mine': commonPage({ readonly: true, searchFields: [input('name', '会议主题'), input('meetingRoom', '会议室'), f('dateRange', '会议时间', { type: 'dateRange' })], columns: [idx, { title: '会议主题', dataIndex: 'name', width: 180 }, { title: '会议室', dataIndex: 'meetingRoom', width: 120 }, { title: '会议时间', dataIndex: 'meetingTime', width: 160 }, { title: '主持人', dataIndex: 'host', width: 110 }, { title: '我的身份', dataIndex: 'myRole', width: 100 }], formTitle: '查询条件', formFields: [input('name', '会议主题'), input('meetingRoom', '会议室')] }),
  '/general/meeting/checkin': commonPage({ readonly: true, searchFields: [input('name', '会议主题'), f('dateRange', '会议时间', { type: 'dateRange' })], columns: [idx, { title: '会议主题', dataIndex: 'name', width: 180 }, { title: '会议时间', dataIndex: 'meetingTime', width: 160 }, { title: '应参会人数', dataIndex: 'requiredCount', width: 110, align: 'right' }, { title: '已签到人数', dataIndex: 'signedCount', width: 110, align: 'right' }, { title: '迟到人数', dataIndex: 'lateCount', width: 100, align: 'right' }], formTitle: '查询条件', formFields: [input('name', '会议主题')] }),
  '/general/meeting/minutes': commonPage({ primaryAction: '纪要登记', searchFields: [input('name', '会议主题'), select('host', '主持人', employees), select('owner', '记录人', employees)], columns: [idx, { title: '会议主题', dataIndex: 'name', width: 180 }, { title: '会议时间', dataIndex: 'meetingTime', width: 160 }, { title: '主持人', dataIndex: 'host', width: 110 }, { title: '记录人', dataIndex: 'owner', width: 110 }, { title: '决议数量', dataIndex: 'quantity', width: 100, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '纪要登记', formFields: [input('name', '会议主题', { required: true }), select('host', '主持人', employees, { required: true }), select('owner', '记录人', employees, { required: true }), number('quantity', '决议数量'), text('remark', '会议纪要', { required: true })] }),
  '/general/meeting/room': commonPage({ primaryAction: '会议室维护', searchFields: [input('meetingRoom', '会议室名称'), input('location', '所在位置'), select('status', '状态', statuses)], columns: [idx, { title: '会议室名称', dataIndex: 'meetingRoom', width: 140 }, { title: '所在位置', dataIndex: 'location', width: 160 }, { title: '容纳人数', dataIndex: 'capacity', width: 100, align: 'right' }, { title: '会议设备', dataIndex: 'equipment', width: 180 }, { title: '开放时间', dataIndex: 'openTime', width: 140 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '会议室维护', formFields: [input('meetingRoom', '会议室名称', { required: true }), input('location', '所在位置', { required: true }), number('capacity', '容纳人数', { required: true }), input('equipment', '会议设备'), input('openTime', '开放时间'), select('status', '状态', statuses, { required: true })] }),
  '/general/seal/apply': commonPage({ primaryAction: '用章申请', approvalFlow: true, searchFields: [input('code', '用章单编号'), select('owner', '申请人', employees), input('sealName', '印章名称'), input('fileName', '文件名称')], columns: [idx, { title: '用章单编号', dataIndex: 'code', width: 140 }, { title: '申请人', dataIndex: 'owner', width: 110 }, { title: '申请部门', dataIndex: 'department', width: 140 }, { title: '印章名称', dataIndex: 'sealName', width: 140 }, { title: '文件名称', dataIndex: 'fileName', width: 160 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '用章申请', formFields: [input('code', '用章单编号', { required: true, readOnly: true }), select('owner', '申请人', employees, { required: true }), select('department', '申请部门', departments, { required: true }), input('sealName', '印章名称', { required: true }), input('fileName', '文件名称', { required: true }), upload('files', '附件')], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('sealRegister', '用章登记', [date('useDate', '用章日期', { required: true }), select('owner', '经办人', employees, { required: true }), text('remark', '登记说明')]), openProcess('return', '归还登记', [date('returnDate', '归还日期', { required: true }), text('remark', '归还说明')])] }),
  '/general/seal/archive': commonPage({ primaryAction: '印章档案维护', searchFields: [input('sealName', '印章名称'), select('sealType', '印章类型', ['公章', '合同章', '财务章', '法人章']), select('status', '状态', statuses)], columns: [idx, { title: '印章名称', dataIndex: 'sealName', width: 140 }, { title: '印章类型', dataIndex: 'sealType', width: 110 }, { title: '印章编号', dataIndex: 'sealNo', width: 130 }, { title: '保管人', dataIndex: 'owner', width: 110 }, { title: '存放位置', dataIndex: 'location', width: 150 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '印章档案维护', formFields: [input('sealName', '印章名称', { required: true }), select('sealType', '印章类型', ['公章', '合同章', '财务章', '法人章'], { required: true }), input('sealNo', '印章编号', { required: true }), select('owner', '保管人', employees, { required: true }), input('location', '存放位置'), select('status', '状态', statuses, { required: true })] }),
});

const supplyColumns = [idx, { title: '用品编码', dataIndex: 'supplyCode', width: 120 }, { title: '用品名称', dataIndex: 'supplyName', width: 140 }, { title: '用品分类', dataIndex: 'supplyCategory', width: 120 }, { title: '规格型号', dataIndex: 'model', width: 120 }, { title: '计量单位', dataIndex: 'unit', width: 100 }];
Object.assign(oaExpansionPageConfigs, {
  '/general/supply/claim': commonPage({ primaryAction: '领用申请', approvalFlow: true, searchFields: [input('code', '领用单编号'), select('owner', '申请人', employees), select('department', '申请部门', departments)], columns: [idx, { title: '领用单编号', dataIndex: 'code', width: 140 }, { title: '申请人', dataIndex: 'owner', width: 110 }, { title: '申请部门', dataIndex: 'department', width: 140 }, { title: '领用品种数', dataIndex: 'kindCount', width: 110, align: 'right' }, { title: '申请总数量', dataIndex: 'quantity', width: 110, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '领用申请', formFields: [input('code', '领用单编号', { required: true, readOnly: true }), select('owner', '申请人', employees, { required: true }), select('department', '申请部门', departments, { required: true }), number('kindCount', '领用品种数', { required: true }), number('quantity', '申请总数量', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('issue', '发放登记', [date('issueDate', '发放日期', { required: true }), number('quantity', '实际发放数量', { required: true }), text('remark', '备注')]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })] }),
  '/general/supply/inbound': commonPage({ primaryAction: '用品入库登记', searchFields: [input('code', '入库单编号'), select('inboundType', '入库类型', ['采购入库', '退回入库', '盘盈入库']), input('supplier', '供应商')], columns: [idx, { title: '入库单编号', dataIndex: 'code', width: 140 }, { title: '入库类型', dataIndex: 'inboundType', width: 110 }, { title: '入库日期', dataIndex: 'inboundDate', width: 120 }, { title: '供应商', dataIndex: 'supplier', width: 160 }, { title: '入库总数量', dataIndex: 'quantity', width: 110, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '用品入库登记', formFields: [input('code', '入库单编号', { required: true, readOnly: true }), select('inboundType', '入库类型', ['采购入库', '退回入库', '盘盈入库'], { required: true }), date('inboundDate', '入库日期', { required: true }), input('supplier', '供应商'), number('quantity', '入库总数量', { required: true })] }),
  '/general/supply/outbound': commonPage({ primaryAction: '出库登记', searchFields: [input('code', '出库单编号'), select('outboundType', '出库类型', ['报损', '报废', '批量发放', '其他出库'])], columns: [idx, { title: '出库单编号', dataIndex: 'code', width: 140 }, { title: '出库类型', dataIndex: 'outboundType', width: 110 }, { title: '接收部门/对象', dataIndex: 'receiver', width: 160 }, { title: '出库总数量', dataIndex: 'quantity', width: 110, align: 'right' }, { title: '出库日期', dataIndex: 'outboundDate', width: 120 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '出库登记', formFields: [input('code', '出库单编号', { required: true, readOnly: true }), select('outboundType', '出库类型', ['报损', '报废', '批量发放', '其他出库'], { required: true }), input('receiver', '接收部门/对象', { required: true }), number('quantity', '出库总数量', { required: true }), date('outboundDate', '出库日期', { required: true })] }),
  '/general/supply/stock': commonPage({ readonly: true, searchFields: [input('supplyCode', '用品编码'), input('supplyName', '用品名称'), input('location', '存放位置')], columns: [...supplyColumns, { title: '存放位置', dataIndex: 'location', width: 140 }, { title: '当前库存', dataIndex: 'stockQty', width: 100, align: 'right' }, { title: '可用库存', dataIndex: 'availableQty', width: 100, align: 'right' }], formTitle: '查询条件', formFields: [input('supplyCode', '用品编码'), input('supplyName', '用品名称')] }),
  '/general/supply/flow': commonPage({ readonly: true, searchFields: [input('supplyName', '用品名称'), select('businessType', '业务类型', ['入库', '出库', '领用', '盘点'])], columns: [idx, { title: '用品名称', dataIndex: 'supplyName', width: 140 }, { title: '业务类型', dataIndex: 'businessType', width: 110 }, { title: '关联单据', dataIndex: 'code', width: 140 }, { title: '入库数量', dataIndex: 'inQty', width: 100, align: 'right' }, { title: '出库数量', dataIndex: 'outQty', width: 100, align: 'right' }], formTitle: '查询条件', formFields: [input('supplyName', '用品名称')] }),
  '/general/supply/check': commonPage({ primaryAction: '盘点任务创建', searchFields: [input('code', '盘点任务编号'), input('name', '盘点任务名称'), select('owner', '盘点负责人', employees)], columns: [idx, { title: '盘点任务编号', dataIndex: 'code', width: 140 }, { title: '盘点任务名称', dataIndex: 'name', width: 180 }, { title: '盘点日期', dataIndex: 'planDate', width: 120 }, { title: '盘点负责人', dataIndex: 'owner', width: 120 }, { title: '应盘品种数', dataIndex: 'kindCount', width: 110, align: 'right' }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '盘点任务创建', formFields: [input('code', '盘点任务编号', { required: true, readOnly: true }), input('name', '盘点任务名称', { required: true }), date('planDate', '盘点日期', { required: true }), select('owner', '盘点负责人', employees, { required: true }), number('kindCount', '应盘品种数', { required: true })] }),
  '/general/supply/base': commonPage({ primaryAction: '用品维护', searchFields: [input('supplyCode', '用品编码'), input('supplyName', '用品名称'), input('supplyCategory', '用品分类')], columns: supplyColumns, formTitle: '用品维护', formFields: [input('supplyCode', '用品编码', { required: true }), input('supplyName', '用品名称', { required: true }), input('supplyCategory', '用品分类', { required: true }), input('model', '规格型号'), input('unit', '计量单位', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '用品维护', { kind: 'link', effect: { type: 'openEdit' } }), openProcess('category', '用品分类维护', [input('supplyCategory', '用品分类', { required: true }), select('status', '状态', statuses, { required: true })]), openProcess('location', '存放位置维护', [input('location', '存放位置', { required: true }), select('status', '状态', statuses, { required: true })])] }),
});

Object.assign(oaExpansionPageConfigs, {
  '/general/knowledge/document': commonPage({ primaryAction: '文档发布', searchFields: [input('name', '文档标题'), input('documentCategory', '文档分类'), select('department', '发布部门', departments)], columns: [idx, { title: '文档标题', dataIndex: 'name', width: 180 }, { title: '文档分类', dataIndex: 'documentCategory', width: 120 }, { title: '发布部门', dataIndex: 'department', width: 140 }, { title: '发布人', dataIndex: 'owner', width: 110 }, { title: '当前版本', dataIndex: 'version', width: 100 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '文档发布', formFields: [input('name', '文档标题', { required: true }), input('documentCategory', '文档分类', { required: true }), select('department', '发布部门', departments, { required: true }), select('owner', '发布人', employees, { required: true }), input('version', '当前版本'), upload('files', '文档附件')] }),
  '/general/document/outgoing': commonPage({ primaryAction: '发文登记', searchFields: [input('documentNo', '发文字号'), input('name', '发文标题'), select('department', '发文部门', departments)], columns: [idx, { title: '发文字号', dataIndex: 'documentNo', width: 140 }, { title: '发文标题', dataIndex: 'name', width: 180 }, { title: '公文类型', dataIndex: 'documentType', width: 120 }, { title: '发文部门', dataIndex: 'department', width: 140 }, { title: '主送单位', dataIndex: 'receiver', width: 160 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '发文登记', formFields: [input('documentNo', '发文字号', { required: true }), input('name', '发文标题', { required: true }), input('documentType', '公文类型', { required: true }), select('department', '发文部门', departments, { required: true }), input('receiver', '主送单位'), upload('files', '正式文件和附件')] }),
  '/general/document/incoming': commonPage({ primaryAction: '收文登记', searchFields: [input('code', '收文编号'), input('name', '收文标题'), input('incomingUnit', '来文单位')], columns: [idx, { title: '收文编号', dataIndex: 'code', width: 140 }, { title: '收文标题', dataIndex: 'name', width: 180 }, { title: '来文文号', dataIndex: 'documentNo', width: 140 }, { title: '来文单位', dataIndex: 'incomingUnit', width: 160 }, { title: '收文日期', dataIndex: 'date', width: 120 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '收文登记', formFields: [input('code', '收文编号', { required: true, readOnly: true }), input('name', '收文标题', { required: true }), input('documentNo', '来文文号'), input('incomingUnit', '来文单位', { required: true }), date('date', '收文日期', { required: true })], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), openProcess('result', '办理结果', [select('department', '承办部门', departments, { required: true }), select('owner', '承办人', employees, { required: true }), text('remark', '办理结果', { required: true })]), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } })] }),
  '/general/notice/list': commonPage({ primaryAction: '通知发布', searchFields: [input('name', '通知标题'), input('noticeCategory', '通知分类'), select('department', '发布部门', departments)], columns: [idx, { title: '通知标题', dataIndex: 'name', width: 180 }, { title: '通知分类', dataIndex: 'noticeCategory', width: 120 }, { title: '发布部门', dataIndex: 'department', width: 140 }, { title: '发布人', dataIndex: 'owner', width: 110 }, { title: '发布时间', dataIndex: 'publishTime', width: 150 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '通知发布', formFields: [input('name', '通知标题', { required: true }), input('noticeCategory', '通知分类', { required: true }), select('department', '发布部门', departments, { required: true }), select('owner', '发布人', employees, { required: true }), text('remark', '通知内容', { required: true })] }),
  '/general/news/list': commonPage({ primaryAction: '新闻发布', searchFields: [input('name', '新闻标题'), input('newsCategory', '新闻分类'), select('department', '发布部门', departments)], columns: [idx, { title: '新闻标题', dataIndex: 'name', width: 180 }, { title: '新闻分类', dataIndex: 'newsCategory', width: 120 }, { title: '封面', dataIndex: 'cover', width: 120 }, { title: '发布部门', dataIndex: 'department', width: 140 }, { title: '作者', dataIndex: 'owner', width: 110 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '新闻发布', formFields: [input('name', '新闻标题', { required: true }), input('newsCategory', '新闻分类', { required: true }), upload('cover', '封面'), select('department', '发布部门', departments, { required: true }), select('owner', '作者', employees, { required: true }), text('remark', '正文', { required: true })] }),
  '/general/policy/list': commonPage({ primaryAction: '制度发布', searchFields: [input('policyNo', '制度编号'), input('name', '制度名称'), input('policyCategory', '制度分类')], columns: [idx, { title: '制度编号', dataIndex: 'policyNo', width: 140 }, { title: '制度名称', dataIndex: 'name', width: 180 }, { title: '制度分类', dataIndex: 'policyCategory', width: 120 }, { title: '当前版本', dataIndex: 'version', width: 100 }, { title: '归口部门', dataIndex: 'department', width: 140 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '制度发布', formFields: [input('policyNo', '制度编号', { required: true }), input('name', '制度名称', { required: true }), input('policyCategory', '制度分类', { required: true }), input('version', '当前版本'), select('department', '归口部门', departments, { required: true }), upload('files', '制度文件')], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }), openProcess('revise', '修订', [input('version', '新版本号', { required: true }), upload('files', '新制度文件', { required: true }), text('remark', '修订说明')]), openProcess('abolish', '废止', [date('finishDate', '废止日期', { required: true }), text('remark', '废止原因', { required: true })])] }),
  '/general/license/ledger': commonPage({ primaryAction: '证照档案维护', searchFields: [input('licenseName', '证照名称'), input('licenseNo', '证照编号'), input('licenseCategory', '证照分类'), select('status', '证照状态', statuses)], columns: [idx, { title: '证照名称', dataIndex: 'licenseName', width: 160 }, { title: '证照编号', dataIndex: 'licenseNo', width: 140 }, { title: '证照分类', dataIndex: 'licenseCategory', width: 120 }, { title: '持证主体', dataIndex: 'holder', width: 140 }, { title: '到期日期', dataIndex: 'expireDate', width: 120 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '证照档案维护', formFields: [input('licenseName', '证照名称', { required: true }), input('licenseNo', '证照编号', { required: true }), input('licenseCategory', '证照分类', { required: true }), input('holder', '持证主体', { required: true }), date('expireDate', '到期日期', { required: true }), upload('files', '证照扫描件')], rowActions: [action('view', '详情', { kind: 'link', effect: { type: 'openDetail' } }), action('edit', '编辑', { kind: 'link', effect: { type: 'openEdit' } }), openProcess('borrow', '证照借用登记', [date('borrowDate', '借用日期', { required: true }), select('owner', '借用人', employees, { required: true }), date('expectedReturnDate', '预计归还日期', { required: true })]), openProcess('return', '证照归还登记', [date('returnDate', '实际归还日期', { required: true }), select('status', '证照状态', statuses, { required: true }), text('remark', '异常说明')]), openProcess('renew', '证照续期登记', [date('effectiveDate', '新生效日期', { required: true }), date('expireDate', '新到期日期', { required: true }), upload('files', '新证照扫描件', { required: true }), number('amount', '办理费用'), input('sourceBill', '关联报销或付款单'), text('remark', '备注')])] }),
});

contentCategoryPage('/general/knowledge/category', '文档分类维护', '分类名称', '文档数量');
contentCategoryPage('/general/notice/category', '通知分类维护', '分类名称', '使用数量');
contentCategoryPage('/general/news/category', '新闻分类维护', '分类名称', '新闻数量');
contentCategoryPage('/general/policy/category', '制度分类维护', '分类名称', '制度数量', [select('department', '归口部门', departments)]);
contentCategoryPage('/general/license/category', '证照分类维护', '分类名称', '证照数量', [
  select('needAnnualReview', '是否需要年审', ['是', '否'], { required: true }),
  select('allowBorrow', '是否允许借用', ['是', '否'], { required: true }),
  number('remindDays', '默认提醒天数', { required: true }),
]);

Object.assign(oaExpansionPageConfigs, {
  '/settings/message': commonPage({ primaryAction: '新增消息模板', searchFields: [input('name', '消息类型'), select('status', '状态', statuses)], columns: [idx, { title: '消息类型', dataIndex: 'name', width: 160 }, { title: '触发场景', dataIndex: 'scene', width: 220 }, { title: '接收人', dataIndex: 'receiver', width: 180 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '消息模板', formFields: [input('name', '消息类型', { required: true }), input('scene', '触发场景', { required: true }), input('receiver', '接收人', { required: true }), select('status', '状态', statuses, { required: true })] }),
  '/settings/attachment': commonPage({ primaryAction: '新增附件规则', searchFields: [input('name', '附件类型'), select('status', '状态', statuses)], columns: [idx, { title: '附件类型', dataIndex: 'name', width: 160 }, { title: '大小限制', dataIndex: 'sizeLimit', width: 120 }, { title: '留存时间', dataIndex: 'retentionTime', width: 120 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '附件规则', formFields: [input('name', '附件类型', { required: true }), input('sizeLimit', '大小限制', { required: true }), input('retentionTime', '留存时间', { required: true }), select('status', '状态', statuses, { required: true })] }),
  '/settings/log': commonPage({ readonly: true, searchFields: [input('operator', '操作人'), input('businessType', '业务类型'), f('dateRange', '操作时间', { type: 'dateRange' })], columns: [idx, { title: '操作人', dataIndex: 'operator', width: 120 }, { title: '业务类型', dataIndex: 'businessType', width: 140 }, { title: '操作', dataIndex: 'operationSummary', width: 140 }, { title: '操作时间', dataIndex: 'date', width: 130 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '日志查询', formFields: [input('operator', '操作人'), input('businessType', '业务类型')] }),
  '/settings/dictionary': commonPage({ primaryAction: '新增字典项', searchFields: [input('name', '字典名称'), select('status', '状态', statuses)], columns: [idx, { title: '字典名称', dataIndex: 'name', width: 160 }, { title: '字典编码', dataIndex: 'code', width: 140 }, { title: '字典值', dataIndex: 'dictValue', width: 180 }, { title: '状态', dataIndex: 'status', width: 100, status: true }], formTitle: '字典项', formFields: [input('name', '字典名称', { required: true }), input('code', '字典编码', { required: true }), input('dictValue', '字典值', { required: true }), select('status', '状态', statuses, { required: true })] }),
});
