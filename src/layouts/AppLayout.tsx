import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Avatar, Badge, Button, Dropdown, Input, Layout, Menu, Space, Tabs, Tooltip, message } from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UserOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { GenericListPage } from '../components/GenericListPage';
import { HrDashboard } from '../components/HrDashboard';
import { flattenRoutes, menuRoutes, routeTitleMap } from '../routes/menuRoutes';
import type { MenuRoute, TabItem } from '../types';

const { Header, Sider, Content } = Layout;
const HOME_PATH = '/dashboard/hr';

function filterRoutes(routes: MenuRoute[], keyword: string): MenuRoute[] {
  if (!keyword.trim()) {
    return routes;
  }
  return routes
    .map((route) => {
      const children = filterRoutes(route.children ?? [], keyword);
      if (route.title.includes(keyword) || children.length) {
        return { ...route, children: children.length ? children : route.children };
      }
      return undefined;
    })
    .filter(Boolean) as MenuRoute[];
}

function toMenuItems(routes: MenuRoute[], collapsed: boolean, onOpen: (path: string) => void): MenuProps['items'] {
  return routes.map((route) => ({
    key: route.path ?? route.title,
    icon: route.icon,
    label: route.path ? (
      <a
        href={`#${route.path}`}
        data-path={route.path}
        className="menu-leaf-label"
        onClick={(event) => {
          onOpen(route.path!);
        }}
      >
        {collapsed ? <Tooltip title={route.title}>{route.title}</Tooltip> : route.title}
      </a>
    ) : collapsed ? (
      <Tooltip title={route.title}>{route.title}</Tooltip>
    ) : (
      route.title
    ),
    children: route.children ? toMenuItems(route.children, collapsed, onOpen) : undefined,
  }));
}

function collectOpenKeys(routes: MenuRoute[]): string[] {
  return routes.flatMap((route) => (route.children?.length ? [route.path ?? route.title, ...collectOpenKeys(route.children)] : []));
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [menuKeyword, setMenuKeyword] = useState('');
  const [activePath, setActivePath] = useState(HOME_PATH);
  const [tabs, setTabs] = useState<TabItem[]>([{ key: HOME_PATH, label: '人资工作台', closable: false }]);

  function openTab(path: string) {
    const label = routeTitleMap.get(path) ?? '未命名页面';
    setTabs((currentTabs) => {
      if (currentTabs.some((tab) => tab.key === path)) {
        return currentTabs;
      }
      return [...currentTabs, { key: path, label, closable: path !== HOME_PATH }];
    });
    setActivePath(path);
  }

  const routeItems = useMemo(() => flattenRoutes(), []);
  const filteredRoutes = useMemo(() => filterRoutes(menuRoutes, menuKeyword), [menuKeyword]);
  const menuItems = useMemo(() => toMenuItems(filteredRoutes, collapsed, openTab), [filteredRoutes, collapsed]);
  const selectedKeys = [activePath];
  const defaultOpenKeys = useMemo(() => collectOpenKeys(menuRoutes), []);

  useEffect(() => {
    const openFromHash = () => {
      const nextPath = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (nextPath && routeItems.some((route) => route.path === nextPath)) {
        openTab(nextPath);
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [routeItems]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const rawKey = String(key);
    const normalizedKey = rawKey.startsWith('/') ? rawKey : rawKey.replace(/^.*(?=\/)/, '');
    if (routeItems.some((route) => route.path === normalizedKey)) {
      openTab(normalizedKey);
    }
  };

  const handleMenuCapture = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const pathFromLabel = target.closest<HTMLElement>('[data-path]')?.dataset.path;
    const menuId = target.closest<HTMLElement>('.ant-menu-item')?.dataset.menuId;
    const pathFromMenuId = menuId?.replace(/^.*(?=\/)/, '');
    const nextPath = pathFromLabel ?? pathFromMenuId;
    if (nextPath && routeItems.some((route) => route.path === nextPath)) {
      openTab(nextPath);
    }
  };

  const handleTabEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action !== 'remove') {
      return;
    }
    const closeKey = String(targetKey);
    const closeIndex = tabs.findIndex((tab) => tab.key === closeKey);
    const nextTabs = tabs.filter((tab) => tab.key !== closeKey);
    setTabs(nextTabs);
    if (activePath === closeKey) {
      const nextActive = nextTabs[Math.max(0, closeIndex - 1)]?.key ?? HOME_PATH;
      setActivePath(nextActive);
    }
  };

  const activeTitle = routeTitleMap.get(activePath) ?? '人资工作台';

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div className="brand">智能办公系统</div>
        <Space size={8} className="header-actions">
          <Tooltip title="BI">
            <Button type="text" size="small" icon={<WindowsOutlined />}>
              BI
            </Button>
          </Tooltip>
          <Tooltip title="消息">
            <Badge count={99} size="small" offset={[-2, 2]}>
              <Button type="text" size="small" icon={<BellOutlined />}>
                消息
              </Button>
            </Badge>
          </Tooltip>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'profile', icon: <ProfileOutlined />, label: '个人中心' },
                { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
              ],
              onClick: ({ key }) => {
                message.success(key === 'profile' ? '打开个人中心' : '已退出登录');
              },
            }}
          >
            <Button type="text" size="small" className="user-menu-button">
              <Avatar size={24} icon={<UserOutlined />} />
              <span>admin</span>
              <DownOutlined className="user-menu-arrow" />
            </Button>
          </Dropdown>
        </Space>
      </Header>
      <Layout className="body-shell">
        <Sider width={220} collapsedWidth={56} collapsed={collapsed} className="side-menu">
          <div className="menu-title">
            {!collapsed && <span>OA菜单</span>}
            <Button
              type="text"
              size="small"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
          </div>
          {!collapsed && (
            <div className="menu-search">
              <Input.Search allowClear size="small" placeholder="搜索菜单" value={menuKeyword} onChange={(event) => setMenuKeyword(event.target.value)} />
            </div>
          )}
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            items={menuItems}
            onClickCapture={handleMenuCapture}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout className={`main-shell ${collapsed ? 'main-shell-collapsed' : ''}`}>
          <Tabs
            className="erp-tabs"
            type="editable-card"
            hideAdd
            activeKey={activePath}
            items={tabs.map((tab) => ({
              key: tab.key,
              label: tab.label,
              closable: tab.closable,
            }))}
            onChange={setActivePath}
            onEdit={handleTabEdit}
          />
          <Content className="app-content">
            {activePath === HOME_PATH ? <HrDashboard /> : <GenericListPage key={activePath} title={activeTitle} path={activePath} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
