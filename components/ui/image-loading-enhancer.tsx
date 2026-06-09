"use client"

import { useEffect } from 'react'

export function ImageLoadingEnhancer() {
  useEffect(() => {
    const cleanups = new Map<HTMLImageElement, () => void>()

    const watch = (image: HTMLImageElement) => {
      cleanups.get(image)?.()

      const finish = () => image.classList.remove('is-image-loading')
      if (image.complete) {
        finish()
        return
      }

      image.classList.add('is-image-loading')
      image.addEventListener('load', finish, { once: true })
      image.addEventListener('error', finish, { once: true })
      cleanups.set(image, () => {
        image.removeEventListener('load', finish)
        image.removeEventListener('error', finish)
      })
    }

    const scan = (root: ParentNode) => root.querySelectorAll('img').forEach(watch)
    scan(document)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) {
          watch(mutation.target)
          return
        }
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node instanceof HTMLImageElement) watch(node)
          scan(node)
        })
      })
    })

    observer.observe(document.body, { attributes: true, attributeFilter: ['src'], childList: true, subtree: true })
    return () => {
      observer.disconnect()
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  return null
}
