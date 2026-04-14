import { useState, useEffect } from 'react';
import { Button, Tabs, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import RichTextEditor from '@/components/forms/RichTextEditor';
import { useGetDisclaimerQuery, useUpdateDisclaimerMutation } from '@/services/disclaimer.api';
import { demoDisclaimer } from '@/mock/demoData';

const TABS = [
  { key: 'terms', label: '📋 Terms & Conditions' },
  { key: 'privacy', label: '🔒 Privacy Policy' },
  { key: 'about', label: '🌐 About Us' },
  { key: 'work', label: '⚙️ How It Works' },
];

function DisclaimerEditor({ type }: { type: string }) {
  const defaultContent = demoDisclaimer[type]?.content || '';
  const [content, setContent] = useState(defaultContent);
  const { data, isLoading } = useGetDisclaimerQuery(type);
  const [updateDisclaimer, { isLoading: saving }] = useUpdateDisclaimerMutation();

  
  useEffect(() => {
    setContent(data?.data || defaultContent);
  }, [data, defaultContent]);

  const handleSave = async () => {
    if (!content || content === '<p><br></p>') {
      message.error('Content cannot be empty');
      return;
    }
    try {
      await updateDisclaimer({ type, content }).unwrap();
      message.success('Content saved successfully!');
    } catch {
      message.error('Failed to save');
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <RichTextEditor value={content} onChange={setContent} placeholder={`Write your ${type} content here...`} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saving}
          size="large"
          style={{ borderRadius: 8, fontWeight: 600, minWidth: 160 }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default function DisclaimerPage() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div>
      <div className="page-title">Disclaimer & Pages</div>
      <div className="page-subtitle">Edit legal pages, privacy policy, and informational content.</div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ padding: '0 24px' }}
          items={TABS.map((tab) => ({
            key: tab.key,
            label: <span style={{ fontWeight: 600, fontSize: 14 }}>{tab.label}</span>,
            children: (
              <div style={{ padding: '16px 0 24px' }}>
                <DisclaimerEditor key={tab.key} type={tab.key} />
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}
