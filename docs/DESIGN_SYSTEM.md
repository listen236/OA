# Design System 设计系统规范

## 视觉基调

- 类型：企业级 ERP / 智能办公后台
- 风格：清爽、克制、高密度、强表格、强表单
- 主色：Ant Design 默认蓝 `#1677ff`
- 背景色：`#f5f7fa`
- 内容卡片：白色
- 边框：`#e5e7eb`

## 尺寸

| 元素 | 规范 |
|---|---|
| Header 高度 | 56px |
| SideMenu 宽度 | 180px |
| MultiTabs 高度 | 40px |
| 查询区 Padding | 16px |
| 表格行高 | 紧凑型 middle / small |
| 表单 Label 宽度 | 100px ~ 120px |
| 页面边距 | 16px |

## Ant Design 组件使用

| 场景 | 组件 |
|---|---|
| 页面布局 | Layout |
| 菜单 | Menu |
| 多标签 | Tabs |
| 查询区 | Form + Row + Col |
| 表格 | Table |
| 按钮 | Button |
| 新增编辑 | Drawer / Modal / Form |
| 详情 | Descriptions / Card / Tabs |
| 上传 | Upload / Dragger |
| 状态 | Tag |
| 审批记录 | Timeline |
| 统计图 | Card + Statistic / 简单图表占位 |

## 状态颜色

| 状态 | 颜色 |
|---|---|
| 启用 / 正常 / 已通过 | green |
| 停用 / 已拒绝 / 异常 | red |
| 审批中 / 处理中 | blue |
| 草稿 / 待提交 | default |
| 待处理 / 待确认 | orange |
| 已归档 / 已锁定 | purple |

## 表格规范

- 每个表格必须包含序号列。
- 操作列固定右侧。
- 操作超过 3 个时使用 Dropdown More。
- 金额、人数、时长等数字右对齐。
- 状态使用 Tag。
- 日期格式：`YYYY-MM-DD HH:mm` 或 `YYYY-MM-DD`。

## 表单规范

- 新增/编辑表单使用两列。
- 复杂表单按 Card 分区。
- 必填项使用 rules 校验。
- 保存成功后提示并关闭 Drawer。
- 取消时如有改动，需要二次确认。

## 交互规范

- 搜索后表格刷新并回到第一页。
- 重置后清空查询条件。
- 新增、编辑、删除、导入、导出均给出 message 提示。
- 删除操作使用 Popconfirm。
- 批量操作需先选择数据，否则提示“请选择数据”。
