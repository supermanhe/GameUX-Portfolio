"use client"

import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers3, Presentation, X } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '@/data/projects'
import { LoadableImage } from '@/components/ui/loadable-image'

type FeaturedConfig = {
  cover: string
  eyebrow: string
  description: string
  detailDescription?: string
  mode: 'gallery' | 'slides'
}

const FEATURED_CASES: Record<string, FeaturedConfig> = {
  manage: {
    cover: '/covers/team-collaboration-cover.jpg',
    eyebrow: 'TEAMWORK · OPERATIONS',
    description: '将规范、模板与经验分享沉淀为团队可复用的协作资产，持续提升设计交付效率。',
    mode: 'gallery',
  },
  'ui-guidelines': {
    cover: '/covers/dahua-ui-guidelines-cover.png',
    eyebrow: 'DESIGN SYSTEM · UI GUIDELINES',
    description: '系统梳理界面视觉语言与组件规则，沉淀为团队可复用、可持续维护的 UI 规范。',
    mode: 'gallery',
  },
  'desktop-to-mobile': {
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1781254001/ChatGPT_Image_2026%E5%B9%B46%E6%9C%8812%E6%97%A5_15_46_03_ipo0cu.webp',
    eyebrow: 'DESKTOP TO MOBILE · KNOWLEDGE',
    description: '将端游页面转译为口袋版 UI，并沉淀新系统的移动端适配方法与规范。',
    detailDescription:
      '经典端游紧跟手游时代推出口袋版。加入项目后，我的重要任务之一，是将既有端游页面重构为手游 UI；此后新系统也默认需要支持口袋版，因此我将实践经验总结为设计方法与规范，用于团队知识积累与分享。',
    mode: 'gallery',
  },
  Consistency: {
    cover: '/covers/figma-rule-cover.jpg',
    eyebrow: 'DESIGN SYSTEM · FIGMA',
    description: '将分散的界面资产整理为可复用、可协作、可持续维护的游戏 UI 规范。',
    mode: 'gallery',
  },
  UEprocess: {
    cover: '/covers/ux-flow-cover.jpg',
    eyebrow: 'WORKFLOW · 0→1',
    description: '从岗位价值到协作落地，完整复盘游戏交互流程如何进入研发管线。',
    mode: 'slides',
  },
}

type FeaturedCase = Project['cases'][number] & {
  config: FeaturedConfig
  projectIndex: number
}

function optimizeCloudinaryImage(src: string, width: number, quality = 'auto:good') {
  if (!src.includes('res.cloudinary.com') || !src.includes('/image/upload/')) return src
  return src.replace('/image/upload/', `/image/upload/f_auto,q_${quality},w_${width},c_limit/`)
}

