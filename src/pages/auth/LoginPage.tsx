import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Alert } from 'antd';
import { MailOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLoginMutation } from '@/services/auth.api';
import { demoAuthUser } from '@/mock/demoData';

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: { email: string; password: string }) => {

    // Try real API login for other credentials
    try {
      const res = await login(values).unwrap();
      
      if (res.success) {
        localStorage.setItem('token', res.data.accessToken);
        message.success('Login successful!');
        setTimeout(() => navigate('/dashboard'), 500);
      }
    } catch (err: any) {
      
      message.error(err?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: '#009A54',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GlobalOutlined style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <div className="auth-logo">eSIM Admin</div>
        </div>
        <div className="auth-subtitle">Sign in to your admin account to continue</div>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Email Address</span>}
            rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
              placeholder="admin@example.com"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Password</span>}
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 24, marginTop: -8 }}>
            <a
              onClick={() => navigate('/forgot-password')}
              style={{ color: '#009A54', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            size="large"
            style={{ borderRadius: 10, fontWeight: 600, height: 48 }}
          >
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
}
