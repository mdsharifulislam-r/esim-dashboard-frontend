import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Dropdown, Button } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useGetNotificationsQuery, useGetProfileQuery } from '@/services/auth.api';
import { getImageUrl } from '@/services/api';

interface HeaderProps {
  breadcrumb?: string;
}

export default function Header({ breadcrumb }: HeaderProps) {
  const navigate = useNavigate();
  const { data: notifData } = useGetNotificationsQuery({});
  const {data:profileData}=useGetProfileQuery()

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: 'Change Password',
      onClick: () => navigate('/change-password'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="app-header">
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: '#111827', letterSpacing: '-0.6px' }}>
          {breadcrumb || 'Dashboard'}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6, fontWeight: 500 }}>
          Welcome back, Admin 👋
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notifications */}
        <Badge count={notifData?.data.unreadCount || 0} size="small">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: 18 }} />}
            onClick={() => navigate('/notifications')}
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
        </Badge>

        {/* User Avatar Dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 10,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Avatar
              src={getImageUrl(profileData?.data?.image || '')}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
              size={40}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', lineHeight: 1.2, fontFamily: "'Syne', sans-serif" }}>{profileData?.data?.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{profileData?.data?.role}</div>
            </div>
            <SettingOutlined style={{ color: '#9ca3af', fontSize: 14, marginLeft: 4 }} />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
