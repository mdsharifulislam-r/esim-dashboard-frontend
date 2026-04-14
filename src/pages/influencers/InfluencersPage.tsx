import { useState } from "react";
import {
  Input,
  Button,
  Switch,
  Avatar,
  Modal,
  Form,
  InputNumber,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import ImageUploader from "@/components/forms/ImageUploader";
import {
  useGetInfluencersQuery,
  useCreateInfluencerMutation,
  useUpdateInfluencerMutation,
  useDeleteInfluencerMutation,
  useToggleInfluencerLockMutation,
} from "@/services/influencer.api";
import { demoInfluencers } from "@/mock/demoData";
import type { Influencer, QueryParams } from "@/types";
import { getImageUrl } from "@/services/api";
import { useToggleUserLockMutation } from "@/services/users.api";

interface InfluencerFormValues {
  name: string;
  email: string;
  phone?: string;
  discount: number;
  commission: number;
}

export default function InfluencersPage() {
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    searchTerm: "",
  });
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Influencer | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetInfluencersQuery(params);

  const [createInfluencer, { isLoading: creating }] =
    useCreateInfluencerMutation();
  const [updateInfluencer, { isLoading: updating }] =
    useUpdateInfluencerMutation();
  const [deleteInfluencer, { isLoading: deleting }] =
    useDeleteInfluencerMutation();
  const [toggleLock, { isLoading: locking }] =
    useToggleInfluencerLockMutation();

  const influencers = data?.data || [];
  const isDemo = false;
  const total = data?.pagination?.total ?? influencers.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const openAdd = () => {
    setEditRecord(null);
    setImageFile(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Influencer) => {
    setEditRecord(record);
    setImageFile(null);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      contact: record.contact,
      discount: record.discount,
      commission: record.commission,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: InfluencerFormValues) => {
   
    
    const formData = new FormData();
    Object.entries(values).forEach(
      ([k, v]) => v != null && formData.append(k, String(v)),
    );
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editRecord) {
        await updateInfluencer({ id: editRecord._id, data: formData }).unwrap();
        message.success("Influencer updated!");
      } else {
        await createInfluencer(formData).unwrap();
        message.success("Influencer created!");
      }
      setModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInfluencer(deleteId).unwrap();
      message.success("Influencer deleted");
      setDeleteId(null);
    } catch {
      message.error("Delete failed");
    }
  };

  const columns: ColumnsType<Influencer> = [
    {
      title: "Influencer",
      key: "influencer",
      render: (_, record) => {
      
        
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar src={getImageUrl(record.image!)} size={38} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{record.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                {record.email}
              </div>
            </div>
          </div>
        );
      },
    },
    { title: "Phone", dataIndex: "contact", render: (p) => p || "—" },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (d) => (
        <span
          style={{
            background: "#e6f7ef",
            color: "#009A54",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {d}%
        </span>
      ),
    },
    {
      title: "Commission",
      dataIndex: "commission",
      render: (c) => (
        <span
          style={{
            background: "#eef2ff",
            color: "#6366f1",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {c}%
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <StatusBadge status={s === "active" ? "Active" : "Inactive"} />
      ),
    },
    {
      title: "Lock",
      key: "lock",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          onChange={() => !isDemo && toggleLock(record._id)}
          loading={locking}
          disabled={isDemo}
          style={{
            background: record.status === "active" ? "#009A54" : undefined,
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => !isDemo && openEdit(record)}
            disabled={isDemo}
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
      <div className="page-title">Influencers</div>
      <div className="page-subtitle">
        Manage influencer partnerships, discounts & commissions.
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            All Influencers ({data?.pagination?.total || 0})
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              placeholder="Search influencers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() =>
                setParams((p) => ({ ...p, searchTerm: searchText, page: 1 }))
              }
              style={{ width: 220, borderRadius: 8 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAdd}
              style={{ borderRadius: 8 }}
            >
              Add Influencer
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={influencers}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(page, limit) =>
            setParams((p) => ({ ...p, page, limit }))
          }
        />
      </div>

      {/* Add/Edit Modal */}
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
            {editRecord ? "Edit Influencer" : "Add Influencer"}
          </span>
        }
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={580}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
              Profile Image
            </div>
            <ImageUploader
              value={getImageUrl(editRecord?.image || "")}
              onChange={setImageFile}
              label="Upload Influencer Photo"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="John Doe"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="john@example.com"
              />
            </Form.Item>
            <Form.Item name="contact" label="Phone">
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="+1234567890"
              />
            </Form.Item>
            <Form.Item
              name="discount"
              label="Discount (%)"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                max={100}
                size="large"
                style={{ width: "100%", borderRadius: 8 }}
                placeholder="10"
              />
            </Form.Item>
            <Form.Item
              name="commission"
              label="Commission (%)"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                max={100}
                size="large"
                style={{ width: "100%", borderRadius: 8 }}
                placeholder="15"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={editRecord ? [] : [{ required: true }]}
            >
              <Input.Password
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="********"
              />
            </Form.Item>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || updating}
              style={{ minWidth: 120 }}
            >
              {editRecord ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Influencer?"
        message="This will permanently remove the influencer from the platform."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
