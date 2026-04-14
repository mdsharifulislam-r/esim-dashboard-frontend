import { useState } from 'react';
import { Input, Button, Select, Avatar, Rate, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { useGetReviewsQuery, useUpdateReviewStatusMutation } from '@/services/review.api';
import { demoReviews } from '@/mock/demoData';
import type { Review, QueryParams } from '@/types';
import dayjs from 'dayjs';

export default function ReviewsPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 10, searchTerm: '', status: '' });
  const [searchText, setSearchText] = useState('');

  const { data, isLoading } = useGetReviewsQuery(params);
  const [updateStatus, { isLoading: updating }] = useUpdateReviewStatusMutation();

  const reviews = data?.data ||[]
  const isDemo = false
  const total = data?.pagination?.total ?? reviews.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      message.success('Review status updated!');
    } catch {
      message.error('Failed to update status');
    }
  };

  const columns: ColumnsType<Review> = [
    {
      title: 'User',
      dataIndex: 'user',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar src={user?.avatar} icon={<UserOutlined />} size={36} style={{ background: '#009A54' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      render: (r) => <Rate disabled value={r} style={{ fontSize: 13 }} />,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (text) => (
        <div style={{ maxWidth: 280, fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
          "{text?.length > 100 ? text.slice(0, 100) + '...' : text}"
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s) => <StatusBadge status={s=="published"?"approved":s} />,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (d) => <span style={{ fontSize: 13, color: '#6b7280' }}>{dayjs(d).format('MMM D, YYYY')}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(val) => !isDemo && handleStatusChange(record._id, val)}
          disabled={isDemo}
          size="small"
          style={{ width: 130 }}
          loading={updating}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="published">Published</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Reviews</div>
      <div className="page-subtitle">Monitor and moderate customer reviews.</div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Reviews ({data?.pagination?.total || 0})</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Select
              placeholder="Filter by status"
              allowClear
              onChange={(val) => setParams((p) => ({ ...p, status: val || '', page: 1 }))}
              style={{ width: 160 }}
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={reviews}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(page, limit) => setParams((p) => ({ ...p, page, limit }))}
        />
      </div>
    </div>
  );
}
