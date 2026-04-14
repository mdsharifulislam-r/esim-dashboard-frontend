import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/influencers': 'Influencers',
  '/blogs': 'Blogs',
  '/coupons': 'Coupons',
  '/faqs': 'FAQs',
  '/reviews': 'Reviews',
  '/support': 'Support Messages',
  '/disclaimer': 'Disclaimer & Pages',
  '/discount': 'Discount Settings',
  '/profile': 'My Profile',
  '/change-password': 'Change Password',
  '/notifications': 'Notifications',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const breadcrumb = breadcrumbMap[location.pathname] || 'Admin Panel';

  return (
    <div className='flex w-full'>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header breadcrumb={breadcrumb} />
        <div className="page-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
