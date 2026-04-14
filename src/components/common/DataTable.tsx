import { Table, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataTableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number, limit: number) => void;
  rowKey?: string;
}

export default function DataTable<T extends object>({
  columns,
  data,
  loading,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  rowKey = '_id',
}: DataTableProps<T>) {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={rowKey}
        pagination={false}
        scroll={{ x: 'max-content' }}
        style={{ borderRadius: 0 }}
      />
      {total > 0 && (
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            Total: <strong>{total}</strong> items
          </span>
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={['10', '20', '50']}
            size="small"
          />
        </div>
      )}
    </div>
  );
}
