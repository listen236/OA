import {
  ApartmentOutlined,
  BankOutlined,
  DownOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Select, Space, message } from 'antd';
import { useMemo, useState } from 'react';
import { PageContainer } from './PageContainer';

interface OrgNode {
  id: string;
  name: string;
  type: 'company' | 'department';
  className: string;
  leader: string;
  employeeCount: number;
  positionCount: number;
  icon: 'company' | 'department';
}

const nodes: OrgNode[] = [
  { id: 'root', name: '智能办公系统', type: 'company', className: 'org-node-root', leader: '张sir', employeeCount: 126, positionCount: 41, icon: 'company' },
  { id: 'hr', name: '人力资源部', type: 'department', className: 'org-node-left', leader: '李sir', employeeCount: 16, positionCount: 5, icon: 'department' },
  { id: 'tech', name: '技术中心', type: 'department', className: 'org-node-right', leader: '王sir', employeeCount: 38, positionCount: 12, icon: 'company' },
];

function NodeIcon({ icon }: { icon: OrgNode['icon'] }) {
  return icon === 'company' ? <BankOutlined /> : <ApartmentOutlined />;
}

function OrgCard({ node, viewType }: { node: OrgNode; viewType: '组织视图' | '岗位视图' | '人员视图' }) {
  const primaryMetric = viewType === '岗位视图' ? node.positionCount : node.employeeCount;
  const primaryLabel = viewType === '岗位视图' ? '岗位' : '在职';

  return (
    <div className={`org-card ${node.className}`}>
      <div className="org-card-head">
        <NodeIcon icon={node.icon} />
        <span>{node.name}</span>
      </div>
      <div className="org-card-body">
        <a className="org-card-leader">{node.leader}</a>
        <div className="org-card-avatar">
          <UserOutlined />
        </div>
        <div className="org-card-metrics">
          <span>{primaryLabel}: {primaryMetric}</span>
          <span>岗位: {node.positionCount}</span>
        </div>
      </div>
    </div>
  );
}

export function OrganizationChartPage() {
  const [viewType, setViewType] = useState<'组织视图' | '岗位视图' | '人员视图'>('组织视图');
  const [rootNode, setRootNode] = useState<string>('root');
  const [expandLevel, setExpandLevel] = useState<number>(2);
  const [zoom, setZoom] = useState(1);
  const [collapsed, setCollapsed] = useState(false);

  const visibleNodes = useMemo(() => {
    if (rootNode === 'root') {
      return collapsed ? nodes.slice(0, 1) : nodes;
    }
    return nodes.filter((node) => node.id === rootNode);
  }, [collapsed, rootNode]);

  return (
    <PageContainer title="组织架构图">
      <div className="org-chart-page">
        <div className="org-chart-toolbar">
          <Space size={8} wrap>
            <Select
              className="org-name-select"
              size="small"
              value={viewType}
              options={['组织视图', '岗位视图', '人员视图'].map((value) => ({ value }))}
              onChange={(value) => setViewType(value)}
            />
            <Select
              className="org-name-select"
              size="small"
              value={rootNode}
              suffixIcon={<DownOutlined />}
              options={nodes.map((node) => ({ value: node.id, label: node.name }))}
              onChange={setRootNode}
            />
            <Select
              size="small"
              value={expandLevel}
              options={[1, 2, 3, 4].map((value) => ({ value, label: `展开 ${value} 级` }))}
              onChange={setExpandLevel}
            />
            <Button size="small" icon={<PlusOutlined />} onClick={() => setCollapsed(false)}>
              展开
            </Button>
            <Button size="small" icon={<MinusOutlined />} onClick={() => setCollapsed(true)}>
              收起
            </Button>
            <Button size="small" icon={<ZoomInOutlined />} onClick={() => setZoom((value) => Math.min(1.6, Number((value + 0.1).toFixed(1))))}>
              放大
            </Button>
            <Button size="small" icon={<ZoomOutOutlined />} onClick={() => setZoom((value) => Math.max(0.7, Number((value - 0.1).toFixed(1))))}>
              缩小
            </Button>
            <Button size="small" icon={<FullscreenOutlined />} onClick={() => message.success('已切换为全屏预览模式')}>
              全屏
            </Button>
            <Button size="small" icon={<UploadOutlined />} onClick={() => message.success('架构图下载任务已创建')}>
              下载架构图
            </Button>
          </Space>
        </div>

        <div className="selected-filters">
          <span>当前视图：{viewType}</span>
          <span>根节点：{nodes.find((node) => node.id === rootNode)?.name}</span>
          <span>展开层级：{expandLevel}</span>
          <span>缩放：{Math.round(zoom * 100)}%</span>
        </div>

        <div className="org-chart-canvas" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
          <div className="org-chart-lines" aria-hidden="true">
            <span className="line-root-down" />
            <span className="line-split" />
            <span className="line-left-down" />
            <span className="line-right-down" />
          </div>
          {visibleNodes.map((node) => (
            <OrgCard key={node.id} node={node} viewType={viewType} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
