import { NavLink } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  TagOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  MessageOutlined,
  SafetyOutlined,
  PercentageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  SettingOutlined,
} from '@ant-design/icons';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { key: 'dashboard', path: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { section: 'Management' },
  { key: 'users', path: '/users', icon: <UserOutlined />, label: 'Users' },
  { key: 'influencers', path: '/influencers', icon: <TeamOutlined />, label: 'Influencers' },
  { section: 'Content' },
  { key: 'blogs', path: '/blogs', icon: <FileTextOutlined />, label: 'Blogs' },
  { key: 'banner', path: '/banner', icon: <BgColorsOutlined />, label: 'Banners' },
  { key: 'coupons', path: '/coupons', icon: <TagOutlined />, label: 'Coupons' },
  { key: 'faqs', path: '/faqs', icon: <QuestionCircleOutlined />, label: 'FAQs' },
  { section: 'Engagement' },
  { key: 'reviews', path: '/reviews', icon: <StarOutlined />, label: 'Reviews' },
  { key: 'support', path: '/support', icon: <MessageOutlined />, label: 'Support' },
  { section: 'Settings' },
  { key: 'disclaimer', path: '/disclaimer', icon: <SafetyOutlined />, label: 'Disclaimer' },
  { key: 'discount', path: '/discount', icon: <PercentageOutlined />, label: 'Discount' },
  { key: 'admins', path: '/admins', icon: <SettingOutlined />, label: 'Manage Admins' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <GlobalOutlined style={{ color: '#fff', fontSize: 20, fontWeight: 700 }} />
        </div>
        <span className="logo-text">eSIM Admin</span>
      </div>

      {/* Toggle Button */}
      <div style={{ padding: '8px 16px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: 8,
            padding: '8px',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => {
          if ('section' in item) {
            return (
              <li key={index} className="sidebar-section-title">
                {item.section}
              </li>
            );
          }
          return (
            <li key={item.key} className="sidebar-menu-item">
              <NavLink
                to={item.path!}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
