import { useState } from "react";
import {
  Button,
  Modal,
  Select,
  Avatar,
  Input,
  Form,
  Drawer,
  message,
  Tag,
} from "antd";
import { UserOutlined, SendOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import {
  useGetSupportMessagesQuery,
  useReplyToSupportMutation,
  useUpdateSupportStatusMutation,
} from "@/services/support.api";
import { demoSupportMessages } from "@/mock/demoData";
import type { SupportMessage, QueryParams } from "@/types";
import dayjs from "dayjs";

export default function SupportPage() {
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    status: "",
  });
  const [viewDrawer, setViewDrawer] = useState<SupportMessage | null>(null);
  const [replyModal, setReplyModal] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data, isLoading } = useGetSupportMessagesQuery(params);
  const [sendReply, { isLoading: replying }] = useReplyToSupportMutation();
  const [updateStatus, { isLoading: updatingStatus }] =
    useUpdateSupportStatusMutation();

  const supportMessages = data?.data || [];
  const isDemo = false;
  const total = data?.pagination?.total ?? supportMessages.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const handleReply = async () => {
    if (!replyModal || !replyText.trim()) return;
    try {
      await sendReply({ id: replyModal._id, reply: replyText }).unwrap();
      message.success("Reply sent!");
      setReplyModal(null);
      setReplyText("");
    } catch {
      message.error("Failed to send reply");
    }
  };

  const columns: ColumnsType<SupportMessage> = [
    {
      title: "User",
      dataIndex: "user",
      render: (user, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            icon={<UserOutlined />}
            size={36}
            style={{ background: "#f59e0b" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              {record?.name}
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              {record?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      render: (s) => <span style={{ fontWeight: 500, fontSize: 13 }}>{s}</span>,
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (m) => (
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {m?.length > 60 ? m.slice(0, 60) + "..." : m}
        </span>
      ),
    },
    {
      title: "Replied",
      dataIndex: "reply",
      render: (r) => (
        <Tag color={r ? "green" : "default"} style={{ borderRadius: 20 }}>
          {r ? "Replied" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <StatusBadge status={s} />,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (d) => (
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
            icon={<EyeOutlined />}
            onClick={() => setViewDrawer(record)}
            style={{
              borderRadius: 8,
              borderColor: "#6366f1",
              color: "#6366f1",
            }}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<SendOutlined />}
            type="primary"
            onClick={() => !isDemo && setReplyModal(record)}
            disabled={isDemo}
            style={{ borderRadius: 8 }}
          >
            Reply
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Support Messages</div>
      <div className="page-subtitle">
        Manage and respond to customer support requests.
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            All Messages ({data?.pagination?.total || 0})
          </div>
          <Select
            placeholder="Filter by status"
            allowClear
            onChange={(val) =>
              setParams((p) => ({ ...p, status: val || "", page: 1 }))
            }
            style={{ width: 160 }}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="pending">In Progress</Select.Option>
            <Select.Option value="resolved">Resolved</Select.Option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={supportMessages}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(page, limit) =>
            setParams((p) => ({ ...p, page, limit }))
          }
        />
      </div>

      {/* View Drawer */}
      <Drawer
        title={
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Support Ticket Details
          </span>
        }
        open={!!viewDrawer}
        onClose={() => setViewDrawer(null)}
        width={520}
      >
        {viewDrawer && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
                padding: 16,
                background: "#f9fffe",
                borderRadius: 12,
              }}
            >
              <Avatar
                icon={<UserOutlined />}
                size={48}
                style={{ background: "#009A54" }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>
                  {viewDrawer.name}
                </div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>
                  {viewDrawer.email}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <StatusBadge status={viewDrawer.status} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                {viewDrawer.subject}
              </div>
              <p
                style={{
                  color: "#374151",
                  lineHeight: 1.7,
                  fontSize: 14,
                  background: "#f9f9f9",
                  padding: 16,
                  borderRadius: 10,
                }}
              >
                {viewDrawer.message}
              </p>
            </div>

            {viewDrawer.reply && (
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#009A54",
                    marginBottom: 8,
                  }}
                >
                  ✅ Admin Reply
                </div>
                <p
                  style={{
                    color: "#374151",
                    lineHeight: 1.7,
                    fontSize: 14,
                    background: "#e6f7ef",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid #b7ebd4",
                  }}
                >
                  {viewDrawer.reply}
                </p>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                Change Status
              </div>
              <Select
                value={viewDrawer.status}
                onChange={async (val) => {
                  if (!isDemo) {
                    await updateStatus({
                      id: viewDrawer._id,
                      status: val,
                    }).unwrap();
                    message.success("Status updated");
                    setViewDrawer({ ...viewDrawer, status: val });
                  }
                }}
                disabled={isDemo}
                loading={updatingStatus}
                style={{ width: "100%" }}
                size="large"
              >
                <Select.Option value="open">Open</Select.Option>
                <Select.Option value="in-progress">In Progress</Select.Option>
                <Select.Option value="resolved">Resolved</Select.Option>
              </Select>
            </div>
          </div>
        )}
      </Drawer>

      {/* Reply Modal */}
      <Modal
        open={!!replyModal}
        title={
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Reply to Support
          </span>
        }
        onCancel={() => setReplyModal(null)}
        footer={null}
        width={520}
        centered
      >
        {replyModal && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                padding: 14,
                background: "#f9f9f9",
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                {replyModal.subject}
              </div>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                {replyModal.message}
              </p>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
              Your Reply
            </div>
            <Input.TextArea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              style={{ borderRadius: 8, marginBottom: 16 }}
            />
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <Button onClick={() => setReplyModal(null)}>Cancel</Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleReply}
                loading={replying}
                style={{ minWidth: 120 }}
              >
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
