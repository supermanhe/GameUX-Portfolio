"use client"

import { useEffect, useLayoutEffect } from 'react'

const KEY = 'returnToProject'
const HASH_PREFIX = '#project-'

// 客户端用 useLayoutEffect（绘制前定位，无跳动）；SSR 退回 useEffect 避免告警
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * 从项目详情页返回首页（点击「返回」或浏览器后退）时，
 * 直接把页面定位到该项目面板——无开场视频、无平滑滚动过程。
 * 目标 slug 取自 sessionStorage 标记或 location.hash（#project-xxx）。
 */
export function RestoreProjectScroll() {
  useIsoLayoutEffect(() => {
    let slug: string | null = null
    try {
      slug = sessionStorage.getItem(KEY)
    } catch {
      slug = null
    }
    if (!slug) {
      const hash = window.location.hash
      if (hash.startsWith(HASH_PREFIX)) slug = decodeURIComponent(hash.slice(HASH_PREFIX.length))
    }
    if (!slug) return

    const targetId = `project-${slug}`
    const docEl = document.documentElement
    const prevRestoration = window.history.scrollRestoration
    const prevScrollBehavior = docEl.style.scrollBehavior
    try {
      window.history.scrollRestoration = 'manual'
    } catch {
      /* ignore */
    }
    docEl.style.scrollBehavior = 'auto' // 关掉平滑滚动 -> 瞬时定位

    let cancelled = false
    let timer = 0
    let flagCleared = false
    let lastSetY = -1
    const start = Date.now()

    const clearFlag = () => {
      if (flagCleared) return
      flagCleared = true
      try {
        sessionStorage.removeItem(KEY)
      } catch {
        /* ignore */
      }
    }
    const settle = () => {
      try {
        window.history.scrollRestoration = prevRestoration
      } catch {
        /* ignore */
      }
      docEl.style.scrollBehavior = prevScrollBehavior
    }

    const jump = (el: HTMLElement) => {
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY)
      window.scrollTo({ top, left: 0, behavior: 'auto' })
      lastSetY = Math.round(window.scrollY)
    }

    const tick = () => {
      if (cancelled) return

      // 用户已自行滚动（偏离我们设置的位置）-> 不再纠正，交还控制权
      if (lastSetY >= 0 && Math.abs(window.scrollY - lastSetY) > 4) {
        clearFlag()
        settle()
        return
      }

      const el = document.getElementById(targetId)
      if (el) {
        clearFlag()
        jump(el)
        // 持续校正一段时间，抵消首页开场状态切换、图片和字体加载带来的布局变化。
        if (Date.now() - start < 3000) {
          timer = window.setTimeout(tick, 120)
        } else {
          settle()
        }
        return
      }

      // 元素还没出现（懒加载）-> 继续等，最多 ~3s
      if (Date.now() - start < 3000) {
        timer = window.setTimeout(tick, 80)
      } else {
        clearFlag()
        settle()
      }
    }

    tick() // 同步首次尝试：元素若已在 DOM，则在绘制前完成定位

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      settle()
    }
  }, [])

  return null
}
