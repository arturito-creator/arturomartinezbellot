import { ImageResponse } from 'next/og'

export const alt = 'Arturo Martínez - AI & Marketing Expert'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 20 }}>ARTURO.AI</div>
        <div style={{ fontSize: 32, opacity: 0.8 }}>AI & Marketing Expert</div>
      </div>
    ),
    {
      ...size,
    }
  )
}

