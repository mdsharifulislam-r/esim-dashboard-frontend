import { useState } from "react";
import {
  Input,
  Button,
  Avatar,
  Modal,
  Form,
  Select,
  Tag,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import ImageUploader from "@/components/forms/ImageUploader";
import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "@/services/admin.api";
import type { Admin, QueryParams } from "@/types";
import { getImageUrl } from "@/services/api";
import dayjs from "dayjs";

interface AdminFormValues {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export default function AdminsPage() {
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    searchTerm: "",
  });
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Admin | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetAdminsQuery(params);

  const [createAdmin, { isLoading: creating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: updating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: deleting }] = useDeleteAdminMutation();

  const admins = data?.data || [];
  const total = data?.pagination?.total ?? admins.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const openAdd = () => {
    setEditRecord(null);
    setImageFile(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Admin) => {
    setEditRecord(record);
    setImageFile(null);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: AdminFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v != null && v !== "") formData.append(k, String(v));
    });
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editRecord) {
        await updateAdmin({ id: editRecord._id, data: formData }).unwrap();
        message.success("Admin updated successfully!");
      } else {
        await createAdmin(formData).unwrap();
        message.success("Admin created successfully!");
      }
      setModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdmin(deleteId).unwrap();
      message.success("Admin deleted successfully");
      setDeleteId(null);
    } catch (err: any) {
      message.error(err?.data?.message || "Delete failed");
    }
  };

  const columns: ColumnsType<Admin> = [
    {
      title: "Admin",
      key: "admin",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            src={record.image ? getImageUrl(record.image) : undefined}
            icon={<UserOutlined />}
            style={{ background: "linear-gradient(135deg, #009A54, #00c96e)" }}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              {record.name}
              {record.verified && (
                <SafetyCertificateOutlined style={{ color: "#009A54", fontSize: 13 }} />
              )}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role: string) => (
        <Tag
          icon={role === "SUPER_ADMIN" ? <CrownOutlined /> : <UserOutlined />}
          color={role === "SUPER_ADMIN" ? "gold" : "blue"}
          style={{ borderRadius: 20, fontWeight: 600, padding: "2px 10px" }}
        >
          {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <StatusBadge status={s === "active" ? "active" : "inactive"} />
      ),
    },
    {
      title: "Referral Code",
      dataIndex: "refferal_code",
      render: (code: string) => (
        <span
          style={{
            background: "#f3f4f6",
            color: "#374151",
            padding: "3px 10px",
            borderRadius: 6,
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {code || "—"}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      render: (d: string) => (
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {dayjs(d).format("MMM D, YYYY")}
        </span>
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
            onClick={() => setDeleteId(record._id)}
            style={{ borderRadius: 8 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Manage Admins</div>
      <div className="page-subtitle">
        Add, edit, and manage administrator accounts for this platform.
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            All Admins
            <span
              style={{
                marginLeft: 10,
                fontSize: 13,
                color: "#9ca3af",
                fontFamily: "DM Sans",
                fontWeight: 400,
              }}
            >
              ({data?.pagination?.total || 0})
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              placeholder="Search admins..."
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
              Add Admin
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={admins}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(page, limit) =>
            setParams((p) => ({ ...p, page, limit }))
          }
        />
      </div>

      {/* Add / Edit Modal */}
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
            {editRecord ? "Edit Admin" : "Add New Admin"}
          </span>
        }
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          {/* Profile Image */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
              Profile Image
            </div>
            <ImageUploader
              value={editRecord?.image ? getImageUrl(editRecord.image) : ""}
              onChange={setImageFile}
              label="Upload Admin Photo"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="John Doe"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="john@example.com"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Role is required" }]}
            >
              <Select
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="Select role"
                options={[
                  { value: "ADMIN", label: "Admin" },
                  { value: "SUPER_ADMIN", label: "Super Admin" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={
                editRecord
                  ? []
                  : [{ required: true, message: "Password is required" }]
              }
            >
              <Input.Password
                size="large"
                style={{ borderRadius: 8 }}
                placeholder={editRecord ? "Leave blank to keep" : "••••••••"}
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
              {editRecord ? "Update Admin" : "Create Admin"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete Admin?"
        message="This will permanently remove the admin account. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
