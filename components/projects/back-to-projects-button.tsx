"use client"

import { useRouter } from 'next/navigation'

/**
 * 「返回项目列表」按钮：行为与浏览器后退一致（history 后退 / pop），
 * 这样回到首页时走的是 Next 的滚动恢复 + 返回定位逻辑，直接落到原项目面板。
 * 若没有可后退的历史（例如直接打开详情页），则退回到首页。
 */
export function BackToProjectsButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
