import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

function createBaseHref(target: URL) {
  const base = new URL('.', target)
  return base.toString()
}

function injectBaseTag(html: string, baseHref: string) {
  if (/\b<base\b/i.test(html)) {
    return html
  }
  const baseTag = `<base href="${baseHref}">`
  const headMatch = html.match(/<head[^>]*>/i)
  if (headMatch?.index !== undefined) {
    const insertIndex = headMatch.index + headMatch[0].length
    return html.slice(0, insertIndex) + baseTag + html.slice(insertIndex)
  }
  return baseTag + html
}

function stripFrameAncestorsMeta(html: string) {
  return html.replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, (meta) => {
    return /frame-ancestors/i.test(meta) ? '' : meta
  })
}

export async function GET(request: NextRequest) {
  const targetParam = request.nextUrl.searchParams.get('url')
  if (!targetParam) {
    return new Response('Missing "url" query parameter.', { status: 400 })
  }

  let target: URL
  try {
    target = new URL(targetParam)
  } catch (error) {
    return new Response('Invalid url.', { status: 400 })
  }

  if (!ALLOWED_PROTOCOLS.has(target.protocol)) {
    return new Response('Unsupported protocol.', { status: 400 })
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(target, {
      headers: {
        'user-agent': request.headers.get('user-agent') ?? 'Mozilla/5.0',
        accept: request.headers.get('accept') ?? '*/*',
        'accept-language': request.headers.get('accept-language') ?? 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      cache: 'no-store',
    })
  } catch (error) {
    return new Response('Unable to reach the requested site.', { status: 502 })
  }

  const contentType = upstreamResponse.headers.get('content-type') ?? 'text/html; charset=utf-8'
  const status = upstreamResponse.status

  if (!upstreamResponse.ok) {
    return new Response('Failed to load the requested site.', { status })
  }

  if (!contentType.includes('text/html')) {
    const buffer = await upstreamResponse.arrayBuffer()
    return new Response(buffer, {
      status,
      headers: {
        'Content-Type': contentType,
      },
    })
  }

  let html = await upstreamResponse.text()
  const baseHref = createBaseHref(target)
  html = injectBaseTag(html, baseHref)
  html = stripFrameAncestorsMeta(html)

  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
