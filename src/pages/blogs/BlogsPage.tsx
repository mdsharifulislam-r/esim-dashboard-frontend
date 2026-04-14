import { useState } from 'react';
import { Input, Button, Image, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { useGetBlogsQuery, useDeleteBlogMutation } from '@/services/blog.api';
import { demoBlogs } from '@/mock/demoData';
import type { Blog, QueryParams } from '@/types';
import dayjs from 'dayjs';
import { getImageUrl } from '@/services/api';

export default function BlogsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState<QueryParams>();
  const [searchText, setSearchText] = useState('');

  const { data, isLoading } = useGetBlogsQuery({});
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();

  const blogs = data?.data ||[]
  const isDemo = false;


  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id).unwrap();
      message.success('Blog deleted successfully');
    } catch {
      message.error('Delete failed');
    }
  };

  const columns: ColumnsType<Blog> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      width: 90,
      render: (src) => (
        <Image
          src={getImageUrl(src) || 'https://via.placeholder.com/60x40'}
          width={60}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          preview={{ mask: <EyeOutlined /> }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          <div
            style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}
            dangerouslySetInnerHTML={{
              __html: record.content?.replace(/<[^>]+>/g, '').slice(0, 80) + '...',
            }}
          />
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (d) => <span style={{ fontSize: 13, color: '#6b7280' }}>{dayjs(d).format('MMM D, YYYY')}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => !isDemo && navigate(`/blogs/edit/${record._id}`)}
            disabled={isDemo}
            style={{ borderRadius: 8, borderColor: '#009A54', color: '#009A54' }}
          />
          <Popconfirm
            title="Delete this blog?"
            description="This action cannot be undone."
            onConfirm={() => !isDemo && handleDelete(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" icon={<DeleteOutlined />} danger style={{ borderRadius: 8 }} loading={deleting} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Blogs</div>
      <div className="page-subtitle">Create and manage blog posts and articles.</div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Blogs ({data?.pagination?.total || 0})</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/blogs/new')} style={{ borderRadius: 8 }}>
              New Blog
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={blogs}
          loading={isLoading && !data}
        />
      </div>
    </div>
  );
}
