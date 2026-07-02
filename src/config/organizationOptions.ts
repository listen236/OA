export const organizationOptions = [
  { name: '智能办公系统', orgType: '公司', status: '启用' },
  { name: '未来制造科技', orgType: '公司', status: '启用' },
  { name: '云智人力服务', orgType: '公司', status: '启用' },
  { name: '总经办', orgType: '部门', status: '启用' },
  { name: '人力资源部', orgType: '部门', status: '启用' },
  { name: '生产一部', orgType: '部门', status: '启用' },
  { name: '生产二部', orgType: '部门', status: '启用' },
  { name: '质量管理部', orgType: '部门', status: '启用' },
  { name: '财务部', orgType: '部门', status: '启用' },
  { name: '技术中心', orgType: '部门', status: '启用' },
] as const;

export const companyOrganizations = organizationOptions
  .filter((organization) => organization.orgType === '公司' && organization.status === '启用')
  .map((organization) => organization.name);

const employeeSpace = '　　　';

export const employeeOptions = [
  { value: '张红红', label: `张红红(AIF1001)${employeeSpace}人力资源部`, employeeNo: 'AIF1001', department: '人力资源部' },
  { value: '李华', label: `李华(AIF1002)${employeeSpace}生产一部`, employeeNo: 'AIF1002', department: '生产一部' },
  { value: '王敏', label: `王敏(AIF1003)${employeeSpace}生产二部`, employeeNo: 'AIF1003', department: '生产二部' },
  { value: '赵强', label: `赵强(AIF1004)${employeeSpace}质量管理部`, employeeNo: 'AIF1004', department: '质量管理部' },
  { value: '陈晓', label: `陈晓(AIF1005)${employeeSpace}财务部`, employeeNo: 'AIF1005', department: '财务部' },
  { value: 'admin', label: `admin(AIF1006)${employeeSpace}总经办`, employeeNo: 'AIF1006', department: '总经办' },
] as const;

export const employeeNoByName = Object.fromEntries(employeeOptions.map((employee) => [employee.value, employee.employeeNo])) as Record<string, string>;

export const departmentTreeOptions = [
  {
    title: '智能办公系统',
    value: '智能办公系统',
    children: [
      { title: '总经办', value: '总经办' },
      { title: '人力资源部', value: '人力资源部' },
      {
        title: '制造中心',
        value: '制造中心',
        children: [
          { title: '生产一部', value: '生产一部' },
          { title: '生产二部', value: '生产二部' },
          { title: '质量管理部', value: '质量管理部' },
        ],
      },
      {
        title: '职能中心',
        value: '职能中心',
        children: [
          { title: '财务部', value: '财务部' },
          { title: '技术中心', value: '技术中心' },
        ],
      },
    ],
  },
] as const;
