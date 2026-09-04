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
      StarterKit.configure({
        // rel/target dibiarkan default TipTap (noopener noreferrer, _blank)
        link: { openOnClick: false, autolink: true },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        // Pakai .prose-custom yang sama dengan halaman berita publik,
        // supaya tampilan saat mengetik sama dengan hasil terbitnya.
        class: 'prose-custom min-h-[200px] px-3 py-2.5 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value])

  if (!editor) return null

  const e = editor

  const aturTautan = () => {
    const sekarang = e.getAttributes('link').href as string | undefined
    const url = window.prompt(
      'Alamat tautan (kosongkan untuk menghapus tautan):',
      sekarang ?? 'https://',
    )
    if (url === null) return // batal

    const rantai = e.chain().focus().extendMarkRange('link')
    if (url.trim() === '') rantai.unsetLink().run()
    else rantai.setLink({ href: url.trim() }).run()
  }

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

        <ToolBtn onClick={() => e.chain().focus().toggleBlockquote().run()} active={e.isActive('blockquote')} title="Kutipan">
          &ldquo;
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolBtn onClick={aturTautan} active={e.isActive('link')} title="Sisipkan tautan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => e.chain().focus().extendMarkRange('link').unsetLink().run()}
          title="Hapus tautan">
          <span className="line-through">↗</span>
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
