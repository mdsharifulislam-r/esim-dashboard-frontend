import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Avatar, Card, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/auth.api';
import { demoAuthUser } from '@/mock/demoData';
import ImageUploader from '@/components/forms/ImageUploader';
import { getImageUrl } from '@/services/api';

export default function ProfilePage() {
  const [form] = Form.useForm();
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const profile = profileData?.data || demoAuthUser;
  const isDemo = !profileData?.data?.name;

  useEffect(() => {
    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
    });
  }, [profile, form]);

  const onFinish = async (values: { name: string; email: string }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) message.success('Profile updated successfully!');
    } catch (err: any) {
      message.error(err?.data?.message || 'Update failed.');
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="page-title">My Profile</div>
      <div className="page-subtitle">Manage your personal information.</div>

      <Card loading={isLoading} style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px', background: '#f9fffe', borderRadius: 12, border: '1px solid #e6f7ef' }}>
          <Avatar
            size={80}
            src={getImageUrl(profile.image||'')}
            icon={<UserOutlined />}
            style={{ background: '#009A54', fontSize: 32 }}
          />
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
              {profile.name}
            </div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>{profile.email}</div>
            <div style={{ color: '#009A54', fontSize: 12, fontWeight: 600, marginTop: 4, background: '#e6f7ef', padding: '2px 10px', borderRadius: 20, display: 'inline-block' }}>
              Super Admin
            </div>
          </div>
        </div>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#1a1a2e' }}>Profile Photo</div>
            <ImageUploader
              value={getImageUrl(profile.image||'')}
              onChange={setImageFile}
              label="Update Profile Photo"
            />
          </Col>
        </Row>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label={<span style={{ fontWeight: 600, fontSize: 13 }}>Full Name</span>} rules={[{ required: true }]}>
                <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />} size="large" style={{ borderRadius: 10 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label={<span style={{ fontWeight: 600, fontSize: 13 }}>Email</span>} rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined style={{ color: '#9ca3af' }} />} size="large" style={{ borderRadius: 10 }} />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" loading={updating} disabled={isDemo} size="large" style={{ borderRadius: 10, fontWeight: 600, minWidth: 160 }}>
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
}
