import { useState } from "react";
import { Input, Button, Switch, Avatar, Tooltip, message, Tag } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  useGetUsersQuery,
  useToggleUserLockMutation,
  useToggleUserStatusMutation,
} from "@/services/users.api";
import { demoUsers } from "@/mock/demoData";
import type { User, QueryParams } from "@/types";
import dayjs from "dayjs";

export default function UsersPage() {
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    searchTerm: "",
    status: "",
  });
  const [searchText, setSearchText] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "lock" | "status";
    userId: string;
    isBlocked?: boolean;
  } | null>(null);

  const { data, isLoading } = useGetUsersQuery(params);
  const [toggleLock, { isLoading: locking }] = useToggleUserLockMutation();
  const [toggleStatus, { isLoading: togglingStatus }] =
    useToggleUserStatusMutation();

  const users = data?.data || [];
  const isDemo = false;
  const total = data?.pagination?.total ?? users.length;
  const page = data?.pagination?.page ?? params.page;
  const limit = data?.pagination?.limit ?? params.limit;

  const handleSearch = () =>
    setParams((p) => ({ ...p, searchTerm: searchText, page: 1 }));

  const handleConfirm = async () => {
    if (!confirmModal) return;
    try {
   
      
     const res= await toggleLock(confirmModal.userId).unwrap();

     
      message.success(
        `User ${confirmModal.isBlocked ? "unlocked" : "locked"} successfully`,
      );
      setConfirmModal(null);
    } catch(err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            src={record.image}
            icon={<UserOutlined />}
            style={{ background: "#009A54" }}
            size={38}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "contact",
      render: (p) => p || <span style={{ color: "#d1d5db" }}>—</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <StatusBadge status={s==="active" ? "active" : "inactive"} />,
    },
    {
      title: "Verified",
      dataIndex: "verified",
      render: (v) => (
        <Tag color={v ? "green" : "default"} style={{ borderRadius: 20 }}>
          {v ? "Verified" : "Unverified"}
        </Tag>
      ),
    },
    {
      title: "Joined",
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
        <Tooltip
          title={record.status === "delete" ? "Unlock User" : "Lock User"}
        >
          <Button
            size="small"
            icon={
              record.status === "delete" ? <UnlockOutlined /> : <LockOutlined />
            }
            danger={record.status === "delete"}
            onClick={() =>
              !isDemo &&
              setConfirmModal({
                open: true,
                type: "lock",
                userId: record._id,
                isBlocked: record.status === "delete",
              })
            }
            disabled={isDemo}
            style={{
              borderRadius: 8,
              ...(record.status === "delete"
                ? { borderColor: "#009A54", color: "#009A54" }
                : {}),
            }}
          >
            {record.status === "delete" ? "Unlock" : "Lock"}
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="page-title">Users</div>
      <div className="page-subtitle">
        Manage all registered users on the platform.
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            All Users
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
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 240, borderRadius: 8 }}
            />
            <Button
              type="primary"
              onClick={handleSearch}
              style={{ borderRadius: 8 }}
            >
              Search
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          loading={isLoading && !data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(page, limit) =>
            setParams((p) => ({ ...p, page, limit }))
          }
        />
      </div>

      <ConfirmModal
        open={confirmModal?.open || false}
        title={
          confirmModal?.type === "lock"
            ? confirmModal?.isBlocked
              ? "Unlock User?"
              : "Lock User?"
            : "Toggle User Status?"
        }
        message={
          confirmModal?.type === "lock"
            ? confirmModal?.isBlocked
              ? "This will allow the user to access the platform again."
              : "This will prevent the user from accessing the platform."
            : "This will change the user's active status."
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal(null)}
        loading={locking || togglingStatus}
        danger={confirmModal?.type === "lock" && !confirmModal?.isBlocked}
      />
    </div>
  );
}
