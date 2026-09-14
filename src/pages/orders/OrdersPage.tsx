import { useState } from 'react';
import { Input, Button, Image, Tag } from 'antd';
import { SearchOutlined, EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { useGetOrdersQuery } from '@/services/order.api';
import type { Order, QueryParams } from '@/types';
import dayjs from 'dayjs';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 10 });
  const [searchText, setSearchText] = useState('');

  const queryParams = {
    ...params,
    ...(searchText ? { searchTerm: searchText } : {}),
  };

  const { data, isLoading } = useGetOrdersQuery(queryParams);

  const orders = Array.isArray(data?.data) ? data.data : [];
  const total = data?.pagination?.total ?? orders.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const columns: ColumnsType<Order> = [
    {
      title: 'Order',
      key: 'order',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#009A54',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {record.oparator_info?.image ? (
              <Image
                src={record.oparator_info.image}
                width={28}
                height={28}
                preview={false}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <ShoppingOutlined />
            )}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, fontFamily: 'monospace', color: '#1a1a2e' }}>
              {record.orderId || record.code}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{record.package_name}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      render: (country) => <span style={{ fontSize: 14 }}>{country}</span>,
    },
    {
      title: 'Data',
      dataIndex: 'data',
      render: (value) => <Tag color="green">{value}</Tag>,
    },
    {
      title: 'Validity',
      dataIndex: 'validity',
      render: (days) => <span style={{ fontSize: 13, color: '#6b7280' }}>{days} days</span>,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      render: (qty) => <span style={{ fontWeight: 600 }}>{qty}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price, record) => (
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>${price}</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>Net ${record.net_price}</div>
        </div>
      ),
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
        <span style={{ fontSize: 13, color: '#6b7280' }}>{dayjs(date).format('MMM D, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record._id}`)}
          style={{ borderRadius: 8, borderColor: '#009A54', color: '#009A54' }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Orders</div>
      <div className="page-subtitle">View and manage eSIM orders across the platform.</div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Orders ({total})</div>
          <Input
            placeholder="Search by code, package, country..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setParams((prev) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 300, borderRadius: 8 }}
            allowClear
          />
        </div>

        <DataTable
          columns={columns}
          data={orders}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(nextPage, nextLimit) => setParams({ page: nextPage, limit: nextLimit })}
        />
      </div>
    </div>
  );
}
