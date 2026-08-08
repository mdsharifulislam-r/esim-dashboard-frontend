import { useState } from 'react';
import { Button, Modal, Form, Input, Select, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import ImageUploader from '@/components/forms/ImageUploader';
import {
  useGetImageBannersQuery,
  useCreateImageBannerMutation,
  useUpdateImageBannerMutation,
  useDeleteImageBannerMutation,
} from '@/services/imagebanner.api';
import { getImageUrl } from '@/services/api';
import type { ImageBanner } from '@/types';
import dayjs from 'dayjs';

export default function ImageBannerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ImageBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetImageBannersQuery();
  const [createImageBanner, { isLoading: creating }] = useCreateImageBannerMutation();
  const [updateImageBanner, { isLoading: updating }] = useUpdateImageBannerMutation();
  const [deleteImageBanner, { isLoading: deleting }] = useDeleteImageBannerMutation();

  const imageBanners = Array.isArray(data?.data) ? data.data : [];

  const openAdd = () => {
    setEditRecord(null);
    setImageFile(null);
    form.resetFields();
    form.setFieldsValue({ status: 'active' });
    setModalOpen(true);
  };

  const openEdit = (record: ImageBanner) => {
    setEditRecord(record);
    setImageFile(null);
    form.setFieldsValue({
      title: record.title,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: { title: string; status: 'active' | 'inactive' }) => {
    if (!editRecord && !imageFile) {
      message.error('Please upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('status', values.status);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editRecord) {
        await updateImageBanner({ id: editRecord._id, data: formData }).unwrap();
        message.success('Image banner updated successfully!');
      } else {
        await createImageBanner(formData).unwrap();
        message.success('Image banner created successfully!');
      }
      setModalOpen(false);
      setImageFile(null);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || 'Operation failed');
    }
  };

  const columns: ColumnsType<ImageBanner> = [
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      width: 120,
      render: (thumbnail) => (
        <Image
          src={getImageUrl(thumbnail)}
          width={80}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          preview
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title) => <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (date) => (
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {dayjs(date).format('MMM D, YYYY')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{ borderRadius: 8, borderColor: '#009A54', color: '#009A54' }}
          />
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => setDeleteId(record._id)}
            style={{ borderRadius: 8 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Image Banners</div>
      <div className="page-subtitle">Create and manage image banners for the platform.</div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Image Banners ({imageBanners.length})</div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
            Add Image Banner
          </Button>
        </div>

        <DataTable columns={columns} data={imageBanners} loading={isLoading && !data} />
      </div>

      <Modal
        open={modalOpen}
        title={
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>
            {editRecord ? 'Edit Image Banner' : 'Add Image Banner'}
          </span>
        }
        onCancel={() => {
          setModalOpen(false);
          setImageFile(null);
          form.resetFields();
        }}
        footer={null}
        width={560}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: 16 }}
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            name="title"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Title</span>}
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input size="large" style={{ borderRadius: 8 }} placeholder="Enter banner title" />
          </Form.Item>

          <Form.Item
            name="status"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Status</span>}
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select size="large" style={{ borderRadius: 8 }}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
              Image {!editRecord && <span style={{ color: '#ef4444' }}>*</span>}
            </div>
            <ImageUploader
              value={imageFile || (editRecord ? getImageUrl(editRecord.thumbnail) : null)}
              onChange={setImageFile}
              label="Upload banner image"
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              onClick={() => {
                setModalOpen(false);
                setImageFile(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={creating || updating} style={{ minWidth: 100 }}>
              {editRecord ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Image Banner?"
        message="This image banner will be permanently removed."
        onConfirm={async () => {
          try {
            await deleteImageBanner(deleteId!).unwrap();
            setDeleteId(null);
            message.success('Image banner deleted successfully!');
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