function FullscreenViewer({ item, onClose }: { item: FeaturedCase; onClose: () => void }) {
  const images = item.media.filter((media) => media.type === 'image' || media.type === 'gif')
  const [active, setActive] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [trackPreview, setTrackPreview] = useState<{ index: number; x: number } | null>(null)
  const dragStartX = useRef<number | null>(null)
  const lastWheelAt = useRef(0)
  const isSlides = item.config.mode === 'slides'
  const goToPrevious = () => setActive((current) => Math.max(current - 1, 0))
  const goToNext = () => setActive((current) => Math.min(current + 1, images.length - 1))

  const handleSlidePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    dragStartX.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleSlidePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    const distance = event.clientX - dragStartX.current
    dragStartX.current = null
    setIsDragging(false)
    if (Math.abs(distance) < 48) return
    if (distance < 0) goToNext()
    else goToPrevious()
  }

  const handleSlidePointerCancel = () => {
    dragStartX.current = null
    setIsDragging(false)
  }

  const handleSlideWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX
    if (Math.abs(delta) < 12) return
    event.preventDefault()

    const now = Date.now()
    if (now - lastWheelAt.current < 420) return
    lastWheelAt.current = now
    if (delta > 0) goToNext()
    else goToPrevious()
  }

  const updateTrackPreview = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    setTrackPreview({ index: Math.round(ratio * (images.length - 1)), x: ratio * rect.width })
  }

  useEffect(() => {
    if (!isSlides) return
    ;[images[active - 1], images[active + 1]].filter(Boolean).forEach((media) => {
      const preload = new window.Image()
      preload.src = optimizeCloudinaryImage(media.src, 1600)
    })
  }, [active, images, isSlides])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (!isSlides) return
      if (event.key === 'ArrowRight') setActive((current) => Math.min(current + 1, images.length - 1))
      if (event.key === 'ArrowLeft') setActive((current) => Math.max(current - 1, 0))
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [images.length, isSlides, onClose])

  return (
    <div className="featured-viewer" role="dialog" aria-modal="true" aria-label={item.title}>
      <header className="featured-viewer-header">
        <div className="min-w-0">
          <p className="featured-viewer-eyebrow font-pixel">{item.config.eyebrow}</p>
          <h2 className="featured-viewer-title">{item.title}</h2>
        </div>
        <div className="featured-viewer-meta">
          <span className="font-pixel">
            {isSlides ? `${String(active + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}` : `${images.length} BOARDS`}
          </span>
          <button type="button" className="featured-viewer-close focus-ring" onClick={onClose} aria-label="关闭全屏查看">
            <X aria-hidden="true" />
          </button>
        </div>
      </header>

      {isSlides ? (
        <div className="featured-slides" onWheel={handleSlideWheel}>
          <div
            className={`featured-slide-stage${isDragging ? ' is-dragging' : ''}`}
            onPointerDown={handleSlidePointerDown}
            onPointerUp={handleSlidePointerUp}
            onPointerCancel={handleSlidePointerCancel}
          >
            <LoadableImage
              key={images[active].src}
              src={optimizeCloudinaryImage(images[active].src, 1600)}
              alt={images[active].caption || `${item.title} 第 ${active + 1} 页`}
              containerClassName="featured-slide-image-frame"
              className="featured-slide-image"
              draggable={false}
            />
          </div>

          <footer className="featured-slide-controls">
            <button
              type="button"
              className="featured-slide-arrow focus-ring"
              onClick={goToPrevious}
              disabled={active === 0}
              aria-label="上一页"
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <div
              className="featured-slide-track-wrap"
              onMouseMove={updateTrackPreview}
              onMouseLeave={() => setTrackPreview(null)}
            >
              {trackPreview ? (
                <div className="featured-slide-preview" style={{ left: trackPreview.x }} aria-hidden="true">
                  <LoadableImage
                    src={optimizeCloudinaryImage(images[trackPreview.index].src, 360, 'auto:eco')}
                    alt=""
                    className="featured-slide-preview-image"
                  />
                  <span className="font-pixel">
                    {String(trackPreview.index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </span>
                </div>
              ) : null}
              <input
                type="range"
                className="featured-slide-track focus-ring"
                min={0}
                max={images.length - 1}
                value={active}
                onChange={(event) => setActive(Number(event.currentTarget.value))}
                aria-label="跳转到幻灯片页面"
                style={{ '--slide-progress': `${images.length > 1 ? (active / (images.length - 1)) * 100 : 100}%` } as CSSProperties}
              />
            </div>
            <button
              type="button"
              className="featured-slide-arrow focus-ring"
              onClick={goToNext}
              disabled={active === images.length - 1}
              aria-label="下一页"
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </footer>
        </div>
      ) : (
        <div className="featured-gallery">
          <div className="featured-gallery-intro">
            <span className="font-pixel">SYSTEM ARCHIVE</span>
            <p>{item.config.detailDescription ?? item.config.description}</p>
          </div>
          {images.map((media, index) => (
            <figure key={media.src} className="featured-gallery-board">
              <figcaption>
                <span className="font-pixel">{String(index + 1).padStart(2, '0')}</span>
                <span>{media.caption || `规范画板 ${String(index + 1).padStart(2, '0')}`}</span>
              </figcaption>
              <LoadableImage
                src={media.src}
                alt={media.caption || `${item.title} 第 ${index + 1} 张`}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="featured-gallery-image"
              />
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectFeaturedCases({ project }: { project: Project }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const items = project.cases.flatMap((item, projectIndex) => {
    const config = FEATURED_CASES[item.id]
    return config ? [{ ...item, config, projectIndex }] : []
  })
  const openItem = items.find((item) => item.id === openId)
  if (items.length === 0) return null

  return (
    <>
      <section className="featured-cases" aria-labelledby="featured-cases-title">
        <div className="featured-cases-heading">
          <div>
            <p className="font-pixel">FOUNDATION WORK</p>
            <h2 id="featured-cases-title">规范与流程沉淀</h2>
          </div>
          {items.length > 2 ? (
            <div className="featured-cases-scroll-controls" aria-label="浏览规范与流程沉淀">
              <button
                type="button"
                className="featured-cases-scroll-button focus-ring"
                onClick={() => trackRef.current?.scrollBy({ left: -trackRef.current.clientWidth * 0.72, behavior: 'smooth' })}
                aria-label="向左浏览"
              >
                <ArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="featured-cases-scroll-button focus-ring"
                onClick={() => trackRef.current?.scrollBy({ left: trackRef.current.clientWidth * 0.72, behavior: 'smooth' })}
                aria-label="向右浏览"
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div ref={trackRef} className="featured-cases-grid">
          {items.map((item) => {
            const Icon = item.config.mode === 'slides' ? Presentation : Layers3
            return (
              <article key={item.id} id={item.id} className="featured-case-card scroll-mt-24">
                <button type="button" className="featured-case-trigger focus-ring" onClick={() => setOpenId(item.id)}>
                  <Image
                    src={item.config.cover}
                    alt=""
                    fill
                    className="featured-case-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <span className="featured-case-scrim" aria-hidden="true" />
                  <span className="featured-case-topline">
                    <span className="featured-case-no font-pixel">{String(item.projectIndex + 1).padStart(2, '0')}</span>
                    <span className="featured-case-mode font-pixel">
                      <Icon aria-hidden="true" />
                      {item.config.mode === 'slides' ? `${item.media.length} SLIDES` : `${item.media.length} BOARDS`}
                    </span>
                  </span>
                  <span className="featured-case-copy">
                    <span className="featured-case-eyebrow font-pixel">{item.config.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <span className="featured-case-description">{item.config.description}</span>
                    <span className="featured-case-cta">
                      {item.config.mode === 'slides' ? '开始演示' : '查看规范档案'}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </span>
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {openItem ? createPortal(<FullscreenViewer item={openItem} onClose={() => setOpenId(null)} />, document.body) : null}
    </>
  )
}
