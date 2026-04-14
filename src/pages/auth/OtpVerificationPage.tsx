import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useVerifyOtpMutation } from '@/services/auth.api';

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const onFinish = async (values: { otp: string }) => {
    try {
      const res = await verifyOtp({ email, oneTimeCode: Number(values.otp) }).unwrap();
      if (res.success) {
        message.success('OTP verified!');
        navigate('/reset-password', { state: { token: res.data } });
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Invalid OTP.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button
          onClick={() => navigate('/forgot-password')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
        >
          <ArrowLeftOutlined /> Back
        </button>
        <div className="auth-logo">Verify OTP</div>
        <div className="auth-subtitle">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="otp"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>OTP Code</span>}
            rules={[{ required: true, len: 4, message: 'Enter the 4-digit OTP' }]}
          >
            <Input
              placeholder="1234"
              size="large"
              maxLength={4}
              style={{ borderRadius: 10, letterSpacing: 8, textAlign: 'center', fontSize: 20 }}
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
            Verify OTP
          </Button>
        </Form>
      </div>
    </div>
  );
}
