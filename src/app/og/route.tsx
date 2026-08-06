import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '82px', color: 'white', background: 'radial-gradient(circle at 78% 18%, #583C50 0, transparent 42%), linear-gradient(135deg, #0d090d 12%, #26131f 58%, #0b090b 100%)', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 700 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 62, height: 62, borderRadius: 15, background: 'linear-gradient(135deg, #EC435B, #CC346E 58%, #583C50)', fontSize: 25 }}>H3</div>MiniMax H3</div>
      <div style={{ display: 'flex', marginTop: 56, fontSize: 70, lineHeight: 1.04, fontWeight: 750, letterSpacing: -3 }}>AI Video Generation,<br />directed your way.</div>
      <div style={{ display: 'flex', marginTop: 34, maxWidth: 900, color: '#dccfd8', fontSize: 27, lineHeight: 1.35 }}>Create cinematic videos from text, images, video, and audio references in one online workspace.</div>
      <div style={{ display: 'flex', marginTop: 42, width: 270, height: 6, borderRadius: 10, background: 'linear-gradient(90deg, #EC435B, #CC346E, #583C50)' }} />
    </div>,
    { width: 1200, height: 630 }
  );
}
