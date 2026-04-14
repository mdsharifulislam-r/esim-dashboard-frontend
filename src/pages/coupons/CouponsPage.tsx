import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} from "@/services/coupon.api";

import type { Coupon, QueryParams } from "@/types";
import dayjs from "dayjs";

export default function CouponsPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetCouponsQuery(params);
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();
  const [toggleStatus] = useToggleCouponStatusMutation();

  const coupons = data?.data || [];
  const isDemo = false;
  const total = data?.pagination?.total ?? coupons.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const openAdd = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Coupon) => {
    setEditRecord(record);
    form.setFieldsValue({
      code: record.custom_code,
      discount: record.discount,
      type: record.type,
      max_use: record.max_use,
      end_date: record.end_date ? dayjs(record.end_date) : null,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      name: record.name,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: Partial<Coupon>) => {
    try {
      if (editRecord) {
        await updateCoupon({ id: editRecord._id, data: { ...values, custom_code: values.code } }).unwrap();
        message.success("Coupon updated!");
      } else {
        await createCoupon({ ...values, custom_code: values.code }).unwrap();
        message.success("Coupon created!");
      }
      setModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: "Code",
      dataIndex: "custom_code",
      render: (code) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              color: "#1a1a2e",
            }}
          >
            {code}
          </span>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(code);
              message.success("Copied!");
            }}
            style={{ color: "#9ca3af" }}
          />
        </div>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, r) => (
        <Tag color="green" style={{ borderRadius: 20, fontWeight: 600 }}>
          {r.amount || r.discount}
          {r.type === "percentage" ? "%" : "$"} OFF
        </Tag>
      ),
    },
    {
      title: "Uses",
      key: "uses",
      render: (_, r) => (
        <span style={{ fontSize: 13 }}>
          <strong>{r.uses}</strong> / {r.max_use}
        </span>
      ),
    },
    {
      title: "Expires",
      dataIndex: "expiresAt",
      render: (d) => {
        const expired = dayjs(d).isBefore(dayjs());
        return (
          <span
            style={{ fontSize: 13, color: expired ? "#ef4444" : "#6b7280" }}
          >
            {dayjs(d).format("MMM D, YYYY")}
            {expired && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ef4444",
                }}
              >
                EXPIRED
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <StatusBadge status={s} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{
              borderRadius: 8,
              borderColor: "#009A54",
              color: "#009A54",
            }}
          />
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => !isDemo && setDeleteId(record._id)}
            disabled={isDemo}
            style={{ borderRadius: 8 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Coupons</div>
      <div className="page-subtitle">
        Manage discount coupons and promo codes.
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            All Coupons ({data?.pagination?.total || 0})
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAdd}
            style={{ borderRadius: 8 }}
          >
            Add Coupon
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={coupons}
          loading={isLoading && !data}
        />
      </div>

      <Modal
        open={modalOpen}
        title={
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {editRecord ? "Edit Coupon" : "Add Coupon"}
          </span>
        }
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={480}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Coupon Name"
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              style={{
                borderRadius: 8,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
              placeholder="SAVE20"
            />
          </Form.Item>
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[{ required: true }]}
          >
            <Input
              size="large"
              style={{
                borderRadius: 8,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
              placeholder="SAVE20"
            />
          </Form.Item>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select size="large" style={{ borderRadius: 8 }}>
                <Select.Option value="percentage">Percentage (%)</Select.Option>
                <Select.Option value="fixed">Fixed ($)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="discount"
              label="Discount Value"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                size="large"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Form.Item>
            <Form.Item
              name="max_use"
              label="Max Uses"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                size="large"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Form.Item>
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[{ required: true }]}
            >
              <Input type="date" size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="End Date"
              rules={[{ required: true }]}
            >
              <Input type="date" size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || updating}
              style={{ minWidth: 100 }}
            >
              {editRecord ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Coupon?"
        message="This coupon will be permanently deleted."
        onConfirm={async () => {
          await deleteCoupon(deleteId!).unwrap();
          setDeleteId(null);
          message.success("Deleted!");
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
