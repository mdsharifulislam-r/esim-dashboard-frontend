import { useState } from 'react';
import { Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
} from '@/services/banner.api';
import type { Banner, QueryParams } from '@/types';
import dayjs from 'dayjs';

export default function BannerPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Banner | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetBannersQuery(params);

  
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();
  const [toggleStatus] = useToggleBannerStatusMutation();

  const banners = data?.data || [];
  const total = data?.pagination?.total ?? banners.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const openAdd = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Banner) => {
    setEditRecord(record);
    form.setFieldsValue({
      text: record.text,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: Partial<Banner>) => {
    try {
      if (editRecord) {
        await updateBanner({ id: editRecord._id, data: values }).unwrap();
        message.success('Banner updated successfully!');
      } else {
        await createBanner(values).unwrap();
        message.success('Banner created successfully!');
      }
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await toggleStatus({ id, status: newStatus }).unwrap();
      message.success(`Banner status changed to ${newStatus}!`);
    } catch (err: any) {
      message.error(err?.data?.message || 'Status change failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id).unwrap();
      message.success('Banner deleted successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Delete failed');
    }
  };

  const columns: ColumnsType<Banner> = [
    {
      title: 'Text',
      dataIndex: 'text',
      render: (text) => (
        <div style={{ fontSize: 14, color: '#1a1a2e' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <StatusBadge status={status} />,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
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
            onClick={() => handleToggleStatus(record._id, record.status)}
            style={{
              borderRadius: 8,
              borderColor: record.status === 'active' ? '#ff4d4f' : '#52c41a',
              color: record.status === 'active' ? '#ff4d4f' : '#52c41a',
            }}
          >
            {record.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{ borderRadius: 8, borderColor: '#009A54', color: '#009A54' }}
          />
          <Popconfirm
            title="Delete this banner?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
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
      <div className="page-title">Banners</div>
      <div className="page-subtitle">Create and manage promotional banners.</div>

      <div style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
          style={{ borderRadius: 8, background: '#009A54' }}
        >
          Add Banner
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={banners}
        loading={isLoading}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(newPage, newLimit) => setParams({ ...params, page: newPage, limit: newLimit })}
      />

      <Modal
        title={editRecord ? 'Edit Banner' : 'Add Banner'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        okText={editRecord ? 'Update' : 'Create'}
        confirmLoading={creating || updating}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Banner Text"
            name="text"
            rules={[
              { required: true, message: 'Please enter banner text' },
              { max: 500, message: 'Text cannot exceed 500 characters' },
            ]}
          >
            <Input.TextArea
              placeholder="Enter banner text"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
