import {
  Alert,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { PageContainer } from './PageContainer';

const metricCards = [
  { title: '在职员工', value: 386, suffix: '人', trend: '+12 本月', icon: <TeamOutlined />, color: '#1677ff' },
  { title: '本月入职', value: 18, suffix: '人', trend: '待入职 6 人', icon: <UserAddOutlined />, color: '#52c41a' },
  { title: '本月离职', value: 5, suffix: '人', trend: '离职率 1.3%', icon: <UserSwitchOutlined />, color: '#fa8c16' },
  { title: '待办审批', value: 27, suffix: '项', trend: '超时 3 项', icon: <ClockCircleOutlined />, color: '#722ed1' },
];

const todoItems = [
  { title: '入职资料待确认', count: 6, tag: '入职', color: 'blue' },
  { title: '请假申请待审批', count: 9, tag: '考勤', color: 'orange' },
  { title: '薪资批次待复核', count: 2, tag: '薪酬', color: 'purple' },
  { title: '合同即将到期', count: 10, tag: '员工', color: 'red' },
];

const quickActions = [
  { label: '新增员工', icon: <UserAddOutlined /> },
  { label: '发起招聘', icon: <FileTextOutlined /> },
  { label: '排班维护', icon: <CalendarOutlined /> },
  { label: '薪资审批', icon: <CheckCircleOutlined /> },
];

const departmentData = [
  { name: '生产一部', value: 126, percent: 86 },
  { name: '生产二部', value: 92, percent: 68 },
  { name: '质量管理部', value: 48, percent: 42 },
  { name: '技术中心', value: 64, percent: 55 },
];

export function HrDashboard() {
  return (
    <PageContainer title="人资工作台">
      <div className="dashboard-page">
        <Row gutter={[12, 12]}>
          {metricCards.map((item) => (
            <Col span={6} key={item.title}>
              <Card size="small" className="dashboard-metric-card">
                <div className="metric-card-body">
                  <div className="metric-icon" style={{ color: item.color, backgroundColor: `${item.color}14` }}>
                    {item.icon}
                  </div>
                  <div>
                    <Statistic title={item.title} value={item.value} suffix={item.suffix} />
                    <div className="metric-trend">{item.trend}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[12, 12]} className="dashboard-section">
          <Col span={16}>
            <Card size="small" title="人力概览" extra={<Button type="link">查看明细</Button>}>
              <div className="overview-grid">
                <div className="overview-chart">
                  <div className="chart-title">近 6 个月入离职趋势</div>
                  <div className="bar-chart">
                    {[42, 58, 46, 72, 64, 80].map((height, index) => (
                      <div className="bar-group" key={index}>
                        <span className="bar-entry" style={{ height: `${height}%` }} />
                        <span className="bar-exit" style={{ height: `${Math.max(18, height - 22)}%` }} />
                        <em>{`${index + 1}月`}</em>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="overview-side">
                  <Alert
                    type="info"
                    showIcon
                    message="今日有 4 名员工入职，2 个招聘需求等待发布。"
                  />
                  {departmentData.map((item) => (
                    <div className="dept-progress" key={item.name}>
                      <div>
                        <span>{item.name}</span>
                        <strong>{item.value} 人</strong>
                      </div>
                      <Progress percent={item.percent} showInfo={false} size="small" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small" title="快捷入口">
              <div className="quick-action-grid">
                {quickActions.map((action) => (
                  <Button key={action.label} icon={action.icon}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
            <Card size="small" title="风险预警" className="dashboard-stacked-card">
              <Space direction="vertical" size={8} className="full-control">
                <Alert type="warning" showIcon message="3 条考勤异常超过 48 小时未处理" />
                <Alert type="error" showIcon message="2 份合同 7 日内到期" />
                <Alert type="info" showIcon message="薪资审批批次等待财务复核" />
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]} className="dashboard-section">
          <Col span={8}>
            <Card size="small" title="待办事项" extra={<Button type="link">全部</Button>}>
              <Space direction="vertical" size={10} className="full-control">
                {todoItems.map((item) => (
                  <div className="todo-card-row" key={item.title}>
                    <div>
                      <Tag color={item.color}>{item.tag}</Tag>
                      <span>{item.title}</span>
                    </div>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small" title="招聘漏斗">
              <div className="funnel-list">
                {[
                  ['新增简历', 128, 100],
                  ['初筛通过', 76, 72],
                  ['面试中', 34, 46],
                  ['待发 Offer', 12, 28],
                ].map(([label, value, percent]) => (
                  <div className="funnel-row" key={String(label)}>
                    <span>{label}</span>
                    <Progress percent={Number(percent)} size="small" />
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small" title="近期动态">
              <Timeline
                items={[
                  { color: 'blue', children: '09:20 张红红提交招聘需求' },
                  { color: 'green', children: '10:05 李华完成入职确认' },
                  { color: 'orange', children: '11:30 考勤异常待复核' },
                  { color: 'gray', children: '14:00 薪资批次进入审批' },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
}
