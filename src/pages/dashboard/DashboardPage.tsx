import { Row, Col, Card, Table, Avatar, Rate } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import StatusBadge from '@/components/common/StatusBadge';
import dayjs from 'dayjs';
import {
  demoDashboardReviews,
  demoDashboardSupport,
  demoDashboardUsers,
} from '@/mock/demoData';
import { useGetDasboardStatsQuery, useGetUsersQuery } from '@/services/users.api';
import { useGetReviewsQuery } from '@/services/review.api';
import { useGetSupportMessagesQuery } from '@/services/support.api';

// Mock data for dashboard (replace with RTK Query when dashboard API exists)
const mockStats = [
  { label: 'Total Users', value: '12,847', icon: <UserOutlined />, color: '#009A54', bg: '#e6f7ef', change: '+12%' },
  { label: 'Influencers', value: '284', icon: <TeamOutlined />, color: '#6366f1', bg: '#eef2ff', change: '+8%' },
  { label: 'Total Revenue', value: '$94,230', icon: <DollarOutlined />, color: '#f59e0b', bg: '#fffbeb', change: '+23%' },
  { label: 'Total Orders', value: '38,492', icon: <ShoppingOutlined />, color: '#ef4444', bg: '#fef2f2', change: '+5%' },
];


const reviewColumns = [
  {
    title: 'User',
    dataIndex: 'user',
    render: (user: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar size={32} icon={<UserOutlined />} style={{ background: '#009A54' }} />
        <span style={{ fontWeight: 500, fontSize: 13 }}>{user?.name}</span>
      </div>
    ),
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    render: (r: number) => <Rate disabled defaultValue={r} style={{ fontSize: 13 }} />,
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    render: (text: string) => (
      <span style={{ fontSize: 13, color: '#6b7280' }}>
        {text.length > 50 ? text.slice(0, 50) + '...' : text}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s: string) => <StatusBadge status={s} />,
  },
];

const userColumns = [
  {
    title: 'User',
    dataIndex: 'name',
    render: (name: string, record: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar size={32} icon={<UserOutlined />} style={{ background: '#6366f1' }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s: string) => <StatusBadge status={s} />,
  },
  {
    title: 'Joined',
    dataIndex: 'createdAt',
    render: (d: string) => <span style={{ fontSize: 13, color: '#6b7280' }}>{dayjs(d).format('MMM D, YYYY')}</span>,
  },
];

const supportColumns = [
  {
    title: 'User',
    dataIndex: 'user',
    render: (user: any,record: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar size={32} icon={<MessageOutlined />} style={{ background: '#f59e0b' }} />
        <span style={{ fontWeight: 500, fontSize: 13 }}>{record?.name}</span>
      </div>
    ),
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    render: (text: string) => <span style={{ fontSize: 13 }}>{text}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s: string) => <StatusBadge status={s} />,
  },
];

export default function DashboardPage() {
  const {data:userData}=useGetUsersQuery({page:1,limit:5})
  const {data:reviewData}=useGetReviewsQuery({page:1,limit:5})
  const {data:supportData}=useGetSupportMessagesQuery({page:1,limit:5})

  const {data:dashboardStats}= useGetDasboardStatsQuery()
  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="page-subtitle">Welcome back! Here's what's happening today.</div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {mockStats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <div className="stat-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div className="stat-value">{stat.label=="Total Users" ? dashboardStats?.data?.totalUsers : stat?.label == "Total Influencers" ? dashboardStats?.data?.totalInfuencer : stat?.label == "Total Revenue" ? dashboardStats?.data?.totalRavinue : dashboardStats?.data?.totalOrders}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: '#e6f7ef', color: '#009A54', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                  <ArrowUpOutlined style={{ fontSize: 10 }} /> {stat.change}
                </span>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>vs last month</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Recent Reviews */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={14}>
          <div className="table-card">
            <div className="table-card-header">
              <div className="table-card-title">Recent Reviews</div>
              <a href="/reviews" style={{ fontSize: 13, color: '#009A54', fontWeight: 500 }}>View all →</a>
            </div>
            <Table
              columns={reviewColumns}
              dataSource={reviewData?.data || []}
              rowKey="_id"
              pagination={false}
              size="small"
              style={{ borderRadius: 0 }}
            />
          </div>
        </Col>

        <Col xs={24} xl={10}>
          <div className="table-card">
            <div className="table-card-header">
              <div className="table-card-title">Recent Users</div>
              <a href="/users" style={{ fontSize: 13, color: '#009A54', fontWeight: 500 }}>View all →</a>
            </div>
            <Table
              columns={userColumns}
              dataSource={userData?.data || []}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </div>
        </Col>
      </Row>

      {/* Recent Support */}
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <div className="table-card">
            <div className="table-card-header">
              <div className="table-card-title">Recent Support Messages</div>
              <a href="/support" style={{ fontSize: 13, color: '#009A54', fontWeight: 500 }}>View all →</a>
            </div>
            <Table
              columns={supportColumns}
              dataSource={supportData?.data || []}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
