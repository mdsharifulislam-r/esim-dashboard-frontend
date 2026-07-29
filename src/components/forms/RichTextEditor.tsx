import { useEffect, type ReactNode } from 'react';
import { Button, Tooltip } from 'antd';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  PictureOutlined,
  BlockOutlined,
  CodeOutlined,
  ClearOutlined,
} from '@ant-design/icons';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

type ToolbarButtonProps = {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({ title, active, onClick, children }: ToolbarButtonProps) {
  return (
    <Tooltip title={title}>
      <Button
        type={active ? 'primary' : 'text'}
        size="small"
        onClick={onClick}
        style={{ minWidth: 32 }}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor__content',
        'data-placeholder': placeholder || '',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const nextHtml = value || '';

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');

    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar">
        <ToolbarButton
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <OrderedListOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <UnorderedListOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeftOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenterOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRightOutlined />
        </ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={addLink}>
          <LinkOutlined />
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={addImage}>
          <PictureOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <BlockOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeOutlined />
        </ToolbarButton>
        <ToolbarButton
          title="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <ClearOutlined />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
