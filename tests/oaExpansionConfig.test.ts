import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const menuSource = readFileSync('src/routes/menuRoutes.tsx', 'utf8');
const configSource = readFileSync('src/config/oaExpansionConfigs.ts', 'utf8');

for (const topLevelMenu of ['人力资源管理', '费控管理', '综合管理', '系统设置']) {
  assert.ok(menuSource.includes(`title: '${topLevelMenu}'`), `missing top-level menu: ${topLevelMenu}`);
}

assert.ok(!menuSource.includes("title: '费控首页'"), 'expense dashboard should be removed from menu');
assert.ok(!menuSource.includes("path: '/expense/dashboard'"), 'expense dashboard route should be removed from menu');
assert.ok(!configSource.includes("'/expense/dashboard'"), 'expense dashboard page config should be removed');

for (const route of [
  '/expense/apply',
  '/expense/reimburse',
  '/expense/statistics',
  '/general/asset/ledger',
  '/general/meeting/reserve',
  '/general/seal/apply',
  '/general/supply/base',
  '/general/knowledge/document',
  '/general/document/outgoing',
  '/general/notice/list',
  '/general/news/list',
  '/general/policy/list',
  '/general/license/ledger',
]) {
  assert.ok(menuSource.includes(`path: '${route}'`), `missing route in menu: ${route}`);
  assert.ok(configSource.includes(`'${route}'`), `missing page config: ${route}`);
}

assert.ok(configSource.includes("effect: { type: 'openProcess'"), 'process actions should open dialogs');
assert.ok(configSource.includes("type: 'detailTable'"), 'employee reimbursement details should render as detail tables');
assert.ok(configSource.includes("'添加费用明细'"), 'expense detail table should expose an add button');
assert.ok(configSource.includes("'添加发票明细'"), 'invoice detail table should expose an add button');

const reimburseBasicIndex = configSource.indexOf("section('基本字段'");
const reimburseExpenseIndex = configSource.indexOf("detailSection('费用明细'");
const reimburseInvoiceIndex = configSource.indexOf("detailSection('发票明细'");
const reimburseSummaryIndex = configSource.indexOf("section('金额汇总'");
const reimburseSupplementIndex = configSource.indexOf("section('补充信息'");
assert.ok(
  reimburseBasicIndex < reimburseExpenseIndex &&
    reimburseExpenseIndex < reimburseSummaryIndex &&
    reimburseExpenseIndex < reimburseInvoiceIndex &&
    reimburseInvoiceIndex < reimburseSummaryIndex &&
    reimburseSummaryIndex < reimburseSupplementIndex,
  'employee reimbursement sections should keep invoice details inside expense details and attachment fields at the bottom',
);
assert.ok(configSource.includes("nestedSections"), 'invoice details should be nested inside expense details');
assert.ok(configSource.includes("dataIndex: 'invoiceDetails'"), 'expense detail table should show invoice detail column');
assert.ok(!configSource.includes("input('relatedInvoice', '关联发票')"), 'expense detail form should not keep related invoice field');
assert.ok(!configSource.includes("text('overStandardReason', '超标原因')"), 'expense detail form should not keep over standard reason field');

for (const field of [
  '关联费用申请',
  '关联借款单',
  '收款账户',
  '报销事由',
  '费用发生日期',
  '是否有发票',
  '发票文件',
  '发票识别状态',
  '发票同步状态',
  '报销总金额',
  '核定报销金额',
  '核减原因',
  '付款方式',
  '付款凭证',
]) {
  assert.ok(configSource.includes(field), `missing employee reimbursement field: ${field}`);
}

console.log('oa expansion config test passed');
