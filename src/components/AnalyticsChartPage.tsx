import { useMemo } from 'react';
import { Button, DatePicker, Form, Input, Select, Space, Table, Tag, TreeSelect, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';
import { getPageConfig } from '../config/pageConfigs';
import type { FieldConfig, MockRecord, SelectOption } from '../types';
import { PageContainer } from './PageContainer';
import { cloneTreeSelectData } from '../utils/treeSelect';

interface AnalyticsChartPageProps {
  title: string;
  path: string;
}

interface MetricItem {
  label: string;
  value: string;
  hint: string;
}

interface ChartPanel {
  title: string;
  type: 'trend' | 'bar' | 'donut' | 'funnel';
  labels: string[];
  values: number[];
  legend?: string[];
}

interface AnalyticsPageModel {
  metrics: MetricItem[];
  charts: ChartPanel[];
  detailTitle?: string;
  detailColumns?: ColumnsType<MockRecord>;
  detailData?: MockRecord[];
  warnings?: Array<{ label: string; count: number; level: '高' | '中' | '低'; source: string }>;
  canExport?: boolean;
}

const departments = ['总经办', '人力资源部', '生产一部', '质量管理部', '财务部', '技术中心'];

function renderSearchControl(field: FieldConfig) {
  const normalizedOptions = (field.options ?? []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const hasRichLabels = normalizedOptions.some((option) => option.label !== option.value);
  if (field.type === 'select') {
    return (
      <Select placeholder={field.placeholder ?? '请选择'} allowClear optionFilterProp="children" optionLabelProp={hasRichLabels ? 'value' : 'children'} popupClassName={hasRichLabels ? 'erp-rich-select-dropdown' : undefined}>
        {(normalizedOptions as SelectOption[]).map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
  if (field.type === 'treeSelect') {
    return <TreeSelect className="full-control" placeholder={field.placeholder ?? '请选择'} allowClear treeDefaultExpandAll treeData={cloneTreeSelectData(field.treeData)} />;
  }
  if (field.type === 'dateRange') {
    return <DatePicker.RangePicker className="full-control" />;
  }
  if (field.type === 'month') {
    return <DatePicker picker="month" className="full-control" />;
  }
  if (field.type === 'date') {
    return <DatePicker className="full-control" />;
  }
  return <Input placeholder={field.placeholder ?? '请输入'} allowClear />;
}

const entryExitDetails: MockRecord[] = [
  { id: 'ee-1', code: 'ONB202606001', employeeNo: 'AIF1001', name: '员工1', department: '人力资源部', position: 'HR专员', changeType: '入职', changeDate: '2026-06-03', sourceBill: '入职管理', owner: '张红红', status: '已确认', date: '2026-06-03' },
  { id: 'ee-2', code: 'RES202606002', employeeNo: 'AIF1002', name: '员工2', department: '生产一部', position: '生产主管', changeType: '离职', changeDate: '2026-06-08', sourceBill: '离职管理', owner: '李华', status: '已离职', date: '2026-06-08' },
  { id: 'ee-3', code: 'ONB202606003', employeeNo: 'AIF1003', name: '员工3', department: '技术中心', position: '系统管理员', changeType: '入职', changeDate: '2026-06-16', sourceBill: '入职管理', owner: '王敏', status: '已确认', date: '2026-06-16' },
];

const attendanceDetails: MockRecord[] = [
  { id: 'att-1', code: 'ATT202606001', employeeNo: 'AIF1001', name: '员工1', department: '总经办', actualDays: 21, missingCount: 2, leaveHours: 8, overtimeHours: 6, hrConfirmStatus: '已确认', owner: '张红红', status: '已确认', date: '2026-06' },
  { id: 'att-2', code: 'ATT202606002', employeeNo: 'AIF1002', name: '员工2', department: '人力资源部', actualDays: 20, missingCount: 4, leaveHours: 16, overtimeHours: 2, hrConfirmStatus: '待确认', owner: '李华', status: '待确认', date: '2026-06' },
  { id: 'att-3', code: 'ATT202606003', employeeNo: 'AIF1003', name: '员工3', department: '生产一部', actualDays: 22, missingCount: 1, leaveHours: 0, overtimeHours: 12, hrConfirmStatus: '已确认', owner: '王敏', status: '已确认', date: '2026-06' },
];

const salaryDetails: MockRecord[] = [
  { id: 'sal-1', code: 'PAY202606001', name: '普通工资批次', salaryMonth: '2026-06', batchType: '普通', department: '全公司', headcount: 126, payrollAmount: 1286000, archiveTime: '2026-06-10 18:00', owner: '陈晓', status: '已归档', date: '2026-06-10' },
  { id: 'sal-2', code: 'PAY202606002', name: '补发批次', salaryMonth: '2026-06', batchType: '补发', department: '技术中心', headcount: 8, payrollAmount: 62400, archiveTime: '2026-06-12 15:20', owner: '陈晓', status: '已归档', date: '2026-06-12' },
  { id: 'sal-3', code: 'PAY202606003', name: '更正批次', salaryMonth: '2026-06', batchType: '更正', department: '生产一部', headcount: 5, payrollAmount: 31800, archiveTime: '2026-06-14 11:30', owner: '陈晓', status: '已归档', date: '2026-06-14' },
];

const money = (value?: number) => `￥${Number(value ?? 0).toLocaleString()}`;

function modelForPath(path: string): AnalyticsPageModel {
  if (path === '/analytics/attendance') {
    return {
      metrics: [
        { label: '出勤天数', value: '2,618', hint: '月考勤统计汇总' },
        { label: '异常次数', value: '43', hint: '迟到、早退、缺卡等' },
        { label: '请假时长', value: '186h', hint: '审批通过后写入统计' },
        { label: '加班时长', value: '312h', hint: '不自动进入薪资计算' },
        { label: '缺卡次数', value: '18', hint: '可钻取打卡记录' },
      ],
      charts: [
        { title: '异常类型分布', type: 'donut', labels: ['迟到', '早退', '缺卡', '外勤异常'], values: [16, 7, 18, 2] },
        { title: '部门异常排名', type: 'bar', labels: departments, values: [6, 9, 13, 4, 5, 6] },
        { title: '月度趋势', type: 'trend', labels: ['1月', '2月', '3月', '4月', '5月', '6月'], values: [31, 28, 36, 25, 42, 43] },
      ],
      detailTitle: '考勤汇总明细',
      detailData: attendanceDetails,
      detailColumns: [
        { title: '工号', dataIndex: 'employeeNo' },
        { title: '姓名', dataIndex: 'name' },
        { title: '所属部门', dataIndex: 'department' },
        { title: '出勤天数', dataIndex: 'actualDays', align: 'right' },
        { title: '异常次数', dataIndex: 'missingCount', align: 'right' },
        { title: '请假时长', dataIndex: 'leaveHours', align: 'right', render: (value) => `${value}h` },
        { title: '加班时长', dataIndex: 'overtimeHours', align: 'right', render: (value) => `${value}h` },
        { title: 'HR确认状态', dataIndex: 'hrConfirmStatus', render: (value) => <Tag color={value === '已确认' ? 'green' : 'orange'}>{String(value)}</Tag> },
        { title: '操作', render: () => <Button type="link" size="small" onClick={() => message.success('已跳转日考勤统计或打卡记录')}>钻取</Button> },
      ],
      canExport: true,
    };
  }

  if (path === '/analytics/salary') {
    return {
      metrics: [
        { label: '薪资总额', value: '￥1,380,200', hint: '仅统计已归档批次' },
        { label: '发薪人数', value: '139', hint: '同员工多批次按明细行统计' },
        { label: '平均实发金额', value: '￥9,929', hint: '按字段权限展示' },
        { label: '补发/更正金额', value: '￥94,200', hint: '关联原批次后统计' },
      ],
      charts: [
        { title: '部门分布', type: 'bar', labels: departments, values: [18, 12, 31, 24, 15, 39] },
        { title: '薪资项构成', type: 'donut', labels: ['基本工资', '绩效奖金', '补贴', '扣款'], values: [58, 24, 12, 6] },
        { title: '月份趋势', type: 'trend', labels: ['1月', '2月', '3月', '4月', '5月', '6月'], values: [112, 118, 121, 119, 132, 138] },
      ],
      detailTitle: '归档薪资批次',
      detailData: salaryDetails,
      detailColumns: [
        { title: '批次编号', dataIndex: 'code' },
        { title: '薪资月份', dataIndex: 'salaryMonth' },
        { title: '批次类型', dataIndex: 'batchType' },
        { title: '所属部门', dataIndex: 'department' },
        { title: '人数', dataIndex: 'headcount', align: 'right' },
        { title: '总金额', dataIndex: 'payrollAmount', align: 'right', render: money },
        { title: '归档时间', dataIndex: 'archiveTime' },
        { title: '操作', render: () => <Button type="link" size="small" onClick={() => message.success('已跳转薪资审批批次')}>钻取批次</Button> },
      ],
      canExport: true,
    };
  }

  if (path === '/analytics/hr-dashboard') {
    return {
      metrics: [
        { label: '在职人数', value: '126', hint: '员工信息当前状态' },
        { label: '待入职人数', value: '8', hint: '入职管理待入职' },
        { label: '待转正人数', value: '12', hint: '转正管理待转正' },
        { label: '待离职人数', value: '3', hint: '离职管理待离职' },
        { label: '招聘中岗位', value: '9', hint: '招聘需求未关闭' },
        { label: '考勤异常', value: '43', hint: '当前时间范围' },
        { label: '绩效完成率', value: '86%', hint: '已发布计划任务' },
        { label: '待审批薪资批次', value: '2', hint: '薪资审批处理中' },
      ],
      charts: [
        { title: '人员趋势', type: 'trend', labels: ['1月', '2月', '3月', '4月', '5月', '6月'], values: [112, 116, 118, 121, 124, 126] },
        { title: '招聘转化', type: 'funnel', labels: ['简历', '面试', 'Offer', '入职'], values: [168, 76, 24, 8] },
        { title: '考勤异常', type: 'bar', labels: departments, values: [6, 9, 13, 4, 5, 6] },
        { title: '绩效分布', type: 'donut', labels: ['优秀', '良好', '合格', '待改进'], values: [18, 45, 31, 6] },
        { title: '薪资趋势', type: 'trend', labels: ['1月', '2月', '3月', '4月', '5月', '6月'], values: [112, 118, 121, 119, 132, 138] },
      ],
      warnings: [
        { label: '合同到期', count: 6, level: '高', source: '合同与协议' },
        { label: '试用期到期', count: 12, level: '中', source: '转正管理' },
        { label: '考勤异常', count: 43, level: '中', source: '考勤统计' },
        { label: '待确认月报', count: 5, level: '低', source: '月考勤统计' },
        { label: '待发工资条', count: 126, level: '高', source: '工资条' },
      ],
      canExport: false,
    };
  }

  return {
    metrics: [
      { label: '入职人数', value: '18', hint: '已确认入职' },
      { label: '离职人数', value: '5', hint: '已离职，不含已放弃' },
      { label: '净增人数', value: '+13', hint: '入职人数 - 离职人数' },
    ],
    charts: [
      { title: '入离职趋势图', type: 'trend', labels: ['1月', '2月', '3月', '4月', '5月', '6月'], values: [6, 9, 7, 12, 10, 18], legend: ['入职', '离职'] },
      { title: '部门分布图', type: 'bar', labels: departments, values: [2, 4, 3, 1, 2, 6] },
    ],
    detailTitle: '入离职明细',
    detailData: entryExitDetails,
    detailColumns: [
      { title: '工号', dataIndex: 'employeeNo' },
      { title: '姓名', dataIndex: 'name' },
      { title: '所属部门', dataIndex: 'department' },
      { title: '岗位', dataIndex: 'position' },
      { title: '变动类型', dataIndex: 'changeType', render: (value) => <Tag color={value === '入职' ? 'green' : 'orange'}>{String(value)}</Tag> },
      { title: '变动日期', dataIndex: 'changeDate' },
      { title: '来源单据', dataIndex: 'sourceBill' },
      { title: '操作', render: (_value, record) => <Button type="link" size="small" onClick={() => message.success(`已跳转${record.changeType === '入职' ? '入职管理' : '离职管理'}`)}>钻取</Button> },
    ],
    canExport: true,
  };
}

function ChartBlock({ chart }: { chart: ChartPanel }) {
  const max = Math.max(...chart.values, 1);
  const total = chart.values.reduce((sum, value) => sum + value, 0) || 1;

  if (chart.type === 'donut') {
    return (
      <div className="analytics-donut-wrap">
        <div className="analytics-donut" style={{ '--first': `${Math.round((chart.values[0] / total) * 360)}deg`, '--second': `${Math.round(((chart.values[0] + chart.values[1]) / total) * 360)}deg` } as React.CSSProperties}>
          <span>{total}</span>
        </div>
        <div className="analytics-legend">
          {chart.labels.map((label, index) => (
            <div key={label}>
              <i className={`legend-dot legend-dot-${index}`} />
              <span>{label}</span>
              <strong>{chart.values[index]}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chart.type === 'funnel') {
    return (
      <div className="analytics-funnel">
        {chart.labels.map((label, index) => (
          <div key={label} className="analytics-funnel-row">
            <span>{label}</span>
            <div><i style={{ width: `${Math.max((chart.values[index] / max) * 100, 18)}%` }} /></div>
            <strong>{chart.values[index]}</strong>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={chart.type === 'trend' ? 'analytics-trend-chart' : 'analytics-bar-chart'}>
      {chart.labels.map((label, index) => (
        <div key={label} className="analytics-chart-bar">
          <span style={{ height: `${Math.max((chart.values[index] / max) * 100, 12)}%` }} />
          {chart.type === 'trend' && <em style={{ bottom: `${Math.max((chart.values[index] / max) * 100, 12)}%` }} />}
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChartPage({ title, path }: AnalyticsChartPageProps) {
  const [form] = Form.useForm();
  const pageConfig = useMemo(() => getPageConfig(path), [path]);
  const model = useMemo(() => modelForPath(path), [path]);

  return (
    <PageContainer title={title}>
      <div className="analytics-page">
        <div className="analytics-filter-panel">
          <Form form={form} layout="vertical">
            <div className="analytics-filter-row">
              {pageConfig.searchFields.map((field) => (
                <Form.Item label={field.label} name={String(field.name)} key={String(field.name)} required={field.required}>
                  {renderSearchControl(field)}
                </Form.Item>
              ))}
              <Space className="analytics-filter-actions">
                <Button type="primary" icon={<SearchOutlined />} onClick={() => message.success('查询完成')}>
                  查询
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
                <Button onClick={() => message.success('已钻取来源明细')}>钻取</Button>
                {model.canExport && (
                  <Button icon={<ExportOutlined />} onClick={() => message.success('导出任务已创建')}>
                    导出
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </div>

        <div className="analytics-metric-grid">
          {model.metrics.map((metric) => (
            <div className="analytics-metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <em>{metric.hint}</em>
            </div>
          ))}
        </div>

        <div className="analytics-chart-grid">
          {model.charts.map((chart) => (
            <section className="analytics-chart-panel" key={chart.title}>
              <div className="analytics-panel-head">
                <h3>{chart.title}</h3>
                <Button type="link" size="small" onClick={() => message.success('已钻取来源明细')}>钻取</Button>
              </div>
              <ChartBlock chart={chart} />
            </section>
          ))}
        </div>

        {model.warnings?.length ? (
          <section className="analytics-chart-panel analytics-warning-panel">
            <div className="analytics-panel-head">
              <h3>预警区</h3>
            </div>
            <div className="analytics-warning-list">
              {model.warnings.map((warning) => (
                <button key={warning.label} type="button" onClick={() => message.success(`已打开${warning.source}`)}>
                  <span>{warning.label}</span>
                  <strong>{warning.count}</strong>
                  <Tag color={warning.level === '高' ? 'red' : warning.level === '中' ? 'orange' : 'blue'}>{warning.level}</Tag>
                  <em>{warning.source}</em>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {model.detailData?.length && model.detailColumns ? (
          <section className="analytics-chart-panel analytics-detail-panel">
            <div className="analytics-panel-head">
              <h3>{model.detailTitle}</h3>
            </div>
            <Table size="small" rowKey="id" columns={model.detailColumns} dataSource={model.detailData} pagination={false} />
          </section>
        ) : null}
      </div>
    </PageContainer>
  );
}
