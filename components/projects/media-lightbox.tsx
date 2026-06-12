"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type LightboxItem = {
  el: Element
  type: 'image' | 'video'
  src: string
  caption?: string
}

type LightboxState = {
  items: LightboxItem[]
  index: number
}

// 可全屏查看的案例媒体（按 DOM 顺序收集；刻意排除 hero / 封面等装饰图）
const ITEM_SELECTOR = [
  '.work-article img',
  '.work-article video',
  '.cs-media',
  '.cs-compare-img.is-active',
  '.cs-tour-img.is-active',
  '.cs-deepentry-frame > img',
  '.cs-spotlight-media',
  '.pcs-scheme-img',
  '.diy-mode-img.is-active',
  '.diy-eco-img',
].join(', ')

// 需要注入「全屏」悬浮按钮的视频（原生控制条会吃掉点击，整体点击不可行）
const VIDEO_SELECTOR = '.work-article video, video.cs-media, video.cs-spotlight-media'

const MAXIMIZE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'

function captionFor(el: Element) {
  const cap = el.closest('figure')?.querySelector('figcaption')?.textContent?.trim()
  if (cap) return cap
  if (el instanceof HTMLImageElement && el.alt.trim()) return el.alt.trim()
  return undefined
}

function toItem(el: Element): LightboxItem {
  const media = el as HTMLImageElement | HTMLVideoElement
  return {
    el,
    type: el.tagName === 'VIDEO' ? 'video' : 'image',
    src: media.currentSrc || media.src,
    caption: captionFor(el),
  }
}

