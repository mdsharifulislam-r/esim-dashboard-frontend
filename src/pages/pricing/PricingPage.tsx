import { useEffect } from 'react';
import { Form, InputNumber, Button, Card, message, Spin } from 'antd';
import { DollarOutlined, SaveOutlined } from '@ant-design/icons';
import { useGetPricingRulesQuery, useUpdatePricingRulesMutation } from '@/services/pricing.api';
import { demoPricingRules } from '@/mock/demoData';

export default function PricingPage() {
  const [form] = Form.useForm();
  const { data, isLoading } = useGetPricingRulesQuery();
  const [updatePricingRules, { isLoading: saving }] = useUpdatePricingRulesMutation();

  const pricingData = data?.data ?? demoPricingRules;

  useEffect(() => {
    form.setFieldsValue({
      margin_price: pricingData?.margin_price,
    });
  }, [pricingData, form]);

  const onFinish = async (values: { margin_price: number }) => {
    try {
      await updatePricingRules({
        margin_price: values.margin_price,
        tax_percent: pricingData.tax_percent,
      }).unwrap();
      message.success('Platform margin updated successfully!');
    } catch {
      message.error('Failed to update platform margin');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 540 }}>
      <div className="page-title">Platform Margin</div>
      <div className="page-subtitle">
        Set the margin percentage applied on top of the base eSIM package price.
      </div>

      <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
            borderRadius: 12,
            padding: 28,
            marginBottom: 32,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Current Platform Margin</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, lineHeight: 1 }}>
            {pricingData.margin_price || 0}
            <span style={{ fontSize: 32 }}>%</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 8 }}>
            Applied to all eSIM package prices across the platform
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="margin_price"
            label={<span style={{ fontWeight: 600, fontSize: 13 }}>Margin Percentage</span>}
            rules={[{ required: true, message: 'Please enter a margin percentage' }]}
          >
            <InputNumber
              min={0}
              max={100}
              size="large"
              style={{ width: '100%', borderRadius: 10 }}
              prefix={<DollarOutlined style={{ color: '#9ca3af' }} />}
              placeholder="e.g. 30"
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
            Update Platform Margin
          </Button>
        </Form>
      </Card>
    </div>
  );
}
