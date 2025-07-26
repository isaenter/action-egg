import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout as ArcoLayout, 
  Menu, 
  Breadcrumb, 
  Avatar, 
  Dropdown, 
  Button,
  Space,
  Divider 
} from '@arco-design/web-react';
import {
  IconDashboard,
  IconUser,
  IconCalendar,
  IconFile,
  IconDesktop,
  IconSettings,
  IconMenuFold,
  IconMenuUnfold,
  IconPoweroff
} from '@arco-design/web-react/icon';

const { Sider, Header, Content } = ArcoLayout;
const MenuItem = Menu.Item;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <IconDashboard />,
      title: '仪表盘'
    },
    {
      key: '/employees',
      icon: <IconUser />,
      title: '人员管理'
    },
    {
      key: '/schedule',
      icon: <IconCalendar />,
      title: '排班管理'
    },
    {
      key: '/attendance-report',
      icon: <IconFile />,
      title: '考勤报表'
    },
    {
      key: '/attendance-analysis',
      icon: <IconDesktop />,
      title: '考勤分析'
    },
    {
      key: '/leave-management',
      icon: <IconSettings />,
      title: '请假管理'
    }
  ];

  const getBreadcrumbItems = () => {
    const pathMap: Record<string, string> = {
      '/': '仪表盘',
      '/employees': '人员管理',
      '/schedule': '排班管理',
      '/attendance-report': '考勤报表',
      '/attendance-analysis': '考勤分析',
      '/leave-management': '请假管理'
    };

    return [
      { path: '/', breadcrumbName: '首页' },
      { path: location.pathname, breadcrumbName: pathMap[location.pathname] || '未知页面' }
    ].filter((_item, index) => index === 0 || location.pathname !== '/');
  };

  const userDroplist = (
    <Menu>
      <MenuItem key="profile">
        <IconUser />
        个人资料
      </MenuItem>
      <MenuItem key="settings">
        <IconSettings />
        系统设置
      </MenuItem>
      <Divider style={{ margin: '4px 0' }} />
      <MenuItem key="logout">
        <IconPoweroff />
        退出登录
      </MenuItem>
    </Menu>
  );

  return (
    <ArcoLayout style={{ height: '100vh' }}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={240}
        style={{
          backgroundColor: '#fff',
          borderRight: '1px solid var(--color-border-2)'
        }}
      >
        <div 
          style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            borderBottom: '1px solid var(--color-border-2)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-text-1)'
          }}
        >
          {collapsed ? '考勤' : '考勤管理系统'}
        </div>
        <Menu
          selectedKeys={[location.pathname]}
          style={{ width: '100%' }}
          onClickMenuItem={(key) => navigate(key)}
        >
          {menuItems.map(item => (
            <MenuItem key={item.key}>
              {item.icon}
              {item.title}
            </MenuItem>
          ))}
        </Menu>
      </Sider>
      
      <ArcoLayout>
        <Header 
          style={{ 
            height: 64, 
            backgroundColor: '#fff', 
            borderBottom: '1px solid var(--color-border-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px'
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <Breadcrumb>
              {getBreadcrumbItems().map((item, index) => (
                <Breadcrumb.Item key={index}>
                  {item.breadcrumbName}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Space>
          
          <Dropdown droplist={userDroplist} position="br">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={32}>
                管理员
              </Avatar>
              <span>管理员</span>
            </Space>
          </Dropdown>
        </Header>
        
        <Content 
          style={{ 
            margin: '24px',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </ArcoLayout>
    </ArcoLayout>
  );
};

export default Layout;