"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'

/**
 * 背景音乐控制器（单轨 bgm2）
 * - 第二页（HistoryScroll）：播放清晰的 bgm2
 * - 第一页（开场遮罩）/ 其他区块 / 其他路由：播放“弱化模糊版”的 bgm2（低通滤波 + 降增益）
 * - 导航栏右上角可开关（默认开启，记忆到 localStorage）
 *
 * Web Audio 图：bgm2 -> lowpass -> gain -> destination
 * 通过对 gain / filter.frequency 做线性 ramp 实现淡入淡出与“模糊”切换。
 */

type Zone = 'page1' | 'page2' | 'other'

type BgmContextValue = {
  enabled: boolean
  toggle: () => void
}

const BgmContext = createContext<BgmContextValue | null>(null)

export function useBgm() {
  const ctx = useContext(BgmContext)
  if (!ctx) throw new Error('useBgm 必须在 <BgmProvider> 内使用')
  return ctx
}

const STORAGE_KEY = 'bgm-enabled'
const FADE = 0.6 // 交叉淡变时长（秒）
const OPEN_FREQ = 20000 // 清晰
const BLUR_FREQ = 480 // 模糊（低通截止）

// 各分区下 bgm2 的目标增益与低通截止频率
// 第二页清晰；第一页与“其他”均为弱化模糊版
const ZONE: Record<Zone, { gain: number; freq: number }> = {
  page1: { gain: 0.16, freq: BLUR_FREQ },
  page2: { gain: 0.45, freq: OPEN_FREQ },
  other: { gain: 0.16, freq: BLUR_FREQ },
}

export function BgmProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const filtRef = useRef<BiquadFilterNode | null>(null)
  const startedRef = useRef(false)
  const zoneRef = useRef<Zone>('page1')
  const enabledRef = useRef(true)

  // 读取记忆的开关状态
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '0') {
        setEnabled(false)
        enabledRef.current = false
      }
    } catch {
      /* ignore */
    }
  }, [])

  // 构建 Web Audio 图（仅一次）
  const ensureGraph = useCallback(() => {
    if (ctxRef.current) return
    try {
      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC || !audioRef.current) return
      const ctx = new AC()
      const source = ctx.createMediaElementSource(audioRef.current)
      const gain = ctx.createGain()
      const filt = ctx.createBiquadFilter()
      filt.type = 'lowpass'
      filt.frequency.value = BLUR_FREQ
      gain.gain.value = 0
      source.connect(filt).connect(gain).connect(ctx.destination)
      ctxRef.current = ctx
      gainRef.current = gain
      filtRef.current = filt
    } catch {
      /* Web Audio 不可用则静默降级 */
    }
  }, [])

  // 把当前 zone + enabled 应用到音频图（带 ramp）
  const apply = useCallback(() => {
    const ctx = ctxRef.current
    const gain = gainRef.current
    const filt = filtRef.current
    const audio = audioRef.current
    if (!ctx || !gain || !filt || !audio) return

    const base = ZONE[zoneRef.current]
    const targetGain = enabledRef.current ? base.gain : 0
    const now = ctx.currentTime

    const ramp = (p: AudioParam, v: number) => {
      p.cancelScheduledValues(now)
      p.setValueAtTime(p.value, now)
      p.linearRampToValueAtTime(v, now + FADE)
    }
    ramp(gain.gain, targetGain)
    ramp(filt.frequency, base.freq)

    if (enabledRef.current && targetGain > 0 && audio.paused) {
      audio.play().catch(() => undefined)
    }
  }, [])

  // 首次用户手势后解锁并启动（自动播放策略）
  useEffect(() => {
    const events = ['pointerdown', 'keydown', 'touchstart', 'click'] as const
    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      ensureGraph()
      ctxRef.current?.resume().catch(() => undefined)
      audioRef.current?.play().catch(() => undefined)
      apply()
      events.forEach((e) => window.removeEventListener(e, start, true))
    }
    events.forEach((e) => window.addEventListener(e, start, { capture: true }))
    return () => events.forEach((e) => window.removeEventListener(e, start, true))
  }, [ensureGraph, apply])

  // 开关变化：记忆 + 应用 + 关闭时淡出后暂停
  useEffect(() => {
    enabledRef.current = enabled
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
    } catch {
      /* ignore */
    }
    apply()
    if (!enabled) {
      const t = setTimeout(() => audioRef.current?.pause(), FADE * 1000 + 80)
      return () => clearTimeout(t)
    }
  }, [enabled, apply])

  // 分区检测
  useEffect(() => {
    // 非首页统一视为“其他”
    if (pathname !== '/') {
      zoneRef.current = 'other'
      apply()
      return
    }

    let introVisible = !!document.querySelector('[data-home-intro]')
    const compute = (): Zone => {
      if (introVisible) return 'page1'
      const line = window.innerHeight * 0.3
      // “我的工具”页同样用清晰版音效（位于最深处，优先判定）
      const skills = document.getElementById('skills')
      if (skills && skills.getBoundingClientRect().top <= line) return 'page2'
      const projects = document.getElementById('projects')
      if (projects && projects.getBoundingClientRect().top <= line) return 'other'
      return 'page2'
    }

    let raf = 0
    const update = () => {
      raf = 0
      const z = compute()
      if (z !== zoneRef.current) {
        zoneRef.current = z
        apply()
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onIntro = (e: Event) => {
      introVisible = !!(e as CustomEvent<boolean>).detail
      update()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('bgm:intro', onIntro as EventListener)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('bgm:intro', onIntro as EventListener)
    }
  }, [pathname, apply])

  const toggle = useCallback(() => {
    // 首次点击开关本身也算手势，顺带解锁
    if (!startedRef.current) {
      startedRef.current = true
      ensureGraph()
      ctxRef.current?.resume().catch(() => undefined)
      audioRef.current?.play().catch(() => undefined)
    }
    setEnabled((v) => !v)
  }, [ensureGraph])

  return (
    <BgmContext.Provider value={{ enabled, toggle }}>
      {children}
      {/* 同源音频，无需 crossOrigin；输出全部经由 Web Audio 图 */}
      <audio ref={audioRef} src="/bgm/bgm2.mp3" loop preload="auto" aria-hidden="true" />
    </BgmContext.Provider>
  )
}
