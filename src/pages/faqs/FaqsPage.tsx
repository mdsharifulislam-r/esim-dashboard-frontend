import { useState } from 'react';
import { Button, Modal, Form, Input, message, Collapse } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useGetFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } from '@/services/faq.api';
import { demoFaqs } from '@/mock/demoData';
import type { Faq, QueryParams } from '@/types';

const { Panel } = Collapse;

export default function FaqsPage() {
  const [params] = useState<QueryParams>({ page: 1, limit: 50 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Faq | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetFaqsQuery(params);
  const [createFaq, { isLoading: creating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: deleting }] = useDeleteFaqMutation();

  const faqs =  data?.data ||[]
  const isDemo = false

  const openAdd = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditRecord(faq);
    form.setFieldsValue({ question: faq.question, answer: faq.answer });
    setModalOpen(true);
  };

  const handleSubmit = async (values: { question: string; answer: string }) => {
    try {
      if (editRecord) {
        await updateFaq({ id: editRecord._id, data: values }).unwrap();
        message.success('FAQ updated!');
      } else {
        await createFaq(values).unwrap();
        message.success('FAQ created!');
      }
      setModalOpen(false);
    } catch {
      message.error('Operation failed');
    }
  };

  return (
    <div>
      <div className="page-title">FAQs</div>
      <div className="page-subtitle">Manage frequently asked questions.</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: '#6b7280' }}>
          <QuestionCircleOutlined style={{ marginRight: 6 }} />
          {faqs.length} questions
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} disabled={isDemo} style={{ borderRadius: 8 }}>
          Add FAQ
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>Loading FAQs...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              <Collapse ghost>
                <Panel
                  key={faq._id}
                  header={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ background: '#e6f7ef', color: '#009A54', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {index + 1}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{faq.question}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginLeft: 16 }} onClick={(e) => e.stopPropagation()}>
                        <Button size="small" icon={<EditOutlined />} onClick={() => !isDemo && openEdit(faq)} disabled={isDemo} style={{ borderRadius: 6, borderColor: '#009A54', color: '#009A54' }} />
                        <Button size="small" icon={<DeleteOutlined />} danger onClick={() => !isDemo && setDeleteId(faq._id)} disabled={isDemo} style={{ borderRadius: 6 }} />
                      </div>
                    </div>
                  }
                >
                  <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, padding: '0 16px 8px 56px' }}>{faq.answer}</p>
                </Panel>
              </Collapse>
            </div>
          ))}
          {faqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 64, background: '#fff', borderRadius: 16, color: '#9ca3af' }}>
              <QuestionCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>No FAQs yet. Add your first FAQ.</div>
            </div>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={<span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>{editRecord ? 'Edit FAQ' : 'Add FAQ'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={560}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} style={{ marginTop: 16 }}>
          <Form.Item name="question" label="Question" rules={[{ required: true }]}>
            <Input.TextArea rows={2} size="large" style={{ borderRadius: 8 }} placeholder="Enter the question..." />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <Input.TextArea rows={5} size="large" style={{ borderRadius: 8 }} placeholder="Enter the detailed answer..." />
          </Form.Item>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || updating} style={{ minWidth: 100 }}>
              {editRecord ? 'Update' : 'Add FAQ'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete FAQ?"
        message="This FAQ will be permanently removed."
        onConfirm={async () => { await deleteFaq(deleteId!).unwrap(); setDeleteId(null); message.success('Deleted!'); }}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
