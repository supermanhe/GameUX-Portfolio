"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type HomeLoopVideoProps = {
  src: string
  transitionSrc: string
}

// 客户端用 useLayoutEffect（绘制前生效，无闪烁）；SSR 退回 useEffect 避免告警
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const ZOOM_TARGET_SECONDS = 1
const FLASH_MS = 460
const FLASH_PEAK_MS = 90

type Phase = 'loop' | 'zooming'

/**
 * 开场遮罩，支持来回切换：
 *  - 首页 idle：循环播放 home-loop，锁定滚动；
 *  - 下滑/点击/↓ -> 播放 zoom-transition；
 *  - zoom 播完 -> 一道高亮闪白（flash cut）盖住瞬切到第二页（避免尺寸不一致的硬切叠化）；
 *  - 第二页滚到顶部后继续上滑 -> 同样闪白盖住，重新回到首页开场。
 */
export function HomeLoopVideo({ src, transitionSrc }: HomeLoopVideoProps) {
  const loopVideoRef = useRef<HTMLVideoElement | null>(null)
  const zoomVideoRef = useRef<HTMLVideoElement | null>(null)
  const phaseRef = useRef<Phase>('loop')
  const switchingRef = useRef(false)

  const [introVisible, setIntroVisible] = useState(true)
  const [phase, setPhase] = useState<Phase>('loop')
  const [flashKey, setFlashKey] = useState(0)

  const setPhaseBoth = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }, [])

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }, [])

  // 触发一次闪白（key 自增 -> 元素重挂载 -> 动画从头播放）
  const triggerFlash = useCallback(() => setFlashKey((k) => k + 1), [])

  // 把缩放视频压到约 ZOOM_TARGET_SECONDS 秒：按时长设倍速。
  // 关键：元数据就绪（onLoadedMetadata）即预设倍速——否则“首次点击时 zoom.duration 还是
  // NaN -> 倍速维持 1 倍 -> 整段原速慢放、等很久”，要等第二次（元数据已缓存）才正常。
  const applyZoomRate = useCallback(() => {
    const zoom = zoomVideoRef.current
    if (!zoom || !Number.isFinite(zoom.duration) || zoom.duration <= 0) return
    zoom.playbackRate = Math.min(zoom.duration / ZOOM_TARGET_SECONDS, 16)
  }, [])

  // 深链接 / 从项目详情返回 / 减少动效 -> 绘制前隐藏开场（不闪一帧循环视频）。
  // 只读取标记不清除，交给 RestoreProjectScroll 去消费定位。
  useIsoLayoutEffect(() => {
    let returningToProject = false
    try {
      returningToProject = !!sessionStorage.getItem('returnToProject')
    } catch {
      returningToProject = false
    }
    if (
      window.location.hash ||
      returningToProject ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIntroVisible(false)
    }
  }, [])

  // 锁/解锁滚动跟随 introVisible
  useEffect(() => {
    if (introVisible) lockScroll()
    else unlockScroll()
    return () => unlockScroll()
  }, [introVisible, lockScroll, unlockScroll])

  // 广播开场可见状态，供背景音乐控制器判断“第一页”
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bgm:intro', { detail: introVisible }))
  }, [introVisible])

  // 进开场时把循环视频从头播放、隐藏 zoom
  useEffect(() => {
    if (!introVisible) return
    setPhaseBoth('loop')
    window.scrollTo(0, 0)
    const loop = loopVideoRef.current
    if (loop) {
      loop.muted = true
      loop.currentTime = 0
      loop.play().catch(() => undefined)
    }
    const zoom = zoomVideoRef.current
    if (zoom) {
      zoom.pause()
      zoom.currentTime = 0
    }
  }, [introVisible, setPhaseBoth])

  // 首页 -> 第二页：播放缩放视频
  const startZoom = useCallback(() => {
    if (phaseRef.current !== 'loop' || switchingRef.current) return
    const zoom = zoomVideoRef.current
    setPhaseBoth('zooming')
    if (!zoom) {
      // 没有 zoom 资源就直接闪白切换
      triggerFlash()
      window.setTimeout(() => setIntroVisible(false), FLASH_PEAK_MS)
      return
    }
    zoom.muted = true
    zoom.currentTime = 0
    applyZoomRate()
    zoom.play().catch(() => {
      triggerFlash()
      window.setTimeout(() => setIntroVisible(false), FLASH_PEAK_MS)
    })
  }, [applyZoomRate, setPhaseBoth, triggerFlash])

  // zoom 播完 -> 闪白盖住瞬切到第二页
  const handleZoomEnded = useCallback(() => {
    if (switchingRef.current) return
    switchingRef.current = true
    triggerFlash()
    window.setTimeout(() => {
      setIntroVisible(false)
      switchingRef.current = false
    }, FLASH_PEAK_MS)
  }, [triggerFlash])

  // 第二页顶部上滑 -> 闪白盖住回到首页开场
  const reopenIntro = useCallback(() => {
    if (switchingRef.current) return
    switchingRef.current = true
    triggerFlash()
    window.setTimeout(() => {
      setIntroVisible(true)
      switchingRef.current = false
    }, FLASH_PEAK_MS)
  }, [triggerFlash])

  // 开场阶段：下滑 / 点击 / ↓ -> 开始缩放
  useEffect(() => {
    if (!introVisible) return
    const onWheel = (event: WheelEvent) => {
      if (phaseRef.current === 'loop' && event.deltaY > 0) startZoom()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (phaseRef.current === 'loop' && ['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) startZoom()
    }
    let touchStartY: number | null = null
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || phaseRef.current !== 'loop') return
      if (touchStartY - (event.touches[0]?.clientY ?? touchStartY) > 24) startZoom()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [introVisible, startZoom])

  // 第二页阶段：滚到顶部后继续上滑 -> 回首页
  useEffect(() => {
    if (introVisible) return
    const atTop = () => window.scrollY <= 2
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < 0 && atTop()) reopenIntro()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) && atTop()) reopenIntro()
    }
    let touchStartY: number | null = null
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || !atTop()) return
      if ((event.touches[0]?.clientY ?? touchStartY) - touchStartY > 28) reopenIntro()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [introVisible, reopenIntro])

  return (
    <>
      {introVisible ? (
        <div
          data-home-intro
          className="fixed inset-0 z-20 cursor-pointer overflow-hidden bg-black"
          aria-label="Homepage intro video"
          onClick={startZoom}
        >
          <video
            ref={loopVideoRef}
            className="h-full w-full object-cover"
            src={src}
            poster="/home-loop-poster.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <video
            ref={zoomVideoRef}
            className={[
              'absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-200',
              phase === 'loop' ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
            src={transitionSrc}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onLoadedMetadata={applyZoomRate}
            onEnded={handleZoomEnded}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center">
            <span className="scroll-hint" data-hidden={phase !== 'loop'} aria-hidden="true">
              <span className="scroll-hint-mouse">
                <span className="scroll-hint-wheel" />
              </span>
              <span className="scroll-hint-label">滑动翻页</span>
            </span>
          </div>
        </div>
      ) : null}

      <div
        key={flashKey}
        className={flashKey > 0 ? 'flash-cut flash-cut--play' : 'flash-cut'}
        style={{ ['--flash-ms' as string]: `${FLASH_MS}ms` }}
        aria-hidden="true"
      />
    </>
  )
}
