import { useEffect, useRef, useState } from 'react';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface ImageUploaderProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Upload Image' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <div className="image-uploader" style={{ padding: 8, cursor: 'default' }}>
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button
              size="small"
              icon={<UploadOutlined />}
              onClick={() => inputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="image-uploader" onClick={() => inputRef.current?.click()}>
          <UploadOutlined style={{ fontSize: 32, color: '#009A54', marginBottom: 8 }} />
          <div style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
            <span style={{ color: '#009A54', fontWeight: 600 }}>{label}</span>
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
            PNG, JPG, WEBP up to 10MB
          </div>
        </div>
      )}
    </div>
  );
}
