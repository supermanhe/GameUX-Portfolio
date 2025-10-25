const IMAGE_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'svg',
  'avif',
  'apng',
])

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'ogg',
  'ogv',
  'mov',
  'm4v',
  'mkv',
])

function getFileExtension(url: URL) {
  const pathname = url.pathname
  const lastSegment = pathname.split('/').pop() ?? ''
  const dotIndex = lastSegment.lastIndexOf('.')
  if (dotIndex === -1) return null
  return lastSegment.slice(dotIndex + 1).toLowerCase()
}

export function normalizeMediaUrl(rawUrl: string | null | undefined) {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  let candidate = trimmed
  if (candidate.startsWith('//')) {
    candidate = `https:${candidate}`
  }

  try {
    const url = new URL(candidate)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch (error) {
    return null
  }
}

export function classifyMediaUrl(rawUrl: string | null | undefined): 'image' | 'video' | null {
  const normalized = normalizeMediaUrl(rawUrl)
  if (!normalized) return null

  try {
    const url = new URL(normalized)
    const extension = getFileExtension(url)
    if (!extension) return null
    if (IMAGE_EXTENSIONS.has(extension)) return 'image'
    if (VIDEO_EXTENSIONS.has(extension)) return 'video'
    return null
  } catch (error) {
    return null
  }
}

export function transformMediaLinks(html: string) {
  if (!html) return html
  if (typeof window === 'undefined' || !window.document) return html

  const container = window.document.createElement('div')
  container.innerHTML = html

  const anchors = Array.from(container.querySelectorAll('a[href]'))
  for (const anchor of anchors) {
    const href = anchor.getAttribute('href')
    const mediaType = classifyMediaUrl(href)
    if (!mediaType) continue

    const textContent = (anchor.textContent ?? '').trim()
    const normalizedHref = normalizeMediaUrl(href)
    if (!normalizedHref) continue

    if (textContent && textContent !== normalizedHref) continue

    if (mediaType === 'image') {
      const img = window.document.createElement('img')
      img.src = normalizedHref
      const title = anchor.getAttribute('title')
      if (title) {
        img.alt = title
      }
      anchor.replaceWith(img)
    } else if (mediaType === 'video') {
      const wrapper = window.document.createElement('div')
      wrapper.className = 'tiptap-video-wrapper'

      const video = window.document.createElement('video')
      video.src = normalizedHref
      video.controls = true
      video.className = 'tiptap-video'
      video.setAttribute('playsinline', 'true')

      wrapper.appendChild(video)
      anchor.replaceWith(wrapper)
    }
  }

  return container.innerHTML
}
