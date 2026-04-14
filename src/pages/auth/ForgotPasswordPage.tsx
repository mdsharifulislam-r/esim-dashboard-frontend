import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useForgotPasswordMutation } from '@/services/auth.api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values: { email: string }) => {
    try {
      const res = await forgotPassword(values).unwrap();

      
      if (res.success) {
        message.success('OTP sent to your email!');
        navigate('/verify-otp', { state: { email: values.email } });
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to send OTP.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
        >
          <ArrowLeftOutlined /> Back to login
        </button>
        <div className="auth-logo">Forgot Password</div>
        <div className="auth-subtitle">Enter your email and we'll send you an OTP to reset your password.</div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Email Address</span>}
            rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
              placeholder="admin@esim.com"
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
            style={{ borderRadius: 10, fontWeight: 600, height: 48 }}
          >
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
}
