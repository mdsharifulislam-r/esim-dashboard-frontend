import { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  useGetPricingRulesQuery,
  useCreatePricingRuleMutation,
  useUpdatePricingRuleMutation,
  useDeletePricingRuleMutation,
} from '@/services/pricing.api';
import type { PricingRulePayload, PricingRules, QueryParams } from '@/types';
import { PRICING_REGIONS } from '@/constants/pricing';
import dayjs from 'dayjs';

const typeColors: Record<PricingRules['type'], string> = {
  global: 'purple',
  country: 'green',
  region: 'blue',
};

export default function PricingPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 10 });
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<PricingRules | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const selectedType = Form.useWatch('type', form);

  const queryParams = {
    ...params,
    ...(searchText ? { searchTerm: searchText } : {}),
  };

  const { data, isLoading } = useGetPricingRulesQuery(queryParams);
  const [createPricingRule, { isLoading: creating }] = useCreatePricingRuleMutation();
  const [updatePricingRule, { isLoading: updating }] = useUpdatePricingRuleMutation();
  const [deletePricingRule, { isLoading: deleting }] = useDeletePricingRuleMutation();

  const pricingRules = Array.isArray(data?.data) ? data.data : [];
  const total = data?.pagination?.total ?? pricingRules.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const openAdd = () => {
    setEditRecord(null);
    form.resetFields();
    form.setFieldsValue({ type: 'country' });
    setModalOpen(true);
  };

  const openEdit = (record: PricingRules) => {
    setEditRecord(record);
    form.setFieldsValue({
      margin_price: record.margin_price,
      type: record.type,
      name: record.type === 'global' ? 'Global' : record.name,
    });
    setModalOpen(true);
  };

  const handleTypeChange = (type: PricingRules['type']) => {
    if (type === 'global') {
      form.setFieldValue('name', 'Global');
    } else {
      form.setFieldValue('name', undefined);
    }
  };

  const handleSubmit = async (values: Omit<PricingRulePayload, 'tax_percent'> & { name: string }) => {
    const payload: PricingRulePayload = {
      margin_price: values.margin_price,
      tax_percent: 0,
      type: values.type,
      name: values.type === 'global' ? 'Global' : values.name.trim(),
    };

    try {
      if (editRecord) {
        await updatePricingRule({ id: editRecord._id, data: payload }).unwrap();
        message.success('Pricing rule updated successfully!');
      } else {
        await createPricingRule(payload).unwrap();
        message.success('Pricing rule created successfully!');
      }
      setModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Operation failed');
    }
  };

  const columns: ColumnsType<PricingRules> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, record) => (
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
            <GlobalOutlined />
          </span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{name}</div>
            <Tag color={typeColors[record.type]} style={{ marginTop: 4, textTransform: 'capitalize' }}>
              {record.type}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Margin',
      dataIndex: 'margin_price',
      render: (value) => (
        <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{value}%</span>
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      render: (date) => (
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {date ? dayjs(date).format('MMM D, YYYY') : '—'}
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
      <div className="page-title">Pricing Rules</div>
      <div className="page-subtitle">
        Manage margin settings by country, region, or global scope.
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Pricing Rules ({total})</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Input
              placeholder="Search by name..."
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setParams((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 240, borderRadius: 8 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
              Add Rule
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pricingRules}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(nextPage, nextLimit) => setParams({ page: nextPage, limit: nextLimit })}
        />
      </div>

      <Modal
        open={modalOpen}
        title={
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>
            {editRecord ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
          </span>
        }
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={520}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: 16 }}
          initialValues={{ type: 'country' }}
        >
          <Form.Item
            name="type"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Scope Type</span>}
            rules={[{ required: true, message: 'Please select a scope type' }]}
          >
            <Select size="large" style={{ borderRadius: 8 }} onChange={handleTypeChange}>
              <Select.Option value="country">Country</Select.Option>
              <Select.Option value="region">Region</Select.Option>
              <Select.Option value="global">Global</Select.Option>
            </Select>
          </Form.Item>

          {selectedType === 'country' && (
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>Country Name</span>}
              rules={[{ required: true, message: 'Please enter a country name' }]}
            >
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="e.g. Bangladesh"
              />
            </Form.Item>
          )}

          {selectedType === 'region' && (
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>Region</span>}
              rules={[{ required: true, message: 'Please select a region' }]}
            >
              <Select
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="Select a region"
                showSearch
                optionFilterProp="label"
                options={PRICING_REGIONS.map((region) => ({
                  value: region,
                  label: region,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item
            name="margin_price"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Margin (%)</span>}
            rules={[{ required: true, message: 'Margin is required' }]}
          >
            <InputNumber
              min={0}
              max={100}
              size="large"
              style={{ width: '100%', borderRadius: 8 }}
              placeholder="e.g. 10"
              addonAfter="%"
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || updating} style={{ minWidth: 100 }}>
              {editRecord ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Pricing Rule?"
        message="This pricing rule will be permanently removed."
        onConfirm={async () => {
          try {
            await deletePricingRule(deleteId!).unwrap();
            setDeleteId(null);
            message.success('Pricing rule deleted successfully!');
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
