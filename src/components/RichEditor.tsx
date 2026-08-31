import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

function ToolBtn({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`px-2 py-1 text-[13px] border transition-colors
        ${active
          ? 'bg-ink text-white border-ink'
          : 'border-transparent text-ink-3 hover:text-ink hover:border-border'
        }`}
    >
      {children}
    </button>
  )
}

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[200px] px-3 py-2.5 text-[14px] text-ink focus:outline-none prose prose-sm max-w-none',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [value])

  if (!editor) return null

  const e = editor

  return (
    <div className="border border-border focus-within:border-ink transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-surface">
        <ToolBtn onClick={() => e.chain().focus().toggleBold().run()} active={e.isActive('bold')} title="Bold">
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().toggleItalic().run()} active={e.isActive('italic')} title="Italic">
          <em>I</em>
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().toggleUnderline().run()} active={e.isActive('underline')} title="Underline">
          <span className="underline">U</span>
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolBtn onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()} active={e.isActive('heading', { level: 2 })} title="Heading">
          H2
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()} active={e.isActive('heading', { level: 3 })} title="Subheading">
          H3
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolBtn onClick={() => e.chain().focus().toggleBulletList().run()} active={e.isActive('bulletList')} title="Bullet list">
          ≡
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().toggleOrderedList().run()} active={e.isActive('orderedList')} title="Numbered list">
          1.
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolBtn onClick={() => e.chain().focus().toggleBlockquote().run()} active={e.isActive('blockquote')} title="Blockquote">
          "
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolBtn onClick={() => e.chain().focus().setTextAlign('left').run()} active={e.isActive({ textAlign: 'left' })} title="Rata kiri">
          ←
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().setTextAlign('center').run()} active={e.isActive({ textAlign: 'center' })} title="Tengah">
          ↔
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().setTextAlign('right').run()} active={e.isActive({ textAlign: 'right' })} title="Rata kanan">
          →
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolBtn onClick={() => e.chain().focus().undo().run()} title="Undo">↩</ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().redo().run()} title="Redo">↪</ToolBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
