"use client"

import { useRouter } from 'next/navigation'

export function BackToProjectsButton({
  slug,
  className,
  children,
  ...props
}: {
  slug: string
  className?: string
  children: React.ReactNode
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const router = useRouter()

  const handleClick = () => {
    try {
      sessionStorage.setItem('returnToProject', slug)
    } catch {
      /* ignore */
    }
    router.push(`/#project-${encodeURIComponent(slug)}`)
  }

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  )
}
