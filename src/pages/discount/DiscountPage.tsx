import { useEffect } from 'react';
import { Form, InputNumber, Input, Button, Card, message, Spin } from 'antd';
import { PercentageOutlined, SaveOutlined } from '@ant-design/icons';
import { useGetDiscountQuery, useUpdateDiscountMutation } from '@/services/disclaimer.api';
import { demoDiscount } from '@/mock/demoData';

export default function DiscountPage() {
  const [form] = Form.useForm();
  const { data, isLoading } = useGetDiscountQuery();
  const [updateDiscount, { isLoading: saving }] = useUpdateDiscountMutation();

  const discountData = data?.data ?? demoDiscount;

  useEffect(() => {
    form.setFieldsValue({
      percentage: discountData?.user_discount,
      description: discountData?.description || '',
    });
  }, [discountData, form]);

  const onFinish = async (values: { percentage: number; description?: string }) => {
    try {
      await updateDiscount({amount: values.percentage, description: values.description}).unwrap();
      message.success('Discount settings updated successfully!');
    } catch {
      message.error('Failed to update discount');
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 540 }}>
      <div className="page-title">Discount Settings</div>
      <div className="page-subtitle">Set the global discount percentage applied across the platform.</div>

      <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {/* Current Preview */}
        <div style={{ background: 'linear-gradient(135deg, #009A54, #00c96e)', borderRadius: 12, padding: 28, marginBottom: 32, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Current Global Discount</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, lineHeight: 1 }}>
            {discountData.user_discount || 0}<span style={{ fontSize: 32 }}>%</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 8 }}>
            {discountData.description || 'This discount for user refferal discount.'}
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="percentage"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Discount Percentage</span>}
            rules={[{ required: true, message: 'Please enter a discount percentage' }]}
          >
            <InputNumber
              min={0}
              max={100}
              size="large"
              style={{ width: '100%', borderRadius: 10 }}
              prefix={<PercentageOutlined style={{ color: '#9ca3af' }} />}
              placeholder="e.g. 15"
              addonAfter="%"
            />
          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
            size="large"
            block
            style={{ borderRadius: 10, fontWeight: 600, height: 48 }}
          >
            Update Discount
          </Button>
        </Form>
      </Card>
    </div>
  );
}
