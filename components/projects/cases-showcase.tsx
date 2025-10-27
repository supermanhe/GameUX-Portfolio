"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Editor } from '@tiptap/core'
import type { JSONContent } from '@tiptap/react'
import { marked } from 'marked'
import type { Project } from '@/data/projects'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CaseCard } from '@/components/projects/case-card'
import { RichEditor } from '@/components/editor/rich-editor'
import { cn } from '@/lib/utils'
import { transformMediaLinks } from '@/lib/media'
import { X } from 'lucide-react'

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

  const getCaseCover = useCallback((c: Project['cases'][number]) => {
    const cover = c.media.find((m) => m.type === 'image' || m.type === 'gif')
    if (cover) {
      return cover
    }

    const videoWithPoster = c.media.find((m) => m.type === 'video' && m.poster)
    if (videoWithPoster) {
      return { ...videoWithPoster, src: videoWithPoster.poster!, type: 'image' as const }
    }

    return null
  }, [])
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
        <DialogContent className="w-full max-w-[min(1200px,95vw)] border border-border/60 bg-background/95 p-0 text-foreground">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:hidden">
            <DialogClose asChild>
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm" type="button">
                <X className="h-5 w-5" />
                <span className="sr-only">{'\u5173\u95ED\u6848\u8BE6\u60C5'}</span>
              </Button>
            </DialogClose>
          </div>
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
                  <div className="flex flex-wrap justify-end gap-2 pr-14 md:pr-0">
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
                        {editing ? 'Exit Edit' : 'Enter Edit'}
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
                        {activeMedia?.type === 'image' ? (
                          <Image
                            src={activeMedia.src}
                            alt={activeMedia.caption || activeCaseTitle}
                            fill
                            sizes="(max-width: 1024px) 100vw, 65vw"
                            className="object-cover"
                          />
                        ) : activeMedia?.type === 'gif' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={activeMedia.src}
                            alt={activeMedia.caption || activeCaseTitle}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
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
              <aside className="hidden flex-col border-l border-border/60 bg-background/80 md:flex md:w-56">
                <div className="border-b border-border/60 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {'\u6848\u4F8B\u5BFC\u822A'}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-3">
                    {project.cases.map((c, idx) => {
                      const cover = getCaseCover(c)
                      const isActive = activeCaseIndex === idx

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setActiveCaseIndex(idx)
                            setActiveMediaIndex(0)
                          }}
                          className={cn(
                            'group relative block h-24 w-full overflow-hidden rounded-xl border border-border/60 text-left transition focus-ring',
                            isActive ? 'border-primary/80 ring-1 ring-primary/40' : 'hover:border-primary/60',
                          )}
                        >
                          <div className="absolute inset-0">
                            {cover ? (
                              cover.type === 'gif' ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={cover.src}
                                  alt={cover.caption || c.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <Image
                                  src={cover.src}
                                  alt={cover.caption || c.title}
                                  fill
                                  sizes="(max-width: 768px) 160px, 200px"
                                  className="object-cover"
                                />
                              )
                            ) : (
                              <div className="h-full w-full bg-muted" />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/60 transition group-hover:bg-black/50" />
                          <div className="relative flex h-full items-center justify-center px-3 text-center text-sm font-medium text-white">
                            {c.title}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="border-t border-border/60 p-4 text-xs text-muted-foreground">
                  {activeCaseTitle ? `${'\u5F53\u524D\u6848\u4F8B'}：${activeCaseTitle}` : '\u9009\u62E9\u5DE6\u4FA7\u6848\u4F8B\u4EE5\u67E5\u770B / \u7F16\u8F91'}
                </div>
              </aside>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


