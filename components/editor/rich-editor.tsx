"use client"

import { useEffect, useMemo, useRef } from 'react'
import { EditorContent, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import type { Editor } from '@tiptap/core'
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
  UnderlineIcon,
  VideoIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { classifyMediaUrl, normalizeMediaUrl, transformMediaLinks } from '@/lib/media'
import { Video } from '@/lib/tiptap-video'

type EditorContentValue = {
  json?: JSONContent
  html?: string
}

type RichEditorProps = {
  content?: EditorContentValue
  placeholder?: string
  onChange?: (payload: { json: JSONContent; html: string }) => void
  className?: string
  onReady?: (editor: Editor) => void
}

function buildEditorContent(content?: EditorContentValue) {
  if (!content) return '<p></p>'
  if (content.json) return content.json
  if (content.html) return transformMediaLinks(content.html)
  return '<p></p>'
}

function tryEmbedMedia(editor: Editor | null, rawUrl: string | null | undefined, options?: { poster?: string }) {
  if (!editor) return false
  const normalizedUrl = normalizeMediaUrl(rawUrl)
  if (!normalizedUrl) return false

  const mediaType = classifyMediaUrl(normalizedUrl)
  if (mediaType === 'image') {
    editor.chain().focus().setImage({ src: normalizedUrl }).run()
    return true
  }

  if (mediaType === 'video') {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'video',
        attrs: {
          src: normalizedUrl,
          poster: options?.poster ?? null,
        },
      })
      .run()
    return true
  }

  return false
}

const menuItems = [
  { command: (editor: Editor) => editor.chain().focus().toggleBold().run(), icon: Bold, label: '\u52A0\u7C97', isActive: (editor: Editor) => editor.isActive('bold') },
  { command: (editor: Editor) => editor.chain().focus().toggleItalic().run(), icon: Italic, label: '\u659C\u4F53', isActive: (editor: Editor) => editor.isActive('italic') },
  {
    command: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
    icon: UnderlineIcon,
    label: '\u4E0B\u5212\u7EBF',
    isActive: (editor: Editor) => editor.isActive('underline'),
  },
  {
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    icon: Heading2,
    label: '\u4E8C\u7EA7\u6807\u9898',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    icon: Heading3,
    label: '\u4E09\u7EA7\u6807\u9898',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    command: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    icon: List,
    label: '\u65E0\u5E8F\u5217\u8868',
    isActive: (editor: Editor) => editor.isActive('bulletList'),
  },
  {
    command: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
    icon: ListOrdered,
    label: '\u6709\u5E8F\u5217\u8868',
    isActive: (editor: Editor) => editor.isActive('orderedList'),
  },
  {
    command: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
    icon: Quote,
    label: '\u5F15\u7528',
    isActive: (editor: Editor) => editor.isActive('blockquote'),
  },
]

export function RichEditor({
  content,
  placeholder = '\u8BB0\u5F55\u4F60\u7684\u8BBE\u8BA1\u601D\u8003\u4E0E\u6210\u679C\u2026',
  onChange,
  className,
  onReady,
}: RichEditorProps) {
  const lastApplied = useRef<string | null>(null)
  const onChangeRef = useRef<RichEditorProps['onChange']>(onChange)
  const editorInstanceRef = useRef<Editor | null>(null)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
        }),
        Underline,
        Placeholder.configure({
          placeholder,
        }),
        Link.configure({
          openOnClick: false,
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-xl border border-border/40',
          },
        }),
        Video,
      ],
      content: buildEditorContent(content),
      editorProps: {
        attributes: {
          class: 'tiptap prose prose-invert max-w-none focus:outline-none',
        },
        handlePaste(_view, event) {
          const pastedText = event.clipboardData?.getData('text/plain')?.trim()
          if (!pastedText) return false

          if (tryEmbedMedia(editorInstanceRef.current, pastedText)) {
            event.preventDefault()
            return true
          }

          return false
        },
      },
      onUpdate({ editor }) {
        const json = editor.getJSON()
        const html = editor.getHTML()
        lastApplied.current = JSON.stringify(json)
        onChangeRef.current?.({
          json,
          html,
        })
      },
      immediatelyRender: false,
    },
    [placeholder],
  )

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor)
    }
  }, [editor, onReady])

  useEffect(() => {
    if (!editor || !content) return
    const nextSignature = content.json ? JSON.stringify(content.json) : content.html ?? ''
    if (nextSignature && nextSignature === lastApplied.current) return

    if (content.json) {
      editor.commands.setContent(content.json)
      lastApplied.current = JSON.stringify(content.json)
    } else if (content.html) {
      editor.commands.setContent(transformMediaLinks(content.html))
      lastApplied.current = content.html
    }
  }, [content, editor])

  useEffect(() => {
    editorInstanceRef.current = editor ?? null
    return () => {
      editorInstanceRef.current = null
    }
  }, [editor])

  const disabled = useMemo(() => !editor, [editor])

  if (!editor) return null

  return (
    <div className={cn('flex h-full flex-col rounded-2xl border border-border/60 bg-card/70', className)}>
      <div className="flex flex-wrap gap-1 border-b border-border/60 bg-background/60 p-2">
        {menuItems.map(({ command, icon: Icon, label, isActive }) => (
          <Button
            key={label}
            variant={isActive(editor) ? 'default' : 'ghost'}
            size="sm"
            type="button"
            onClick={() => command(editor)}
            disabled={disabled}
            className="h-8 rounded-full px-2"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const url = window.prompt('\u8F93\u5165\u94FE\u63A5 URL')
            if (!url) return
            const shouldEmbed = editor.state.selection.empty && tryEmbedMedia(editor, url)
            if (!shouldEmbed) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          disabled={disabled}
          className="h-8 rounded-full px-2"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const url = window.prompt('\u8F93\u5165\u56FE\u7247\u6216 GIF \u7684 URL')
            if (!url) return
            editor.chain().focus().setImage({ src: url }).run()
          }}
          disabled={disabled}
          className="h-8 rounded-full px-2"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const src = window.prompt('\u8F93\u5165\u89C6\u9891\u5730\u5740\uFF08MP4 \u6216\u6D41\u5A92\u4F53\u94FE\u63A5\uFF09')
            if (!src) return
            const poster = window.prompt('\u53EF\u9009\uFF1A\u8F93\u5165\u5C01\u9762\u56FE URL\uFF08\u53EF\u7559\u7A7A\uFF09') || undefined
            if (!tryEmbedMedia(editor, src, { poster })) {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: 'video',
                  attrs: {
                    src,
                    poster,
                  },
                })
                .run()
            }
          }}
          disabled={disabled}
          className="h-8 rounded-full px-2"
        >
          <VideoIcon className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
            className="h-8 rounded-full px-2"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
            className="h-8 rounded-full px-2"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative flex-1 overflow-y-auto p-4">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}
