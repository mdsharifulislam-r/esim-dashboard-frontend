import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploader from '@/components/forms/ImageUploader';
import RichTextEditor from '@/components/forms/RichTextEditor';
import { useCreateBlogMutation, useUpdateBlogMutation, useGetBlogQuery } from '@/services/blog.api';
import { getImageUrl } from '@/services/api';

export default function BlogFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: blogData } = useGetBlogQuery(id!, { skip: !isEdit });
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  useEffect(() => {
    if (blogData?.data) {
      form.setFieldsValue({ title: blogData.data.title, status: blogData.data.status });
      setContent(blogData.data.content || '');
    }
  }, [blogData, form]);

  const onFinish = async (values: { title: string; status: string }) => {
    if (!content || content === '<p><br></p>') {
      message.error('Please add blog content');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEdit) {
        await updateBlog({ id: id!, data: formData }).unwrap();
        message.success('Blog updated successfully!');
      } else {
        await createBlog(formData).unwrap();
        message.success('Blog created successfully!');
        navigate('/blogs');
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to save blog');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/blogs')}
          style={{ borderRadius: 8 }}
        >
          Back
        </Button>
        <div className="page-title" style={{ marginBottom: 0 }}>
          {isEdit ? 'Edit Blog' : 'Create New Blog'}
        </div>
      </div>
      <div className="page-subtitle">{isEdit ? 'Update blog content and settings.' : 'Write a new article for your audience.'}</div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} initialValues={{ status: 'active' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <Form.Item
                name="title"
                label={<span style={{ fontWeight: 600, fontSize: 13 }}>Blog Title</span>}
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input
                  size="large"
                  placeholder="Enter blog title..."
                  style={{ borderRadius: 8, fontSize: 16, fontWeight: 500 }}
                />
              </Form.Item>

              <div style={{ marginBottom: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#1a1a2e' }}>Content <span style={{ color: '#ef4444' }}>*</span></div>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your blog post..."
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card
              title={<span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>Publish Settings</span>}
              style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            >

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={creating || updating}
                  block
                  size="large"
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  {isEdit ? 'Update Blog' : 'Publish'}
                </Button>
              </div>
            </Card>

            <Card
              title={<span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>Thumbnail</span>}
              style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            >
              <ImageUploader
                value={isEdit ? getImageUrl(blogData?.data?.thumbnail||'') : null}
                onChange={setImageFile}
                label="Upload Thumbnail"
              />
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
}
