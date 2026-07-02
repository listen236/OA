import {
  ApartmentOutlined,
  AuditOutlined,
  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  HomeOutlined,
  IdcardOutlined,
  NotificationOutlined,
  ProfileOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShopOutlined,
  SolutionOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { MenuRoute } from '../types';

export const menuRoutes: MenuRoute[] = [
  {
    title: '人力资源管理',
    icon: <TeamOutlined />,
    children: [
      { path: '/dashboard/hr', title: '人资工作台', icon: <DashboardOutlined /> },
      {
        title: '组织架构',
        icon: <ApartmentOutlined />,
        children: [
          { path: '/organization/list', title: '组织管理' },
          { path: '/organization/chart', title: '组织架构图' },
          { path: '/organization/position', title: '岗位管理' },
        ],
      },
      {
        title: '员工管理',
        icon: <IdcardOutlined />,
        children: [
          { path: '/employee/list', title: '员工信息' },
          { path: '/employee/archive', title: '员工档案' },
          { path: '/employee/contract', title: '合同与协议' },
        ],
      },
      {
        title: '招聘管理',
        icon: <TeamOutlined />,
        children: [
          { path: '/recruitment/demand', title: '招聘需求' },
          { path: '/recruitment/resume', title: '简历筛选' },
          { path: '/recruitment/talent', title: '人才库' },
          { path: '/recruitment/interview', title: '发起面试' },
          { path: '/recruitment/offer', title: 'Offer发放' },
        ],
      },
      {
        title: '入转调离',
        icon: <SolutionOutlined />,
        children: [
          { path: '/lifecycle/onboarding', title: '入职管理' },
          { path: '/lifecycle/regularization', title: '转正管理' },
          { path: '/lifecycle/transfer', title: '人员调动' },
          { path: '/lifecycle/resignation', title: '离职管理' },
        ],
      },
      {
        title: '考勤管理',
        icon: <CalendarOutlined />,
        children: [
          { path: '/attendance/repair', title: '补卡申请' },
          { path: '/attendance/leave', title: '请假申请' },
          { path: '/attendance/overtime', title: '加班申请' },
          { path: '/attendance/out', title: '外出申请' },
          { path: '/attendance/trip', title: '出差申请' },
          { path: '/attendance/group', title: '考勤组管理' },
          { path: '/attendance/shift', title: '班次管理' },
          { path: '/attendance/schedule', title: '排班管理' },
          { path: '/attendance/rule', title: '考勤规则管理' },
          { path: '/attendance/holiday', title: '假期管理' },
          { path: '/attendance/clock-record', title: '打卡记录' },
          { path: '/attendance/daily-stat', title: '日考勤统计' },
          { path: '/attendance/monthly-stat', title: '月考勤统计' },
        ],
      },
      {
        title: '绩效管理',
        icon: <SafetyCertificateOutlined />,
        children: [
          { path: '/performance/plan', title: '考核计划' },
          { path: '/performance/progress', title: '考核进度' },
          { path: '/performance/template', title: '考核模板' },
          { path: '/performance/indicator', title: '考核指标' },
        ],
      },
      {
        title: '薪酬管理',
        icon: <DollarOutlined />,
        children: [
          { path: '/salary/approval', title: '薪资审批' },
          { path: '/salary/payslip', title: '工资条' },
        ],
      },
      {
        title: '数据分析',
        icon: <BarChartOutlined />,
        children: [
          { path: '/analytics/roster', title: '员工花名册' },
          { path: '/analytics/entry-exit', title: '入离职统计' },
          { path: '/analytics/attendance', title: '考勤汇总' },
          { path: '/analytics/salary', title: '薪资统计' },
          { path: '/analytics/hr-dashboard', title: 'HR看板' },
        ],
      },
    ],
  },
  {
    title: '费控管理',
    icon: <DollarOutlined />,
    children: [
      { path: '/expense/budget', title: '预算管理' },
      { path: '/expense/apply', title: '费用申请' },
      { path: '/expense/reimburse', title: '费用报销' },
      { path: '/expense/invoice', title: '发票夹' },
      { path: '/expense/type', title: '费用类型' },
    ],
  },
  {
    title: '综合管理',
    icon: <HomeOutlined />,
    children: [
      {
        title: '固定资产管理',
        icon: <ShopOutlined />,
        children: [
          { path: '/general/asset/ledger', title: '资产台账' },
          { path: '/general/asset/inbound', title: '资产入库' },
          { path: '/general/asset/claim', title: '资产领用' },
          { path: '/general/asset/transfer', title: '资产调拨' },
          { path: '/general/asset/borrow', title: '资产借用' },
          { path: '/general/asset/repair', title: '资产维修' },
          { path: '/general/asset/check', title: '资产盘点' },
          { path: '/general/asset/disposal', title: '资产处置' },
          { path: '/general/asset/category', title: '资产分类' },
        ],
      },
      {
        title: '会议管理',
        icon: <AuditOutlined />,
        children: [
          { path: '/general/meeting/reserve', title: '会议预约' },
          { path: '/general/meeting/mine', title: '我的会议' },
          { path: '/general/meeting/checkin', title: '会议签到' },
          { path: '/general/meeting/minutes', title: '会议纪要' },
          { path: '/general/meeting/room', title: '会议室管理' },
        ],
      },
      {
        title: '用章管理',
        icon: <FileProtectOutlined />,
        children: [
          { path: '/general/seal/apply', title: '用章申请' },
          { path: '/general/seal/archive', title: '印章档案' },
        ],
      },
      {
        title: '办公用品管理',
        icon: <ShopOutlined />,
        children: [
          { path: '/general/supply/claim', title: '用品领用' },
          { path: '/general/supply/inbound', title: '入库管理' },
          { path: '/general/supply/outbound', title: '其他出库' },
          { path: '/general/supply/stock', title: '实时库存' },
          { path: '/general/supply/flow', title: '库存流水' },
          { path: '/general/supply/check', title: '库存盘点' },
          { path: '/general/supply/base', title: '用品基础资料' },
        ],
      },
      {
        title: '知识库',
        icon: <ReadOutlined />,
        children: [
          { path: '/general/knowledge/document', title: '文档中心' },
          { path: '/general/knowledge/category', title: '文档分类' },
        ],
      },
      {
        title: '公文管理',
        icon: <FileDoneOutlined />,
        children: [
          { path: '/general/document/outgoing', title: '发文登记' },
          { path: '/general/document/incoming', title: '收文登记' },
        ],
      },
      {
        title: '通知公告',
        icon: <NotificationOutlined />,
        children: [
          { path: '/general/notice/list', title: '通知公告' },
          { path: '/general/notice/category', title: '通知分类' },
        ],
      },
      {
        title: '新闻管理',
        icon: <ProfileOutlined />,
        children: [
          { path: '/general/news/list', title: '新闻中心' },
          { path: '/general/news/category', title: '新闻分类' },
        ],
      },
      {
        title: '制度规范',
        icon: <SafetyCertificateOutlined />,
        children: [
          { path: '/general/policy/list', title: '制度中心' },
          { path: '/general/policy/category', title: '制度分类' },
        ],
      },
      {
        title: '证照管理',
        icon: <FileProtectOutlined />,
        children: [
          { path: '/general/license/ledger', title: '证照台账' },
          { path: '/general/license/category', title: '证照分类' },
        ],
      },
    ],
  },
  {
    title: '系统设置',
    icon: <SettingOutlined />,
    children: [
      { path: '/settings/workflow', title: '流程管理' },
      { path: '/settings/role', title: '角色管理' },
      { path: '/settings/permission', title: '权限管理' },
    ],
  },
];

export const flattenRoutes = (routes: MenuRoute[] = menuRoutes): Required<Pick<MenuRoute, 'path' | 'title'>>[] =>
  routes.flatMap((route) => {
    if (route.path) {
      return [{ path: route.path, title: route.title }];
    }
    return flattenRoutes(route.children ?? []);
  });

export const routeTitleMap = new Map(flattenRoutes().map((route) => [route.path, route.title]));
