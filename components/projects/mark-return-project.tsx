"use client"

import { useEffect } from 'react'

/**
 * 在项目详情页挂载时记录当前项目 slug，
 * 这样无论是点「返回」还是浏览器后退回到首页，都能直接定位回该项目面板。
 */
export function MarkReturnProject({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      sessionStorage.setItem('returnToProject', slug)
    } catch {
      /* ignore */
    }
  }, [slug])

  return null
}
