"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Editor } from '@tiptap/core'
import type { JSONContent } from '@tiptap/react'
import { marked } from 'marked'
import type { Project } from '@/data/projects'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CaseCard } from '@/components/projects/case-card'
import { RichEditor } from '@/components/editor/rich-editor'
import { cn } from '@/lib/utils'
import { transformMediaLinks } from '@/lib/media'

type DraftRecord = Record<string, { json?: JSONContent; html: string }>

type CasesShowcaseProps = {
  project: Project
}

export function CasesShowcase({ project }: CasesShowcaseProps) {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number | null>(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [drafts, setDrafts] = useState<DraftRecord>({})
  const [editing, setEditing] = useState(false)
  const [showEditToggle, setShowEditToggle] = useState(false)
  const editorRef = useRef<Editor | null>(null)

  const open = activeCaseIndex !== null
  const activeCase = open ? project.cases[activeCaseIndex!] : null
  const activeCaseId = activeCase?.id ?? null
  const activeCaseTitle = activeCase?.title ?? ''
  const activeCaseHighlights = activeCase?.highlights ?? []
  const activeCaseMedia = activeCase?.media ?? []
  const activeCaseArticle = activeCase?.articleMDX ?? ''
  const activeMedia = activeCaseMedia[activeMediaIndex]
  const draft = activeCaseId ? drafts[activeCaseId] : undefined

  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'g') {
        event.preventDefault()
        setShowEditToggle(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    if (!activeCaseId) return
    setActiveMediaIndex(0)
    setEditing(false)
    setShowEditToggle(false)
  }, [activeCaseId])

  const baseHtml = useMemo(() => {
    if (!activeCaseArticle) return ''
    const parsed = marked.parse(activeCaseArticle) as string
    return transformMediaLinks(parsed)
  }, [activeCaseArticle])

  const editorContent = useMemo(() => {
    if (!activeCaseId) return undefined
    if (draft) return draft
    return { html: baseHtml }
  }, [activeCaseId, draft, baseHtml])

  const displayHtml = draft?.html ?? baseHtml

  const handleEditorChange = useCallback(
    (payload: { json: JSONContent; html: string }) => {
      if (!activeCaseId) return
      setDrafts((prev) => ({
        ...prev,
        [activeCaseId]: payload,
      }))
    },
    [activeCaseId],
  )

  const goToCase = useCallback(
    (nextIndex: number) => {
      if (project.cases.length === 0) return
      const normalized = ((nextIndex % project.cases.length) + project.cases.length) % project.cases.length
      setActiveCaseIndex(normalized)
    },
    [project.cases.length],
  )

  const goPrev = useCallback(() => {
    if (activeCaseIndex === null) return
    goToCase(activeCaseIndex - 1)
  }, [activeCaseIndex, goToCase])

  const goNext = useCallback(() => {
    if (activeCaseIndex === null) return
    goToCase(activeCaseIndex + 1)
  }, [activeCaseIndex, goToCase])

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {project.cases.map((c, idx) => (
          <CaseCard
            key={c.id}
            slug={project.slug}
            c={c}
            index={idx}
            onOpen={({ index }) => setActiveCaseIndex(index)}
          />
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            setActiveCaseIndex(null)
            setActiveMediaIndex(0)
            setEditing(false)
            setShowEditToggle(false)
            editorRef.current = null
          }
        }}
      >
        <DialogContent className="max-w-[min(1200px,95vw)] w-full border border-border/60 bg-background/95 p-0 text-foreground">
          {activeCase && activeCaseId && (
            <div className="flex h-[92vh]">
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 p-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{activeCaseTitle}</h2>
                    {editing && activeCaseHighlights.length > 0 && (
                      <ul className="list-inside list-disc text-sm text-muted-foreground">
                        {activeCaseHighlights.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {showEditToggle && (
                      <Button
                        variant={editing ? 'default' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          if (editing) {
                            editorRef.current = null
                          }
                          setEditing((prev) => !prev)
                          setShowEditToggle(true)
                        }}
                      >
                        {editing ? '退出编辑' : '进入编辑'}
                      </Button>
                    )}
                    {editing && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          const payload = {
                            project: project.slug,
                            caseId: activeCaseId,
                            title: activeCaseTitle,
                            highlights: activeCaseHighlights,
                            article: {
                              markdown: activeCaseArticle,
                              html: displayHtml,
                              json: draft?.json ?? editorRef.current?.getJSON() ?? null,
                            },
                            exportedAt: new Date().toISOString(),
                          }

                          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const anchor = document.createElement('a')
                          anchor.href = url
                          anchor.download = `case-${project.slug}-${activeCaseId}.json`
                          anchor.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        {'\u5BFC\u51FA JSON'}
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={goPrev}>
                      {'\u4E0A\u4E00\u6848\u4F8B'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={goNext}>
                      {'\u4E0B\u4E00\u6848\u4F8B'}
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden p-6 pt-4">
                  <div className="flex h-full flex-col gap-4">
                    {editing && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-black/40">
                        {activeMedia?.type === 'image' || activeMedia?.type === 'gif' ? (
                          <Image
                            src={activeMedia.src}
                            alt={activeMedia.caption || activeCaseTitle}
                            fill
                            sizes="(max-width: 1024px) 100vw, 65vw"
                            className="object-cover"
                          />
                        ) : activeMedia?.type === 'video' ? (
                          <video controls poster={activeMedia.poster} className="h-full w-full rounded-2xl object-cover">
                            <source src={activeMedia.src} />
                          </video>
                        ) : activeMedia?.type === 'embed' ? (
                          <iframe
                            src={activeMedia.src}
                            title={activeMedia.caption || activeCaseTitle}
                            className="h-full w-full rounded-2xl border-0"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            {'\u6682\u65E0\u5A92\u4F53\u5185\u5BB9'}
                          </div>
                        )}
                      </div>
                    )}

                    {editing ? (
                      <RichEditor
                        key={activeCaseId}
                        content={editorContent}
                        onChange={handleEditorChange}
                        className="flex-1"
                        onReady={(editorInstance) => {
                          editorRef.current = editorInstance
                          if (drafts[activeCaseId]) return
                          const json = editorInstance.getJSON()
                          const html = editorInstance.getHTML()
                          setDrafts((prev) => ({
                            ...prev,
                            [activeCaseId]: { json, html },
                          }))
                        }}
                      />
                    ) : (
                      <div className="flex-1 overflow-y-auto rounded-2xl border border-border/60 bg-card/70 p-5">
                        <div className="tiptap" dangerouslySetInnerHTML={{ __html: displayHtml }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <aside className="flex w-56 flex-col border-l border-border/60 bg-background/80">
                <div className="border-b border-border/60 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {'\u5A92\u4F53\u5BFC\u822A'}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-3">
                    {activeCaseMedia.map((media, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveMediaIndex(idx)}
                        className={cn(
                          'relative h-24 w-full overflow-hidden rounded-xl border border-border/60 transition hover:border-primary/60',
                          activeMediaIndex === idx && 'border-primary/80 ring-1 ring-primary/40',
                        )}
                      >
                        {media.type === 'video' ? (
                          <div className="flex h-full w-full items-center justify-center bg-black/80 text-xs text-foreground/80">
                            {'\u89C6\u9891'}
                          </div>
                        ) : media.type === 'embed' ? (
                          <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-secondary-foreground/80">
                            Embed
                          </div>
                        ) : (
                          <Image
                            src={media.src}
                            alt={media.caption || `${'\u5A92\u4F53'} ${idx + 1}`}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border/60 p-4 text-xs text-muted-foreground">
                  {activeMedia?.caption || '\u9009\u62E9\u53F3\u4FA7\u7F29\u7565\u56FE\u4EE5\u67E5\u770B / \u7F16\u8F91\u5BF9\u5E94\u7D20\u6750'}
                </div>
              </aside>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
