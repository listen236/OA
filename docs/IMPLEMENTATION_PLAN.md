# 实施计划

## 第一阶段：项目骨架

1. 初始化 Vite + React + TypeScript。
2. 安装 Ant Design、React Router、Zustand。
3. 实现 BasicLayout、HeaderBar、SideMenu、MultiTabs。
4. 完成全局样式，保证整体接近参考截图。

## 第二阶段：公共组件

1. PageContainer
2. SearchPanel
3. ActionToolbar
4. DataTable
5. FormSection
6. UploadBox
7. StatusTag

## 第三阶段：核心页面

优先生成：

1. 人资工作台
2. 组织管理
3. 员工信息
4. 招聘需求
5. 入职管理
6. 考勤组管理
7. 班次管理
8. 排班管理
9. 日考勤统计
10. 月考勤统计
11. 考核计划
12. 薪资审批
13. 工资条

## 第四阶段：补齐模块

补齐所有 PRD 中的剩余页面，保持统一模板。

## 第五阶段：交互完善

1. 新增/编辑 Drawer。
2. 详情 Drawer。
3. 删除确认。
4. 批量选择。
5. 导入导出提示。
6. 审批 Timeline。
7. Mock 数据搜索过滤。

## 验收标准

- `npm install` 后能运行。
- `npm run dev` 能打开完整系统。
- 左侧菜单完整。
- 多标签页可用。
- 每个模块都有页面。
- 样式接近参考图。
- 表单和列表符合 PRD 字段。