export function MediaLightbox({ scope = '.key-design' }: { scope?: string }) {
  const [state, setState] = useState<LightboxState | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  const lastWheelAt = useRef(0)
  const stageRef = useRef<HTMLElement>(null)
  // 放大态下按住拖动平移：记录起点 + 起始滚动位移；moved 用于抑制拖动结束时误触的缩放切换
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  const openAt = useCallback(
    (el: Element) => {
      const root = document.querySelector(scope)
      if (!root) return
      const items = Array.from(root.querySelectorAll(ITEM_SELECTOR)).map(toItem)
      const index = items.findIndex((item) => item.el === el)
      if (index === -1) return
      setZoomed(false)
      setState({ items, index })
    },
    [scope],
  )

  const close = useCallback(() => setState(null), [])

  const step = useCallback((delta: number) => {
    setZoomed(false)
    setState((s) => {
      if (!s) return s
      const index = Math.min(Math.max(s.index + delta, 0), s.items.length - 1)
      return index === s.index ? s : { ...s, index }
    })
  }, [])

  // 图片直接点击打开（视频走注入按钮）
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const root = document.querySelector(scope)
      if (!root || !root.contains(target)) return
      let el: Element | null = target.closest('img')
      if (!el) return
      // 叠放轮播图（迭代对比/功能巡览）：点到非当前帧时换成当前帧
      if (el.matches('.cs-compare-img:not(.is-active), .cs-tour-img:not(.is-active)')) {
        el = el.parentElement?.querySelector('img.is-active') ?? el
      }
      if (!el.matches(ITEM_SELECTOR)) return
      event.preventDefault()
      openAt(el)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scope, openAt])

  // 为视频注入「全屏」悬浮按钮；markdown 文章的视频在水合后才出现，用 MutationObserver 兜底
  useEffect(() => {
    const root = document.querySelector(scope)
    if (!root) return undefined

    const inject = () => {
      root.querySelectorAll('video').forEach((video) => {
        if (!video.matches(VIDEO_SELECTOR)) return
        const host =
          video.closest<HTMLElement>('.tiptap-video-wrapper, .cs-figure-frame, .cs-spotlight-frame') ??
          video.parentElement
        if (!host || host.querySelector(':scope > .media-expand-btn')) return
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'media-expand-btn'
        btn.setAttribute('aria-label', '全屏查看')
        btn.innerHTML = MAXIMIZE_ICON
        btn.addEventListener('click', (event) => {
          event.preventDefault()
          event.stopPropagation()
          video.pause()
          openAt(video)
        })
        host.classList.add('media-expand-host')
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
        host.appendChild(btn)
      })
    }

    inject()
    const observer = new MutationObserver(inject)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [scope, openAt])

  // 打开期间：锁滚动 + 键盘导航
  useEffect(() => {
    if (!state) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        step(-1)
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault()
        step(1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [state !== null, close, step]) // eslint-disable-line react-hooks/exhaustive-deps

  // 预加载相邻图片，上下切换不闪白
  useEffect(() => {
    if (!state) return
    ;[state.items[state.index - 1], state.items[state.index + 1]]
      .filter((item): item is LightboxItem => Boolean(item && item.type === 'image'))
      .forEach((item) => {
        const preload = new window.Image()
        preload.src = item.src
      })
  }, [state])

  if (!state) return null

  const current = state.items[state.index]
  const counter = `${String(state.index + 1).padStart(2, '0')} / ${String(state.items.length).padStart(2, '0')}`

  const onWheel = (event: React.WheelEvent) => {
    if (zoomed) return
    if (Math.abs(event.deltaY) < 16) return
    const now = Date.now()
    if (now - lastWheelAt.current < 400) return
    lastWheelAt.current = now
    step(event.deltaY > 0 ? 1 : -1)
  }

  // 放大态：按住拖动以平移大图（直接改 stage 的 scrollLeft/scrollTop）
  const onPointerDown = (event: React.PointerEvent) => {
    if (!zoomed || event.button !== 0) return
    const stage = stageRef.current
    if (!stage) return
    drag.current = { x: event.clientX, y: event.clientY, sl: stage.scrollLeft, st: stage.scrollTop, moved: false }
    stage.setPointerCapture(event.pointerId)
    setGrabbing(true)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const d = drag.current
    const stage = stageRef.current
    if (!d || !stage) return
    const dx = event.clientX - d.x
    const dy = event.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true
    stage.scrollLeft = d.sl - dx
    stage.scrollTop = d.st - dy
  }

  const onPointerUp = (event: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    // 真正拖动过 → 抑制随后图片 onClick 的缩放切换，避免拖完就退出放大
    if (d.moved) suppressClick.current = true
    drag.current = null
    stageRef.current?.releasePointerCapture(event.pointerId)
    setGrabbing(false)
  }

  // 点击舞台：放大 ↔ 默认尺寸来回切换（视频不缩放）；真正拖动结束的那次点击不触发
  const onStageClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (current?.type === 'video') return
    setZoomed((z) => !z)
  }

  return createPortal(
    <div
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="案例媒体全屏查看"
      onWheel={onWheel}
    >
      <header className="media-lightbox-head">
        <span className="font-pixel">{counter}</span>
        <button type="button" className="media-lightbox-btn focus-ring" onClick={close} aria-label="关闭全屏查看">
          <X aria-hidden="true" />
        </button>
      </header>

      <figure
        ref={stageRef}
        className={cn('media-lightbox-stage', zoomed && 'is-zoomed', grabbing && 'is-grabbing')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onStageClick}
      >
        {current.type === 'video' ? (
          <video
            key={current.src}
            className="media-lightbox-media"
            src={current.src}
            controls
            autoPlay
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.src}
            className="media-lightbox-media"
            src={current.src}
            alt={current.caption ?? ''}
            draggable={false}
          />
        )}
        {current.caption && <figcaption className="media-lightbox-cap">{current.caption}</figcaption>}
      </figure>

      <div className="media-lightbox-nav">
        <button
          type="button"
          className="media-lightbox-btn focus-ring"
          onClick={() => step(-1)}
          disabled={state.index === 0}
          aria-label="上一个"
        >
          <ChevronUp aria-hidden="true" />
        </button>
        <button
          type="button"
          className="media-lightbox-btn focus-ring"
          onClick={() => step(1)}
          disabled={state.index === state.items.length - 1}
          aria-label="下一个"
        >
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
