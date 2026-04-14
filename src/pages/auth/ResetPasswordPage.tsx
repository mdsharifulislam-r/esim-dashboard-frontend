import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useResetPasswordMutation } from '@/services/auth.api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    try {
     await localStorage.setItem('token', token);
      
      const res = await resetPassword({ token, newPassword: values.newPassword,confirmPassword: values.confirmPassword }).unwrap();
      if (res.success) {
        message.success('Password reset successfully!');
        navigate('/login');
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Reset failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Reset Password</div>
        <div className="auth-subtitle">Create a new secure password for your account.</div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="newPassword"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>New Password</span>}
            rules={[{ required: true, min: 8, message: 'Minimum 8 characters' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="New password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Confirm Password</span>}
            rules={[{ required: true, message: 'Please confirm your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Confirm password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            size="large"
            style={{ borderRadius: 10, fontWeight: 600, height: 48, marginTop: 8 }}
          >
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
}
