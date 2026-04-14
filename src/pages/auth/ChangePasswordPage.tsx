import { Form, Input, Button, message, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useChangePasswordMutation } from '@/services/auth.api';

export default function ChangePasswordPage() {
  const [form] = Form.useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onFinish = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match!');
      return;
    }
    try {
      const res = await changePassword({ currentPassword: values.oldPassword, newPassword: values.newPassword ,confirmPassword: values.confirmPassword}).unwrap();
      if (res.success) {
        message.success('Password changed successfully!');
        form.resetFields();
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="page-title">Change Password</div>
      <div className="page-subtitle">Update your account password securely.</div>

      <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="oldPassword"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Current Password</span>}
            rules={[{ required: true, message: 'Current password is required' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} size="large" style={{ borderRadius: 10 }} placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>New Password</span>}
            rules={[{ required: true, min: 8, message: 'Minimum 8 characters' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} size="large" style={{ borderRadius: 10 }} placeholder="New password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Confirm New Password</span>}
            rules={[{ required: true, message: 'Please confirm new password' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} size="large" style={{ borderRadius: 10 }} placeholder="Confirm new password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isLoading} size="large" style={{ borderRadius: 10, fontWeight: 600, minWidth: 160 }}>
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  );
}
