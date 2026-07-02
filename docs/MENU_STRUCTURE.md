# 菜单与路由结构

```ts
export const menuRoutes = [
  { path: '/dashboard/hr', title: '人资工作台' },
  { title: '组织架构', children: [
    { path: '/organization/list', title: '组织管理' },
    { path: '/organization/chart', title: '组织架构图' },
    { path: '/organization/position', title: '岗位管理' },
  ]},
  { title: '员工管理', children: [
    { path: '/employee/list', title: '员工信息' },
    { path: '/employee/archive', title: '员工档案' },
    { path: '/employee/contract', title: '合同与协议' },
  ]},
  { title: '招聘管理', children: [
    { path: '/recruitment/demand', title: '招聘需求' },
    { path: '/recruitment/resume', title: '简历筛选' },
    { path: '/recruitment/talent', title: '人才库' },
    { path: '/recruitment/interview', title: '发起面试' },
    { path: '/recruitment/offer', title: 'Offer发放' },
  ]},
  { title: '入转调离', children: [
    { path: '/lifecycle/onboarding', title: '入职管理' },
    { path: '/lifecycle/regularization', title: '转正管理' },
    { path: '/lifecycle/transfer', title: '人员调动' },
    { path: '/lifecycle/resignation', title: '离职管理' },
  ]},
  { title: '考勤管理', children: [
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
  ]},
  { title: '绩效管理', children: [
    { path: '/performance/plan', title: '考核计划' },
    { path: '/performance/progress', title: '考核进度' },
    { path: '/performance/template', title: '考核模板' },
    { path: '/performance/indicator', title: '考核指标' },
  ]},
  { title: '薪酬管理', children: [
    { path: '/salary/approval', title: '薪资审批' },
    { path: '/salary/payslip', title: '工资条' },
  ]},
  { title: '数据分析', children: [
    { path: '/analytics/roster', title: '员工花名册' },
    { path: '/analytics/entry-exit', title: '入离职统计' },
    { path: '/analytics/attendance', title: '考勤汇总' },
    { path: '/analytics/salary', title: '薪资统计' },
    { path: '/analytics/hr-dashboard', title: 'HR看板' },
  ]},
  { title: '系统设置', children: [
    { path: '/settings/workflow', title: '流程管理' },
    { path: '/settings/role', title: '角色管理' },
    { path: '/settings/permission', title: '权限管理' },
  ]},
]
```
