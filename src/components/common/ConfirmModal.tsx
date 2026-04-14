import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title = 'Confirm Action',
  message,
  onConfirm,
  onCancel,
  loading,
  danger = true,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      closable={!loading}
    >
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: danger ? '#fce4ec' : '#e6f7ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <ExclamationCircleOutlined
            style={{ fontSize: 28, color: danger ? '#e53935' : '#009A54' }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button onClick={onCancel} disabled={loading} style={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger={danger}
            onClick={onConfirm}
            loading={loading}
            style={{
              minWidth: 100,
              background: danger ? undefined : '#009A54',
              borderColor: danger ? undefined : '#009A54',
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
