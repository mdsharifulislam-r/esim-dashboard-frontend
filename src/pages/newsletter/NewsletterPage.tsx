import { useState } from 'react';
import { Input, message } from 'antd';
import { DeleteOutlined, MailOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useGetNewslettersQuery, useDeleteNewsletterMutation } from '@/services/newsletter.api';
import type { Newsletter, QueryParams } from '@/types';
import dayjs from 'dayjs';

export default function NewsletterPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 10 });
  const [searchText, setSearchText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryParams = {
    ...params,
    ...(searchText ? { searchTerm: searchText } : {}),
  };

  const { data, isLoading } = useGetNewslettersQuery(queryParams);
  const [deleteNewsletter, { isLoading: deleting }] = useDeleteNewsletterMutation();

  const newsletters = data?.data || [];
  const total = data?.pagination?.total ?? newsletters.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const columns: ColumnsType<Newsletter> = [
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#009A54',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MailOutlined />
          </span>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{email}</span>
        </div>
      ),
    },
    {
      title: 'Subscribed',
      dataIndex: 'createdAt',
      render: (date) => (
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {dayjs(date).format('MMM D, YYYY h:mm A')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <button
          type="button"
          onClick={() => setDeleteId(record._id)}
          style={{
            background: '#fff1f0',
            border: '1px solid #ffccc7',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            color: '#ff4d4f',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
          }}
        >
          <DeleteOutlined />
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Newsletter</div>
      <div className="page-subtitle">View and manage newsletter subscribers.</div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Subscribers ({total})</div>
          <Input
            placeholder="Search by email..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setParams((prev) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 280, borderRadius: 8 }}
            allowClear
          />
        </div>

        <DataTable
          columns={columns}
          data={newsletters}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(nextPage, nextLimit) => setParams({ page: nextPage, limit: nextLimit })}
        />
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Subscriber?"
        message="This subscriber will be permanently removed from the newsletter list."
        onConfirm={async () => {
          try {
            await deleteNewsletter(deleteId!).unwrap();
            setDeleteId(null);
            message.success('Subscriber deleted successfully!');
          } catch (err: any) {
            message.error(err?.data?.message || 'Delete failed');
          }
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
