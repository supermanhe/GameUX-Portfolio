import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Game UI/UX Portfolio'
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          background: '#0b0c10',
          color: '#fff',
          padding: '60px',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 24, color: '#a1a1aa' }}>游戏 UI/UX 设计师作品集</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

