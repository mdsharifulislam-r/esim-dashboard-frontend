import { Card, Button, Badge, Empty, Pagination } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useGetNotificationsQuery, useMarkNotificationsReadMutation } from '@/services/auth.api';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';

dayjs.extend(relativeTime);

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetNotificationsQuery({page, limit: 10});
  const [markRead, { isLoading: marking }] = useMarkNotificationsReadMutation();
  
  const notifications =data?.data?.data|| []
  const unreadCount = data?.data?.unreadCount || 0;
  const isDemo = false

  return (
    <div className='w-full'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">{unreadCount} unread notifications</div>
        </div>
        {unreadCount > 0 && (
          <Button
            icon={<CheckOutlined />}
            onClick={() => markRead()}
            loading={marking}
            disabled={isDemo}
            style={{ borderRadius: 8, borderColor: '#009A54', color: '#009A54' }}
          >
            Mark all read
          </Button>
        )}
      </div>

      <Card loading={isLoading} style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: 0 }} bodyStyle={{ padding: 0 }}>
        {notifications?.length === 0 ? (
          <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: 48 }} />
        ) : (
          notifications?.map((notif, index) => (
            <div
              key={notif._id}
              style={{
                padding: '16px 24px',
                borderBottom: index < notifications.length - 1 ? '1px solid #f5f5f5' : 'none',
                background: notif.isRead ? 'transparent' : '#f9fffe',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: notif.isRead ? '#f3f4f6' : '#e6f7ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BellOutlined style={{ color: notif.isRead ? '#9ca3af' : '#009A54' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>
                  {notif.title}
                  {!notif.isRead && (
                    <span style={{ width: 8, height: 8, background: '#009A54', borderRadius: '50%', display: 'inline-block', marginLeft: 8 }} />
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{notif.message}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{dayjs(notif.createdAt).fromNow()}</div>
              </div>
            </div>
          ))
        )}
      </Card>
      <div className='py-4 flex justify-end'>
        <Pagination
          current={page}
          pageSize={data?.pagination?.limit || 10}
          total={data?.pagination?.total || 0}
          showSizeChanger={false}
          onChange={(page) => setPage(page)}
          />
      </div>
    </div>
  );
}
