"use client"

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { safeLocalStorageGet, safeLocalStorageSet } from '@/lib/utils'
import type { Media } from '@/components/gallery'

type LocalItem = Media & { id: string; alt?: string }

function readFileAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

export function UploadPanel({ storageKey }: { storageKey: string }) {
  const [items, setItems] = useState<LocalItem[]>([])
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const stored = safeLocalStorageGet<LocalItem[]>(storageKey, [])
    setItems(stored)
  }, [storageKey])

  useEffect(() => {
    safeLocalStorageSet(storageKey, items)
  }, [storageKey, items])

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    const converted = await Promise.all(
      arr.map(async (f) => {
        const ext = f.name.split('.').pop()?.toLowerCase()
        let type: Media['type'] = 'image'
        if (ext && ['mp4', 'webm'].includes(ext)) type = 'video'
        if (ext && ['gif'].includes(ext)) type = 'gif'
        const data = await readFileAsDataURL(f)
        return {
          id: crypto.randomUUID(),
          type,
          src: data,
          caption: '',
          local: true,
        } as LocalItem
      })
    )
    setItems((x) => [...converted, ...x])
  }

  const remove = (id: string) => setItems((x) => x.filter((i) => i.id !== id))

  const exported: Media[] = useMemo(() => items.map(({ id, alt, ...m }) => m), [items])

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">编辑模式</h3>
          <p className="text-xs text-muted-foreground">仅本地预览与保存，不会上传到服务器。</p>
        </div>
        <Button variant={editing ? 'default' : 'secondary'} onClick={() => setEditing((e) => !e)}>
          {editing ? '退出编辑' : '进入编辑'}
        </Button>
      </div>

      {editing && (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="files">上传媒体（图片/GIF/视频）</Label>
            <Input id="files" type="file" multiple onChange={(e) => onFiles(e.target.files)} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((it) => (
              <div key={it.id} className="rounded-xl border border-border p-3">
                <div className="mb-2 overflow-hidden rounded-lg border border-border">
                  {it.type === 'video' ? (
                    <video src={it.src} controls className="w-full" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.src} alt={it.caption} className="w-full" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>说明</Label>
                  <Textarea
                    placeholder="为媒体添加说明"
                    value={it.caption || ''}
                    onChange={(e) =>
                      setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, caption: e.target.value } : x)))
                    }
                  />
                  <div className="flex justify-end">
                    <Button variant="destructive" onClick={() => remove(it.id)}>
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function useUploadedMedia(storageKey: string) {
  return safeLocalStorageGet<Media[]>(storageKey, [])
}

